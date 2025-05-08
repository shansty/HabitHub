import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class S3Service {
    private s3 = new S3Client({
        region: process.env.AWS_REGION || 'eu-north-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        },
    });

    async uploadFile(file: Express.Multer.File): Promise<string> {
        if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            throw new Error('Missing AWS credentials in .env file');
        }
        const key = `uploads/${uuid()}${path.extname(file.originalname)}`;
        console.log('Uploading to S3:', key);
        await this.s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    }
}
