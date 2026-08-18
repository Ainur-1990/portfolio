// Каталог: контент отделён от кода — менять товары можно без правки script.js
const PRODUCTS = [
  { id: 1, name: "Наушники AirSound Pro", category: "audio", price: 8990, emoji: "🎧", desc: "Bluetooth 5.3, шумоподавление, 30 ч работы" },
  { id: 2, name: "Наушники BassDot", category: "audio", price: 2990, emoji: "🎵", desc: "Компактные TWS, чехол-зарядка" },
  { id: 3, name: "Колонка BoomBox Mini", category: "audio", price: 4590, emoji: "🔊", desc: "Влагозащита IPX7, 12 ч работы" },
  { id: 4, name: "Смарт-часы PulseFit 2", category: "wearables", price: 6490, emoji: "⌚", desc: "Пульс, сон, 100+ тренировок" },
  { id: 5, name: "Фитнес-браслет StepOne", category: "wearables", price: 2290, emoji: "📈", desc: "Шагомер, уведомления, 14 дней батареи" },
  { id: 6, name: "PowerBank 10000 mAh", category: "charging", price: 1890, emoji: "🔋", desc: "Быстрая зарядка PD 20 Вт" },
  { id: 7, name: "Кабель USB-C 2м", category: "charging", price: 590, emoji: "🔌", desc: "Плетёный, 60 Вт" },
  { id: 8, name: "Зарядная станция 3-в-1", category: "charging", price: 3490, emoji: "⚡", desc: "Телефон + часы + наушники" },
  { id: 9, name: "Держатель в авто MagGrip", category: "accessories", price: 1290, emoji: "🚗", desc: "Магнитный, на дефлектор" },
  { id: 10, name: "Клавиатура MechType 68", category: "accessories", price: 5290, emoji: "⌨️", desc: "Механическая, hot-swap, RGB" },
  { id: 11, name: "Мышь GlideMouse Silent", category: "accessories", price: 1590, emoji: "🖱️", desc: "Бесшумные клики, 4000 DPI" },
  { id: 12, name: "Веб-камера StreamCam HD", category: "accessories", price: 3990, emoji: "📹", desc: "1080p, микрофон со шумоподавлением" },
];

const CATEGORIES = [
  { id: "all", name: "Все" },
  { id: "audio", name: "Аудио" },
  { id: "wearables", name: "Носимое" },
  { id: "charging", name: "Зарядки" },
  { id: "accessories", name: "Аксессуары" },
];
