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

const Templates: React.FC = () => {
  const userInfo = useRecoilValue(myInfoState);

  return (
    <div>
      <h2>내가 작성한 Templates</h2>
      <List>
        {userInfo.myTemplates.map((template) => (
          <ListItem key={template.templateId}>{template.title}</ListItem>
        ))}
      </List>
    </div>
  );
};

export default Templates;
