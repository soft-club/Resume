import { t } from "@lingui/macro";

export const fixGrammar = async (text: string) => {
  const response = await fetch("/api/gemini/fix-grammar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(t`Failed to fix grammar: ${error}`);
  }

  const { text: fixedText } = await response.json();
  return fixedText;
};
