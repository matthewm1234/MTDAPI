import { Router } from "express";
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/incoming-call', async (req, res) => {
    const setting = req.body;
    console.log(setting)
    try {
        const result = await prisma.incomingCall.create({
            data: setting
        })
        res.status(200).json("OK");
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'An Error Occurs' });
    }
});

router.get('/incoming-call', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    try {
        const settings = await prisma.incomingCall.findUnique({
            where: { userId: user.id },
            select: {
                ios: true,
                android: true,
                web: true,
                updatedAt: true
            }
        })
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

router.put('/incoming-call', async (req, res) => {
    const data = req.body;
    //@ts-ignore
    const user = req.user;
    try {
        const result = await prisma.incomingCall.update({
            where: { userId: user.id },
            data,
            select: {
                ios: true,
                android: true,
                web: true,
                updatedAt: true,
            },

        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});


router.get('/device-info', async (req, res) => {
    //@ts-ignore
    const { id } = req.user;
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            devices: true
        }
    });
    if (user) {
        res.json({ deviceCount: user.devices.length, phoneNumberCount: 1 });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

export default router;