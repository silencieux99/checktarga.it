import { jsPDF } from "jspdf";
import type { AIVerification, ReportSection, VehicleReportInfo } from "@/types/report.types";
import { COMPANY } from "@/lib/company";
import { SITE } from "@/lib/pricing";

interface PDFGeneratorOptions {
  sections: ReportSection[];
  vehicleInfo: VehicleReportInfo;
  orderId: string;
  generatedDate?: Date;
  ai?: AIVerification;
}

export async function generateProfessionalPDF(options: PDFGeneratorOptions): Promise<Buffer> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  let currentY = margin;

  const colors = {
    primary: [14, 116, 144],
    success: [16, 185, 129],
    warning: [245, 158, 11],
    danger: [239, 68, 68],
    text: [30, 41, 59],
    textLight: [100, 116, 139],
  };

  const checkPageBreak = (neededSpace: number) => {
    if (currentY + neededSpace > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }
  };

  const setColor = (color: number[]) => {
    doc.setTextColor(color[0], color[1], color[2]);
  };

  doc.setFontSize(24);
  setColor(colors.primary);
  doc.setFont("helvetica", "bold");
  doc.text("REPORT VEICOLO", margin, currentY);
  currentY += 10;

  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  doc.setFontSize(9);
  setColor(colors.textLight);
  doc.setFont("helvetica", "normal");
  doc.text(`Report N° ${options.orderId}`, margin, currentY);
  const dateStr = (options.generatedDate || new Date()).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generato il ${dateStr}`, pageWidth - margin, currentY, { align: "right" });
  currentY += 12;

  checkPageBreak(40);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 35, "FD");
  currentY += 8;

  const vehicleTitle =
    [options.vehicleInfo.marque, options.vehicleInfo.modele, options.vehicleInfo.version]
      .filter(Boolean)
      .join(" ") || "Veicolo";

  doc.setFontSize(16);
  setColor(colors.text);
  doc.setFont("helvetica", "bold");
  doc.text(vehicleTitle, margin + 5, currentY);
  currentY += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const mainInfo = [
    { label: "Targa", value: options.vehicleInfo.plaque },
    { label: "VIN", value: options.vehicleInfo.vin },
    { label: "Anno", value: options.vehicleInfo.annee },
    { label: "Carburante", value: options.vehicleInfo.carburant },
  ].filter((item) => item.value);

  mainInfo.forEach((item, index) => {
    const x = margin + 5 + (index % 2) * 85;
    const y = currentY + Math.floor(index / 2) * 7;
    setColor(colors.textLight);
    doc.text(`${item.label}:`, x, y);
    setColor(colors.text);
    doc.setFont("helvetica", "bold");
    doc.text(String(item.value), x + 35, y);
    doc.setFont("helvetica", "normal");
  });

  currentY += 25;

  const reportSections = options.sections.filter((section) => section.id !== "media");

  checkPageBreak(30);
  doc.setFontSize(14);
  setColor(colors.text);
  doc.setFont("helvetica", "bold");
  doc.text("VALUTAZIONE GLOBALE", margin, currentY);
  currentY += 10;

  let score = 100;
  reportSections.forEach((section) => {
    section.items.forEach((item) => {
      if (item.flag === "risk") score -= 15;
      if (item.flag === "warn") score -= 5;
    });
  });
  score = Math.max(0, Math.min(100, score));

  const scoreColor =
    score >= 80 ? colors.success : score >= 60 ? colors.warning : colors.danger;

  doc.setFillColor(scoreColor[0] + 20, scoreColor[1] + 20, scoreColor[2] + 20);
  doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.rect(margin, currentY, 40, 20, "FD");

  doc.setFontSize(24);
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(`${score}/100`, margin + 20, currentY + 13, { align: "center" });

  let total = 0;
  let ok = 0;
  let warnings = 0;
  let risks = 0;
  reportSections.forEach((section) => {
    section.items.forEach((item) => {
      total++;
      if (item.flag === "ok") ok++;
      if (item.flag === "warn") warnings++;
      if (item.flag === "risk") risks++;
    });
  });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const statsX = margin + 50;
  const statsY = currentY + 5;
  const stats = [
    { label: "Punti verificati", value: total, color: colors.text },
    { label: "Conformi", value: ok, color: colors.success },
    { label: "Avvisi", value: warnings, color: colors.warning },
    { label: "Rischi", value: risks, color: colors.danger },
  ];

  stats.forEach((stat, index) => {
    const y = statsY + index * 5;
    setColor(colors.textLight);
    doc.text(`${stat.label}:`, statsX, y);
    doc.setTextColor(stat.color[0], stat.color[1], stat.color[2]);
    doc.setFont("helvetica", "bold");
    doc.text(String(stat.value), statsX + 35, y);
    doc.setFont("helvetica", "normal");
  });

  currentY += 25;

  if (options.ai?.analysis) {
    checkPageBreak(30);
    doc.setFontSize(12);
    setColor(colors.text);
    doc.setFont("helvetica", "bold");
    doc.text("SINTESI IA", margin, currentY);
    currentY += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    setColor(colors.textLight);
    doc.text(options.ai.analysis, margin, currentY, { maxWidth: pageWidth - 2 * margin });
    currentY += 20;
  }

  reportSections.forEach((section, sectionIndex) => {
    checkPageBreak(20);
    doc.setFontSize(12);
    setColor(colors.primary);
    doc.setFont("helvetica", "bold");
    doc.text(`${sectionIndex + 1}. ${section.title.toUpperCase()}`, margin, currentY);
    currentY += 8;

    section.items.forEach((item) => {
      checkPageBreak(8);
      const itemColor =
        item.flag === "ok"
          ? colors.success
          : item.flag === "warn"
            ? colors.warning
            : item.flag === "risk"
              ? colors.danger
              : colors.text;
      const icon =
        item.flag === "ok" ? "OK" : item.flag === "warn" ? "!" : item.flag === "risk" ? "X" : "-";

      doc.setFontSize(9);
      setColor(colors.textLight);
      doc.setFont("helvetica", "normal");
      doc.text(item.label, margin + 5, currentY);
      doc.setTextColor(itemColor[0], itemColor[1], itemColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text(`${icon} ${String(item.value)}`, margin + 70, currentY, {
        maxWidth: pageWidth - margin - 75,
      });
      currentY += 6;
    });

    if (section.notes?.length) {
      currentY += 2;
      section.notes.forEach((note) => {
        checkPageBreak(8);
        doc.setFontSize(8);
        setColor(colors.textLight);
        doc.setFont("helvetica", "italic");
        doc.text(`i ${note}`, margin + 5, currentY, { maxWidth: pageWidth - 2 * margin - 5 });
        currentY += 5;
      });
    }

    currentY += 3;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;
  });

  const footerY = pageHeight - margin + 5;
  doc.setFontSize(8);
  setColor(colors.textLight);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Report generato da ${SITE.domain} — ${COMPANY.legalName}`,
    pageWidth / 2,
    footerY,
    { align: "center" }
  );
  doc.text(
    "Servizio privato e indipendente. Le informazioni sono fornite a titolo indicativo.",
    pageWidth / 2,
    footerY + 4,
    { align: "center" }
  );
  doc.text(
    "Le informazioni disponibili possono variare in base al veicolo e alle fonti consultabili.",
    pageWidth / 2,
    footerY + 8,
    { align: "center" }
  );

  const pdfArrayBuffer = doc.output("arraybuffer");
  return Buffer.from(pdfArrayBuffer);
}
