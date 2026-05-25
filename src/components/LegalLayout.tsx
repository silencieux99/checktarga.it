export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">{title}</h1>
        <div className="space-y-4 text-slate-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
