import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { imageUploadService } from "../services/imageUploadService";

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    //@ts-ignore
    const user = req.user;
    try {

        if (!user) {
            return res.status(404).json({ error: "Auth token not provided" });
        }

        const allUser = await prisma.user.findMany({
            where: {
                isVerified: true
            },
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
// Route to handle image upload
router.post('/upload', upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Validate file type (e.g., only allow images)
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(req.file.mimetype);
        const extname = fileTypes.test(path.extname(req.file.originalname).toLowerCase());

        if (!mimeType || !extname) {
            return res.status(400).json({ error: 'Invalid file type' });
        }
        await imageUploadService(res, req)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// update user
router.put('/', async (req, res) => {
    //@ts-ignore
    const { id } = req.user;
    const data = req.body;
    try {
        const result = await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                image: true,
                isVerified: true,
            },

        });
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.status(400).json({ error: `Failed to update account info` });
    }
});
export default router;