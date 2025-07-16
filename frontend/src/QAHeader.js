import { Select, Typography, Tooltip, Space } from "antd";
import PropTypes from "prop-types";

const { Title, Text } = Typography;
const { Option } = Select;

export const QAHeader = (props) => {
  const { setSelectedModel, modelList, selectedModel } = props;

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Title level={4} style={{ margin: 0, color: '#333' }}>
        Select a model
      </Title>
      
      <Tooltip title={modelList.length === 0 ? "No models available" : null}>
        <Select
          placeholder="Choose a Model"
          style={{ width: '100%' }}
          size="large"
          value={selectedModel?.modelId || null}
          onChange={(value) => {
            const model = modelList.find(m => m.modelId === value);
            setSelectedModel(model);
          }}
          optionRender={(option) => (
            <Space direction="vertical" size="small">
              <Text strong>{option.data.modelName}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {option.data.modelId}
              </Text>
            </Space>
          )}
        >
          {modelList.map((model) => (
            <Option 
              key={model.modelId} 
              value={model.modelId}
              modelName={model.modelName}
              modelId={model.modelId}
            >
              <Space direction="vertical" size="small">
                <Text strong>{model.modelName}</Text>
                {/* <Text type="secondary" style={{ fontSize: '12px' }}>
                  {model.modelId}
                </Text> */}
              </Space>
            </Option>
          ))}
        </Select>
      </Tooltip>
    </Space>
  );
};

QAHeader.propTypes = {
  setSelectedModel: PropTypes.func.isRequired,
  modelList: PropTypes.array,
  selectedModel: PropTypes.object,
};

QAHeader.defaultProps = {
  modelList: [],
  selectedModel: null,
};
