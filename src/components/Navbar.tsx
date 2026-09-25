import React from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { SEDES_MEGATLON } from "../types";
import {
  Dumbbell,
  BarChart3,
  Users,
  FileText,
  Sparkles,
  Building2,
  FileSpreadsheet,
  AlertTriangle,
  Flame,
  CheckCircle2,
  RefreshCw,
  Compass,
  MessageSquareText,
  Shield,
  Lock,
} from "lucide-react";

interface NavbarProps {
  solapaActual: string;
  setSolapaActual: (solapa: string) => void;
  onOpenManagerModal: () => void;
  onOpenFileIngestion: () => void;
  onOpenAiInsights: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  solapaActual,
  setSolapaActual,
  onOpenManagerModal,
  onOpenFileIngestion,
  onOpenAiInsights,
}) => {
  const {
    gerente,
    soloMiSede,
    setSoloMiSede,
    sedeFiltroActiva,
    setSedeFiltroActiva,
    onboardingsFiltrados,
    casosFiltrados,
    contratosFiltrados,
    equipo,
    isFirebaseSynced,
  } = useMegatlon();

  const alertasRojasCount = onboardingsFiltrados.filter((o) => o.alerta_roja && !o.tarea_resuelta).length;
  const sleepersAbiertosCount = casosFiltrados.filter((c) => c.estado === "Abierto").length;
  const contratosRiesgoAltoCount = contratosFiltrados.filter((c) => c.riesgo_baja === "Alto").length;
  const pendientesAprobacionCount = (equipo || []).filter(
    (m) => (m.rol === "gerente" && !m.aprobadoPorDirector) || (!m.autorizadoPorGerente && m.rol !== "director" && m.rol !== "gerente")
  ).length;
  const esDirector = gerente.rol === "director";

  return (
    <header className="bg-[#0c0c0f] border-b border-white/10 sticky top-0 z-40">
      {/* Top Bar: Brand, Manager Credentials & Branch Status */}
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Slogan */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#c2410c] flex items-center justify-center shadow-lg shadow-[#ff6b00]/25">
            <Dumbbell className="w-5 h-5 text-white transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-lg text-white font-['Montserrat',sans-serif]">
                MEGATLON <span className="text-[#ff6b00]">RETENCIÓN & 30D</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff6b00]/15 text-[#ff6b00] border border-[#ff6b00]/30 uppercase tracking-wider">
                28 Sedes Oficiales
              </span>
            </div>
            <p className="text-[11px] text-[#8e8e93]">
              Gestión Integral de Socios, Customer Journey y Cruce por DNI
            </p>
          </div>
        </div>

        {/* Center / Right: Manager Badge & Quick Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Firestore Sync Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-[#8e8e93]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Firebase Firestore Activo</span>
          </div>

          {/* Branch & Manager Trigger Button */}
          <button
            onClick={onOpenManagerModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#16161d] hover:bg-[#1f1f28] border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5 text-[#ff6b00]" />
            <span>
              Sede: <strong className="text-white">{gerente.sede}</strong>
            </span>
            <span className="text-[#8e8e93] text-[11px]">
              ({gerente.nombre} {gerente.apellido})
            </span>
          </button>

          {/* Ingestar Archivos Button */}
          <button
            onClick={onOpenFileIngestion}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 text-xs font-bold transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            <span>Ingestar Archivos (CSV)</span>
          </button>

          {/* Diagnóstico IA Modal */}
          <button
            onClick={onOpenAiInsights}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ea580c] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-[#ff6b00]/25 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Diagnóstico IA</span>
          </button>
        </div>
      </div>

      {/* Navigation Solapas Bar */}
      <div className="bg-[#121217] border-t border-white/5">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none py-1">
          <nav className="flex items-center gap-1">
            {/* 1. Onboarding 30 Días */}
            <button
              onClick={() => setSolapaActual("onboarding")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                solapaActual === "onboarding"
                  ? "bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25"
                  : "text-[#8e8e93] hover:text-white hover:bg-white/5"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Onboarding 30 Días</span>
              {alertasRojasCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full bg-red-950 text-red-300 text-[10px] font-black border border-red-500 animate-pulse">
                  🚨 {alertasRojasCount}
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
                  {onboardingsFiltrados.length}
                </span>
              )}
            </button>

            {/* 2. Sleepers */}
            <button
              onClick={() => setSolapaActual("sleepers")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                solapaActual === "sleepers"
                  ? "bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25"
                  : "text-[#8e8e93] hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Sleepers (Inactivos)</span>
              {sleepersAbiertosCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
                  {sleepersAbiertosCount}
                </span>
              )}
            </button>

            {/* 3. Contratos a Vencer */}
            <button
              onClick={() => setSolapaActual("contratos")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                solapaActual === "contratos"
                  ? "bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25"
                  : "text-[#8e8e93] hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Contratos a Vencer (90-150d)</span>
              {contratosRiesgoAltoCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200 text-[10px] font-bold">
                  {contratosRiesgoAltoCount} en riesgo
                </span>
              )}
            </button>

            {/* 4. Panorama & Analíticas */}
            <button
              onClick={() => setSolapaActual("panorama")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                solapaActual === "panorama"
                  ? "bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25"
                  : "text-[#8e8e93] hover:text-white hover:bg-white/5"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Panorama & Analíticas</span>
            </button>

            {/* 5. Estudio Visual Creativo */}
            <button
              onClick={() => setSolapaActual("estudio")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                solapaActual === "estudio"
                  ? "bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25"
                  : "text-[#8e8e93] hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Estudio Visual</span>
            </button>

            {/* 6. Administración de Mensajes (Solo Director) */}
            <button
              onClick={() => setSolapaActual("admin_mensajes")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                solapaActual === "admin_mensajes"
                  ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md shadow-amber-500/25"
                  : "text-[#8e8e93] hover:text-white hover:bg-white/5"
              }`}
            >
              <MessageSquareText className="w-4 h-4 text-amber-400" />
              <span>Admin Mensajes</span>
              {esDirector ? (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black border border-amber-400/30">
                  Director
                </span>
              ) : (
                <Lock className="w-3 h-3 text-[#8e8e93]" />
              )}
            </button>

            {/* 7. Auditor & Equipo (Jerarquía Director -> Gerente -> Equipo) */}
            <button
              onClick={() => setSolapaActual("auditor")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                solapaActual === "auditor"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "text-[#8e8e93] hover:text-white hover:bg-white/5"
              }`}
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Auditor & Equipo</span>
              {pendientesAprobacionCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 animate-pulse">
                  ⏳ {pendientesAprobacionCount}
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-zinc-300 text-[10px]">
                  {equipo.length}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Scope Filter Toggle */}
          <div className="flex items-center gap-2 text-xs text-[#8e8e93]">
            <button
              onClick={() => setSoloMiSede(!soloMiSede)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                soloMiSede
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                  : "bg-white/5 border border-white/10 text-white"
              }`}
            >
              {soloMiSede ? `📍 Solo mi sede (${gerente.sede})` : "🌐 Vista Red (28 Sedes Oficiales)"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
