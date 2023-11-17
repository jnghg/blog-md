import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="max-w-5xl mx-auto py-10">
      <Component {...pageProps} />
    </div>
  );
}
