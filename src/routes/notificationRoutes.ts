import { PrismaClient } from "@prisma/client";
import { Router } from "express";


const router = Router();
const prisma = new PrismaClient();

// get appointments
router.get('/', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                participantId: user.id,
            },
            select: {
                id: true,
                createdAt: true,
                appointment: {
                    select: {
                        id: true,
                        date: true,
                        time: true,
                        title: true,
                        location: true,
                        participantNo: true,
                        ownerId: true,
                        shared: true,
                        users: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                                image: true,
                                isVerified: true,
                                devices: true,
                            }
                        }
                    }
                },
                counter: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.status(200).json(notifications);
    } catch (e) {
        res.status(500).json({ error: `Failed to get the notifications` });
    }
})

router.get('/accept/:id', async (req, res) => {
    const { id } = req.params;
    //@ts-ignore
    const user = req.user;
    try {
        const dbNotification = await prisma.notification.findUnique({
            where: {
                id,
            },
            include: {
                appointment: true,
            },
        });

        if (!dbNotification) {
            return res.sendStatus(403);
        }
        // Here we validated that the user is the owner of the notification
        if (!(dbNotification?.participantId == user.id)) {
            return res.sendStatus(403);
        }
        const result = await prisma.appointment.update({
            where: { id: dbNotification.appointmentId },
            data: {
                shared: true
            }
        });
        await prisma.notification.delete({
            where: {
                id: dbNotification.appointmentId
            }
        })
        return res.status(200).json("OK");
    } catch (e) {
        res.status(500).json({ error: `Sorry an error occurred. Try again!` });
    }
})

router.get('/deny/:id', async (req, res) => {
    const { id } = req.params;
    //@ts-ignore
    const user = req.user;
    try {
        const dbNotification = await prisma.notification.findUnique({
            where: {
                id,
            },
            include: {
                appointment: true,
            },
        });

        if (!dbNotification) {
            return res.sendStatus(403);
        }
        // Here we validated that the user is the owner of the notification
        if (!(dbNotification?.participantId == user.id)) {
            return res.sendStatus(403);
        }
        await prisma.notification.delete({
            where: {
                id: dbNotification.id
            }
        })
        return res.status(200).json("OK");
    } catch (e) {
        res.status(500).json({ error: `Sorry an error occurred. Try again!` });
    }
})
export default router;