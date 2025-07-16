export const modelList = [
  // {
  //   customizationsSupported: [],
  //   guardrailsSupported: true,
  //   inferenceTypesSupported: ["ON_DEMAND"],
  //   inputModalities: ["TEXT"],
  //   modelArn:
  //     "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-text-premier-v1:0",
  //   modelId: "amazon.titan-text-premier-v1:0",
  //   modelLifecycle: {
  //     status: "ACTIVE",
  //   },
  //   modelName: "Titan Text G1 - Premier",
  //   outputModalities: ["TEXT"],
  //   providerName: "Amazon",
  //   responseStreamingSupported: true,
  // },
  // {
  //   customizationsSupported: [],
  //   guardrailsSupported: true,
  //   inferenceTypesSupported: ["ON_DEMAND"],
  //   inputModalities: ["TEXT"],
  //   modelArn:
  //     "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2:1",
  //   modelId: "anthropic.claude-v2:1",
  //   modelLifecycle: {
  //     status: "ACTIVE",
  //   },
  //   modelName: "Claude",
  //   outputModalities: ["TEXT"],
  //   providerName: "Anthropic",
  //   responseStreamingSupported: true,
  // },
  // {
  //   customizationsSupported: [],
  //   guardrailsSupported: true,
  //   inferenceTypesSupported: ["ON_DEMAND"],
  //   inputModalities: ["TEXT"],
  //   modelArn: "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2",
  //   modelId: "anthropic.claude-v2",
  //   modelLifecycle: {
  //     status: "ACTIVE",
  //   },
  //   modelName: "Claude",
  //   outputModalities: ["TEXT"],
  //   providerName: "Anthropic",
  //   responseStreamingSupported: true,
  // },
  {
    customizationsSupported: [],
    guardrailsSupported: true,
    inferenceTypesSupported: ["ON_DEMAND"],
    inputModalities: ["TEXT", "IMAGE"],
    modelArn:
      "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0",
    modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    modelLifecycle: {
      status: "ACTIVE",
    },
    modelName: "Claude 3.5 Sonnet V2",
    outputModalities: ["TEXT"],
    providerName: "Anthropic",
    responseStreamingSupported: true,
  },
  {
    customizationsSupported: [],
    guardrailsSupported: true,
    inferenceTypesSupported: ["ON_DEMAND"],
    inputModalities: ["TEXT", "IMAGE"],
    modelArn:
      "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0",
    modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
    modelLifecycle: {
      status: "ACTIVE",
    },
    modelName: "Claude 3.5 Sonnet",
    outputModalities: ["TEXT"],
    providerName: "Anthropic",
    responseStreamingSupported: true,
  },
  // {
  //   customizationsSupported: [],
  //   guardrailsSupported: true,
  //   inferenceTypesSupported: ["ON_DEMAND"],
  //   inputModalities: ["TEXT", "IMAGE"],
  //   modelArn:
  //     "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
  //   modelId: "anthropic.claude-3-haiku-20240307-v1:0",
  //   modelLifecycle: {
  //     status: "ACTIVE",
  //   },
  //   modelName: "Claude 3 Haiku",
  //   outputModalities: ["TEXT"],
  //   providerName: "Anthropic",
  //   responseStreamingSupported: true,
  // },
  {
    customizationsSupported: [],
    guardrailsSupported: true,
    inferenceTypesSupported: ["ON_DEMAND"],
    inputModalities: ["TEXT"],
    modelArn:
      "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-instant-v1",
    modelId: "anthropic.claude-instant-v1",
    modelLifecycle: {
      status: "ACTIVE",
    },
    modelName: "Claude Instant",
    outputModalities: ["TEXT"],
    providerName: "Anthropic",
    responseStreamingSupported: true,
  },
];
