"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Sphere from "./Sphere";
import {
  SYSTEM_PROMPT,
  detectState,
  generateReply,
  type AuraState,
  type Msg,
} from "./brain";

const STORE_KEY = "aura-memory-v1";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const STATE_LABEL: Record<AuraState, string> = {
  idle: "ОЖИДАНИЕ",
  thinking: "ОБРАБОТКА",
  care: "ЗАБОТА",
  alert: "ТРЕВОГА",
};

const STATE_HINT: Record<AuraState, string> = {
  idle: "Жду вашу команду",
  thinking: "Обрабатываю запрос…",
  care: "Рада вас слышать",
  alert: "Режим «Забота»: я рядом",
};

const STATE_DOT: Record<AuraState, string> = {
  idle: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]",
  thinking: "bg-cyan-200 shadow-[0_0_8px_rgba(165,243,252,0.9)] animate-pulse",
  care: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]",
  alert: "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.9)] animate-pulse",
};

const STATE_TEXT: Record<AuraState, string> = {
  idle: "text-cyan-300",
  thinking: "text-cyan-200",
  care: "text-emerald-300",
  alert: "text-red-300",
};

const QUICK_PROMPTS = ["Привет!", "Меня зовут Айнур", "Я устал", "Что ты умеешь?", "Который час?"];

type Saved = {
  v: 1;
  savedAt: number;
  messages: Msg[];
  name?: string;
  mode?: "demo" | "ollama";
  endpoint?: string;
  model?: string;
};

