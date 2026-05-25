import Link from "next/link";
import Container from "@/components/Container";

const POSTS = [
  {
    slug: "come-verificare-km-auto-usata",
    title: "Come verificare i chilometri di un'auto usata",
    excerpt: "Segnali pratici per individuare anomalie nel contachilometri prima dell'acquisto.",
    category: "Guida",
    date: "12 mag 2026",
  },
  {
    slug: "fermo-amministrativo-cosa-significa",
    title: "Fermo amministrativo: cosa significa per l'acquirente",
    excerpt: "Spiegazione semplice dei vincoli PRA e dei rischi connessi.",
    category: "Legale",
    date: "3 mag 2026",
  },
  {
    slug: "documenti-da-chiedere-venditore",
    title: "5 documenti da chiedere sempre al venditore",
    excerpt: "Checklist rapida da usare durante la visita del veicolo.",
    category: "Consigli",
    date: "25 apr 2026",
  },
];

export default function BlogPreview() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <Container className="px-4">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">Blog</p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Guide e approfondimenti</h2>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 sm:inline-flex"
          >
            Vedi tutti
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white p-6 transition-colors hover:bg-slate-50 sm:p-7"
            >
              <div className="mb-4 flex items-center gap-3">
                <time className="font-mono text-[11px] font-bold tabular-nums text-slate-300">
                  {post.date}
                </time>
                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {post.category}
                </span>
              </div>
              <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-slate-900 group-hover:text-blue-600 sm:text-lg">
                {post.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-400">
                {post.excerpt}
              </p>
              <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-blue-600">
                Leggi l&apos;articolo
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
