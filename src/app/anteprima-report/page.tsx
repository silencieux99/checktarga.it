import { Suspense } from "react";
import ReportPreviewView from "@/components/report-preview/ReportPreviewView";

export const metadata = {
  title: "Anteprima report",
  robots: { index: false, follow: true },
};

export default function AnteprimaReportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <ReportPreviewView />
    </Suspense>
  );
}
