import { t } from "@lingui/macro";

export const improveWriting = async (text: string) => {
  const response = await fetch("/api/gemini/improve-writing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(t`Failed to improve writing: ${error}`);
  }

  const { text: improvedText } = await response.json();
  return improvedText;
};
