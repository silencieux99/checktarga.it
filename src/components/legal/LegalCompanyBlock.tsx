import { COMPANY, COMPANY_FULL_ADDRESS } from "@/lib/company";
import { SITE } from "@/lib/pricing";

export default function LegalCompanyBlock() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm leading-relaxed text-slate-700">
      <p className="font-semibold text-slate-900">{COMPANY.legalName}</p>
      <p className="mt-2">Company Number: {COMPANY.companyNumber}</p>
      <p className="mt-2 whitespace-pre-line">
        {COMPANY.addressLines.join("\n")}
      </p>
      <p className="mt-2">
        Email:{" "}
        <a href={`mailto:${SITE.supportEmail}`} className="text-brand-accent underline underline-offset-2">
          {SITE.supportEmail}
        </a>
      </p>
      <p className="mt-2">Orari assistenza: {COMPANY.supportHours}</p>
      <p className="mt-2 text-slate-600">{COMPANY_FULL_ADDRESS}</p>
    </div>
  );
}
