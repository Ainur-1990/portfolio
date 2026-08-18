import Link from "next/link";
import { projects } from "@/lib/projects";
import Reveal from "./Reveal";

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

const worksWord = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "работа";
  if ([2, 3, 4].includes(m10) && ![12, 13, 14].includes(m100)) return "работы";
  return "работ";
};

export default function Home() {
  return (
    <>
      {/* фоновые светящиеся пятна */}
      <div
        className="orb"
        style={{ width: 500, height: 500, top: -150, left: -100, background: "#7c3aed" }}
      />
      <div
        className="orb"
        style={{
          width: 420,
          height: 420,
          top: "35%",
          right: -120,
          background: "#059669",
          animationDelay: "-6s",
        }}
      />
      <div
        className="orb"
        style={{
          width: 380,
          height: 380,
          bottom: -120,
          left: "30%",
          background: "#2563eb",
          animationDelay: "-12s",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-white/5 bg-[#050508]/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <span className="font-mono text-sm text-neutral-400">
              <span className="text-violet-400">~/</span>portfolio
            </span>
            <nav className="flex gap-6 text-sm text-neutral-400">
              <a href="#projects" className="transition hover:text-white">
                Проекты
              </a>
              <a href="#skills" className="transition hover:text-white">
                Навыки
              </a>
              <a href="#contacts" className="transition hover:text-white">
                Контакты
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-6">
          {/* Hero */}
          <section className="py-24 sm:py-32">
            <Reveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-neutral-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Открыт к заказам
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="mb-4 font-mono text-sm text-emerald-400">
                Привет, я
              </p>
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
                <span className="text-gradient">Аинур</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
                Делаю сайты, Telegram-ботов и автоматизацию для малого бизнеса.
                Быстро, чистым кодом, под ключ — от идеи до работающего решения.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#projects"
                  className="btn-primary rounded-full px-7 py-3 font-medium text-white"
                >
                  Смотреть проекты
                </a>
                <a
                  href="https://t.me/f_r_e_n_d_s_90"
                  className="rounded-full border border-white/20 px-7 py-3 font-medium transition hover:border-white/40 hover:bg-white/10"
                >
                  Написать в Telegram
                </a>
              </div>
            </Reveal>
          </section>

          {/* Projects */}
          <section id="projects" className="pb-24">
            <Reveal>
              <h2 className="mb-10 text-2xl font-semibold">
                Проекты
                <span className="ml-3 align-middle font-mono text-sm font-normal text-neutral-500">
                  {projects.length} {worksWord(projects.length)}
                </span>
              </h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="glass group block h-full overflow-hidden rounded-2xl"
                  >
                    {/* живое демо в рамке браузера */}
                    <div className="border-b border-white/10 bg-white/5 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                        </span>
                        <span className="ml-2 flex-1 truncate rounded-md bg-black/30 px-3 py-1 font-mono text-[11px] text-neutral-400">
                          {p.demoHost}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-56 overflow-hidden">
                      <iframe
                        src={p.demoUrl}
                        title={`Демо: ${p.title}`}
                        loading="lazy"
                        scrolling="no"
                        className="pointer-events-none absolute left-0 top-0 h-[760px] w-[1200px] origin-top-left scale-[0.37] border-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b10] via-transparent to-transparent opacity-60" />
                    </div>
                    <div className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div
                          className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} text-2xl shadow-lg`}
                        >
                          {p.emoji}
                        </div>
                        <span className="translate-x-2 font-mono text-sm text-neutral-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-violet-300 group-hover:opacity-100">
                          {"->"}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold transition group-hover:text-white">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-400">
                        {p.tagline}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-neutral-400 transition group-hover:bg-white/10"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="pb-24">
            <Reveal>
              <h2 className="mb-10 text-2xl font-semibold">Навыки</h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="glass rounded-2xl p-8">
                <div className="flex flex-wrap gap-3">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200 transition hover:border-violet-400/50 hover:bg-violet-400/10 hover:text-white"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>
        </main>

        <footer
          id="contacts"
          className="relative z-10 border-t border-white/5 py-14 text-center text-sm text-neutral-500"
        >
          <Reveal>
            <p className="mb-4 text-lg text-neutral-300">
              Есть задача?{" "}
              <a
                href="https://t.me/f_r_e_n_d_s_90"
                className="text-gradient font-semibold"
              >
                Напишите — обсудим
              </a>
            </p>
            <p>
              <a
                href="https://t.me/f_r_e_n_d_s_90"
                className="text-neutral-300 transition hover:text-white"
              >
                Telegram
              </a>{" "}
              ·{" "}
              <a
                href="https://github.com/Ainur-1990"
                className="text-neutral-300 transition hover:text-white"
              >
                GitHub
              </a>
            </p>
            <p className="mt-3">© {new Date().getFullYear()} Аинур</p>
          </Reveal>
        </footer>
      </div>
    </>
  );
}
