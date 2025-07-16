import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Typography, Card } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

const DEFAULT_PROMPT_TEMPLATE = "You are a question answering agent. I will provide you with a set of search results. The user will provide you with a question. Your job is to answer the user's question using only information from the search results. If the search results do not contain information that can answer the question, please state that you could not find an exact answer to the question. Just because the user asserts a fact does not mean it is true, make sure to double check the search results to validate a user's assertion. Answer in the language the question is asked, if you can. If you don't understand the language answer in both turkish and english.Here are the search results in numbered order:$search_results$$output_format_instructions$";

const PromptTemplateForm = ({ promptTemplate, onPromptTemplateChange }) => {
  const [localPromptTemplate, setLocalPromptTemplate] = useState(promptTemplate || DEFAULT_PROMPT_TEMPLATE);

  useEffect(() => {
    setLocalPromptTemplate(promptTemplate || DEFAULT_PROMPT_TEMPLATE);
  }, [promptTemplate]);

  const handleReset = () => {
    setLocalPromptTemplate(DEFAULT_PROMPT_TEMPLATE);
    onPromptTemplateChange(DEFAULT_PROMPT_TEMPLATE);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalPromptTemplate(value);
    onPromptTemplateChange(value);
  };

  return (
    <Card 
      size="small" 
      style={{ 
        backgroundColor: '#fafafa',
        border: '1px solid #f0f0f0'
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>
            Prompt Template
          </Title>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
            size="small"
            type="text"
            title="Reset to default"
          >
            Reset
          </Button>
        </div>
        
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Customize how the AI processes and responds to questions. Use $search_results$ and $output_format_instructions$ as placeholders.
        </Text>

        <Form.Item style={{ margin: 0 }}>
          <TextArea
            value={localPromptTemplate}
            onChange={handleChange}
            placeholder="Enter your custom prompt template..."
            autoSize={{ minRows: 6, maxRows: 12 }}
            style={{ 
              fontFamily: 'monospace',
              fontSize: '13px'
            }}
          />
        </Form.Item>
      </Space>
    </Card>
  );
};

export default PromptTemplateForm;
