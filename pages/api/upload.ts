import path, { resolve } from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

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
    try {
      //
      const postsDirectory = path.join(process.cwd(), "public/static/images");
      const form = formidable({
        multiples: false,
        uploadDir: postsDirectory,

        filename: function (name, ext, part, form) {
          return `${new Date().getTime()}-${(
            part.originalFilename + ""
          ).replaceAll(" ", "")}`;
        },
      });

      new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject(err);
          }

          for (const file in files) {
            //@ts-ignore
            files[file] = btoa(files[file]);
          }

          resolve([fields, files]);
          res.status(200).json({ fields, files });
        });
      });
    } catch (error) {
      console.error("Error parsing form:", error);
      return res.status(500).json({ error: "Error parsing form" });
    }
  }
}
