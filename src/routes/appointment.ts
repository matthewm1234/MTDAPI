import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import _ from "lodash"


const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    const { date, time, title, location, participantNo } = req.body;
    try {
        const result = await prisma.appointment.create({
            data: {
                date: new Date(date),
                time,
                title,
                location,
                ownerId: user.id,
                participantNo,
                users: {
                    connect: [{ id: user.id }, { phone: participantNo }],
                },
            }
        })
        return res.status(200).json("ok");
    } catch (err: unknown) {
        return res.status(500).json(err);
    }
});

router.put('/share/:id', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    const { id } = req.params;

    try {
        const dbAppointment = await prisma.appointment.findUnique({
            where: {
                id,
            },
            include: {
                users: true,
            },
        });

        if (!dbAppointment) {
            return res.sendStatus(404);
        }
        // Here we validated that the user is the owner of the appointment
        if (!(dbAppointment?.ownerId == user.id /**||   (dbAppointment.participantNo === user.phone && dbAppointment.shared === true)*/)) {
            return res.sendStatus(403);
        }
        const participant = dbAppointment.users.filter((dbUser) => dbUser.id !== user?.id)[0]

        // Step 2: Fetch the last snapshot
        const lastSnapshot = await prisma.appointmentSnapshot.findFirst({
            where: {
                appointmentId: id,
                notifications: {
                    some: { participantId: participant.id },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Step 3: Decide on notification creation
        if (!lastSnapshot) {
            // Create a new snapshot only if there's a change
            const newSnapshot = await prisma.appointmentSnapshot.create({
                data: {
                    date: dbAppointment.date,
                    time: dbAppointment.time,
                    title: dbAppointment.title,
                    location: dbAppointment.location,
                    appointmentId: dbAppointment.id,
                },
            });

            // Create a new notification with this new snapshot
            await prisma.notification.create({
                data: {
                    appointmentSnapshotId: newSnapshot.id,
                    participantId: participant.id,
                    appointmentId: id
                },
            });
        } else {
            // Increment counter in the latest notification if there are no changes
            const lastNotification = await prisma.notification.findFirst({
                where: {
                    appointmentSnapshotId: lastSnapshot.id,
                    participantId: participant.id,
                },
                include: {
                    snapshot: {
                        select: {
                            date: true,
                            time: true,
                            title: true,
                            location: true,
                        }
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            const hasChanges = !_.isEqual(
                lastNotification?.snapshot,
                {
                    date: dbAppointment.date,
                    time: dbAppointment.time,
                    title: dbAppointment.title,
                    location: dbAppointment.location
                }
            );
            if (hasChanges) {
                await prisma.notification.create({
                    data: {
                        appointmentSnapshotId: lastSnapshot.id,
                        participantId: participant.id,
                        appointmentId: id
                    },
                });
                await prisma.appointmentSnapshot.update({
                    where: { id: lastSnapshot.id },
                    data: {
                        date: dbAppointment.date,
                        time: dbAppointment.time,
                        title: dbAppointment.title,
                        location: dbAppointment.location
                    }
                });
            }
            else {
                if (lastNotification) {
                    await prisma.notification.update({
                        where: { id: lastNotification.id },
                        data: { counter: { increment: 1 } },
                    });
                }
            }
        }
        return res.status(200).json("ok");
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: `Failed to update appointment info` });
    }
})

router.put('/', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    const data = req.body;
    const { id } = req.body;
    try {
        const dbAppointment = await prisma.appointment.findUnique({
            where: {
                id,
            },
            include: {
                users: true,
            },
        });

        if (!dbAppointment) {
            return res.sendStatus(403);
        }
        // Here we validated that the user is the owner of the appointment
        if (!(dbAppointment?.ownerId == user.id /**|| (dbAppointment.participantNo === user.phone && dbAppointment.shared === true)*/)) {
            return res.sendStatus(403);
        }

        const result = await prisma.appointment.update({
            where: { id },
            data,
            select: {
                date: true,
                time: true,
                title: true,
                location: true,
            }
        });

        return res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(400).json({ error: `Failed to update appointment info` });
    }
});

// get appointments
router.get('/', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    try {
        var appointments = await prisma.appointment.findMany({
            where: {
                users: {
                    some: {
                        id: user.id,
                    }
                }
            },
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
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        appointments = appointments.filter((appointment) => appointment.ownerId == user.id || (appointment.shared == true && appointment.users.find((dbUser) => dbUser.id === user.id)));
        res.status(200).json(appointments);
    } catch (e) {
        res.status(400).json({ error: `Failed to get the records` });
    }
})

export default router;