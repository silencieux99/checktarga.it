import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ReportPreviewView from "@/components/report-preview/ReportPreviewView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Anteprima report",
  noIndex: true,
});

export default function AnteprimaReportPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-accent border-t-transparent" />
          </div>
        }
      >
        <ReportPreviewView />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
