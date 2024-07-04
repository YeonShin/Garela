import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { myInfoState } from "../../atom";

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

const TemplateLibrary: React.FC = () => {
  const userInfo = useRecoilValue(myInfoState);

  return (
    <div>
      <h2>내 Template Library</h2>
      <List>
        {userInfo.templateLibrary.map((template) => (
          <ListItem key={template.templateId}>{template.title}</ListItem>
        ))}
      </List>
    </div>
  );
};

export default TemplateLibrary;
