import { Router } from "express";
import { Prisma, PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// get Insights
router.get('/', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    var insights = await prisma.insight.findMany({
        where: {
            record: {
                users: {
                    some: {
                        id: user.id,
                    }
                },
                AND: {
                    visible: true
                }
            }
        },
        select: {
            transcription: true,
            topics: true,
            summary: true,
            record: {
                include: {
                    users: true
                },

            },
        },
    });
    insights = insights.filter((insight) => insight?.record?.captioned === true)
    res.status(200).json(insights);
})

// Create insight
router.post('/', async (req, res) => {
    console.log(req.body)
    const { summary, topics, messages, recordId } = req.body;
    try {
        await prisma.$transaction(async (tx) => {
            if (messages?.length || topics?.length || summary) {
                const insight = await tx.insight.create({
                    data: {
                        record: {
                            connect: { id: recordId }
                        }
                    }
                })
                if (messages.length) {
                    messages.forEach(async (item: any) => {
                        await tx.transcription.create({
                            data: {
                                endTime: item.endTime,
                                startTime: item.startTime,
                                sentiment: item.sentiment.suggested,
                                speaker: item.from?.name,
                                message: item.text,
                                insight: {
                                    connect: {
                                        id: insight.id
                                    },
                                },
                            }
                        })
                    });
                }
                if (topics.length) {
                    topics.forEach(async (item: any) => {
                        await tx.topics.create({
                            data: {
                                text: item.text,
                                insight: {
                                    connect: {
                                        id: insight.id
                                    }
                                }
                            }
                        })
                    });
                }
                if (summary) {
                    await tx.summary.create({
                        data: {
                            text: summary,
                            insight: {
                                connect: {
                                    id: insight.id
                                }
                            }
                        }
                    })
                }
            }
            res.status(200).json("OK");
        },
            {
                maxWait: 5000, // default: 2000
                timeout: 10000, // default: 5000
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
            }
        )
    } catch (e) {
        console.log( "I instigated this", e)
        res.status(400).json({ error: 'An Error Occurs' });
    }

});
export default router;