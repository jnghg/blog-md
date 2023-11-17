import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import AWS from "aws-sdk";
import multer from "multer";
import dayjs from "dayjs";
import multerS3 from "multer-s3";
import { createReadStream } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing form data" });
      }

      const { file } = files;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // AWS S3 설정
      const s3 = new AWS.S3({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        region: "ap-northeast-2",
      });

      // 파일명
      const fileName = `${file[0].newFilename}_${file[0].originalFilename}`;

      // S3 params
      const params = {
        Bucket: "goqual-homepage-images",
        Key: `${dayjs().format("YYYY/MM/DD")}/${fileName}`,
        ContentType: file[0]?.mimetype || "image/png",
        Body: createReadStream(file[0].filepath),
      };

      try {
        // 업로드
        const response = await s3.upload(params).promise();

        // 저장된 url
        const imageUrl = response.Location;

        return res.status(200).json({ imageUrl });
      } catch (error) {
        console.error("Error uploading file to S3:", error);
        return res.status(500).json({ error: "Error uploading file to S3" });
      }
    });
  }
}
