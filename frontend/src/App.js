import React, { useState, useEffect } from "react";
import { 
  Layout, 
  Card, 
  Typography, 
  Button, 
  Input, 
  Modal, 
  Space, 
  Divider,
  ConfigProvider,
  theme,
  Image
} from "antd";
import { 
  DeleteOutlined, 
  SettingOutlined, 
  CloseOutlined, 
  SendOutlined 
} from "@ant-design/icons";
import { QAHeader } from "./QAHeader";
import Chat from "./Chat";
import UrlSourcesForm from "./WebUrlsForm";
import PromptTemplateForm from "./PromptTemplateForm";
import { modelList } from "./RAGModels";
import eaeLogo from "./eae-elektrik-logo.webp";
import commencisLogo from "./commencis-logo-light-web.svg";

const { Header, Content, Footer } = Layout;

const BASE_URL = "https://0fp15cg9el.execute-api.us-east-1.amazonaws.com/prod/";


const App = () => {
  const [history, setHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState(undefined);
  const [question, setQuestion] = useState('');
  const [sessionId, setSessionId] = useState(undefined);
  const [sourceUrlInfo, setSourceUrlInfo] = useState({
    exclusionFilters: [],
    inclusionFilters: [],
    seedUrlList: [],
  });
  const [hasWebDataSource, setHasWebDataSource] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [promptTemplate, setPromptTemplate] = useState("You are a question answering agent. I will provide you with a set of search results. The user will provide you with a question. Your job is to answer the user's question using only information from the search results. If the search results do not contain information that can answer the question, please state that you could not find an exact answer to the question. Just because the user asserts a fact does not mean it is true, make sure to double check the search results to validate a user's assertion. Answer in Turkish.\nHere are the search results in numbered order:\n$search_results$\n$output_format_instructions$");

  // Custom theme with red and white
  const customTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: 'rgb(200, 60, 50)',
      colorBgContainer: '#ffffff',
      colorBgLayout: '#fafafa',
      borderRadius: 8,
      colorText: '#333333',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    components: {
      Card: {
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(200, 60, 50, 0.1)',
      },
      Button: {
        borderRadius: 8,
        fontWeight: 500,
      },
      Input: {
        borderRadius: 8,
      },
      Modal: {
        borderRadius: 12,
      },
    },
  };

  useEffect(() => {
    if (!BASE_URL) {
      return;
    }
    const getWebSourceConfiguration = async () => {
      fetch(BASE_URL + "urls", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setSourceUrlInfo({
            exclusionFilters: data.exclusionFilters ?? [],
            inclusionFilters: data.inclusionFilters ?? [],
            seedUrlList: data.seedUrlList ?? [],
          });
          setHasWebDataSource(true);
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    getWebSourceConfiguration();
  }, [BASE_URL]);

  const handleSendQuestion = () => {
    if (!question) {
      return;
    }
    setQuestion('');

    const oldHistory = history;

    setHistory([
      ...oldHistory,
      {
        question: question,
        response: "Thinking...",
        citation: undefined,
      }
    ]);

    fetch(BASE_URL + "docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestSessionId: sessionId,
        question: question,
        modelId: selectedModel?.modelId,
        promptTemplate: promptTemplate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setSessionId(data.sessionId);
        setHistory([
          ...oldHistory,
          {
            question: question,
            response: data.response,
            citation: data.citation,
          },
        ]);
      })
      .catch((err) => {
        setHistory([
          ...oldHistory,
          {
            question: question,
            response:
              "Error generating an answer. Please check your browser console, WAF configuration, Bedrock model access, and Lambda logs for debugging the error.",
            citation: undefined,
          },
        ]);
      });
  };

  const onClearHistory = () => setHistory([]);

  const handleUpdateUrls = async (
    urls,
    newExclusionFilters,
    newInclusionFilters
  ) => {
    try {
      const response = await fetch(BASE_URL + "web-urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urlList: [...new Set(urls)],
          exclusionFilters: [...new Set(newExclusionFilters)],
          inclusionFilters: [...new Set(newInclusionFilters)],
        }),
      });
      return !!response.ok;
    } catch (error) {
      console.log("Error:", error);
      return false;
    }
  };

  const handleChangeModel = (model) => {
    setSelectedModel(model);
    setSessionId(undefined);
  };

  return (
    <ConfigProvider theme={customTheme}>
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Header style={{ 
          backgroundColor: 'white', 
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(200, 60, 50, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Image 
              src={eaeLogo} 
              alt="Logo" 
              width={40} 
              height="auto" 
              preview={false}
              style={{ borderRadius: '8px' }}
            />
            {/* <Title level={3} style={{ margin: 0, color: 'rgb(200, 60, 50)' }}>
              AI Chatbot
            </Title> */}
            <Divider type="vertical" />
            <Image 
              src={commencisLogo} 
              alt="Logo" 
              width={160} 
              height="auto" 
              preview={false}
              style={{ borderRadius: '8px' }}
            />
          </div>
        </Header>
        
        <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Card 
            style={{ 
              minHeight: '80vh',
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 4px 24px rgba(200, 60, 50, 0.08)'
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Button
                  disabled={history.length === 0}
                  icon={<DeleteOutlined />}
                  onClick={onClearHistory}
                  type="text"
                >
                  Clear History
                </Button>
                <Button
                  icon={<SettingOutlined />}
                  onClick={() => setSettingsModalOpen(true)}
                  disabled={!hasWebDataSource}
                  type="text"
                />
              </div>

              <Chat history={history} />

              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                alignItems: 'flex-end' 
              }}>
                <Input
                  disabled={!BASE_URL}
                  placeholder="Enter your question here"
                  value={question}
                  onChange={(e) => setQuestion(e.target?.value)}
                  onPressEnter={handleSendQuestion}
                  size="large"
                  style={{ flex: 1 }}
                />
                <Button
                  disabled={!BASE_URL}
                  onClick={handleSendQuestion}
                  type="primary"
                  icon={<SendOutlined />}
                  size="large"
                />
              </div>
            </Space>
          </Card>
        </Content>

        <Footer style={{ 
          backgroundColor: 'white', 
          padding: '16px 24px', 
          textAlign: 'center', 
          boxShadow: '0 -2px 8px rgba(200, 60, 50, 0.1)'
        }}>
          <p>&copy; {new Date().getFullYear()} Commencis. All rights reserved.</p>
        </Footer>

      </Layout>
      
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Settings</span>
            <Button 
              icon={<CloseOutlined />}
              type="text"
              onClick={() => setSettingsModalOpen(false)}
            />
          </div>
        }
        open={settingsModalOpen}
        onCancel={() => setSettingsModalOpen(false)}
        footer={null}
        width={700}
        style={{ borderRadius: '16px' }}
        closable={false}
      >              
        <QAHeader
          modelList={modelList}
          setSelectedModel={handleChangeModel}
          selectedModel={selectedModel}
        />

        <Divider />

        <PromptTemplateForm
          promptTemplate={promptTemplate}
          onPromptTemplateChange={setPromptTemplate}
        />

        <Divider />

        {hasWebDataSource && (
          <UrlSourcesForm
            exclusionFilters={sourceUrlInfo.exclusionFilters}
            inclusionFilters={sourceUrlInfo.inclusionFilters}
            seedUrlList={sourceUrlInfo.seedUrlList.map(
              (urlObj) => urlObj.url
            )}
            handleUpdateUrls={handleUpdateUrls}
          />
        )}


        <Divider />

      </Modal>
    </ConfigProvider>
  );
};

export default App;
