import { t } from "@lingui/macro";

type Mood = "casual" | "professional" | "confident" | "friendly";

export const changeTone = async (text: string, tone: string) => {
  const response = await fetch("/api/gemini/change-tone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, tone }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(t`Failed to change tone: ${error}`);
  }

  const { text: modifiedText } = await response.json();
  return modifiedText;
};
