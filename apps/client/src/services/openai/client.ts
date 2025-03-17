import { t } from "@lingui/macro";
import { OpenAI } from "openai";

import { useOpenAiStore } from "@/client/stores/openai";

export const openai = () => {
  const { apiKey, baseURL } = useOpenAiStore.getState();

  if (!apiKey) {
    throw new Error(
      t`Your OpenAI API Key has not been set yet. Please go to your account settings to enable OpenAI Integration.`,
    );
  }

  const defaultBaseURL = "/api/gemini";

  return new OpenAI({
    apiKey,
    baseURL: baseURL ?? defaultBaseURL,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
      "Access-Control-Allow-Origin": "*",
      // eslint-disable-next-line lingui/no-unlocalized-strings
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      // eslint-disable-next-line lingui/no-unlocalized-strings
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
