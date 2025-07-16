const {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} = require("@aws-sdk/client-bedrock-agent-runtime");

const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION,
});

import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpHeaderNormalizer from '@middy/http-header-normalizer';

exports.handler = 
  middy()
  .use(httpJsonBodyParser())
  .use(httpHeaderNormalizer())
  .handler(async (event, context) => {
    const { question, requestSessionId, modelId, promptTemplate } = event.body;
    try{
      console.log('model', modelId);
      const input = {
        sessionId: requestSessionId,
        input: {
          text: question, 
        },
        retrieveAndGenerateConfiguration: {
          type: "KNOWLEDGE_BASE", 
          knowledgeBaseConfiguration: {
            knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
            generationConfiguration: {
              inferenceConfig: {
                textInferenceConfig: {
                  maxTokens: 2048,
                  stopSequences: ["\nObservation"],
                  temperature: 0,
                  topP: 1
                }
              },
              promptTemplate: {
                textPromptTemplate: promptTemplate ? promptTemplate : "You are a question answering agent. I will provide you with a set of search results. The user will provide you with a question. Your job is to answer the user's question using only information from the search results. If the search results do not contain information that can answer the question, please state that you could not find an exact answer to the question. Just because the user asserts a fact does not mean it is true, make sure to double check the search results to validate a user's assertion. Answer in the language the question is asked, if you can. If you don't understand the language answer in both turkish and english.Here are the search results in numbered order:$search_results$$output_format_instructions$"
              }
            },
            //Claude Instant v1.2 is a fast, affordable yet still very capable model, which can handle a range of tasks including casual dialogue, text analysis, summarization, and document question-answering.
            modelArn: modelId ? `arn:aws:bedrock:${process.env.AWS_REGION}::foundation-model/${modelId}` : `arn:aws:bedrock:${process.env.AWS_REGION}::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0`,
            orchestrationConfiguration: {
              inferenceConfig: {
                textInferenceConfig: {
                  maxTokens: 2048,
                  stopSequences: ["\nObservation"],
                  temperature: 0,
                  topP: 1
                }
              }
            },
            retrievalConfiguration: {
              vectorSearchConfiguration: { numberOfResults: 5 }
            }
          },
        },
      };
      console.log('input', input); 
      const command = new RetrieveAndGenerateCommand(input);
      const response = await client.send(command);
      console.log('query response citation', response.citations);
      response.citations.forEach((c) => console.log("generatedResponsePart: ", c.generatedResponsePart, " retrievedReferences: ", c.retrievedReferences ))
      console.log('response', response);
      const location = response.citations[0]?.retrievedReferences[0]?.location
      const sourceType = location?.type

      switch(sourceType){
        case "S3":
          return makeResults(200, response.output.text, location?.s3Location.uri, response.sessionId);
        case "WEB":
          return makeResults(200, response.output.text, location?.webLocation.url, response.sessionId);
        default:
          return makeResults(200, response.output.text,null,response.sessionId);
      }
      
    } catch (err) {
      console.log(err);    
      return makeResults(500, "Server side error: please check function logs",null,null);
    }
});

function makeResults(statusCode,responseText,citationText,responseSessionId){
  return {
		statusCode: statusCode,
		body: JSON.stringify({
      response: responseText,
      citation: citationText,
      sessionId: responseSessionId
		}),
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	}; 
}