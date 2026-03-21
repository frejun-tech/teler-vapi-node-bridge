import axios from "axios";

interface VapiCallResponse {
    id: string;                
    status: string;
    transport: {
        provider: string;
        websocketCallUrl: string;
    }
}

interface VapiResponse {
    data: string;
    webSocketURL: string | null;
}

export class VapiClient {
    private apiKey: string;
    private assistantId: string;
    private sampleRate: number;
    private baseURL: string;

    constructor(apiKey: string, assistantId: string, sampleRate: number=8000) {
        this.apiKey  = apiKey;
        this.assistantId = assistantId;
        this.sampleRate  = sampleRate;
        this.baseURL     = "https://api.vapi.ai"
    }

    public createCall = async (): Promise<VapiResponse> => {
        try{
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                }
            };

            const body = {
                "assistantId": this.assistantId,
                "transport": {
                    "provider": "vapi.websocket",
                    "audioFormat": {
                        "format": "pcm_s16le",
                        "container": "raw",
                        "sampleRate": this.sampleRate
                    }
                }
            }
            
            const res = await axios.post<VapiCallResponse>(
                `${this.baseURL}/call`, body,  config
            )

            if (!res?.data?.transport?.websocketCallUrl) {
                throw new Error(`No websocket URL returned from Vapi ${res.data}`);
            }
            
            const response = {
                "data": "WebSocket URL",
                "webSocketURL": res.data.transport.websocketCallUrl
            }

            return response;
        } catch (err) {
            const response = {
                "data": "WebSocket URL",
                "webSocketURL": null
            }
            if (axios.isAxiosError(err)) {
                const message =
                err.response?.data?.message ||
                err.response?.data ||
                err.message;

                console.error("Vapi Error: ", message);
                return response;
            }
            console.error("Vapi Error: ", err);
            return response;
        }
    }
}