export default function AuraApp() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [name, setName] = useState<string | undefined>();
  const [state, setState] = useState<AuraState>("idle");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"demo" | "ollama">("demo");
  const [endpoint, setEndpoint] = useState("http://localhost:11434");
  const [model, setModel] = useState("glm4:9b");
  const [showSettings, setShowSettings] = useState(false);

  const nameRef = useRef(name);
  nameRef.current = name;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const scrollRef = useRef<HTMLDivElement>(null);

  // загрузка памяти (цикл 7 дней)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const d = JSON.parse(raw) as Saved;
        const fresh = Date.now() - d.savedAt < WEEK_MS;
        setName(fresh ? d.name : undefined);
        if (d.mode) setMode(d.mode);
        if (d.endpoint) setEndpoint(d.endpoint);
        if (d.model) setModel(d.model);
        setMessages(
          fresh && Array.isArray(d.messages) && d.messages.length
            ? d.messages
            : [
                {
                  role: "aura",
                  text: "Цикл памяти завершён: архив старше 7 дней очищен. Начинаю новый цикл. Представьтесь — и я запомню вас.",
                  ts: Date.now(),
                },
              ]
        );
      } else {
        setMessages([
          {
            role: "aura",
            text: "Система AURA активна. Я — ваш локальный ассистент: помню переписку 7 дней, слежу за вашим самочувствием и остаюсь вежливой. С чего начнём?",
            ts: Date.now(),
          },
        ]);
      }
    } catch {
      /* повреждённая память — просто начинаем заново */
    }
  }, []);

  // сохранение памяти
  useEffect(() => {
    try {
      const data: Saved = { v: 1, savedAt: Date.now(), messages: messages.slice(-60), name, mode, endpoint, model };
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch {
      /* приватный режим браузера — живём без памяти */
    }
  }, [messages, name, mode, endpoint, model]);

  // автопрокрутка чата
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // эффект «печатающей» реплики
  const typewriter = (full: string) =>
    new Promise<void>((resolve) => {
      const ts = Date.now();
      setMessages((m) => [...m, { role: "aura", text: "", ts }]);
      const step = Math.max(1, Math.round(full.length / 70));
      let i = 0;
      const id = window.setInterval(() => {
        i += step;
        const done = i >= full.length;
        const chunk = full.slice(0, done ? full.length : i);
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "aura", text: chunk, ts };
          return copy;
        });
        if (done) {
          window.clearInterval(id);
          resolve();
        }
      }, 18);
    });

  async function askOllama(text: string): Promise<string> {
    const history = messagesRef.current
      .slice(-20)
      .map((m) => ({ role: m.role === "aura" ? "assistant" : "user", content: m.text }));
    const res = await fetch(`${endpoint.replace(/\/+$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history, { role: "user", content: text }],
        stream: false,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const reply = String(data?.message?.content ?? "").trim();
    if (!reply) throw new Error("пустой ответ ядра");
    return reply;
  }

  async function send(preset?: string) {
    const text = (preset ?? input).trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text, ts: Date.now() }]);
    setBusy(true);
    setState("thinking");

    if (modeRef.current === "ollama") {
      try {
        const reply = await askOllama(text);
        await typewriter(reply);
        setState(detectState(reply));
      } catch {
        setMode("demo");
        await typewriter(
          "Не удалось связаться с локальным ядром Ollama. Проверьте, что сервис запущен, а эта страница открыта по http (не https). Переключаюсь на демо-ядро — оно всегда со мной."
        );
        setState("idle");
      }
    } else {
      // небольшая задержка — «раздумье» демо-ядра
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
      const { reply, state: st, name: newName } = generateReply(text, { name: nameRef.current });
      if (newName) setName(newName);
      await typewriter(reply);
      setState(st);
    }
    setBusy(false);
  }

  function clearMemory() {
    if (!window.confirm("Очистить память AURA (переписку и имя)?")) return;
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      /* ignore */
    }
    setName(undefined);
    setMessages([
      {
        role: "aura",
        text: "Память очищена. Мы начинаем с чистого листа — как в первый день цикла.",
        ts: Date.now(),
      },
    ]);
    setState("idle");
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#03030a] text-neutral-100">
      {/* киберпанк-сетка и сканлайны */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0 1px, transparent 1px 3px)",
        }}
      />

      <header className="sticky top-0 z-20 border-b border-cyan-400/10 bg-[#03030a]/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 font-mono text-xs">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-neutral-500 transition hover:text-white">
              ← сайт
            </Link>
            <span className="text-cyan-300">
              AURA<span className="text-neutral-600"> OS</span>
              <span className="ml-2 hidden text-neutral-600 sm:inline">// прототип v1.0</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 tracking-wider text-neutral-300">
              <span className={`h-2 w-2 rounded-full ${STATE_DOT[state]}`} />
              {STATE_LABEL[state]}
            </span>
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-300 transition hover:border-cyan-400/40 hover:text-white"
              aria-label="Настройки"
            >
              ⚙
            </button>
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="relative z-10 border-b border-cyan-400/10 bg-[#050510]">
          <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-5 font-mono text-xs sm:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="text-neutral-500">ЯДРО</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "demo" | "ollama")}
                className="rounded-lg border border-white/10 bg-[#0a0a18] px-3 py-2 text-neutral-200 outline-none focus:border-cyan-400/50"
              >
                <option value="demo">Демо-ядро (встроенное)</option>
                <option value="ollama">Ollama (локальная нейросеть)</option>
              </select>
            </label>
            <label className={`flex flex-col gap-2 ${mode === "demo" ? "opacity-40" : ""}`}>
              <span className="text-neutral-500">АДРЕС OLLAMA</span>
              <input
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                disabled={mode === "demo"}
                className="rounded-lg border border-white/10 bg-[#0a0a18] px-3 py-2 text-neutral-200 outline-none focus:border-cyan-400/50"
              />
            </label>
            <label className={`flex flex-col gap-2 ${mode === "demo" ? "opacity-40" : ""}`}>
              <span className="text-neutral-500">МОДЕЛЬ</span>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={mode === "demo"}
                className="rounded-lg border border-white/10 bg-[#0a0a18] px-3 py-2 text-neutral-200 outline-none focus:border-cyan-400/50"
              />
            </label>
            <p className="text-neutral-600 sm:col-span-3">
              Режим Ollama работает, когда сайт открыт по http (например, localhost) и сервис запущен
              с переменной OLLAMA_ORIGINS=*. Демо-ядро работает всегда и без интернета.
            </p>
            <div className="sm:col-span-3">
              <button
                onClick={clearMemory}
                className="rounded-full border border-red-400/30 px-4 py-1.5 text-red-300 transition hover:bg-red-400/10"
              >
                Очистить память (7-дневный цикл принудительно)
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-6 lg:grid-cols-[1.1fr_1fr]">
        {/* сфера */}
        <section className="flex min-h-[360px] flex-col items-center justify-center gap-6 rounded-2xl border border-cyan-400/10 bg-[#050510]/80 py-10 lg:h-[calc(100dvh-160px)]">
          <Sphere state={state} />
          <div className="text-center font-mono">
            <p className={`text-sm tracking-[0.35em] ${STATE_TEXT[state]}`}>{STATE_LABEL[state]}</p>
            <p className="mt-2 text-xs text-neutral-500">{STATE_HINT[state]}</p>
            <p className="mt-4 text-[10px] uppercase tracking-widest text-neutral-700">
              ядро: {mode === "demo" ? "демо (встроенное)" : `ollama · ${model}`}
            </p>
          </div>
        </section>

        {/* чат */}
        <section className="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-cyan-400/10 bg-[#050510]/80 lg:h-[calc(100dvh-160px)]">
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-cyan-400/10 px-4 py-2.5 text-sm leading-6 text-neutral-100">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm border-l-2 border-cyan-400/50 bg-white/5 px-4 py-2.5 text-sm leading-6 text-neutral-300">
                    {m.text || "…"}
                  </div>
                </div>
              )
            )}
            {busy && (
              <div className="flex justify-start">
                <div className="flex gap-1.5 rounded-2xl border-l-2 border-cyan-400/50 bg-white/5 px-4 py-3">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-300"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  disabled={busy}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2 border-t border-white/5 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишите AURA…"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0a0a18] px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-cyan-400/50"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-xl bg-cyan-400/15 px-4 py-2.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/25 disabled:opacity-40"
            >
              Отправить
            </button>
          </form>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-4 text-center font-mono text-[10px] uppercase tracking-widest text-neutral-600">
        Aura OS · локальный прототип · память 7 дней · часть портфолио Аинура
      </footer>
    </div>
  );
}
