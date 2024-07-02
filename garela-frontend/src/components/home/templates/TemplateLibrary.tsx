import React, { useState } from 'react';
import styled from 'styled-components';
import TemplateImg from "../../../imgs/postImg.jpg";

const DropdownMenuTemplate = styled.div`
  position: absolute;
  top: 70px;
  right: 70px;
  width: 300px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.div<{ active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  border-bottom: ${(props) => (props.active ? '2px solid #007bff' : 'none')};
`;

const TemplateList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const TemplateItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const TemplateImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
`;

const TemplateDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TemplateCategory = styled.div`
  color: #007bff;
  font-size: 0.9rem;
`;

const TemplateTitle = styled.div`
  font-weight: bold;
`;

const templates = [
  { id: 1, category: '#Category', title: 'Template Title 1', thumbnailImg: TemplateImg, content: '<h1>Template 1</h1><p>This is the content of template 1.</p>' },
  { id: 2, category: '#Category', title: 'Template Title 2', thumbnailImg: TemplateImg, content: '<h1>Template 2</h1><p>This is the content of template 2.</p>' },
  { id: 3, category: '#Category', title: 'Template Title 3', thumbnailImg: TemplateImg, content: '<h1>Template 3</h1><p>This is the content of template 3.</p>' },
];

const TemplateLibrary: React.FC<{ onSelectTemplate: (template: any) => void }> = ({ onSelectTemplate }) => {
  const [activeTab, setActiveTab] = useState<'Subscribed' | 'MyTemplate'>('Subscribed');
  const filteredTemplates = templates; // 필터링 로직은 필요에 따라 추가

  return (
    <DropdownMenuTemplate>
      <Tabs>
        <Tab
          active={activeTab === "Subscribed"}
          onClick={() => setActiveTab("Subscribed")}
        >
          Subscribed
        </Tab>
        <Tab
          active={activeTab === "MyTemplate"}
          onClick={() => setActiveTab("MyTemplate")}
        >
          My Template
        </Tab>
      </Tabs>
      <TemplateList>
        {filteredTemplates.map((template) => (
          <TemplateItem key={template.id} onClick={() => onSelectTemplate(template)}>
            <TemplateImage src={template.thumbnailImg} alt="Template" />
            <TemplateDetails>
              <TemplateCategory>{template.category}</TemplateCategory>
              <TemplateTitle>{template.title}</TemplateTitle>
            </TemplateDetails>
          </TemplateItem>
        ))}
      </TemplateList>
    </DropdownMenuTemplate>
  );
};

export default TemplateLibrary;
