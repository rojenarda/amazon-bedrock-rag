import React, { useEffect, useRef } from "react";
import { Card, Typography, Space, Empty } from "antd";
import { ThreeDots } from 'react-loading-icons';
import PropTypes from "prop-types";

const { Text, Paragraph } = Typography;


const ThinkingMessage = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <ThreeDots width="32" height="16" fill="rgb(200, 60, 50)" />
  </div>
);

const Chat = (props) => {
  const history = props.history;
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      ref={boxRef}
      style={{
        backgroundColor: "#fafafa",
        padding: "16px",
        borderRadius: "12px",
        overflowY: "auto",
        minHeight: "70vh",
        maxHeight: "70vh",
        // minHeight: "400px",
        border: "1px solid #f0f0f0"
      }}
    >
      {history?.length > 0 ? (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {history?.map((msg, index) => (
            <Space key={index} direction="vertical" size="small" style={{ width: '100%' }}>
              {/* User Question */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Card
                  style={{
                    backgroundColor: 'rgb(200, 60, 50)',
                    color: 'white',
                    maxWidth: '70%',
                    borderRadius: '16px 16px 4px 16px',
                    border: 'none',
                    marginBottom: '8px'
                  }}
                  bodyStyle={{ padding: '12px 16px' }}
                >
                  <Text style={{ color: 'white' }}>{msg.question}</Text>
                </Card>
              </div>

              {/* AI Response */}
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Card
                  style={{
                    backgroundColor: 'white',
                    maxWidth: '70%',
                    borderRadius: '16px 16px 16px 4px',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                  }}
                  bodyStyle={{ padding: '12px 16px' }}
                >
                  <Space direction="vertical" size="small">
                    {/* eslint-disable-next-line */}
                      {msg.response == "Thinking..." ? (
                        <ThinkingMessage />
                      ) : (
                      <Paragraph style={{ margin: 0, color: '#333' }}>
                        {msg.response}
                      </Paragraph>
                      )}
                    {msg.citation && (
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        <a href={msg.citation} target="_blank" rel="noopener noreferrer">{msg.citation}</a>
                      </Text>
                    )}
                  </Space>
                </Card>
              </div>
            </Space>
          ))}
        </Space>
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          minHeight: '300px'
        }}>
          <Empty 
            description="No chat history"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
    </div>
  );
};

Chat.propTypes = { history: PropTypes.array };
Chat.defaultProps = { history: [] };

export default Chat;
