export type Project = {
  slug: string;
  title: string;
  tagline: string;
  emoji: string;
  stack: string[];
  task: string;
  solution: string[];
  features: string[];
  color: string;
  demoUrl: string;
  demoHost: string;
};

const demo = (slug: string) => `/demos/${slug}/index.html`;

export const projects: Project[] = [
  {
    slug: "aura-os",
    title: "AURA — ИИ-ассистент",
    tagline: "Киберпанк-ассистент: 3D-сфера, память на 7 дней, локальное ИИ-ядро",
    emoji: "🔮",
    stack: ["Next.js", "TypeScript", "Canvas 3D", "Ollama"],
    color: "from-cyan-500 to-violet-600",
    demoUrl: "/aura",
    demoHost: "aura://local",
    task: "Нужен ИИ-помощник в стиле «Джарвиса», который живёт прямо на устройстве пользователя: без облака, API-ключей и передачи данных.",
    solution: [
      "Пульсирующая 3D-сфера на Canvas: цвет и ритм отражают состояние — ожидание, забота, тревога",
      "Чат с вежливой «личностью» и распознаванием самочувствия собеседника",
      "Память на localStorage с циклом 7 дней — переписка и имя не переживают дедлайн",
      "Подключение настоящей нейросети через Ollama — локально, по принципу BYOK без ключей",
    ],
    features: [
      "Полностью локально: работает без интернета и API-ключей",
      "Сфера реагирует на эмоции: краснеет и ускоряет пульс в режиме «Забота»",
      "Запоминает имя и историю диалога на 7 дней",
    ],
  },
  {
    slug: "telegram-bot",
    title: "Telegram-бот записи",
    tagline: "Онлайн-запись клиентов для малого бизнеса",
    emoji: "🤖",
    stack: ["Node.js", "grammY", "Telegram Bot API"],
    color: "from-sky-500 to-blue-600",
    demoUrl: demo("telegram-bot"),
    demoHost: "t.me/BarberBot",
    task:
      "Малому бизнесу (барбершоп, салон, автосервис) нужна запись клиентов без платных CRM и звонков менеджеру.",
    solution: [
      "Сценарий записи через inline-кнопки: услуга → мастер → день → время",
      "Хранение бронирований в памяти, команды /bookings и /cancel",
      "Лёгкий деплой: один файл bot.js, работает на любом VPS",
    ],
    features: [
      "Inline-кнопки вместо текстовых команд — клиенту не нужно ничего печатать",
      "Валидация расписания: только свободные слоты",
      "Готов к подключению реальной БД и оплате",
    ],
  },
  {
    slug: "landing",
    title: "Лендинг барбершопа",
    tagline: "Продающий одностраничник с формой записи",
    emoji: "💈",
    stack: ["HTML", "CSS", "JavaScript"],
    color: "from-amber-500 to-orange-600",
    demoUrl: demo("landing"),
    demoHost: "barbershop-borodach.ru",
    task:
      "Локальному бизнесу нужен сайт-визитка, который грузится мгновенно и приводит заявки с телефона.",
    solution: [
      "Семантическая вёрстка без фреймворков —PageSpeed 100",
      "Адаптив mobile-first, анимации появления при скролле",
      "Форма записи с валидацией и маской телефона",
    ],
    features: [
      "Мгновенная загрузка: ни одного JS-фреймворка",
      "Блоки: услуги с ценами, галерея, отзывы, контакты",
      "Плавные scroll-анимации на IntersectionObserver",
    ],
  },
  {
    slug: "parser-dashboard",
    title: "Парсер цен + дашборд",
    tagline: "Мониторинг цен конкурентов с графиками",
    emoji: "📊",
    stack: ["Node.js", "cheerio", "Chart.js"],
    color: "from-emerald-500 to-teal-600",
    demoUrl: demo("parser-dashboard"),
    demoHost: "price-monitor.local",
    task:
      "Магазину нужно отслеживать цены у конкурентов и видеть динамику, чтобы вовремя менять свои.",
    solution: [
      "Скрипт собирает цены с сайтов-витрин в CSV",
      "Дашборд строит графики динамики и сравнение магазинов",
      "Запуск по расписанию (cron / Task Scheduler)",
    ],
    features: [
      "История цен в CSV — данные не теряются",
      "Интерактивные графики Chart.js",
      "Легко добавить новый сайт: один конфиг-объект",
    ],
  },
  {
    slug: "mini-shop",
    title: "Мини-интернет-магазин",
    tagline: "Каталог с корзиной и оформлением заказа",
    emoji: "🛒",
    stack: ["HTML", "CSS", "JavaScript"],
    color: "from-violet-500 to-purple-600",
    demoUrl: demo("mini-shop"),
    demoHost: "mini-shop.demo",
    task:
      "Небольшому продавцу нужен каталог товаров с корзиной без дорогой платформы вроде Shopify.",
    solution: [
      "Каталог с фильтрацией по категориям и поиску",
      "Корзина на localStorage — переживает перезагрузку",
      "Оформление заказа с валидацией формы",
    ],
    features: [
      "Счётчик товаров и сумма в реальном времени",
      "Товары в JSON — контент меняется без правки кода",
      "Готов к подключению платежей и админки",
    ],
  },
];
