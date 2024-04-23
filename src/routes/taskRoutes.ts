import { Router } from "express";
import { PrismaClient } from '@prisma/client';
import { getDate } from "../../utils";

const router = Router();
const prisma = new PrismaClient();


// Create Task
router.post('/', async (req, res) => {
    const { recordId, data } = req.body;

    console.log(recordId, data) // { actionItems: [] }
    console.log(recordId, data.actionItems)
    try {
        await prisma.$transaction(async (tx) => {
            if (data.actionItems.length) {
                data.actionItems.forEach(async (item: any) => {
                    const task = await tx.task.create({
                        data: {
                            description: item.text,
                            record: {
                                connect: {
                                    id: recordId
                                }
                            }
                        }
                    })
                    await tx.statusChange.create({
                        data: {
                            taskId: task.id,
                            status: "todo",
                            date: getDate()
                        }
                    })

                });
            }

        })
        console.log("test was successfully");
        res.status(200).json("success");
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'An Error Occurs' });
    }
});

// get Tasks
router.get('/', async (req, res) => {
    var tasks = await prisma.task.findMany({
        include: {
            status_change: true,
        },
    });
    res.json(tasks.map((task) => ({
        id: task.id,
        status: task.status_change
    })));
})

// get Task with the latest status
router.get('/:date/:status', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    console.log("got o tis fetch")
    const { date } = req.params;
    const { status } = req.params;
    const date_edit = new Date(date)
    date_edit.setSeconds(date_edit.getSeconds() + 86399)

    var tasks = await prisma.task.findMany({
        include: {
            status_change: {
                where: {
                    date: {
                        lte: date_edit,
                    },
                    AND: {
                        task: {
                            record: {
                                users: {
                                    some: {
                                        id: user.id
                                    }
                                },
                                AND: {
                                    visible: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    date: "desc"
                },
                // take: 1
            },
            record: {

                include: {
                    users: true,
                    insight: {
                        include: {
                            topics: true
                        }
                    }
                }
            }
        },
    });
    tasks = tasks.filter((task) => task?.record?.users[0].id == user.id);
    res.json(tasks.filter((task) => task.status_change.length > 0 && (status == null || task.status_change[0].status === status)).map((task) => ({
        id: task.id,
        description: task.description,
        status: task.status_change[0].status,
        statusList: task.status_change,
        record: task.record
    })));
})



export default router;