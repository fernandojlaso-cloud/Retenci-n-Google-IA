import React, { useState, useMemo } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { SocioOnboarding, RamaOnboarding, HitoOnboarding, SEDES_MEGATLON } from "../types";
import { QuickMessageModal } from "./QuickMessageModal";
import { ClientProfileModal, SocioPerfilData } from "./ClientProfileModal";
import {
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Dumbbell,
  Sparkles,
  Waves,
  Footprints,
  Send,
  Mail,
  ChevronRight,
  Filter,
  Plus,
  MessageCircle,
  HelpCircle,
  Check,
  Search,
  Building2,
  Calendar,
  AlertCircle
} from "lucide-react";

export const OnboardingJourneyView: React.FC = () => {
  const {
    onboardingsFiltrados,
    gerente,
    actualizarHitoOnboarding,
    actualizarRamaOnboarding,
    resolverAlertaRoja,
    agregarSocioOnboarding,
    construirMensajeHito,
    soloMiSede,
  } = useMegatlon();

  // Filtros
  const [filtroRama, setFiltroRama] = useState<string>("Todas");
  const [filtroHito, setFiltroHito] = useState<string>("Todos");
  const [soloAlertas, setSoloAlertas] = useState<boolean>(false);
  const [busqueda, setBusqueda] = useState<string>("");

  // Modales
  const [socioMensaje, setSocioMensaje] = useState<SocioOnboarding | null>(null);
  const [modalNuevoSocio, setModalNuevoSocio] = useState<boolean>(false);
  const [socioResolucion, setSocioResolucion] = useState<SocioOnboarding | null>(null);
  const [notasResolucion, setNotasResolucion] = useState<string>("");
  const [socioDetalle, setSocioDetalle] = useState<SocioOnboarding | null>(null);
  const [socioPerfilModal, setSocioPerfilModal] = useState<SocioPerfilData | null>(null);

  // Formulario nuevo socio manual
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoDni, setNuevoDni] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevaRama, setNuevaRama] = useState<RamaOnboarding>("Sin clasificar");
  const [nuevaSede, setNuevaSede] = useState(gerente.sede);

  // Métricas
  const metricas = useMemo(() => {
    const total = onboardingsFiltrados.length;
    const hito1Pendientes = onboardingsFiltrados.filter(
      (s) => s.hito_actual === "Hito 1" && (!s.hito1_completado || s.rama === "Sin clasificar")
    ).length;
    const hito2y3 = onboardingsFiltrados.filter(
      (s) => s.hito_actual === "Hito 2" || s.hito_actual === "Hito 3"
    ).length;
    const alertasRojas = onboardingsFiltrados.filter((s) => s.alerta_roja && !s.tarea_resuelta).length;
    const completados = onboardingsFiltrados.filter(
      (s) => s.hito_actual === "Completado" || (s.hito4_completado && s.hito4_status === "Positivo")
    ).length;

    return { total, hito1Pendientes, hito2y3, alertasRojas, completados };
  }, [onboardingsFiltrados]);

  // Lista filtrada
  const listaFiltrada = useMemo(() => {
    return onboardingsFiltrados.filter((s) => {
      if (soloAlertas && (!s.alerta_roja || s.tarea_resuelta)) return false;
      if (filtroRama !== "Todas" && s.rama !== filtroRama) return false;
      if (filtroHito !== "Todos" && s.hito_actual !== filtroHito) return false;

      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const matchNombre = s.nombre.toLowerCase().includes(q);
        const matchDni = s.dni.includes(q);
        const matchTel = s.telefono.includes(q);
        return matchNombre || matchDni || matchTel;
      }
      return true;
    });
  }, [onboardingsFiltrados, soloAlertas, filtroRama, filtroHito, busqueda]);

  const handleCrearSocio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevoDni.trim()) return;

    await agregarSocioOnboarding({
      dni: nuevoDni.trim(),
      nombre: nuevoNombre.trim(),
      telefono: nuevoTelefono.trim() || "+54 9 11 0000-0000",
      email: nuevoEmail.trim() || "socio@megatlon.com.ar",
      sede: nuevaSede,
      fecha_alta: new Date().toISOString().slice(0, 10),
      dias_desde_alta: 1,
      rama: nuevaRama,
      hito_actual: "Hito 1",
      hito1_completado: false,
      hito2_completado: false,
      hito3_completado: false,
      hito4_completado: false,
      hito4_asistencia_real: 0,
      alerta_roja: false,
      tarea_urgente_asignada: false,
      tarea_resuelta: false,
      updatedAt: new Date().toISOString()
    });

    setNuevoNombre("");
    setNuevoDni("");
    setNuevoTelefono("");
    setNuevoEmail("");
    setNuevaRama("Sin clasificar");
    setModalNuevoSocio(false);
  };

  const getRamaIcon = (rama: RamaOnboarding) => {
    switch (rama) {
      case "Musculación":
        return <Dumbbell className="w-3.5 h-3.5 text-amber-400" />;
      case "Clases de Técnicas":
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case "Pileta":
        return <Waves className="w-3.5 h-3.5 text-cyan-400" />;
      case "Outdoor":
        return <Footprints className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const getRamaBadgeStyle = (rama: RamaOnboarding) => {
    switch (rama) {
      case "Musculación":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "Clases de Técnicas":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "Pileta":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "Outdoor":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      default:
        return "bg-zinc-700/30 text-zinc-400 border-zinc-700/50";
    }
  };

  const getHitoColor = (hito: HitoOnboarding) => {
    switch (hito) {
      case "Hito 1":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      case "Hito 2":
        return "text-indigo-400 bg-indigo-500/10 border-indigo-500/30";
      case "Hito 3":
        return "text-purple-400 bg-purple-500/10 border-purple-500/30";
      case "Hito 4":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "Completado":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Journey Map Overview */}
      <div className="bg-gradient-to-br from-[#16161c] via-[#121217] to-[#0c0c0f] border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff6b00]/15 text-[#ff6b00] text-xs font-bold border border-[#ff6b00]/30 tracking-wide uppercase">
                Customer Journey 30 Días
              </span>
              <span className="text-xs text-[#8e8e93]">
                {soloMiSede ? `Sucursal ${gerente.sede}` : "Todas las sedes"} • Gerente: {gerente.nombre} {gerente.apellido}
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              Onboarding & Fidelización Mes 1
            </h2>
            <p className="text-xs text-[#8e8e93] mt-1 max-w-2xl leading-relaxed">
              Línea de tiempo con ramificaciones dinámicas por actividad. Cada hito permite un chequeo directo de adaptación y genera alertas tempranas antes del primer vencimiento.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalNuevoSocio(true)}
              className="px-4 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#ea580c] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Alta Manual Socio
            </button>
          </div>
        </div>

        {/* Visual Customer Journey Map Timeline */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Customer Journey Map (Ruta de los 30 Días)</span>
            <span className="text-zinc-500 font-normal">Segmentación por DNI en 4 Ramas: Musculación • Clases • Pileta • Outdoor</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Hito 1 */}
            <div className="bg-[#1c1c24]/80 border border-white/5 rounded-xl p-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                  Día 1 a 2
                </span>
                <span className="text-[11px] text-zinc-400 font-semibold">Hito 1</span>
              </div>
              <h4 className="text-xs font-bold text-white">Alta & Diagnóstico</h4>
              <p className="text-[11px] text-[#8e8e93] mt-1 line-clamp-2">
                Identificar actividad principal y segmentar en 1 de las 4 ramas obligatorias.
              </p>
            </div>

            {/* Hito 2 */}
            <div className="bg-[#1c1c24]/80 border border-white/5 rounded-xl p-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  Día 4 a 5
                </span>
                <span className="text-[11px] text-zinc-400 font-semibold">Hito 2</span>
              </div>
              <h4 className="text-xs font-bold text-white">Pulso de Adaptación</h4>
              <p className="text-[11px] text-[#8e8e93] mt-1 line-clamp-2">
                Conexión con profe de sala, dinámica de clases grupales y logística de sede.
              </p>
            </div>

            {/* Hito 3 */}
            <div className="bg-[#1c1c24]/80 border border-white/5 rounded-xl p-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                  Día 10 a 14
                </span>
                <span className="text-[11px] text-zinc-400 font-semibold">Hito 3</span>
              </div>
              <h4 className="text-xs font-bold text-white">Ajuste & Autonomía</h4>
              <p className="text-[11px] text-[#8e8e93] mt-1 line-clamp-2">
                Revisión de plan de entrenamiento y control de frecuencia mínima (2x/sem).
              </p>
            </div>

            {/* Hito 4 */}
            <div className="bg-[#1c1c24]/80 border border-white/5 rounded-xl p-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  Día 25 a 30
                </span>
                <span className="text-[11px] text-zinc-400 font-semibold">Hito 4</span>
              </div>
              <h4 className="text-xs font-bold text-white">Cierre & Retención</h4>
              <p className="text-[11px] text-[#8e8e93] mt-1 line-clamp-2">
                Cruce feedback + asistencia real. Alerta roja gerencial o felicitación + referido.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-[#141419] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-[#8e8e93] mb-2">
            <span className="text-xs font-semibold">Total en Proceso</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{metricas.total}</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Socios en días 1 a 30</p>
        </div>

        <div className="bg-[#141419] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-[#8e8e93] mb-2">
            <span className="text-xs font-semibold">Hito 1 (Alta)</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{metricas.hito1Pendientes}</div>
          <p className="text-[11px] text-blue-400/80 mt-0.5">Diagnóstico y rama</p>
        </div>

        <div className="bg-[#141419] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between text-[#8e8e93] mb-2">
            <span className="text-xs font-semibold">Hito 2 y 3</span>
            <MessageCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{metricas.hito2y3}</div>
          <p className="text-[11px] text-purple-400/80 mt-0.5">Adaptación y rutina</p>
        </div>

        <div className="bg-[#141419] border border-red-500/20 bg-red-950/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-xs font-bold">Alertas Rojas 🚨</span>
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-400">{metricas.alertasRojas}</div>
          <p className="text-[11px] text-red-300/80 mt-0.5">Contacto urgente gerente</p>
        </div>

        <div className="bg-[#141419] border border-emerald-500/20 bg-emerald-950/10 rounded-2xl p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold">Mes 1 Completado</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{metricas.completados}</div>
          <p className="text-[11px] text-emerald-300/80 mt-0.5">Hábito afianzado</p>
        </div>
      </div>

      {/* Control Bar: Filters, Branch Selector, and Search */}
      <div className="bg-[#141419] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search by DNI or Name */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8e93]" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por DNI, Nombre o Teléfono..."
              className="w-full bg-[#1c1c24] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#8e8e93] focus:outline-none focus:border-[#ff6b00]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Rama filter */}
            <div className="flex items-center gap-1 bg-[#1c1c24] border border-white/10 rounded-xl p-1 text-xs">
              <span className="text-[10px] text-[#8e8e93] px-2 font-semibold">Rama:</span>
              {(["Todas", "Musculación", "Clases de Técnicas", "Pileta", "Outdoor"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setFiltroRama(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    filtroRama === r
                      ? "bg-[#ff6b00] text-white font-bold"
                      : "text-[#8e8e93] hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Red Alert toggle button */}
            <button
              onClick={() => setSoloAlertas(!soloAlertas)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                soloAlertas
                  ? "bg-red-500/20 border-red-500 text-red-400 shadow-md shadow-red-500/20"
                  : "bg-[#1c1c24] border-white/10 text-[#8e8e93] hover:text-red-400"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Solo Alertas Rojas ({metricas.alertasRojas})
            </button>
          </div>
        </div>

        {/* Milestone Sub-Tabs */}
        <div className="flex items-center gap-1 border-t border-white/5 pt-3 overflow-x-auto">
          <span className="text-[10px] text-[#8e8e93] font-semibold uppercase mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Hito:
          </span>
          {(["Todos", "Hito 1", "Hito 2", "Hito 3", "Hito 4", "Completado"] as const).map((h) => (
            <button
              key={h}
              onClick={() => setFiltroHito(h)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filtroHito === h
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-[#8e8e93] hover:text-white hover:bg-white/5"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards List */}
      <div className="space-y-3">
        {listaFiltrada.length === 0 ? (
          <div className="bg-[#141419] border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-sm font-semibold text-[#8e8e93]">
              No se encontraron socios en este criterio de búsqueda o sucursal.
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Probá cambiando el filtro de rama, hito o cargando nuevos socios desde el botón "Alta Manual".
            </p>
          </div>
        ) : (
          listaFiltrada.map((socio) => {
            const mensajeSocio = construirMensajeHito(socio);

            return (
              <div
                key={socio.id}
                className={`bg-[#141419] border rounded-2xl p-4 transition-all duration-200 hover:border-white/20 ${
                  socio.alerta_roja && !socio.tarea_resuelta
                    ? "border-red-500/50 bg-gradient-to-r from-red-950/20 via-[#141419] to-[#141419]"
                    : "border-white/10"
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left Column: Member details & Rama tag */}
                  <div className="space-y-1.5 min-w-[260px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{socio.nombre}</h4>
                      <span className="text-[11px] font-mono text-[#8e8e93] bg-[#1c1c24] px-2 py-0.5 rounded border border-white/5">
                        DNI {socio.dni}
                      </span>
                      {socio.alerta_roja && !socio.tarea_resuelta && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> ALERTA ROJA MES 1
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#8e8e93] flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                        Megatlon {socio.sede}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        Día {socio.dias_desde_alta} de 30 (Alta: {socio.fecha_alta})
                      </span>
                      <span className="text-zinc-500">
                        {socio.telefono}
                      </span>
                    </div>

                    {/* Segmentación Obligatoria Dropdown */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-semibold text-zinc-400">Rama asignada:</span>
                      <select
                        value={socio.rama}
                        onChange={(e) => actualizarRamaOnboarding(socio.id, e.target.value as RamaOnboarding)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none transition-colors ${getRamaBadgeStyle(
                          socio.rama
                        )}`}
                      >
                        <option value="Sin clasificar" className="bg-[#1c1c24] text-zinc-300">
                          ❓ Sin clasificar (Hito 1 pendiente)
                        </option>
                        <option value="Musculación" className="bg-[#1c1c24] text-amber-300">
                          🏋️ Musculación (Sala de pesas)
                        </option>
                        <option value="Clases de Técnicas" className="bg-[#1c1c24] text-purple-300">
                          ✨ Clases de Técnicas (Yoga, CrossFit, Pilates)
                        </option>
                        <option value="Pileta" className="bg-[#1c1c24] text-cyan-300">
                          🏊 Pileta (Natación libre / Aquagym)
                        </option>
                        <option value="Outdoor" className="bg-[#1c1c24] text-emerald-300">
                          🏃 Outdoor (Running y aire libre)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Middle Column: Milestone progression & Real attendance */}
                  <div className="flex-1 w-full lg:max-w-md bg-[#1c1c24]/50 rounded-xl p-3 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getHitoColor(socio.hito_actual)}`}>
                        {socio.hito_actual}
                      </span>
                      <span className="text-xs text-[#8e8e93]">
                        Asistencia real: <strong className="text-white">{socio.hito4_asistencia_real} visitas</strong>
                      </span>
                    </div>

                    {/* Timeline Step Indicators */}
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {/* Step 1 */}
                      <button
                        type="button"
                        onClick={() => actualizarHitoOnboarding(socio.id, "Hito 1", { hito1_completado: !socio.hito1_completado })}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          socio.hito1_completado
                            ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                            : "bg-[#141419] border-white/5 text-[#8e8e93] hover:text-white"
                        }`}
                        title="Hito 1: Día 1-2 (Alta y Diagnóstico)"
                      >
                        <div className="text-[10px] font-bold">H1: Día 1-2</div>
                        <div className="text-[9px] truncate">Diagnóstico</div>
                      </button>

                      {/* Step 2 */}
                      <button
                        type="button"
                        onClick={() => actualizarHitoOnboarding(socio.id, "Hito 2", { hito2_completado: !socio.hito2_completado })}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          socio.hito2_completado
                            ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                            : "bg-[#141419] border-white/5 text-[#8e8e93] hover:text-white"
                        }`}
                        title="Hito 2: Día 4-5 (Primer Pulso de Adaptación)"
                      >
                        <div className="text-[10px] font-bold">H2: Día 4-5</div>
                        <div className="text-[9px] truncate">Pulso</div>
                      </button>

                      {/* Step 3 */}
                      <button
                        type="button"
                        onClick={() => actualizarHitoOnboarding(socio.id, "Hito 3", { hito3_completado: !socio.hito3_completado })}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          socio.hito3_completado
                            ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                            : "bg-[#141419] border-white/5 text-[#8e8e93] hover:text-white"
                        }`}
                        title="Hito 3: Día 10-14 (Ajuste y Autonomía)"
                      >
                        <div className="text-[10px] font-bold">H3: Día 10-14</div>
                        <div className="text-[9px] truncate">Ajuste</div>
                      </button>

                      {/* Step 4 */}
                      <button
                        type="button"
                        onClick={() => actualizarHitoOnboarding(socio.id, "Hito 4", { hito4_completado: !socio.hito4_completado })}
                        className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          socio.hito4_completado
                            ? socio.alerta_roja
                              ? "bg-red-500/20 border-red-500/40 text-red-300"
                              : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-[#141419] border-white/5 text-[#8e8e93] hover:text-white"
                        }`}
                        title="Hito 4: Día 25-30 (Cierre y Retención)"
                      >
                        <div className="text-[10px] font-bold">H4: Día 25-30</div>
                        <div className="text-[9px] truncate">Mes 1</div>
                      </button>
                    </div>

                    {/* Context Feedback / Alert note */}
                    {socio.alerta_roja && !socio.tarea_resuelta ? (
                      <div className="text-[11px] text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg p-2 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Tarea prioritaria para el gerente:</strong> {socio.alerta_motivo || "Baja asistencia en primer mes. Requiere contacto humano para evitar rescisión."}
                        </div>
                      </div>
                    ) : socio.hito2_feedback ? (
                      <p className="text-[11px] text-[#8e8e93] italic truncate">
                        Feedback Hito 2: "{socio.hito2_feedback}"
                      </p>
                    ) : (
                      <p className="text-[11px] text-zinc-500">
                        {socio.hito_actual === "Hito 1" && "Pendiente enviar mensaje diagnóstico inicial."}
                        {socio.hito_actual === "Hito 2" && "Listo para evaluar comodidad de sala o dinámica de clases."}
                        {socio.hito_actual === "Hito 3" && "Revisar rutina y verificar frecuencia semanal."}
                        {socio.hito_actual === "Hito 4" && "Evaluación de continuidad y premio de referido."}
                      </p>
                    )}
                  </div>

                  {/* Right Column: Quick Action WhatsApp & Email Buttons */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-white/5">
                    {/* Botón WhatsApp */}
                    <button
                      onClick={() => setSocioMensaje(socio)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> WhatsApp ({socio.hito_actual})
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          setSocioPerfilModal({
                            id: socio.id,
                            dni: socio.dni,
                            nombre: socio.nombre,
                            telefono: socio.telefono,
                            email: socio.email,
                            sede: socio.sede,
                            plan: "Onboarding 30D",
                            modulo: "onboarding",
                            riesgo: socio.alerta_roja && !socio.tarea_resuelta ? "Alto" : "Bajo",
                          })
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-[#1c1c24] hover:bg-[#252530] text-[#8e8e93] hover:text-white border border-white/5 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        title="Ver comentarios del cliente, historial y NPS"
                      >
                        Perfil
                      </button>

                      {/* Botón Resolver Alerta si aplica */}
                      {socio.alerta_roja && !socio.tarea_resuelta ? (
                        <button
                          onClick={() => {
                            setSocioResolucion(socio);
                            setNotasResolucion(socio.resolucion_notas || "");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Resolver Alerta
                        </button>
                      ) : (
                        <button
                          onClick={() => setSocioDetalle(socio)}
                          className="px-3 py-1.5 rounded-xl bg-[#1c1c24] hover:bg-[#252530] text-[#8e8e93] hover:text-white border border-white/5 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                        >
                          Ficha <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Mensajería Rápida (WhatsApp / Email) */}
      {socioMensaje && (
        <QuickMessageModal
          isOpen={Boolean(socioMensaje)}
          onClose={() => setSocioMensaje(null)}
          destinatario={{
            nombre: socioMensaje.nombre,
            dni: socioMensaje.dni,
            telefono: socioMensaje.telefono,
            email: socioMensaje.email,
            sede: socioMensaje.sede,
            modulo: "onboarding",
            hito: socioMensaje.hito_actual,
            rama: socioMensaje.rama
          }}
          mensajeInicial={construirMensajeHito(socioMensaje)}
        />
      )}

      {/* Modal Resolver Alerta Roja */}
      {socioResolucion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121217] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Resolver Alerta Roja</h3>
                <p className="text-xs text-[#8e8e93]">{socioResolucion.nombre} • DNI {socioResolucion.dni}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8e8e93] mb-1.5">
                Acción realizada por el gerente (Fernando Laso):
              </label>
              <textarea
                rows={4}
                value={notasResolucion}
                onChange={(e) => setNotasResolucion(e.target.value)}
                placeholder="Ej. Se conversó telefónicamente, se le reprogramó la rutina para turno mañana con el profe Martín y se bonificó pase de prueba..."
                className="w-full bg-[#1c1c24] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSocioResolucion(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#8e8e93] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  await resolverAlertaRoja(socioResolucion.id, notasResolucion);
                  setSocioResolucion(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Marcar como Resuelta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle Ficha Socio */}
      {socioDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">{socioDetalle.nombre}</h3>
                <p className="text-xs text-[#8e8e93]">
                  DNI: {socioDetalle.dni} • Megatlon {socioDetalle.sede} • Día {socioDetalle.dias_desde_alta}
                </p>
              </div>
              <button
                onClick={() => setSocioDetalle(null)}
                className="text-[#8e8e93] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#1c1c24] p-3 rounded-xl border border-white/5 space-y-1">
                <span className="font-semibold text-zinc-400">Rama:</span> {socioDetalle.rama}
                <br />
                <span className="font-semibold text-zinc-400">Hito Actual:</span> {socioDetalle.hito_actual}
                <br />
                <span className="font-semibold text-zinc-400">Asistencias acumuladas:</span> {socioDetalle.hito4_asistencia_real}
              </div>

              {socioDetalle.hito1_respuesta && (
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-blue-200">
                  <strong className="block text-blue-300">Respuesta Hito 1:</strong>
                  {socioDetalle.hito1_respuesta}
                </div>
              )}

              {socioDetalle.hito2_feedback && (
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-200">
                  <strong className="block text-purple-300">Feedback Hito 2:</strong>
                  {socioDetalle.hito2_feedback} ({socioDetalle.hito2_satisfaccion})
                </div>
              )}

              {socioDetalle.hito3_progreso && (
                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-200">
                  <strong className="block text-indigo-300">Progreso Hito 3:</strong>
                  {socioDetalle.hito3_progreso}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSocioDetalle(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1c1c24] text-white hover:bg-white/10"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Socio Manual */}
      {modalNuevoSocio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">Alta Manual a Onboarding 30D</h3>
              <button
                onClick={() => setModalNuevoSocio(false)}
                className="text-[#8e8e93] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearSocio} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#8e8e93] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="Ej. Gonzalo Heredia"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#8e8e93] mb-1">DNI (Identificador)</label>
                  <input
                    type="text"
                    required
                    value={nuevoDni}
                    onChange={(e) => setNuevoDni(e.target.value)}
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="38.990.112"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8e8e93] mb-1">Teléfono (WhatsApp)</label>
                  <input
                    type="text"
                    value={nuevoTelefono}
                    onChange={(e) => setNuevoTelefono(e.target.value)}
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="+54 9 11 ..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8e8e93] mb-1">Email</label>
                <input
                  type="email"
                  value={nuevoEmail}
                  onChange={(e) => setNuevoEmail(e.target.value)}
                  className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="socio@gmail.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#8e8e93] mb-1">Rama Inicial</label>
                  <select
                    value={nuevaRama}
                    onChange={(e) => setNuevaRama(e.target.value as RamaOnboarding)}
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Sin clasificar">Sin clasificar</option>
                    <option value="Musculación">Musculación</option>
                    <option value="Clases de Técnicas">Clases de Técnicas</option>
                    <option value="Pileta">Pileta</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8e8e93] mb-1">Sucursal</label>
                  <select
                    value={nuevaSede}
                    onChange={(e) => setNuevaSede(e.target.value)}
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {SEDES_MEGATLON.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalNuevoSocio(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#8e8e93]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ff6b00] text-white hover:bg-[#ea580c]"
                >
                  Guardar en Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Historial y Perfil de Comentarios / NPS */}
      {socioPerfilModal && (
        <ClientProfileModal
          isOpen={Boolean(socioPerfilModal)}
          onClose={() => setSocioPerfilModal(null)}
          socio={socioPerfilModal}
        />
      )}
    </div>
  );
};
