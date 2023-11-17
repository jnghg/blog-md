import { remark } from "remark";
import html from "remark-html";

// 마크다운 -> html
export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
