import React, { useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { postCategoryState, postEditorState, postFileState, postSummaryState, postTitleState } from "../../atom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the Divider Blot
const BlockEmbed = Quill.import("blots/block/embed");

class DividerBlot extends BlockEmbed {
  static create(value: any) {
    const node = super.create(value) as HTMLElement;
    node.style.width = value || "70%";
    return node;
  }

  static value(node: HTMLElement) {
    return node.style.width;
  }
}
DividerBlot.blotName = "divider";
DividerBlot.tagName = "hr";
Quill.register(DividerBlot, true);

// Add custom icon
const CustomToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-header" defaultValue="" onChange={(e) => e.persist()}>
        <option value="1"></option>
        <option value="2"></option>
        <option value=""></option>
      </select>
      <select className="ql-font"></select>
      <select className="ql-size"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <button className="ql-strike"></button>
      <select className="ql-color"></select>
      <select className="ql-background"></select>
      <button className="ql-blockquote"></button>
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-indent" value="-1"></button>
      <button className="ql-indent" value="+1"></button>
      <button className="ql-link"></button>
      <button className="ql-image"></button>
      <button className="ql-video"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-align" value=""></button>
      <button className="ql-align" value="center"></button>
      <button className="ql-align" value="right"></button>
      <button className="ql-align" value="justify"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-code-block"></button>
      <button className="ql-divider">
        <svg viewBox="0 0 18 18">
          <line className="ql-stroke" x1="0" x2="18" y1="9" y2="9"></line>
        </svg>
      </button>
    </span>
    <span className="ql-formats">
      <button className="ql-clean"></button>
    </span>
  </div>
);

// // Define the custom toolbar module
// const modules = {
//   toolbar: {
//     container: "#toolbar",
//     handlers: {
//       divider: function (this: any) {
//         const range = this.quill.getSelection();
//         if (range) {
//           this.quill.insertEmbed(range.index, "divider", "70%", "user");
//         }
//       },
//     },
//   },
// };

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "color",
  "background",
  "link",
  "image",
  "video",
  "align",
  "code-block",
  "divider", // Add the divider format
];

const Body = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 80px;
  padding: 20px;
  background-color: #f5f5f5;
`;

const EditorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  height: 700px; /* Set the height of the editor and preview */
`;

const EditorContainer = styled.div`
  width: 50%;
  padding: 20px;
  border-right: 1px solid #ddd;
  overflow-y: auto; /* Enable vertical scroll */
  max-height: 700px; /* Ensure max height matches the parent height */

  .ql-editor {
    min-height: 500px; /* Set minimum height for the editor */
    max-height: 500px;
  }
`;

const PreviewContainer = styled.div`
  width: 50%;
  padding: 20px;
  background-color: #f9f9f9;
  border-left: 1px solid #ddd;
  border-radius: 0px 8px 8px 0px;
  overflow-y: auto; /* Enable vertical scroll */
  max-height: 700px; /* Ensure max height matches the parent height */

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  pre {
    background: #f5f2f0;
    padding: 10px;
    border-radius: 4px;
    overflow: auto;
  }

  blockquote {
    border-left: 4px solid #5A67D8;
    margin: 0;
    padding: 10px 20px;
  }

  iframe {
    width: 100%;
    height: 300px;
  }

  a {
    color: #007bff;
    text-decoration: underline;
  }

  .ql-align-center {
    text-align: center;
  }

  .ql-align-right {
    text-align: right;
  }

  .ql-align-justify {
    text-align: justify;
  }

  .ql-indent-1 {
    padding-left: 3em;
  }

  .ql-indent-2 {
    padding-left: 6em;
  }

  .ql-indent-3 {
    padding-left: 9em;
  }

  .ql-indent-4 {
    padding-left: 12em;
  }

  .ql-video {
    width: 100%;
    height: 400px;
  }

  .ql-font-serif {
    font-family: "Georgia", "Times New Roman", serif;
  }

  .ql-font-monospace {
    font-family: "Monaco", "Courier New", monospace;
  }

  .ql-size-small {
    font-size: 0.75em;
  }

  .ql-size-large {
    font-size: 1.5em;
  }

  .ql-size-huge {
    font-size: 2.5em;
  }
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 24px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const CategorySelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SummaryInput = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;



const CreatePost: React.FC = () => {
  const [editorState, setEditorState] = useRecoilState(postEditorState);
  const [title, setTitle] = useRecoilState(postTitleState);
  const [category, setCategory] = useRecoilState(postCategoryState);
  const [summary, setSummary] = useRecoilState(postSummaryState);
  const [file, setFile] = useRecoilState<File | null>(postFileState);
  const quillRef = useRef<ReactQuill | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  
    input.onchange = async () => {
      if (input.files) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append("image", file);
  
        try {
          const response = await axios.post("http://localhost:5000/upload/upload-image", formData); // 올바른 포트로 수정
          const imageUrl = response.data.url;
  
          if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            if (range) {
              quill.insertEmbed(range.index, "image", imageUrl);
            }
          }
        } catch (error) {
          console.error("Image upload failed:", error);
        }
      }
    };
  };


  const modules = useMemo(() => ({
    toolbar: {
      container: "#toolbar",
      handlers: {
        image: imageHandler,
        divider: function (this: any) {
          const range = this.quill.getSelection();
          if (range) {
            this.quill.insertEmbed(range.index, "divider", "70%", "user");
          }
        },
      },
    },
  }), []);

  return (
    <Body>
      <EditorWrapper>
        <EditorContainer>
          <TitleInput
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <CategorySelect
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Study">Study</option>
            <option value="Hobby">Hobby</option>
            <option value="Work">Work</option>
          </CategorySelect>
          <SummaryInput
            placeholder="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <FileInput type="file" accept="image/*" onChange={handleFileChange} />
          <CustomToolbar />
          <ReactQuill
            ref={quillRef}
            value={editorState}
            onChange={setEditorState}
            modules={modules}
            formats={formats}
          />
        </EditorContainer>
        <PreviewContainer dangerouslySetInnerHTML={{ __html: editorState }} />
      </EditorWrapper>
    </Body>
  );
};

export default CreatePost;
