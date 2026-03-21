import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { StreamConnector } from '@frejun/teler';
import { StreamType }      from '@frejun/teler';
import { callStreamHandler, remoteStreamHandler } from './streamHandlers';
import { config } from '../core/config';
import { VapiClient } from './vapiClient';

export const wss = new WebSocketServer({ noServer: true });


wss.on('connection', async (callWs: WebSocket) => {
    console.log('Teler connected to WebSocket');
    
    const vapiClient = new VapiClient(config.vapiApiKey, config.vapiAssistantId, config.vapiSampleRate);
    const vapiResponse = await vapiClient.createCall();
    const wsURL = vapiResponse.webSocketURL;

    if(!wsURL) {
        callWs.close(1008, "Vapi didn't responded with a WebSocket URL");
        return;
    }
    
    const connector = new StreamConnector(
        wsURL,
        StreamType.BIDIRECTIONAL,
        callStreamHandler,
        remoteStreamHandler()
    );

    await connector.bridgeStream(callWs);
});

export const handleUpgrade = (request: IncomingMessage, socket: Socket, head: Buffer) => {
    if (request.url === '/api/v1/media-stream') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws);
        });
    } else {
        socket.destroy();
    }
};