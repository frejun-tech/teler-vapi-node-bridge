import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port:                   Number(process.env.PORT) || 8000,
    nodeEnv:                process.env.NODE_ENV || 'development',
    serverDomain:           process.env.SERVER_DOMAIN || 'your_fallback_domain',
    
    telerKey:               process.env.TELER_API_KEY || '',
    telerSampleRate:        process.env.TELER_SAMPLE_RATE || "8k",
    telerChunkSize:         Number(process.env.TELER_CHUNK_SIZE) || 500,
    
    vapiAssistantId:        process.env.VAPI_ASSISTANT_ID || '',
    vapiApiKey:             process.env.VAPI_API_KEY || '',
    vapiSampleRate:         Number(process.env.VAPI_SAMPLE_RATE) || 8000,
    vapiBufferSize:         Number(process.env.VAPI_MESSAGE_BUFFER_SIZE) || 50,
} as const;