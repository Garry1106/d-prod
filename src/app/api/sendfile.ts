import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

// S3 Configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const upload = multer({ dest: "./uploads" });

async function uploadToS3(filePath: string, key: string, contentType: string) {
    const fileStream = fs.createReadStream(filePath);
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileStream,
        ContentType: contentType,
    });
    await s3Client.send(command);
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    upload.single("file")(req as any, res as any, async (err: any) => {
        if (err) {
            return res.status(500).json({ success: false, message: "File upload error", error: err.message });
        }

        const reqWithFile = req as NextApiRequest & { file?: Express.Multer.File };
        if (!reqWithFile.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const filePath = reqWithFile.file.path;
        const fileKey = `uploads/${Date.now()}_${reqWithFile.file.originalname}`;
        const contentType = reqWithFile.file.mimetype;

        try {
            const fileUrl = await uploadToS3(filePath, fileKey, contentType);
            fs.unlinkSync(filePath); // Remove temp file
            console.log("File uploaded successfully to S3:", fileUrl);
            return res.status(200).json({ success: true, message: "file uploaded to S3", fileUrl });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error uploading file to S3", error });
        }
    });
}
