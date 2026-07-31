import * as dotenv from "dotenv";
dotenv.config();

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const aTWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
export const GROQ_API_KEY = process.env.GROQ_API_KEY;
export const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
export const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
export const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
export const NGROK_URL = process.env.NGROK_URL;
