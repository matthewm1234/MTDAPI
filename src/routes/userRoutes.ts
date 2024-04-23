import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';

router.get('/', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    try {

        if (!user) {
            return res.status(404).json({ error: "Auth token not provided" });
        }

        const allUser = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                image: true,
                isVerified: true,
            }
        })
        res.json(allUser.filter(contact => contact.phone != user.phone).map(contact => {
            const { name: value, phone: key, ...others } = contact;
            return { value, key, ...others }
        }))
    } catch (e) {
        return res.sendStatus(401)
    }

})
export default router;