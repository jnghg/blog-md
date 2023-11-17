import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { Suspense, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const Write: React.FC = () => {
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();

  const onChangeEditor = (event: any, editor: any) => {
    setData(editor.getData());
  };

  const onClickRegister = async () => {
    const response = await fetch(`/api/post`, {
      method: "POST",
      body: JSON.stringify({ data, title }),
    });
    const success = await response.json();

    const { revalidated } = await (
      await fetch(
        `/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}`
      )
    ).json();
    if (success && revalidated)
      router.replace("/post").then(() => router.reload());
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-5">
        <h2 className="w-16">제목</h2>
        <input
          className="rounded-lg border border-solid h-10 text-xl py-2 px-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value || "")}
          placeholder="제목을 입력하세요."
          autoFocus
        />
      </div>
      <Editor data={data} onChange={onChangeEditor} />
      <button
        className="mt-5 mr-5 bg-blue-500 text-white rounded-lg py-1 px-2 w-16 hover:bg-blue-600 duration-300"
        onClick={onClickRegister}
      >
        등록
      </button>
      <Link href={"/post"}>
        <button className="bg-gray-400 text-white rounded-lg py-1 px-2 w-16 hover:bg-gray-500 duration-300">
          뒤로
        </button>
      </Link>
    </div>
  );
};

export default Write;
