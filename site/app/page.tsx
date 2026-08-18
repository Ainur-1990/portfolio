import Link from "next/link";
import { projects } from "@/lib/projects";

const skills = [
  "Next.js",
  "Tailwind CSS",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "grammY",
  "Telegram Bot API",
  "HTML/CSS",
  "Chart.js",
  "Парсинг данных",
  "Git",
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-mono text-sm text-neutral-400">
            ~/portfolio
          </span>
          <nav className="flex gap-6 text-sm text-neutral-400">
            <a href="#projects" className="hover:text-white">
              Проекты
            </a>
            <a href="#skills" className="hover:text-white">
              Навыки
            </a>
            <a href="#contacts" className="hover:text-white">
              Контакты
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        {/* Hero */}
        <section className="py-24 sm:py-32">
          <p className="mb-4 font-mono text-sm text-emerald-400">
            Привет, я
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Имя Фамилия
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
            Делаю сайты, Telegram-ботов и автоматизацию для малого бизнеса.
            Быстро, чистым кодом, под ключ — от идеи до работающего решения.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-white px-6 py-3 font-medium text-neutral-950 transition hover:bg-neutral-200"
            >
              Смотреть проекты
            </a>
            <a
              href="https://t.me/username"
              className="rounded-full border border-white/20 px-6 py-3 font-medium transition hover:bg-white/10"
            >
              Написать в Telegram
            </a>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="pb-24">
          <h2 className="mb-10 text-2xl font-semibold">Проекты</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group rounded-2xl border border-white/10 bg-neutral-900 p-6 transition hover:border-white/30 hover:bg-neutral-800/60"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} text-2xl`}
                >
                  {p.emoji}
                </div>
                <h3 className="text-lg font-semibold group-hover:text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-400">{p.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-neutral-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="pb-24">
          <h2 className="mb-10 text-2xl font-semibold">Навыки</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      </main>

      <footer
        id="contacts"
        className="border-t border-white/10 py-12 text-center text-sm text-neutral-500"
      >
        <p>
          Связь:{" "}
          <a href="https://t.me/username" className="text-neutral-300 hover:text-white">
            Telegram
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/username"
            className="text-neutral-300 hover:text-white"
          >
            GitHub
          </a>
        </p>
        <p className="mt-2">© {new Date().getFullYear()} Имя Фамилия</p>
      </footer>
    </>
  );
}
