// Languages
export type Language = {
  id: string;
  name: string;
  locale: string;
  editorCode: string;
  progress?: number;
};

export const languages: Language[] = [
  {
    id: "en-US",
    name: "English",
    editorCode: "en",
    locale: "en-US",
  },
  {
    id: "ru",
    name: "Russian",
    editorCode: "ru",
    locale: "ru-RU",
  },
  {
    id: "uz",
    name: "Uzbek",
    editorCode: "uz",
    locale: "uz-UZ",
  },
];
