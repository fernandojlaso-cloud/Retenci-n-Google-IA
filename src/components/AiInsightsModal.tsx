import React, { useState, useEffect } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import {
  BrainCircuit,
  X,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Target,
} from "lucide-react";

interface AiInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const AiInsightsModal: React.FC<AiInsightsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const { casos, filtroSedeGlobal } = useMegatlon();

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAiAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casos,
          sedeFiltro: filtroSedeGlobal || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error consultando análisis IA");
      }
      setAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "No se pudo generar el diagnóstico inteligente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !analysis) {
      fetchAiAnalysis();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141418] border border-[#26262e] w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-fadeIn">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#222228] flex items-center justify-between bg-gradient-to-r from-[#17171d] to-[#141418]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f2622a] to-[#d64c18] flex items-center justify-center text-white shadow-lg shadow-[#f2622a]/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white font-['Outfit']">
                  DIAGNÓSTICO EJECUTIVO DE FUGA IA
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f2622a]/15 text-[#f2622a] border border-[#f2622a]/30 uppercase">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-[#8e8e93]">
                Análisis de deserción en base a {casos.length} socios de la red
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAiAnalysis}
              disabled={loading}
              className="p-2 rounded-xl bg-[#1e1e24] hover:bg-[#282830] text-[#8e8e93] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Recalcular análisis"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1e1e24] hover:bg-[#282830] text-[#8e8e93] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#f2622a] animate-spin" />
              <p className="text-sm font-semibold text-white">
                Procesando cohortes de inactividad con Gemini...
              </p>
              <p className="text-xs text-[#8e8e93]">
                Evaluando correlación entre días sin asistir, motivos y retención por sede
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-[#ff453a]/10 border border-[#ff453a]/25 text-[#ff453a] text-xs">
              {error}
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="bg-[#18181e] border border-[#272730] rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2622a]/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#f2622a] mb-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Resumen Estratégico
                </h3>
                <p className="text-sm text-[#e1e1e6] leading-relaxed">
                  {analysis.resumenEjecutivo}
                </p>
              </div>

              {/* Grid: Main Causes & Critical Branches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Causes */}
                <div className="bg-[#18181e] border border-[#272730] rounded-2xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                    <TrendingDown className="w-3.5 h-3.5 text-[#ff453a]" />
                    Focos Principales de Abandono
                  </h3>
                  <ul className="space-y-2 text-xs">
                    {analysis.causasPrincipales?.map((causa: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-[#c4c4cc]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f2622a] mt-1.5 shrink-0" />
                        <span>{causa}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Critical Branches */}
                <div className="bg-[#18181e] border border-[#272730] rounded-2xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#ffd426]" />
                    Sedes en Alerta Prioritaria
                  </h3>
                  <div className="space-y-2">
                    {analysis.sedesCriticas?.map((s: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-[#1f1f26] border border-[#2c2c36] p-2.5 rounded-xl text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-white block">{s.sede}</span>
                          <span className="text-[11px] text-[#8e8e93]">{s.motivo}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff453a]/15 text-[#ff453a] border border-[#ff453a]/30">
                          {s.volumen}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Action Plan */}
              <div className="bg-[#18181e] border border-[#272730] rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#30d158] flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" />
                  Plan de Acción Inmediato para las Próximas 48 Horas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {analysis.planAccionInmediato?.map((plan: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-[#1e1e24] border border-[#2a2a34] rounded-xl p-3 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#f2622a] block mb-1">
                          {plan.paso}
                        </span>
                        <p className="text-xs font-semibold text-white leading-snug">
                          {plan.accion}
                        </p>
                      </div>
                      <span className="text-[10px] text-[#8e8e93] mt-2 block">
                        Impacto estimado: <strong className="text-[#30d158]">{plan.impacto}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#222228] bg-[#141418] flex items-center justify-between">
          <span className="text-[11px] text-[#8e8e93]">
            Sugerencia: Usá el <strong>Estudio Visual</strong> para crear los flyers de la campaña recomendada.
          </span>
          <button
            onClick={() => {
              onClose();
              if (onNavigateToTab) onNavigateToTab("creativos");
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#f2622a] to-[#ff7a45] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-[#f2622a]/20"
          >
            <span>Ir al Estudio Visual</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
