import { Bot, InlineKeyboard } from "grammy";

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.error("Задай переменную окружения BOT_TOKEN (токен от @BotFather)");
  process.exit(1);
}

const bot = new Bot(TOKEN);

// ------- Данные (в реальном проекте — база данных) -------

const SERVICES = [
  { id: "haircut", name: "Стрижка", duration: "60 мин", price: 1500 },
  { id: "beard", name: "Борода", duration: "30 мин", price: 900 },
  { id: "complex", name: "Стрижка + борода", duration: "90 мин", price: 2100 },
];

const MASTERS = ["Алексей", "Дмитрий", "Игорь"];

const TIMES = ["10:00", "12:00", "14:00", "16:00", "18:00"];

// Бронирования: { userId: { service, master, date, time } }
const sessions = new Map();
const bookings = [];

// ------- Хелперы -------

const serviceKeyboard = () =>
  new InlineKeyboard().text(
    SERVICES.map((s) => [s.name, `svc:${s.id}`]).flat()
  );

const masterKeyboard = () =>
  new InlineKeyboard().text(MASTERS.map((m) => [m, `mst:${m}`]).flat());

// Ближайшие 5 дней
const nextDays = () => {
  const days = [];
  const now = new Date();
  for (let i = 1; days.length < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
    days.push([label, `date:${iso}`]);
  }
  return days;
};

const dateKeyboard = () => new InlineKeyboard().text(nextDays().flat());

const timeKeyboard = () =>
  new InlineKeyboard().text(TIMES.map((t) => [t, `time:${t}`]).flat());

// ------- Сценарий записи -------

bot.command("start", (ctx) =>
  ctx.reply(
    "Привет! Я бот записи в барбершоп ✂️\n\nВыбери услугу:",
    { reply_markup: serviceKeyboard() }
  )
);

bot.on("callback_query:data", async (ctx) => {
  const [action, value] = ctx.callbackQuery.data.split(":");
  const userId = ctx.from.id;
  const session = sessions.get(userId) || {};

  switch (action) {
    case "svc": {
      const svc = SERVICES.find((s) => s.id === value);
      Object.assign(session, { service: svc });
      sessions.set(userId, session);
      await ctx.editMessageText(
        `Услуга: ${svc.name} (${svc.price} ₽)\n\nВыбери мастера:`,
        { reply_markup: masterKeyboard() }
      );
      break;
    }
    case "mst": {
      session.master = value;
      sessions.set(userId, session);
      await ctx.editMessageText(
        `Мастер: ${value}\n\nВыбери день:`,
        { reply_markup: dateKeyboard() }
      );
      break;
    }
    case "date": {
      session.date = value;
      sessions.set(userId, session);
      await ctx.editMessageText("Выбери время:", {
        reply_markup: timeKeyboard(),
      });
      break;
    }
    case "time": {
      session.time = value;
      bookings.push({ userId, ...session });
      sessions.delete(userId);
      const s = session;
      await ctx.editMessageText(
        `✅ Записан!\n\n` +
          `💈 ${s.service.name} — ${s.service.price} ₽\n` +
          `👤 Мастер: ${s.master}\n` +
          `📅 ${s.date} в ${s.time}\n\n` +
          `Ждём тебя! Отменить запись: /cancel`,
        { reply_markup: new InlineKeyboard().text("Записаться ещё", "restart") }
      );
      console.log("Новое бронирование:", bookings.at(-1));
      break;
    }
    case "restart": {
      await ctx.editMessageText("Выбери услугу:", {
        reply_markup: serviceKeyboard(),
      });
      break;
    }
  }

  await ctx.answerCallbackQuery();
});

bot.command("cancel", (ctx) => {
  const idx = bookings.findIndex((b) => b.userId === ctx.from.id);
  if (idx === -1) return ctx.reply("У тебя нет активных записей.");
  bookings.splice(idx, 1);
  ctx.reply("Запись отменена. Записаться снова: /start");
});

bot.command("bookings", (ctx) => {
  const mine = bookings.filter((b) => b.userId === ctx.from.id);
  if (!mine.length) return ctx.reply("Записей пока нет.");
  ctx.reply(
    mine
      .map(
        (b) =>
          `${b.service.name}, ${b.master}, ${b.date} ${b.time}`
      )
      .join("\n")
  );
});

bot.start();
console.log("Бот запущен…");
