import type { ResumeData } from "./index";

export const sampleResume: ResumeData = {
  basics: {
    name: "Азиз Каримов",
    headline: "Опытный Веб-разработчик и Программист",
    email: "aziz.karimov@gmail.com",
    phone: "+998 90 123 45 67",
    location: "Ташкент, Узбекистан",
    url: {
      label: "",
      href: "https://azizkarimov.uz/",
    },
    customFields: [],
    picture: {
      url: "https://i.imgur.com/HgwyOuJ.jpg",
      size: 120,
      aspectRatio: 1,
      borderRadius: 0,
      effects: {
        hidden: false,
        border: false,
        grayscale: false,
      },
    },
  },
  sections: {
    summary: {
      name: "Обо мне",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "summary",
      content:
        "<p>Опытный веб-разработчик с 5-летним стажем в создании эффективных и удобных веб-сайтов и приложений. Специализируюсь на <strong>фронтенд-технологиях</strong> и увлечен современными веб-стандартами и передовыми методами разработки. Имею подтвержденный опыт успешного ведения проектов от концепции до внедрения.</p>",
    },
    awards: {
      name: "Награды",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "awards",
      items: [
        {
          id: "spdhh9rrqi1gvj0yqnbqunlo",
          visible: true,
          title: "Лучший IT-специалист года",
          awarder: "Ассоциация IT-компаний Узбекистана",
          date: "2022",
          summary: "За вклад в развитие IT-сферы Узбекистана",
          url: {
            label: "",
            href: "",
          },
        },
      ],
    },
    certifications: {
      name: "Сертификаты",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "certifications",
      items: [
        {
          id: "spdhh9rrqi1gvj0yqnbqunlo",
          visible: true,
          name: "Полный курс веб-разработки",
          issuer: "IT Park Uzbekistan",
          date: "2020",
          summary: "",
          url: {
            label: "",
            href: "",
          },
        },
        {
          id: "n838rddyqv47zexn6cxauwqp",
          visible: true,
          name: "Сертифицированный разработчик AWS",
          issuer: "Amazon Web Services",
          date: "2021",
          summary: "",
          url: {
            label: "",
            href: "",
          },
        },
      ],
    },
    education: {
      name: "Образование",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "education",
      items: [
        {
          id: "yo3p200zo45c6cdqc6a2vtt3",
          visible: true,
          institution: "Ташкентский университет информационных технологий",
          studyType: "Бакалавр компьютерных наук",
          area: "Ташкент, Узбекистан",
          score: "",
          date: "Сентябрь 2014 - Июнь 2018",
          summary: "",
          url: {
            label: "",
            href: "",
          },
        },
      ],
    },
    experience: {
      name: "Опыт работы",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "experience",
      items: [
        {
          id: "lhw25d7gf32wgdfpsktf6e0x",
          visible: true,
          company: "Digital Solutions Uzbekistan",
          position: "Старший веб-разработчик",
          location: "Ташкент, Узбекистан",
          date: "Январь 2021 - По настоящее время",
          summary:
            "<ul><li><p>Руководил редизайном основного сайта продукта, что привело к увеличению вовлеченности пользователей на 40%.</p></li><li><p>Разработал и внедрил новый адаптивный фреймворк, улучшающий совместимость с различными устройствами.</p></li><li><p>Наставлял команду из четырех младших разработчиков, развивая культуру технического совершенства.</p></li></ul>",
          url: {
            label: "",
            href: "https://digitalsolutions.uz/",
          },
        },
        {
          id: "r6543lil53ntrxmvel53gbtm",
          visible: true,
          company: "IT Park Uzbekistan",
          position: "Веб-разработчик",
          location: "Ташкент, Узбекистан",
          date: "Июль 2018 - Декабрь 2020",
          summary:
            "<ul><li><p>Сотрудничал в команде из 10 человек для разработки высококачественных веб-приложений с использованием React.js и Node.js.</p></li><li><p>Управлял интеграцией сторонних сервисов, таких как Stripe для платежей и Twilio для SMS-сервисов.</p></li><li><p>Оптимизировал производительность приложений, достигнув 30% сокращения времени загрузки.</p></li></ul>",
          url: {
            label: "",
            href: "https://itpark.uz/",
          },
        },
      ],
    },
    volunteer: {
      name: "Волонтерство",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "volunteer",
      items: [
        {
          id: "lhw25d7gf32wgdfpsktf6e0x",
          visible: true,
          organization: "IT для молодежи",
          position: "Преподаватель-волонтер",
          location: "Ташкент, Узбекистан",
          date: "2019 - По настоящее время",
          summary:
            "<p>Обучаю молодежь основам программирования и веб-разработки в рамках некоммерческой инициативы.</p>",
          url: {
            label: "",
            href: "",
          },
        },
      ],
    },
    interests: {
      name: "Интересы",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "interests",
      items: [
        {
          id: "hn0keriukh6c0ojktl9gsgjm",
          visible: true,
          name: "Путешествия",
          keywords: ["Горы", "Исторические места", "Культурный туризм"],
        },
        {
          id: "r8c3y47vykausqrgmzwg5pur",
          visible: true,
          name: "Чтение",
          keywords: ["Техническая литература", "Научная фантастика", "История"],
        },
      ],
    },
    languages: {
      name: "Языки",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "languages",
      items: [
        {
          id: "hn0keriukh6c0ojktl9gsgjm",
          visible: true,
          name: "Узбекский",
          description: "Родной",
          level: 5,
        },
        {
          id: "r8c3y47vykausqrgmzwg5pur",
          visible: true,
          name: "Русский",
          description: "Свободно",
          level: 4,
        },
        {
          id: "b5l75aseexqv17quvqgh73fe",
          visible: true,
          name: "Английский",
          description: "Продвинутый",
          level: 4,
        },
      ],
    },
    profiles: {
      name: "Профили",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "profiles",
      items: [
        {
          id: "cnbk5f0aeqvhx69ebk7hktwd",
          visible: true,
          network: "LinkedIn",
          username: "azizkarimov",
          icon: "linkedin",
          url: {
            label: "",
            href: "https://linkedin.com/in/azizkarimov",
          },
        },
        {
          id: "ukl0uecvzkgm27mlye0wazlb",
          visible: true,
          network: "GitHub",
          username: "azizkarimov",
          icon: "github",
          url: {
            label: "",
            href: "https://github.com/azizkarimov",
          },
        },
        {
          id: "ukl0uecvzkgm27mlye0wazlc",
          visible: true,
          network: "Telegram",
          username: "@azizkarimov",
          icon: "telegram",
          url: {
            label: "",
            href: "https://t.me/azizkarimov",
          },
        },
      ],
    },
    projects: {
      name: "Проекты",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "projects",
      items: [
        {
          id: "yw843emozcth8s1ubi1ubvlf",
          visible: true,
          name: "E-Commerce платформа для узбекских ремесленников",
          description: "Руководитель проекта",
          date: "2020-2021",
          summary:
            "<p>Руководил разработкой полноценной e-commerce платформы для узбекских ремесленников, что привело к увеличению продаж на 25%.</p>",
          keywords: ["React", "Node.js", "MongoDB", "Stripe"],
          url: {
            label: "",
            href: "",
          },
        },
        {
          id: "ncxgdjjky54gh59iz2t1xi1v",
          visible: true,
          name: "Интерактивная панель аналитики",
          description: "Frontend-разработчик",
          date: "2019",
          summary:
            "<p>Создал интерактивную панель аналитики для SaaS-приложения, улучшающую визуализацию данных для клиентов.</p>",
          keywords: ["Vue.js", "D3.js", "Firebase"],
          url: {
            label: "",
            href: "",
          },
        },
      ],
    },
    publications: {
      name: "Публикации",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "publications",
      items: [
        {
          id: "f2sv5z0cce6ztjl87yuk8fak",
          visible: true,
          name: "Развитие IT-сферы в Узбекистане: перспективы и вызовы",
          publisher: "Журнал 'Цифровая экономика'",
          date: "2022",
          summary:
            "<p>Статья о текущем состоянии и перспективах развития IT-индустрии в Узбекистане.</p>",
          url: {
            label: "",
            href: "",
          },
        },
      ],
    },
    references: {
      name: "Рекомендации",
      columns: 1,
      separateLinks: true,
      visible: false,
      id: "references",
      items: [
        {
          id: "f2sv5z0cce6ztjl87yuk8fak",
          visible: true,
          name: "Предоставляются по запросу",
          description: "",
          summary: "",
          url: {
            label: "",
            href: "",
          },
        },
      ],
    },
    skills: {
      name: "Навыки",
      columns: 1,
      separateLinks: true,
      visible: true,
      id: "skills",
      items: [
        {
          id: "hn0keriukh6c0ojktl9gsgjm",
          visible: true,
          name: "Веб-технологии",
          description: "Продвинутый",
          level: 5,
          keywords: ["HTML5", "JavaScript", "PHP", "Python"],
        },
        {
          id: "r8c3y47vykausqrgmzwg5pur",
          visible: true,
          name: "Веб-фреймворки",
          description: "Средний",
          level: 4,
          keywords: ["React.js", "Vue.js", "Laravel", "Django"],
        },
        {
          id: "b5l75aseexqv17quvqgh73fe",
          visible: true,
          name: "Инструменты",
          description: "Средний",
          level: 3,
          keywords: ["Webpack", "Git", "Docker", "JIRA"],
        },
      ],
    },
    custom: {},
  },
  metadata: {
    template: "glalie",
    layout: [
      [
        ["summary", "experience", "education", "projects", "references"],
        [
          "profiles",
          "skills",
          "certifications",
          "interests",
          "languages",
          "awards",
          "volunteer",
          "publications",
        ],
      ],
    ],
    css: {
      value: "* {\n\toutline: 1px solid #000;\n\toutline-offset: 4px;\n}",
      visible: false,
    },
    page: {
      margin: 14,
      format: "a4",
      options: {
        breakLine: true,
        pageNumbers: true,
      },
    },
    theme: {
      background: "#ffffff",
      text: "#000000",
      primary: "#0066cc",
    },
    typography: {
      font: {
        family: "Roboto",
        subset: "cyrillic",
        variants: ["regular"],
        size: 13,
      },
      lineHeight: 1.75,
      hideIcons: false,
      underlineLinks: true,
    },
    notes: "",
  },
};
