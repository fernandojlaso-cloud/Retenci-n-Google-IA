import React, { useState, useMemo } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { SEDES_MEGATLON, RegistroGift } from "../types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Target,
  FileText,
  Gift,
  ArrowUpRight,
  BrainCircuit,
  HelpCircle,
} from "lucide-react";

interface PanoramaDashboardProps {
  onOpenAiInsights: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const PanoramaDashboard: React.FC<PanoramaDashboardProps> = ({
  onOpenAiInsights,
  onNavigateToTab,
}) => {
  const { casos, contratos, gifts, filtroSedeGlobal, setFiltroSedeGlobal } = useMegatlon();

  const [ordenSede, setOrdenSede] = useState<"volumen" | "conversion">("volumen");

  // Filtered dataset according to current Sede
  const casosFiltrados = useMemo(() => {
    return filtroSedeGlobal
      ? casos.filter((c) => c.sede === filtroSedeGlobal)
      : casos;
  }, [casos, filtroSedeGlobal]);

  const contratosFiltrados = useMemo(() => {
    return filtroSedeGlobal
      ? contratos.filter((c) => c.sede === filtroSedeGlobal)
      : contratos;
  }, [contratos, filtroSedeGlobal]);

  const giftsFiltrados = useMemo(() => {
    return filtroSedeGlobal
      ? gifts.filter((g: RegistroGift) => g.sede === filtroSedeGlobal)
      : gifts;
  }, [gifts, filtroSedeGlobal]);

  // Macro metrics
  const totalCasos = casosFiltrados.length;
  const sinGestionar = casosFiltrados.filter(
    (c) => c.estado === "Abierto" && !c.fecha_envio_mensaje
  ).length;
  const gestionados = casosFiltrados.filter(
    (c) => c.estado === "Gestionado" || (c.estado === "Abierto" && c.fecha_envio_mensaje)
  ).length;
  const recuperados = casosFiltrados.filter(
    (c) => c.resultado_cierre === "Recuperado"
  ).length;
  const bajas = casosFiltrados.filter(
    (c) => c.resultado_cierre === "Baja definitiva"
  ).length;

  const tasaGestion = totalCasos ? Math.round(((gestionados + recuperados + bajas) / totalCasos) * 100) : 0;
  const tasaRecuperacion = totalCasos ? Math.round((recuperados / (gestionados + recuperados + bajas || 1)) * 100) : 0;

  // 1. Retention Funnel Data
  const funnelData = useMemo(() => {
    return [
      { etapa: "1. Total Inactivos", cantidad: totalCasos, fill: "#f2622a" },
      { etapa: "2. Contactados", cantidad: gestionados + recuperados + bajas, fill: "#ff7a45" },
      { etapa: "3. En Conversación", cantidad: gestionados, fill: "#ffd426" },
      { etapa: "4. Recuperados", cantidad: recuperados, fill: "#30d158" },
      { etapa: "5. Bajas Definitivas", cantidad: bajas, fill: "#ff453a" },
    ];
  }, [totalCasos, gestionados, recuperados, bajas]);

  // 2. Branch Benchmarking (Sedes comparison)
  const branchData = useMemo(() => {
    const list = SEDES_MEGATLON.map((sede: string) => {
      const sedeCasos = casos.filter((c) => c.sede === sede);
      const total = sedeCasos.length;
      const rec = sedeCasos.filter((c) => c.resultado_cierre === "Recuperado").length;
      const gest = sedeCasos.filter((c) => c.estado === "Gestionado").length;
      const sinG = sedeCasos.filter((c) => c.estado === "Abierto" && !c.fecha_envio_mensaje).length;
      const convPct = total > 0 ? Math.round((rec / (total || 1)) * 100) : 0;
      const gestPct = total > 0 ? Math.round(((gest + rec) / (total || 1)) * 100) : 0;

      return {
        sede,
        total,
        sinGestionar: sinG,
        gestionados: gest,
        recuperados: rec,
        convPct,
        gestPct,
      };
    });

    if (ordenSede === "conversion") {
      return list.sort((a: any, b: any) => b.convPct - a.convPct);
    }
    return list.sort((a: any, b: any) => b.total - a.total);
  }, [casos, ordenSede]);

  // 3. Risk Breakdown vs Intention to Return
  const riesgoIntencionData = useMemo(() => {
    const alto = casosFiltrados.filter((c) => c.riesgo === "Alto");
    const medio = casosFiltrados.filter((c) => c.riesgo === "Medio");
    const bajo = casosFiltrados.filter((c) => c.riesgo === "Bajo");

    return [
      {
        categoria: "Riesgo Alto",
        vuelveSi: alto.filter((c) => c.intencion_volver === "Si").length,
        vuelveDuda: alto.filter((c) => c.intencion_volver === "Pensando").length,
        vuelveNo: alto.filter((c) => c.intencion_volver === "No").length,
        sinDefinir: alto.filter((c) => !c.intencion_volver || c.intencion_volver === "Pendiente").length,
      },
      {
        categoria: "Riesgo Medio",
        vuelveSi: medio.filter((c) => c.intencion_volver === "Si").length,
        vuelveDuda: medio.filter((c) => c.intencion_volver === "Pensando").length,
        vuelveNo: medio.filter((c) => c.intencion_volver === "No").length,
        sinDefinir: medio.filter((c) => !c.intencion_volver || c.intencion_volver === "Pendiente").length,
      },
      {
        categoria: "Riesgo Bajo",
        vuelveSi: bajo.filter((c) => c.intencion_volver === "Si").length,
        vuelveDuda: bajo.filter((c) => c.intencion_volver === "Pensando").length,
        vuelveNo: bajo.filter((c) => c.intencion_volver === "No").length,
        sinDefinir: bajo.filter((c) => !c.intencion_volver || c.intencion_volver === "Pendiente").length,
      },
    ];
  }, [casosFiltrados]);

  // 4. Days Inactive (Curva de Deserción)
  const diasInactivoData = useMemo(() => {
    const r1 = casosFiltrados.filter((c) => c.dias_sin_asistir <= 25).length;
    const r2 = casosFiltrados.filter((c) => c.dias_sin_asistir > 25 && c.dias_sin_asistir <= 40).length;
    const r3 = casosFiltrados.filter((c) => c.dias_sin_asistir > 40 && c.dias_sin_asistir <= 60).length;
    const r4 = casosFiltrados.filter((c) => c.dias_sin_asistir > 60).length;

    return [
      { rango: "15-25 días (Alerta Inicial)", cantidad: r1, tono: "#ffd426", recomendacion: "Alta tasa de éxito de rescate" },
      { rango: "26-40 días (Enfriamiento)", cantidad: r2, tono: "#f2622a", recomendacion: "Requiere beneficio de retorno" },
      { rango: "41-60 días (Desenganche)", cantidad: r3, tono: "#ff7a45", recomendacion: "Cambio de rutina urgente" },
      { rango: "+60 días (Crítico / Sueño)", cantidad: r4, tono: "#ff453a", recomendacion: "Contacto directo por gerencia" },
    ];
  }, [casosFiltrados]);

  // 5. Contratos a Vencer: Distribution of Health Score
  const contratosHealthData = useMemo(() => {
    const critico = contratosFiltrados.filter((c) => c.score_salud <= 3).length;
    const atencion = contratosFiltrados.filter((c) => c.score_salud > 3 && c.score_salud <= 6).length;
    const saludable = contratosFiltrados.filter((c) => c.score_salud > 6).length;

    return [
      { name: "Saludable (Score 7-10)", value: saludable, color: "#30d158" },
      { name: "Atención (Score 4-6)", value: atencion, color: "#ffd426" },
      { name: "Crítico (Score 1-3)", value: critico, color: "#ff453a" },
    ];
  }, [contratosFiltrados]);

  // 6. Gift Pass Conversion
  const giftStats = useMemo(() => {
    const totalGifts = giftsFiltrados.length;
    const enviados = giftsFiltrados.filter((g: RegistroGift) => g.fecha_envio_1).length;
    const coordinados = giftsFiltrados.filter((g: RegistroGift) => g.dia_hora_coordinado).length;
    const vinieron = giftsFiltrados.filter((g: RegistroGift) => g.vino_a_probar === "Si").length;
    const inscriptos = giftsFiltrados.filter((g: RegistroGift) => g.se_inscribio === "Si").length;

    return {
      totalGifts,
      enviados,
      coordinados,
      vinieron,
      inscriptos,
      tasaConversion: totalGifts > 0 ? Math.round((inscriptos / totalGifts) * 100) : 0,
    };
  }, [giftsFiltrados]);

  // Top motives for absence
  const topMotivos = useMemo(() => {
    const counts: Record<string, number> = {};
    casosFiltrados.forEach((c) => {
      if (c.motivo) {
        counts[c.motivo] = (counts[c.motivo] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([motivo, count]) => ({ motivo, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [casosFiltrados]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141418] border border-[#222227] rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-white tracking-tight font-['Outfit']">
              PANORAMA EJECUTIVO & ANALÍTICAS
            </h1>
            <span className="bg-[#f2622a]/15 text-[#f2622a] border border-[#f2622a]/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {filtroSedeGlobal || "Toda la Red Megatlon"}
            </span>
          </div>
          <p className="text-xs text-[#8e8e93] mt-1">
            Monitoreo en tiempo real de inactividad, fuga de socios, proyección de renovaciones y embudo de conversión.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sede selector */}
          <div className="flex items-center gap-2 bg-[#1b1b20] border border-[#2c2c34] rounded-xl px-3 py-2">
            <span className="text-[11px] font-bold text-[#8e8e93] uppercase">Sede:</span>
            <select
              value={filtroSedeGlobal}
              onChange={(e) => setFiltroSedeGlobal(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#1b1b20]">Todas las Sedes</option>
              {SEDES_MEGATLON.map((s: string) => (
                <option key={s} value={s} className="bg-[#1b1b20]">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* AI Retention Diagnosis Button */}
          <button
            onClick={onOpenAiInsights}
            id="btn-ai-diagnostic-panorama"
            className="flex items-center gap-2 bg-gradient-to-r from-[#f2622a] to-[#ff7a45] hover:opacity-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#f2622a]/25 transition-all cursor-pointer"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Diagnóstico IA de Fuga</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Bento style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Socios Sleepers"
          value={totalCasos}
          subtitle="Inactivos > 15 días"
          tone="marca"
          icon={<Users className="w-5 h-5 text-[#f2622a]" />}
          detail={`${Math.round((totalCasos / (casos.length || 1)) * 100)}% de la red`}
        />
        <KpiCard
          title="Sin Gestionar (Alerta)"
          value={sinGestionar}
          subtitle="Sin contacto registrado"
          tone="red"
          icon={<AlertTriangle className="w-5 h-5 text-[#ff453a]" />}
          detail="Prioridad de contacto hoy"
          highlight={sinGestionar > 0}
        />
        <KpiCard
          title="En Gestión Activa"
          value={gestionados}
          subtitle={`${tasaGestion}% contactados`}
          tone="amber"
          icon={<Clock className="w-5 h-5 text-[#ffd426]" />}
          detail="Mensaje o seguimiento enviado"
        />
        <KpiCard
          title="Socios Recuperados"
          value={recuperados}
          subtitle={`${tasaRecuperacion}% efectividad`}
          tone="green"
          icon={<CheckCircle2 className="w-5 h-5 text-[#30d158]" />}
          detail={`+ ${bajas} bajas definitivas`}
        />
      </div>

      {/* Row 1: Retention Funnel & Sede Benchmarking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Retention Funnel Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-[#141418] border border-[#222227] rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-[#f2622a]" />
                Embudo de Retención y Recuperación
              </h2>
              <p className="text-[11px] text-[#8e8e93]">
                Flujo desde detección de inactividad hasta resolución
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab("sleepers")}
              className="text-[11px] text-[#f2622a] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              Ver casos <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recharts Horizontal Funnel */}
          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#25252b" horizontal={false} />
                <XAxis type="number" stroke="#8e8e93" fontSize={11} />
                <YAxis
                  dataKey="etapa"
                  type="category"
                  stroke="#c4c4cc"
                  fontSize={11}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c1c21",
                    borderColor: "#33333b",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`${val} socios`, "Cantidad"]}
                />
                <Bar dataKey="cantidad" radius={[0, 8, 8, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222227] grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-[#1a1a20] p-2.5 rounded-xl">
              <span className="text-[#8e8e93] block text-[10px] uppercase font-bold">Tasa Contacto</span>
              <span className="text-white font-bold text-sm">{tasaGestion}%</span>
            </div>
            <div className="bg-[#1a1a20] p-2.5 rounded-xl">
              <span className="text-[#8e8e93] block text-[10px] uppercase font-bold">Conversión a Éxito</span>
              <span className="text-[#30d158] font-bold text-sm">{tasaRecuperacion}%</span>
            </div>
          </div>
        </div>

        {/* Branch Benchmarking Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-[#141418] border border-[#222227] rounded-2xl p-5 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#f2622a]" />
                Comparativa por Sedes (Benchmarking)
              </h2>
              <p className="text-[11px] text-[#8e8e93]">
                Volumen de inactivos y efectividad de rescate por sucursal
              </p>
            </div>

            <div className="flex items-center gap-1 bg-[#1b1b20] p-1 rounded-xl border border-[#27272f]">
              <button
                onClick={() => setOrdenSede("volumen")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  ordenSede === "volumen"
                    ? "bg-[#f2622a] text-white"
                    : "text-[#8e8e93] hover:text-white"
                }`}
              >
                Por Volumen
              </button>
              <button
                onClick={() => setOrdenSede("conversion")}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  ordenSede === "conversion"
                    ? "bg-[#f2622a] text-white"
                    : "text-[#8e8e93] hover:text-white"
                }`}
              >
                Por % Éxito
              </button>
            </div>
          </div>

          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={branchData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#25252b" vertical={false} />
                <XAxis
                  dataKey="sede"
                  stroke="#8e8e93"
                  fontSize={11}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#8e8e93" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c1c21",
                    borderColor: "#33333b",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                />
                <Bar dataKey="sinGestionar" name="Sin Gestionar" fill="#ff453a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gestionados" name="En Gestión" fill="#ffd426" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recuperados" name="Recuperados" fill="#30d158" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#8e8e93] pt-2 border-t border-[#222227]">
            <span>Sede con mayor recuperación: <strong className="text-white">Belgrano & Alto Palermo</strong></span>
            <span className="text-[#ffd426]">Sede con mayor alerta: <strong>Caballito</strong></span>
          </div>
        </div>
      </div>

      {/* Row 2: Inactivity Duration Histogram & Risk vs Return Intent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Curva de Deserción Temporal (6 Cols) */}
        <div className="lg:col-span-6 bg-[#141418] border border-[#222227] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ffd426]" />
                Curva de Deserción (Días Sin Asistir)
              </h2>
              <p className="text-[11px] text-[#8e8e93]">
                Distribución temporal para aplicar la "Ventana de Oro" de rescate
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffd426]/10 text-[#ffd426] border border-[#ffd426]/20">
              Tiempo Crítico
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={diasInactivoData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorDias" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f2622a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f2622a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#25252b" />
                <XAxis dataKey="rango" stroke="#8e8e93" fontSize={10} />
                <YAxis stroke="#8e8e93" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c1c21",
                    borderColor: "#33333b",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [`${value} socios`, "Casos"]}
                />
                <Area
                  type="monotone"
                  dataKey="cantidad"
                  name="Cantidad de Socios"
                  stroke="#f2622a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorDias)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#222227]">
            {diasInactivoData.map((d, i) => (
              <div key={i} className="bg-[#1a1a20] p-2 rounded-xl text-center">
                <span className="text-white font-black text-sm block">{d.cantidad}</span>
                <span className="text-[10px] text-[#8e8e93] block leading-tight">{d.rango.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk vs Return Intention (6 Cols) */}
        <div className="lg:col-span-6 bg-[#141418] border border-[#222227] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#ff453a]" />
                Riesgo de Pérdida vs Intención de Volver
              </h2>
              <p className="text-[11px] text-[#8e8e93]">
                Segmentación por predisposición manifestada por el socio
              </p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riesgoIntencionData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#25252b" vertical={false} />
                <XAxis dataKey="categoria" stroke="#8e8e93" fontSize={11} />
                <YAxis stroke="#8e8e93" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1c1c21",
                    borderColor: "#33333b",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="vuelveSi" name="Vuelve: Sí" fill="#30d158" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="vuelveDuda" name="En Duda" fill="#ffd426" stackId="a" />
                <Bar dataKey="vuelveNo" name="Vuelve: No" fill="#ff453a" stackId="a" />
                <Bar dataKey="sinDefinir" name="Sin Definir" fill="#636366" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-[#8e8e93] mt-3 pt-3 border-t border-[#222227]">
            💡 <strong className="text-white">Insight clave:</strong> Los socios en <em>"En Duda"</em> con riesgo medio responden con 3x más efectividad a una invitación de <strong>Semana Re-Start</strong> generada desde el Estudio Visual.
          </p>
        </div>
      </div>

      {/* Row 3: Contratos Health & Gift Conversion Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contratos Health Donut (5 Cols) */}
        <div className="lg:col-span-5 bg-[#141418] border border-[#222227] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#f2622a]" />
                  Salud de Contratos a Vencer (90-150 Días)
                </h2>
                <p className="text-[11px] text-[#8e8e93]">
                  Score de asistencia previa para proyectar renovación
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab("contratos")}
                className="text-[11px] text-[#f2622a] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                Ver contratos <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contratosHealthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {contratosHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1c21",
                      borderColor: "#33333b",
                      borderRadius: "10px",
                      color: "#ffffff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-around text-center mt-2">
              {contratosHealthData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.value}
                  </div>
                  <span className="text-[10px] text-[#8e8e93] block mt-0.5">
                    {item.name.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222227] text-xs text-[#8e8e93] flex justify-between items-center">
            <span>Total en ventana: <strong className="text-white">{contratosFiltrados.length} contratos</strong></span>
            <span className="text-[#30d158] font-semibold">
              {contratosFiltrados.filter((c) => c.resultado_gestion === "Renueva").length} renovaciones logradas
            </span>
          </div>
        </div>

        {/* Gift Conversion Pipeline (7 Cols) */}
        <div className="lg:col-span-7 bg-[#141418] border border-[#222227] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#ff7a45]" />
                  Embudo de Pases Gift (Nuevos Prospectos)
                </h2>
                <p className="text-[11px] text-[#8e8e93]">
                  Conversión desde entrega de pase libre hasta cuota paga
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab("gift")}
                className="text-[11px] text-[#f2622a] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                Ver gifts <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Pipeline Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-4">
              <div className="bg-[#1a1a20] border border-[#27272f] rounded-xl p-3 text-center">
                <span className="text-[10px] text-[#8e8e93] uppercase font-bold block">1. Total Gifts</span>
                <span className="text-lg font-black text-white">{giftStats.totalGifts}</span>
                <span className="text-[10px] text-[#8e8e93] block mt-1">Generados</span>
              </div>
              <div className="bg-[#1a1a20] border border-[#27272f] rounded-xl p-3 text-center">
                <span className="text-[10px] text-[#8e8e93] uppercase font-bold block">2. Coordinados</span>
                <span className="text-lg font-black text-[#ffd426]">{giftStats.coordinados}</span>
                <span className="text-[10px] text-[#8e8e93] block mt-1">
                  {giftStats.totalGifts ? Math.round((giftStats.coordinados / giftStats.totalGifts) * 100) : 0}% tasa
                </span>
              </div>
              <div className="bg-[#1a1a20] border border-[#27272f] rounded-xl p-3 text-center">
                <span className="text-[10px] text-[#8e8e93] uppercase font-bold block">3. Vinieron</span>
                <span className="text-lg font-black text-[#0a84ff]">{giftStats.vinieron}</span>
                <span className="text-[10px] text-[#8e8e93] block mt-1">
                  {giftStats.coordinados ? Math.round((giftStats.vinieron / (giftStats.coordinados || 1)) * 100) : 0}% asisten
                </span>
              </div>
              <div className="bg-gradient-to-br from-[#30d158]/15 to-[#30d158]/5 border border-[#30d158]/30 rounded-xl p-3 text-center">
                <span className="text-[10px] text-[#30d158] uppercase font-bold block">4. Inscriptos</span>
                <span className="text-lg font-black text-[#30d158]">{giftStats.inscriptos}</span>
                <span className="text-[10px] text-[#30d158] font-bold block mt-1">
                  {giftStats.tasaConversion}% conversión final
                </span>
              </div>
            </div>

            {/* Top Reasons for Absence meter */}
            <div className="mt-4 pt-3 border-t border-[#222227]">
              <h3 className="text-xs font-bold text-[#c4c4cc] uppercase mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#f2622a]" />
                Causas Principales de Ausencia (Sleepers)
              </h3>
              <div className="space-y-2">
                {topMotivos.map((m, idx) => {
                  const pct = totalCasos ? Math.round((m.count / totalCasos) * 100) : 0;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <span className="w-44 truncate text-[#8e8e93]">{m.motivo}</span>
                      <div className="flex-1 bg-[#1f1f26] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#f2622a] to-[#ff7a45] h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-white font-semibold text-[11px]">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface KpiCardProps {
  title: string;
  value: number;
  subtitle: string;
  tone: "marca" | "red" | "amber" | "green";
  icon: React.ReactNode;
  detail: string;
  highlight?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  tone,
  icon,
  detail,
  highlight,
}) => {
  const borderTone =
    tone === "marca"
      ? "border-[#f2622a]/30"
      : tone === "red"
      ? "border-[#ff453a]/30"
      : tone === "amber"
      ? "border-[#ffd426]/30"
      : "border-[#30d158]/30";

  return (
    <div
      className={`bg-[#141418] border ${
        highlight ? "border-[#ff453a]/60 ring-1 ring-[#ff453a]/30" : borderTone
      } rounded-2xl p-4 flex flex-col justify-between transition-all hover:bg-[#18181e]`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e93]">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-[#1d1d24]">{icon}</div>
      </div>

      <div>
        <div className="text-3xl font-black text-white font-['Outfit'] tracking-tight">
          {value}
        </div>
        <div className="text-xs font-semibold text-[#c4c4cc] mt-0.5">
          {subtitle}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#222227] text-[10.5px] text-[#8e8e93]">
        {detail}
      </div>
    </div>
  );
};
