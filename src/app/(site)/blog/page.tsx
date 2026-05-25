export const metadata = {
  title: "Blog",
};

const POSTS = [
  {
    slug: "come-verificare-km-auto-usata",
    title: "Come verificare i chilometri di un'auto usata",
    excerpt: "Segnali pratici per individuare anomalie nel contachilometri prima dell'acquisto.",
    date: "12 maggio 2026",
  },
  {
    slug: "fermo-amministrativo-cosa-significa",
    title: "Fermo amministrativo: cosa significa per l'acquirente",
    excerpt: "Spiegazione semplice dei vincoli PRA e dei rischi connessi.",
    date: "3 maggio 2026",
  },
  {
    slug: "documenti-da-chiedere-venditore",
    title: "5 documenti da chiedere sempre al venditore",
    excerpt: "Checklist rapida da usare durante la visita del veicolo.",
    date: "25 aprile 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Blog CheckTarga</h1>
        <p className="mb-10 text-slate-600">
          Guide pratiche per comprare un&apos;auto usata in sicurezza.
        </p>
        <div className="space-y-6">
          {POSTS.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-slate-200 p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                {post.date}
              </p>
              <h2 className="mb-2 text-xl font-bold text-slate-900">{post.title}</h2>
              <p className="text-slate-600">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
