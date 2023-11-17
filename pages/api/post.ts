import { readFileSync, readdirSync, writeFileSync } from "fs";
import matter from "gray-matter";
import path from "path";
import { NodeHtmlMarkdown } from "node-html-markdown";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // md 파일 위치
    const postsDirectory = path.join(process.cwd(), "posts");

    const files = readdirSync(postsDirectory).map((file) => {
      const postContents = readFileSync(`${postsDirectory}/${file}`, "utf-8");
      const { data, content } = matter(postContents);
      const [fileName] = file.split(".md") || [];

      return {
        data,
        file,
        content,
        fileName,
      };
    }) as any;

    res.status(200).json(files);
  }
  if (req.method === "POST") {
    // 게시판 글과 제목
    const { data, title } = JSON.parse(req.body);

    try {
      // 총 게시글 개수 확인
      const postsDirectory = path.join(process.cwd(), "posts");
      const postLength = readdirSync(postsDirectory).length || 0;

      // html to markdown
      const markdownContent = NodeHtmlMarkdown.translate(data);

      // front-matter 설정 및 제목
      const frontmatter = matter.stringify(markdownContent, {
        title: title || `${postLength}-${dayjs().format("YYYY-MM-DD")}`,
      });

      // 여러 공백을 하나로 합치고 (-) 문자로 변경
      const newTitle = title.replace(/\s+/g, "-");

      // 저장할 md 파일명
      const fileName = "" || `${postLength}-${newTitle}.md`;

      // 저장할 최종 경로
      const filePath = path.join(process.cwd(), "posts", fileName);

      // 저장
      writeFileSync(filePath, frontmatter, "utf8");
    } catch (error) {
      res.status(500).send("Add Post Error");
    }

    res.status(200).json(true);
  }
}
