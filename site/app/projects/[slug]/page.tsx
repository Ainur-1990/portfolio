import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link
        href="/"
        className="font-mono text-sm text-neutral-400 hover:text-white"
      >
        ← назад
      </Link>

      <div
        className={`mt-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${project.color} text-3xl`}
      >
        {project.emoji}
      </div>
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{project.title}</h1>
      <p className="mt-3 text-lg text-neutral-400">{project.tagline}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-neutral-400"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-8">
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block rounded-full px-7 py-3 font-medium text-white"
        >
          Открыть демо в новом окне ↗
        </a>
      </div>

      {/* встроенное живое демо */}
      <div className="glass mt-8 overflow-hidden rounded-2xl">
        <div className="border-b border-white/10 bg-white/5 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            </span>
            <span className="ml-2 flex-1 truncate rounded-md bg-black/30 px-3 py-1 font-mono text-xs text-neutral-400">
              {project.demoHost}
            </span>
          </div>
        </div>
        <iframe
          src={project.demoUrl}
          title={`Демо: ${project.title}`}
          className="h-[600px] w-full border-0"
        />
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Задача</h2>
        <p className="mt-3 leading-7 text-neutral-300">{project.task}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Решение</h2>
        <ul className="mt-3 space-y-2">
          {project.solution.map((s) => (
            <li key={s} className="flex gap-3 leading-7 text-neutral-300">
              <span className="text-emerald-400">▸</span>
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Детали</h2>
        <ul className="mt-3 space-y-2">
          {project.features.map((f) => (
            <li key={f} className="flex gap-3 leading-7 text-neutral-300">
              <span className="text-emerald-400">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 rounded-2xl border border-white/10 bg-neutral-900 p-6">
        <p className="text-sm text-neutral-400">
          Хочешь похожее решение для своего бизнеса?
        </p>
        <a
          href="https://t.me/f_r_e_n_d_s_90"
          className="mt-3 inline-block font-medium text-emerald-400 hover:text-emerald-300"
        >
          Написать в Telegram →
        </a>
      </div>
    </main>
  );
}
