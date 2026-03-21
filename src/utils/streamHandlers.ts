import { StreamData, StreamHandlerResult, StreamOP } from "@frejun/teler";
import { config } from "../core/config";

export const callStreamHandler = async (message: StreamData): Promise<StreamHandlerResult> => {
    try {
        if(typeof message === "string") {
            const data = JSON.parse(message);
    
            if(data["type"] === "audio") {
                const audioB64 = data["data"]["audio_b64"];
                const payload = Buffer.from(audioB64, 'base64');
                return [payload, StreamOP.RELAY];
            }
        }

        return ['', StreamOP.PASS];
    } catch(err) {
        console.log("Error in call stream handler", err);
        return ['', StreamOP.PASS];
    }
}

export const remoteStreamHandler = () => {
    let chunkId = 1
    const messageBuffer: Buffer[] = [];

    const handler = async(message: StreamData): Promise<StreamHandlerResult> => {
        try {
            if (message instanceof Buffer) {
                messageBuffer.push(message);

                if(messageBuffer.length >= config.vapiBufferSize) {
                    const audio = Buffer.concat(messageBuffer);
                    const payload = JSON.stringify({
                        type: "audio",
                        audio_b64: audio.toString("base64"),
                        chunk_id: chunkId++,
                    });
                    messageBuffer.length = 0;
                    console.log("Relaying to Teler...");
                    return [payload, StreamOP.RELAY];
                }
                return ['', StreamOP.PASS];

            } else if(typeof message === "string") {
                const control = JSON.parse(message);

                if (control.status === 'stopped') {
                    console.log(`Flushing buffer of ${messageBuffer.length} chunks on speech stop`);
                    messageBuffer.length = 0; 
                }
            }
            return ['', StreamOP.PASS];
            
        } catch (error) {
            console.warn(`Error in remote stream handler: ${error}`);
            messageBuffer.length = 0;
            return ['', StreamOP.PASS];
        }
    }

    return handler;
}