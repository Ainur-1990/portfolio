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
          href="https://t.me/username"
          className="mt-3 inline-block font-medium text-emerald-400 hover:text-emerald-300"
        >
          Написать в Telegram →
        </a>
      </div>
    </main>
  );
}
