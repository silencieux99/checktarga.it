'use client';

import React, { useState, useEffect } from 'react';
import {
    Shield, AlertTriangle, CheckCircle, XCircle,
    Car, Gauge, Calendar, Fuel, Zap, Leaf,
    Download, Share2, ArrowLeft,
    FileText, Users, Clock, AlertCircle, Activity,
    Wrench, TrendingUp, Info, Sparkles, Lock
} from 'lucide-react';
import Link from 'next/link';
import type { ReportSection, AIVerification, VehicleReportInfo } from '@/types/report.types';

interface PremiumReportViewProps {
    sections: ReportSection[];
    vehicleInfo?: VehicleReportInfo;
    ai?: AIVerification;
    reportId?: string;
    pdfUrl?: string;
}

const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Eccellente';
    if (score >= 60) return 'Buono';
    return 'Da verificare';
};

const getSectionIcon = (sectionId: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
        identification: Car,
        technical: Wrench,
        transmission: Gauge,
        body: Car,
        registration: FileText,
        references: Info,
        tyres: Gauge,
        media: Sparkles,
        performance: Gauge,
        environment: Leaf,
        ownership: Users,
        history: Clock,
        itv: FileText,
        mileage: Gauge,
        equipment: Sparkles,
        safety: Shield,
        alerts: AlertCircle,
        value: TrendingUp,
        reliability: Activity,
        theftRisk: Lock,
        recommendations: Sparkles,
        geminiSynthese: Sparkles,
        geminiTech: Wrench,
        geminiVol: Shield,
    };
    return icons[sectionId] || Info;
};

