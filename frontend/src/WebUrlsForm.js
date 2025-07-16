import { useState } from "react";
import {
  Input,
  Button,
  Typography,
  Space,
  Alert,
  message,
  Card,
  Divider
} from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';

const { Title, Text } = Typography;

const UrlSourcesForm = (props) => {
  const { exclusionFilters, inclusionFilters, seedUrlList, handleUpdateUrls } =
    props;
  const [urls, setUrls] = useState(seedUrlList);
  const [newExclusionFilters, setNewExclusionFilters] = useState(exclusionFilters);
  const [newInclusionFilters, setNewInclusionFilters] = useState(inclusionFilters);
  const [isMaxNumUrls, setIsMaxNumUrls] = useState(seedUrlList.length >= 10);

  const validateURL = (url) => {
    const regex = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return regex.test(url);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanedUrls = urls
      .map((url) => url?.trim())
      .filter((url) => validateURL(url));

    const isUpdated = await handleUpdateUrls(
      cleanedUrls,
      newExclusionFilters,
      newInclusionFilters
    );
    
    if (isUpdated) {
      message.success('Successfully updated!');
    } else {
      message.error('Update was unsuccessful. Make sure your base url is valid and/or your current data source is not in sync mode');
    }
  };

  const handleUrlUpdate = (newUrl, index) => {
    const newUrls = [...urls];
    newUrls[index] = newUrl;
    setUrls(newUrls);
  };

  const handleExclusionFilterUpdate = (filter, index) => {
    const newFilters = [...newExclusionFilters];
    newFilters[index] = filter;
    setNewExclusionFilters(newFilters);
  };

  const handleInclusionFilterUpdate = (filter, index) => {
    const newFilters = [...newInclusionFilters];
    newFilters[index] = filter;
    setNewInclusionFilters(newFilters);
  };

  const addUrlInput = () => {
    if (urls.length + 1 > 10) {
      return;
    }
    setIsMaxNumUrls(urls.length + 1 === 10);
    setUrls([...urls, ""]);
  };

  const removeUrlInput = () => {
    if (urls.length === 0) {
      return;
    }
    const newUrls = [...urls];
    newUrls.splice(newUrls.length - 1, 1);
    setUrls(newUrls);
    setIsMaxNumUrls(false);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={4} style={{ margin: 0 }}>
        Source URLs and Filters
      </Title>
      
      <Card style={{ borderRadius: '12px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* URL List Section */}
          <div>
            <Text strong style={{ fontSize: '16px', color: 'rgb(200, 60, 50)' }}>
              URL List
            </Text>
            <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '12px' }}>
              {urls?.length > 0 && urls.map((url, index) => (
                <Input
                  key={`url-${index}`}
                  placeholder={`URL #${index + 1}`}
                  value={url}
                  onChange={(e) => handleUrlUpdate(e.target.value, index)}
                  size="large"
                />
              ))}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button
                  disabled={urls.length === 0}
                  onClick={removeUrlInput}
                  icon={<MinusCircleOutlined />}
                  type="text"
                  danger
                />
                <Button
                  disabled={isMaxNumUrls}
                  onClick={addUrlInput}
                  icon={<PlusCircleOutlined />}
                  type="primary"
                />
              </div>
            </Space>
          </div>

          <Divider />

          {/* Exclusion Filters Section */}
          <div>
            <Text strong style={{ fontSize: '16px', color: 'rgb(200, 60, 50)' }}>
              Exclusion Filters
            </Text>
            <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '12px' }}>
              {newExclusionFilters?.length > 0 && newExclusionFilters.map((filter, index) => (
                <Input
                  key={`exclusion-${index}`}
                  placeholder={`Exclusion Filter #${index + 1}`}
                  value={filter}
                  onChange={(e) => handleExclusionFilterUpdate(e.target.value, index)}
                  size="large"
                />
              ))}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button
                  disabled={newExclusionFilters.length === 0}
                  onClick={() => {
                    const filters = [...newExclusionFilters];
                    filters.splice(filters.length - 1, 1);
                    setNewExclusionFilters(filters);
                  }}
                  icon={<MinusCircleOutlined />}
                  type="text"
                  danger
                />
                <Button
                  onClick={() => setNewExclusionFilters([...newExclusionFilters, ""])}
                  icon={<PlusCircleOutlined />}
                  type="primary"
                />
              </div>
            </Space>
          </div>

          <Divider />

          {/* Inclusion Filters Section */}
          <div>
            <Text strong style={{ fontSize: '16px', color: 'rgb(200, 60, 50)' }}>
              Inclusion Filters
            </Text>
            <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '12px' }}>
              {newInclusionFilters?.length > 0 && newInclusionFilters.map((filter, index) => (
                <Input
                  key={`inclusion-${index}`}
                  placeholder={`Inclusion Filter #${index + 1}`}
                  value={filter}
                  onChange={(e) => handleInclusionFilterUpdate(e.target.value, index)}
                  size="large"
                />
              ))}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button
                  disabled={newInclusionFilters.length === 0}
                  onClick={() => {
                    const filters = [...newInclusionFilters];
                    filters.splice(filters.length - 1, 1);
                    setNewInclusionFilters(filters);
                  }}
                  icon={<MinusCircleOutlined />}
                  type="text"
                  danger
                />
                <Button
                  onClick={() => setNewInclusionFilters([...newInclusionFilters, ""])}
                  icon={<PlusCircleOutlined />}
                  type="primary"
                />
              </div>
            </Space>
          </div>

          <Alert
            message="Note: Submitting urls and filters won't automatically sync the web data source. The data source is updated on a recurring schedule and any submitted list of seed urls and filters will be considered for the upcoming sync."
            type="info"
            showIcon
            style={{ borderRadius: '8px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              size="large"
              style={{ paddingLeft: '32px', paddingRight: '32px' }}
            >
              Update URLs
            </Button>
          </div>
        </Space>
      </Card>
    </Space>
  );
};

UrlSourcesForm.propTypes = {
  exclusionFilters: PropTypes.array,
  inclusionFilters: PropTypes.array,
  seedUrlList: PropTypes.array,
  handleUpdateUrls: PropTypes.func.isRequired
};

UrlSourcesForm.defaultProps = {
  exclusionFilters: [],
  inclusionFilters: [],
  seedUrlList: [],
};

export default UrlSourcesForm;
