import { Router } from "express";
import { StreamChat } from 'stream-chat';
import jwt from 'jsonwebtoken';
import { PrismaClient } from ".prisma/client";


const STREAM_API_KEY = process.env.STREAM_API_KEY ?? '';
const STREAM_API_SECRET = process.env.STREAM_API_SECRET ?? '';
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';

// Initialize a Server Client
const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);
const prisma = new PrismaClient();

const router = Router();

// get single audio
router.get('/', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    try {
        if (!user) {
            return res.status(404).json({ error: "Auth token not provided" });
        }

        // Create User Token
        const token = serverClient.createToken(user.phone ?? '08128131961');

        // TODO implement
        // console.log("manage to get here")

        return res.json({ token });
    } catch (e) {
        return res.sendStatus(401)
    }
});

export default router;