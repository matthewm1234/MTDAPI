import { Router } from "express";
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create Call
router.post('/', async (req, res) => {
    const call = req.body;
    console.log(call)
    try {
        const result = await prisma.call.create({
            data: call
        })
        res.status(200).json("OK");
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'An Error Occurs' });
    }
});

// delete record
router.delete('/:recordId', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    const { recordId } = req.params;
    try {
        await prisma.$transaction(async (tx) => {
            const insight = await tx.insight.findUnique({
                where: {
                    recordId: Number(recordId)
                },
                include: {
                    transcription: true,
                    topics: true,
                    summary: true
                }
            })
            const task = await tx.task.findUnique({
                where: {
                    recordId: Number(recordId)
                }
            })
            if (insight?.id) {
                !insight.transcription.length || await tx.transcription.deleteMany({
                    where: {
                        insightId: insight?.id
                    }
                })

                !insight.topics.length || (async function () {
                    console.log("topics executed")
                    await tx.topics.deleteMany({
                        where: {
                            insightId: insight?.id
                        }
                    })
                })();

                insight.summary && await tx.summary.delete({ //!insight.summary ||
                    where: {
                        insightId: insight?.id
                    }
                })
                // await tx.insight.delete({
                //     where: {
                //         recordId: Number(recordId)
                //     }
                // })
            }
            if (task) {
                await tx.statusChange.deleteMany({
                    where: {
                        taskId: Number(task.id)
                    }
                })
            }

            await tx.recording.update({
                where: {
                    id: Number(recordId)
                },
                data: {
                    users: {
                        set: []
                    }
                }
            })
            await tx.recording.delete({
                where: {
                    id: Number(recordId)
                }
            })
            res.status(200).json({ success: true });
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({ error: 'An Error Occurs' });
    }
});

// Create Record
router.post('/record', async (req, res) => {
    const { users, filename, url, duration } = req.body;
    try {
        const result = await prisma.recording.create({
            data: {
                filename,
                url,
                duration,
                users: {
                    connect: [{ id: users.owner }, { phone: users.participant }],
                },
                //Because prisma reorders during connect, this is important
                captioned: true
            },
            select: {
                id: true,
                filename: true,
                url: true,
                duration: true,
                users: true,
                visible: true,
                processed: true,
                conversationId: true,
                jobId: true,
            }
        })
        res.status(200).json(result);
    } catch (err: unknown) {
        res.status(500).json();
    }
});

// get records
router.get('/records', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    try {
        var records = await prisma.recording.findMany({
            where: {
                users: {
                    some: {
                        id: user.id
                    }
                }
            },
            select: {
                id: true,
                filename: true,
                url: true,
                duration: true,
                users: true,
                visible: true,
                processed: true,
                conversationId: true,
                jobId: true,
                createdAt: true,
                insight: true,
                captioned: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        records = records.filter((record) => record.captioned === true)
        res.status(200).json(records);
    } catch (e) {
        res.status(400).json({ error: `Failed to get the records` });
    }
})
// update record
router.put('/record/:id', async (req, res) => {
    const { id } = req.params;
    console.log("req.params", id)
    const data = req.body;
    try {
        const result = await prisma.recording.update({
            where: { id: Number(id) },
            data,
            select: {
                id: true,
                filename: true,
                url: true,
                duration: true,
                users: true,
                visible: true,
                processed: true,
                conversationId: true,
                jobId: true
            },

        });
        res.status(200).json(result);

    } catch (e) {
        console.log(e)
        res.status(400).json({ error: `Failed to update the Audio` });
    }
});

export default router;