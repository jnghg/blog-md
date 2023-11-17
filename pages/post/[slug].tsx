import markdownToHtml from "@/libs/utils";
import matter from "gray-matter";
import path from "path";
import { GetStaticProps } from "next";
import Link from "next/link";
import Markdown from "react-markdown";

const PostDetail: React.FC = ({ data, post }: any) => {
  return (
    <>
      <div className="mb-10 space-y-5">
        <div className="font-bold text-xl">제목 : {data?.title}</div>
        <Markdown>{post}</Markdown>
      </div>
      <Link href={"/post"}>
        <button className="bg-gray-400 text-white rounded-lg py-1 px-2 w-16 hover:bg-gray-500 duration-300">
          뒤로
        </button>
      </Link>
    </>
  );
};

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const postsDirectory = path.join(process.cwd(), "posts");

  const { content, data } = matter.read(
    `${postsDirectory}/${ctx?.params?.slug}.md`
  );

  return {
    props: {
      data,
      post: content,
    },
  };
};

export default PostDetail;