const SectionCard = ({ section }: { section: ReportSection }) => {
    const Icon = getSectionIcon(section.id || '');

    const okCount = section.items.filter(i => i.flag === 'ok').length;
    const warnCount = section.items.filter(i => i.flag === 'warn').length;
    const riskCount = section.items.filter(i => i.flag === 'risk').length;

    const sectionStatus = riskCount > 0 ? 'danger' : warnCount > 0 ? 'warning' : 'success';
    const statusColors = {
        success: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
        warning: { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
        danger: { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    };
    const colors = statusColors[sectionStatus];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className={`flex items-center gap-4 p-5 border-b ${colors.border} ${colors.light}`}>
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="flex-1 text-lg font-bold text-slate-900">{section.title}</h3>
                <div className="flex items-center gap-2">
                    {riskCount > 0 && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                            <XCircle className="w-4 h-4" /> {riskCount}
                        </span>
                    )}
                    {warnCount > 0 && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                            <AlertTriangle className="w-4 h-4" /> {warnCount}
                        </span>
                    )}
                    {riskCount === 0 && warnCount === 0 && okCount > 0 && (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" /> OK
                        </span>
                    )}
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between px-5 py-4 hover:bg-slate-50/80 transition-colors">
                        <span className="text-slate-600 font-medium text-sm md:text-base leading-tight pr-4">{item.label}</span>
                        <div className="flex items-start gap-3 text-right">
                            <span className="text-slate-900 font-semibold text-sm md:text-base leading-tight break-words">{String(item.value)}</span>
                            {item.flag === 'ok' && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                            {item.flag === 'warn' && <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />}
                            {item.flag === 'risk' && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                        </div>
                    </div>
                ))}
            </div>

            {section.notes && section.notes.length > 0 && (
                <div className="px-5 py-4 bg-teal-50 border-t border-teal-100">
                    {section.notes.map((note, idx) => (
                        <p key={idx} className="text-sm text-teal-900 whitespace-pre-wrap leading-relaxed">{note}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function PremiumReportView({
    sections, vehicleInfo, reportId, pdfUrl,
}: PremiumReportViewProps) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const [heroVisible, setHeroVisible] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const calculateScore = () => {
        let score = 100;
        sections.forEach(s => s.items.forEach(item => {
            if (item.flag === 'risk') score -= 15;
            if (item.flag === 'warn') score -= 5;
        }));
        return Math.max(0, Math.min(100, score));
    };

    const vehicleScore = calculateScore();

    useEffect(() => {
        setHeroVisible(true);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setAnimatedScore(prev => {
                    if (prev >= vehicleScore) {
                        clearInterval(interval);
                        return vehicleScore;
                    }
                    return prev + 2;
                });
            }, 20);
            return () => clearInterval(interval);
        }, 300);
        return () => clearTimeout(timer);
    }, [vehicleScore]);

    const getVehicleData = (keys: string[]) => {
        for (const key of keys) {
            if (vehicleInfo?.[key]) return String(vehicleInfo[key]);
        }
        for (const section of sections) {
            for (const item of section.items) {
                const label = item.label.toLowerCase();
                for (const key of keys) {
                    if (label.includes(key.toLowerCase())) return String(item.value);
                }
            }
        }
        return '—';
    };

    const brand = getVehicleData(['marque', 'marca', 'brand']);
    const model = getVehicleData(['version', 'modele', 'modelo', 'model']);
    const year = getVehicleData(['annee', 'année', 'año', 'year', 'anno']);
    const fuel = getVehicleData(['carburant', 'combustible', 'fuel', 'energie', 'carburante']);
    const power = getVehicleData(['puissance', 'potencia', 'power', 'potenza']);
    const plate = getVehicleData(['immatriculation', 'matricula', 'plaque', 'plate', 'targa']);
    const vin = getVehicleData(['vin']);
    const emissions = getVehicleData(['emission_co2', 'co2', 'emissioni']);
    const brandLogoUrl = vehicleInfo?.logo_marque
        || (brand !== '—'
            ? `https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/${brand.toLowerCase()}.png`
            : null);

    const formatPower = (p: string) => {
        if (p === '—') return '—';
        if (!p.toLowerCase().includes('cv') && !p.toLowerCase().includes('hp')) return `${p} CV`;
        return p;
    };

    const ownerName = vehicleInfo?.titulaire || vehicleInfo?.proprietario;
    const ownerAddress = vehicleInfo?.adresse || vehicleInfo?.indirizzo;

    const handleDownload = async () => {
        if (!pdfUrl) return;

        setIsDownloading(true);
        try {
            const response = await fetch(pdfUrl);
            if (!response.ok) {
                throw new Error('Errore durante il download');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Report_${brand}_${model}_${plate}.pdf`.replace(/[^a-zA-Z0-9_.-]/g, '_');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Errore download PDF:', error);
            alert('Errore durante il download del PDF. Riprova.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: `Report ${brand} ${model}`, url });
            } catch {
                // User cancelled or share failed silently
            }
        } else {
            await navigator.clipboard.writeText(url);
            alert('Link copiato!');
        }
    };

    const heroEnter = heroVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-5';

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {reportId !== 'esempio-report' && (
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
                    <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link href="/account" className="flex items-center gap-2 text-slate-600 hover:text-teal-700 transition-colors font-medium">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Indietro</span>
                        </Link>
                        <h1 className="text-lg font-bold text-slate-900">Report Veicolo</h1>
                        <div className="hidden lg:flex items-center gap-2">
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading || !pdfUrl}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                                {isDownloading ? 'Download...' : 'PDF'}
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 transition-all"
                            >
                                <Share2 className="w-4 h-4" /> Condividi
                            </button>
                        </div>
                        <div className="w-10 lg:hidden" />
                    </div>
                </header>
            )}

            <div className="relative pt-4 pb-8 lg:pt-12 lg:pb-16 bg-slate-50/50">
                <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white to-transparent pointer-events-none" />
                <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-teal-100/40 rounded-full blur-[60px] md:blur-[100px] mix-blend-multiply opacity-70 animate-pulse" />
                <div className="absolute top-[10%] left-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-blue-100/40 rounded-full blur-[60px] md:blur-[100px] mix-blend-multiply opacity-70" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6">
                        <div
                            className={`md:col-span-8 bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group transition-all duration-500 ease-out ${heroEnter}`}
                        >
                            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                {brandLogoUrl && <img src={brandLogoUrl} className="w-32 h-32 md:w-64 md:h-64 object-contain" alt="" />}
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                    <div className="px-2.5 py-1 bg-slate-900 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full">
                                        Report Ufficiale
                                    </div>
                                    <div className="px-2.5 py-1 bg-teal-50 text-teal-700 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Verificato
                                    </div>
                                </div>

                                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-1 md:mb-2 tracking-tight">
                                    {brand}
                                </h1>
                                <p className="text-lg md:text-2xl text-slate-500 font-medium mb-6 md:mb-8 leading-tight">
                                    {model}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    {plate !== '—' && (
                                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                <Car className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">Targa</div>
                                                <div className="text-sm font-bold text-slate-900 font-mono">{plate}</div>
                                            </div>
                                        </div>
                                    )}
                                    {vin !== '—' && (
                                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <div className="min-w-0 overflow-hidden">
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">VIN</div>
                                                <div className="text-sm font-bold text-slate-900 font-mono break-all">{vin}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div
                            className={`md:col-span-4 bg-slate-900 rounded-2xl md:rounded-[2rem] p-4 md:p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[160px] transition-all duration-500 ease-out delay-100 ${heroEnter}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-blue-600 opacity-20" />
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-teal-500 rounded-full blur-[80px] opacity-40" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6 md:mb-8">
                                    <h3 className="text-base md:text-lg font-bold">Affidabilità</h3>
                                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
                                </div>

                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
                                        {animatedScore}
                                    </span>
                                    <span className="text-lg md:text-xl text-slate-500 font-medium mb-3 md:mb-4">/100</span>
                                </div>

                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                                    <div
                                        className={`h-full transition-all duration-[1500ms] ease-out ${vehicleScore >= 80 ? 'bg-emerald-500' : vehicleScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                        style={{ width: `${animatedScore}%` }}
                                    />
                                </div>
                                <div className="inline-flex px-3 py-1 rounded-full bg-white/10 text-xs md:text-sm font-medium backdrop-blur-md self-start border border-white/10">
                                    {getScoreLabel(vehicleScore)}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {[
                                { icon: Calendar, label: 'Anno', value: year, color: 'text-teal-600', bg: 'bg-teal-50' },
                                { icon: Fuel, label: 'Carburante', value: fuel, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { icon: Zap, label: 'Potenza', value: formatPower(power), color: 'text-amber-600', bg: 'bg-amber-50' },
                                { icon: Leaf, label: 'Emissioni CO₂', value: emissions, color: 'text-blue-600', bg: 'bg-blue-50' },
                            ].map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className={`bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 ease-out flex items-center gap-3 md:gap-4 group ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    style={{ transitionDelay: `${200 + i * 100}ms` }}
                                >
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                                        <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div className="min-w-0 overflow-hidden">
                                        <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{stat.label}</div>
                                        <div className="text-sm md:text-lg font-bold text-slate-900 break-words">{stat.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {vehicleInfo?.photo_modele && (
                <div className="max-w-5xl mx-auto px-4 mb-8">
                    <div className={`bg-white rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-500 ease-out ${heroEnter}`}>
                        <div className="relative aspect-video sm:aspect-auto overflow-hidden bg-slate-100 flex items-center justify-center">
                            <img
                                src={vehicleInfo.photo_modele}
                                alt={`${brand} ${model}`}
                                className="w-full h-auto max-h-[300px] md:max-h-[500px] object-contain"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                                <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] md:text-sm font-bold text-slate-900 shadow-lg flex items-center gap-2">
                                    <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" />
                                    Foto modello
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {vehicleInfo?.isMarketingExample && vehicleInfo?.vehicleImageUrl && (
                <div className="max-w-5xl mx-auto px-4 mb-8">
                    <div className={`bg-white rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-500 ease-out ${heroEnter}`}>
                        <div className="relative aspect-video sm:aspect-auto overflow-hidden bg-slate-100 flex items-center justify-center">
                            <img
                                src={vehicleInfo.vehicleImageUrl}
                                alt={`${brand} ${model}`}
                                className="w-full h-auto max-h-[300px] md:max-h-[500px] object-contain"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                                <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] md:text-sm font-bold text-slate-900 shadow-lg flex items-center gap-2">
                                    <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" />
                                    Foto del veicolo analizzato
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 mb-8">
                <div className={`bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm transition-all duration-500 ease-out delay-200 ${heroEnter}`}>
                    <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-teal-600" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Dati proprietario</h3>
                        {ownerName ? (
                            <div className="flex flex-col gap-1">
                                <p className="text-lg font-medium text-slate-800">{ownerName}</p>
                                {ownerAddress && <p className="text-slate-500">{ownerAddress}</p>}
                            </div>
                        ) : (
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Lock className="w-4 h-4 text-slate-400" />
                                    <span className="font-semibold text-slate-700 text-sm">Dati protetti</span>
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Il titolare attuale ha esercitato il diritto di opposizione alla diffusione dei propri dati personali,
                                    in conformità al Regolamento GDPR (UE 2016/679) e alla normativa italiana sulla protezione dei dati.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-32 lg:pb-24">
                <div className="space-y-6">
                    {sections
                        .filter((section) => section.id !== "media")
                        .map((section) => (
                        <SectionCard key={section.id || section.title} section={section} />
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-50">
                <div className="flex gap-3 max-w-lg mx-auto">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading || !pdfUrl}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-5 h-5" /> PDF
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold shadow-lg shadow-teal-500/30 hover:shadow-xl transition-all"
                    >
                        <Share2 className="w-5 h-5" /> Condividi
                    </button>
                </div>
            </div>
        </div>
    );
}
