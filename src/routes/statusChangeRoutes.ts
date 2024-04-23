import { Router } from "express";
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();


// Create
router.post('/', async (req, res) => {
    const task = req.body;
    try {
        const result = await prisma.statusChange.create({
            data: task
        })
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'An Error Occurs' });
    }
});

// Create
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;
    try {
        const result = await prisma.statusChange.update({
            where: { id: Number(id) },
            data: { date: new Date(date) }
        })
        res.status(200).json(result);
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
        const result = await prisma.recording.update({
            where: { id: Number(recordId) },
            data: { visible: false }
        })
        res.status(200).json({ success: true })
    } catch (e) {
        console.log(e)
        res.status(400).json({ error: 'An Error Occurs' });
    }
});
// update a task
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { category } = req.body;
//     try {
//         const result = await prisma.task.update({
//             where: { id: Number(id) },
//             data: { category },
//         });
//         res.status(200).json("OK");
//     } catch (e) {
//         console.log(e)
//         res.status(400).json({ error: `Failed to update the Task` });
//     }
// })
export default router;