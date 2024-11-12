import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// Configure AWS S3 client
//@ts-ignore
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const BUCKET_NAME = 'mtduploadbucket';


export async function imageUploadService(res: any, req: any) {
    try {
        // Generate a unique filename
        const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;

        // Upload to S3
        const params = {
            Bucket: BUCKET_NAME,
            Key: `image_upload/$${fileName}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read', // Set the file to be publicly readable

        }; 
        //@ts-ignore
        const command = new PutObjectCommand(params);
        await s3.send(command);

        // Get the URL of the uploaded file
        const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/image_upload/${fileName}`;
        const user = req.user;
        await prisma.user.update({
            where: { id: user.id },
            data: { image: imageUrl },
        })
        res.status(200).json({ imageUrl: imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
}