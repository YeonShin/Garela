import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styled from "styled-components";

const Container = styled.div`
  width: 60%;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 0px 0px 8px 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 80px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 24px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const EditorWrapper = styled.div`
  .demo-wrapper {
    border: 1px solid #f1f1f1;
    padding: 10px;
    border-radius: 4px;
  }
  .demo-editor {
    height: 300px;
    padding: 10px;
  }
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;

const CreatePost: React.FC = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");

  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
  };

  const handleSubmit = () => {
    const content = editorState.getCurrentContent().getPlainText();
    console.log("Title:", title);
    console.log("Content:", content);
  };

  return (
    <Container>
      <TitleInput
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <EditorWrapper>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={onEditorStateChange}
        />
      </EditorWrapper>
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </Container>
  );
};

export default CreatePost;
