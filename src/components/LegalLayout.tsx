export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-2 text-3xl font-bold text-slate-900 md:text-4xl">{title}</h1>
        <div className="legal-prose text-[15px] leading-relaxed text-slate-600 [&_a]:text-brand-accent [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </div>
  );
}
