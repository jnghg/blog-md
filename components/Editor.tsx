import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from "react";

interface EditorProps {
  onChange: (event: any, editor: any) => void;
  data: string | null | undefined;
  [key: string]: any;
}

const Editor: React.FC<EditorProps> = ({ onChange, data }) => {
  const customUploadAdapter = (loader: any) => {
    // (2)
    return {
      upload() {
        return new Promise((resolve, reject) => {
          const data = new FormData();
          loader.file.then((file: File) => {
            data.append("name", file.name);
            data.append("file", file);

            fetch("/api/s3-upload", {
              method: "POST",
              body: data,
            }).then((res) => {
              res.json().then((data) => {
                resolve({
                  default: data?.imageUrl || "",
                });
              });
            });
          });
        });
      },
    };
  };

  function uploadPlugin(editor: any) {
    // (3)
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return customUploadAdapter(loader);
    };
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      onChange={onChange}
      config={{
        placeholder: "내용을 입력하세요.",
        image: {
          upload: {
            types: ["png", "jpeg"],
          },
        },
        extraPlugins: [uploadPlugin],
        toolbar: {
          items: ["heading", "|", "bold", "imageUpload"],
        },

        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            },
          ],
        },
      }}
    />
  );
};

export default Editor;
