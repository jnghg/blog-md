import Blog from "@/components/blog";
import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps } from "next";
import path from "path";

const Post: React.FC = ({ files }: any) => {
  return <Blog files={files} />;
};

export const getStaticProps: GetStaticProps = async (ctx) => {
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
  });

  return {
    props: {
      files,
    },
  };
};

export default Post;
