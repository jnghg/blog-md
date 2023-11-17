import { GetStaticProps, NextPage } from "next";
import Link from "next/link";

const Blog: NextPage<{ files: any }> = ({ files }) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {files?.map((file: any, index: number) => (
          <div
            key={index}
            className="rounded-lg px-2 py-2 h-20 hover:bg-slate-50 duration-300 shadow-lg"
          >
            <Link href={`/post/${file.fileName}`}>
              <div className="mb-2 font-bold text-xl">
                {file.data.title.length > 15
                  ? (file.data.title + "").substring(0, 15) + "..."
                  : file.data.title}
              </div>
              <div className="mt-2 h-2 bg-gray-200 w-40" />
              <div className="mt-2 h-2 bg-gray-300" />
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Link href={"/post/write"}>
          <button className="bg-blue-500 text-white rounded-lg py-1 px-2 w-16 hover:bg-blue-600 duration-300">
            글쓰기
          </button>
        </Link>
      </div>
    </>
  );
};

export default Blog;
