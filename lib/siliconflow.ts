export const SILICONFLOW_FREE_SETTING_ID = "siliconflow-free";
export const SILICONFLOW_BASE_URL = "https://api.siliconflow.cn/v1";

export const SILICONFLOW_FREE_MODELS = [
  "Qwen/Qwen2.5-7B-Instruct",
  "Qwen/Qwen2.5-Coder-7B-Instruct",
  "THUDM/glm-4-9b-chat",
  "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
  "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
] as const;

export type SiliconFlowFreeModel = (typeof SILICONFLOW_FREE_MODELS)[number];

export function isSiliconFlowFreeModel(model: string): model is SiliconFlowFreeModel {
  return SILICONFLOW_FREE_MODELS.includes(model as SiliconFlowFreeModel);
}

export function getSiliconFlowApiKey() {
  return process.env.SILICONFLOW_API_KEY || process.env.AI_API_KEY || "";
}
