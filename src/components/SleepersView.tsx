import React, { useState, useMemo } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { CasoSleeper, NivelRiesgo, MotivoInasistencia, IntencionVolver, EstadoCaso } from "../types";
import { QuickMessageModal } from "./QuickMessageModal";
import { ClientProfileModal, SocioPerfilData } from "./ClientProfileModal";
import {
  Search,
  MessageCircle,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Send,
  HelpCircle,
  ChevronRight,
  X,
  Dumbbell,
  Building2,
  Phone,
  ArrowUpDown,
  Filter,
  Sparkles,
  Flame,
  FileText,
  History,
  Star,
  Check,
  RotateCcw
} from "lucide-react";

interface SleepersViewProps {
  onOpenMessageModal?: (socio: CasoSleeper) => void;
}

const MOTIVOS_LISTA: MotivoInasistencia[] = [
  "Falta de tiempo",
  "Motivos económicos / Precio",
  "Problemas de salud / Lesión",
  "Mudanza / Distancia",
  "Desmotivación / Pérdida de hábito",
  "Horarios / Disponibilidad de clases",
  "Disconformidad con servicio / profes",
  "Otro motivo",
  "Sin especificar",
];

const INTENCIONES_LISTA: { id: IntencionVolver; label: string; color: string }[] = [
  { id: "Si", label: "Sí, vuelve", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
  { id: "Pensando", label: "Lo está pensando", color: "text-amber-400 bg-amber-500/15 border-amber-500/30" },
  { id: "No", label: "No vuelve", color: "text-red-400 bg-red-500/15 border-red-500/30" },
  { id: "Pendiente", label: "Pendiente consulta", color: "text-zinc-400 bg-zinc-800/60 border-zinc-700/50" },
];

export const SleepersView: React.FC<SleepersViewProps> = () => {
  const {
    casosFiltrados,
    actualizarCasoSleeper,
    enviarMensajeSleeper,
    gerente,
    soloMiSede,
    comentarios,
  } = useMegatlon();

  const [busqueda, setBusqueda] = useState("");
  const [seguimientosSeleccionados, setSeguimientosSeleccionados] = useState<string[]>([]);
  const [intencionesSeleccionadas, setIntencionesSeleccionadas] = useState<string[]>([]);
  const [riesgosSeleccionados, setRiesgosSeleccionados] = useState<string[]>([]);
  const [filtroMotivo, setFiltroMotivo] = useState<string>("");
  const [ordenAsc, setOrdenAsc] = useState<boolean>(true);

  const [socioMensaje, setSocioMensaje] = useState<{ socio: CasoSleeper; numeroMensaje: 1 | 2; texto: string } | null>(null);
  const [socioPerfilModal, setSocioPerfilModal] = useState<SocioPerfilData | null>(null);

  const toggleSeguimiento = (id: string) => {
    if (!id) {
      setSeguimientosSeleccionados([]);
      return;
    }
    setSeguimientosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleIntencion = (id: string) => {
    if (!id) {
      setIntencionesSeleccionadas([]);
      return;
    }
    setIntencionesSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleRiesgo = (id: string) => {
    if (!id) {
      setRiesgosSeleccionados([]);
      return;
    }
    setRiesgosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const limpiarTodosLosFiltros = () => {
    setSeguimientosSeleccionados([]);
    setIntencionesSeleccionadas([]);
    setRiesgosSeleccionados([]);
    setFiltroMotivo("");
    setBusqueda("");
  };

  const totalFiltrosActivos =
    seguimientosSeleccionados.length +
    intencionesSeleccionadas.length +
    riesgosSeleccionados.length +
    (filtroMotivo ? 1 : 0);

  // Filtrado y ordenamiento de la lista de sleepers con soporte multi-filtro
  const casos = useMemo(() => {
    const list = casosFiltrados.filter((c) => {
      if (riesgosSeleccionados.length > 0 && !riesgosSeleccionados.includes(c.riesgo)) {
        return false;
      }
      if (intencionesSeleccionadas.length > 0 && !intencionesSeleccionadas.includes(c.intencion_volver)) {
        return false;
      }
      if (filtroMotivo && c.motivo !== filtroMotivo) return false;

      if (seguimientosSeleccionados.length > 0) {
        const matchSeguimiento = seguimientosSeleccionados.some((seg) => {
          if (seg === "pendiente") return !c.fecha_envio_mensaje_1 && !c.fecha_envio_mensaje;
          if (seg === "en_espera_15d") return c.estado_seguimiento === "primer_mensaje_enviado" && (c.dias_restantes_seguimiento ?? 0) >= 0;
          if (seg === "urgente_2do") return c.estado_seguimiento === "segundo_mensaje_requerido" || ((c.dias_restantes_seguimiento ?? 0) < 0 && c.fecha_envio_mensaje_1 && !c.fecha_envio_mensaje_2);
          if (seg === "segundo_enviado") return c.estado_seguimiento === "segundo_mensaje_enviado";
          return false;
        });
        if (!matchSeguimiento) return false;
      }

      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        return (
          c.nombre.toLowerCase().includes(q) ||
          c.dni.includes(q) ||
          c.telefono.includes(q) ||
          (c.fecha_fin_contrato && c.fecha_fin_contrato.includes(q)) ||
          (c.motivo && c.motivo.toLowerCase().includes(q))
        );
      }
      return true;
    });

    // Ordenamiento por fecha de fin de contrato
    return [...list].sort((a, b) => {
      const dateA = a.fecha_fin_contrato ? new Date(a.fecha_fin_contrato).getTime() : 9999999999999;
      const dateB = b.fecha_fin_contrato ? new Date(b.fecha_fin_contrato).getTime() : 9999999999999;
      return ordenAsc ? dateA - dateB : dateB - dateA;
    });
  }, [casosFiltrados, riesgosSeleccionados, seguimientosSeleccionados, intencionesSeleccionadas, filtroMotivo, busqueda, ordenAsc]);

  // Métricas para la barra superior
  const stats = useMemo(() => {
    const total = casosFiltrados.length;
    const primerMensajePendiente = casosFiltrados.filter((c) => !c.fecha_envio_mensaje_1 && !c.fecha_envio_mensaje).length;
    const enSeguimientoBajoRiesgo = casosFiltrados.filter((c) => c.estado_seguimiento === "primer_mensaje_enviado" && (c.dias_restantes_seguimiento ?? 0) >= 0).length;
    const segundoMensajeUrgente = casosFiltrados.filter((c) => c.estado_seguimiento === "segundo_mensaje_requerido" || ((c.dias_restantes_seguimiento ?? 0) < 0 && c.fecha_envio_mensaje_1 && !c.fecha_envio_mensaje_2)).length;
    const vuelven = casosFiltrados.filter((c) => c.intencion_volver === "Si").length;

    return { total, primerMensajePendiente, enSeguimientoBajoRiesgo, segundoMensajeUrgente, vuelven };
  }, [casosFiltrados]);

  // Plantillas de mensajes dinámicas según la regla de 15 días (Textos oficiales Megatlon)
  const generarTextoMensaje = (c: CasoSleeper, numMensaje: 1 | 2) => {
    const nombre = c.nombre.split(" ")[0] || "Hola";
    const sede = c.sede || gerente.sede;
    const gerenteNombre = `${gerente.nombre} ${gerente.apellido}`;
    const cargo = gerente.cargo || "Gerente de Sede";

    if (numMensaje === 1) {
      // 1° mensaje: Empático, primer empujón
      return `Hola ${nombre}, ¿cómo estás?

Soy ${gerenteNombre}, ${cargo} de MEGATLON ${sede}.

En MEGATLON tenemos un sistema que nos permite identificar cuando alguno de nuestros socios lleva un tiempo sin venir a entrenar. Y esta vez nos apareciste vos, por eso te estoy escribiendo.

Todos tenemos momentos en los que nuestras rutinas cambian, los tiempos se acomodan de otra manera y, a veces, después de un tiempo sin venir, lo que más cuesta es simplemente volver.

¡Así que tomá este mensaje como un pequeño empujón! Armate el bolso y volvé, que nosotros te estamos esperando.

Y ya que estamos en contacto, si querés contarme algo, hacerme alguna consulta o necesitas que te ayude con algo relacionado con el gimnasio, escribime. Estoy acá para ayudarte.

Un abrazo,`;
    } else {
      // 2° mensaje: 15 días después de haber enviado el 1°
      return `Hola ${nombre}, ¿cómo estás?

Acá nuevamente ${gerenteNombre}, ${cargo} de MEGATLON ${sede}.

Hace unos días te escribí, ya que hacía un tiempo que no te veíamos por acá. Hoy insisto un poquito más, con ganas de motivarte a volver y que nos encontremos nuevamente en MEGATLON.

Y también aprovecho para consultarte algo que no hice en el mensaje anterior: ¿hubo algo de tu experiencia en nuestra sede que no resultó tal como esperabas? ¿O hay algo que buscabas para tu entrenamiento y no encontraste?

De ser así, no dudes en compartírmelo. Si está a nuestro alcance, vamos a buscar la mejor manera de ayudarte.

Un abrazo,`;
    }
  };

  const handlePrepararMensaje = (c: CasoSleeper, numMensaje: 1 | 2) => {
    const texto = generarTextoMensaje(c, numMensaje);
    setSocioMensaje({ socio: c, numeroMensaje: numMensaje, texto });
  };

  const handleAbrirPerfil = (c: CasoSleeper) => {
    setSocioPerfilModal({
      id: c.id,
      dni: c.dni,
      nombre: c.nombre,
      telefono: c.telefono,
      email: c.email,
      sede: c.sede,
      plan: c.plan,
      fecha_fin_contrato: c.fecha_fin_contrato,
      dias_sin_asistir: c.dias_sin_asistir,
      ultimo_acceso: c.ultimo_acceso,
      motivo: c.motivo,
      intencion_volver: c.intencion_volver,
      riesgo: c.riesgo,
      nps_score: c.nps_score,
      nps_comentario: c.nps_comentario,
      modulo: "sleepers",
    });
  };

  return (
    <div className="space-y-5">
      {/* Header Banner Megatlon */}
      <div className="bg-[#141419] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-[#ff6b00] text-white text-[10.5px] font-black tracking-wider uppercase">
                Módulo Sleepers
              </span>
              <span className="text-xs text-[#8e8e93] font-semibold">
                {soloMiSede ? `Megatlon ${gerente.sede}` : "Todas las sedes (Red)"}
              </span>
              <span className="text-xs text-[#8e8e93]">
                • Ordenado por Fecha Fin de Contrato
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-['Montserrat',sans-serif] uppercase">
              Recuperación de Socios Inactivos (Sleepers)
            </h1>
            <p className="text-xs text-[#8e8e93] mt-1 max-w-3xl">
              Socios con cuota al día que dejaron de asistir. Al enviar el <strong>1er mensaje</strong> se fija <strong>Riesgo Bajo</strong> y 15 días de seguimiento. Cumplido ese plazo sin respuesta, pasa automáticamente a <strong>Riesgo Alto</strong> y se habilita el <strong>2do mensaje</strong> de rescate.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="w-4 h-4 text-[#8e8e93] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por DNI, Nombre, Vto Contrato..."
                className="w-full bg-[#1b1b22] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00]"
              />
            </div>

            <button
              onClick={() => setOrdenAsc(!ordenAsc)}
              title="Cambiar orden de vencimiento de contrato"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1b1b22] border border-white/10 hover:border-white/30 text-xs font-bold text-zinc-300 transition-colors cursor-pointer shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span className="hidden sm:inline">{ordenAsc ? "Vto Más Próximo" : "Vto Más Lejano"}</span>
            </button>
          </div>
        </div>

        {/* Stats KPIs Cards - Clickable and Combinable */}
        <div>
          <div className="flex items-center justify-between pb-1.5 text-xs text-zinc-400">
            <span className="font-bold flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span>Hacé clic en cualquier tarjeta para filtrar o sumar filtros:</span>
            </span>
            {totalFiltrosActivos > 0 && (
              <button
                type="button"
                onClick={limpiarTodosLosFiltros}
                className="text-[11px] font-bold text-[#ff6b00] hover:text-orange-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Limpiar filtros ({totalFiltrosActivos})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            {/* Total Sleepers */}
            <button
              type="button"
              onClick={limpiarTodosLosFiltros}
              title="Ver todos los sleepers sin filtros"
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                totalFiltrosActivos === 0
                  ? "bg-[#1f1f2e] border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.08)] ring-1 ring-white/20"
                  : "bg-[#191922] border-white/5 hover:border-white/20 hover:bg-[#1e1e28]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8e8e93] font-semibold block uppercase">Total Sleepers</span>
                {totalFiltrosActivos === 0 && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </div>
              <span className="text-xl font-black text-white block mt-0.5">{stats.total}</span>
              <span className="text-[10px] text-zinc-400 font-semibold block mt-0.5">
                {totalFiltrosActivos === 0 ? "✓ Mostrando todos" : "Clic para ver todos"}
              </span>
            </button>

            {/* 1° Mensaje Pendiente */}
            <button
              type="button"
              onClick={() => toggleSeguimiento("pendiente")}
              title="Filtrar socios que aún no recibieron el primer mensaje"
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                seguimientosSeleccionados.includes("pendiente")
                  ? "bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-2 ring-amber-500/50"
                  : "bg-amber-950/20 border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-950/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-300 font-semibold block uppercase">1° Msj Pendiente</span>
                {seguimientosSeleccionados.includes("pendiente") && (
                  <span className="p-0.5 rounded-full bg-amber-500 text-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <span className="text-xl font-black text-amber-400 block mt-0.5">{stats.primerMensajePendiente}</span>
              <span className="text-[10px] text-amber-300/90 font-semibold block mt-0.5">
                {seguimientosSeleccionados.includes("pendiente") ? "✓ Filtro activo" : "+ Sumar a filtro"}
              </span>
            </button>

            {/* En Gracia 15d (Bajo Riesgo) */}
            <button
              type="button"
              onClick={() => toggleSeguimiento("en_espera_15d")}
              title="Filtrar socios con 1er mensaje enviado esperando respuesta (Riesgo Bajo)"
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                seguimientosSeleccionados.includes("en_espera_15d")
                  ? "bg-blue-950/60 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)] ring-2 ring-blue-500/50"
                  : "bg-blue-950/20 border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-950/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-blue-300 font-semibold block uppercase">En Gracia (15d - Bajo)</span>
                {seguimientosSeleccionados.includes("en_espera_15d") && (
                  <span className="p-0.5 rounded-full bg-blue-500 text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <span className="text-xl font-black text-blue-400 block mt-0.5">{stats.enSeguimientoBajoRiesgo}</span>
              <span className="text-[10px] text-blue-300/90 font-semibold block mt-0.5">
                {seguimientosSeleccionados.includes("en_espera_15d") ? "✓ Filtro activo" : "+ Sumar a filtro"}
              </span>
            </button>

            {/* Venció 15d (Riesgo Alto) */}
            <button
              type="button"
              onClick={() => toggleSeguimiento("urgente_2do")}
              title="Filtrar casos donde expiró el plazo de 15 días (Riesgo Alto - Requiere 2° mensaje)"
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                seguimientosSeleccionados.includes("urgente_2do")
                  ? "bg-red-950/60 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.35)] ring-2 ring-red-500/50"
                  : "bg-red-950/30 border-red-500/30 hover:border-red-500/60 hover:bg-red-950/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-red-300 font-semibold block uppercase">🚨 Venció 15d (Alto)</span>
                {seguimientosSeleccionados.includes("urgente_2do") && (
                  <span className="p-0.5 rounded-full bg-red-500 text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <span className="text-xl font-black text-red-400 block mt-0.5">{stats.segundoMensajeUrgente}</span>
              <span className="text-[10px] text-red-300/90 font-semibold block mt-0.5">
                {seguimientosSeleccionados.includes("urgente_2do") ? "✓ Filtro activo" : "+ Sumar a filtro"}
              </span>
            </button>

            {/* Confirmaron Volver */}
            <button
              type="button"
              onClick={() => toggleIntencion("Si")}
              title="Filtrar socios que confirmaron intención de volver"
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                intencionesSeleccionadas.includes("Si")
                  ? "bg-emerald-950/60 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500/50"
                  : "bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-950/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-300 font-semibold block uppercase">Confirmaron Volver</span>
                {intencionesSeleccionadas.includes("Si") && (
                  <span className="p-0.5 rounded-full bg-emerald-500 text-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <span className="text-xl font-black text-emerald-400 block mt-0.5">{stats.vuelven}</span>
              <span className="text-[10px] text-emerald-300/90 font-semibold block mt-0.5">
                {intencionesSeleccionadas.includes("Si") ? "✓ Filtro activo" : "+ Sumar a filtro"}
              </span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#8e8e93] font-semibold flex items-center gap-1 min-w-[150px]">
              <Filter className="w-3.5 h-3.5" /> Estado de Seguimiento:
            </span>

            <button
              type="button"
              onClick={() => setSeguimientosSeleccionados([])}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                seguimientosSeleccionados.length === 0
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#1b1b22] text-[#8e8e93] hover:text-white"
              }`}
            >
              Todos
            </button>

            {[
              { id: "pendiente", label: "1° Msj Pendiente" },
              { id: "en_espera_15d", label: "En seguimiento 15d (Bajo)" },
              { id: "urgente_2do", label: "🚨 Expiró 15d (Requiere 2° Msj)" },
              { id: "segundo_enviado", label: "2° Msj Enviado" },
            ].map((f) => {
              const activo = seguimientosSeleccionados.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleSeguimiento(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activo
                      ? "bg-[#ff6b00] text-white shadow-md font-bold ring-1 ring-white/30"
                      : "bg-[#1b1b22] text-[#8e8e93] hover:text-white hover:bg-[#252530]"
                  }`}
                >
                  {activo && <Check className="w-3 h-3 stroke-[3]" />}
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[#8e8e93] font-semibold flex items-center gap-1 min-w-[150px]">
              Intención de volver:
            </span>
            <button
              type="button"
              onClick={() => setIntencionesSeleccionadas([])}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                intencionesSeleccionadas.length === 0
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#1b1b22] text-[#8e8e93] hover:text-white"
              }`}
            >
              Todas
            </button>
            {[
              { id: "Si", label: "Sí, vuelve 🟢" },
              { id: "Pensando", label: "Lo está pensando 🟡" },
              { id: "No", label: "No vuelve 🔴" },
            ].map((i) => {
              const activo = intencionesSeleccionadas.includes(i.id);
              return (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => toggleIntencion(i.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activo
                      ? "bg-[#ff6b00] text-white shadow-md font-bold ring-1 ring-white/30"
                      : "bg-[#1b1b22] text-[#8e8e93] hover:text-white hover:bg-[#252530]"
                  }`}
                >
                  {activo && <Check className="w-3 h-3 stroke-[3]" />}
                  {i.label}
                </button>
              );
            })}

            {/* Riesgo filter pills */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[#8e8e93] font-semibold">Riesgo:</span>
              <button
                type="button"
                onClick={() => setRiesgosSeleccionados([])}
                className={`px-2 py-0.8 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  riesgosSeleccionados.length === 0
                    ? "bg-white/20 text-white"
                    : "bg-[#1b1b22] text-[#8e8e93] hover:text-white"
                }`}
              >
                Todos
              </button>
              {[
                { id: "Alto", label: "Alto 🔴" },
                { id: "Medio", label: "Medio 🟡" },
                { id: "Bajo", label: "Bajo 🟢" },
              ].map((r) => {
                const activo = riesgosSeleccionados.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleRiesgo(r.id)}
                    className={`px-2 py-0.8 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      activo
                        ? "bg-[#ff6b00] text-white font-bold"
                        : "bg-[#1b1b22] text-[#8e8e93] hover:text-white"
                    }`}
                  >
                    {activo && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Combinations Banner for Sleepers */}
          {totalFiltrosActivos > 0 && (
            <div className="flex flex-wrap items-center gap-2 bg-[#0c0c10] border border-[#ff6b00]/40 p-2.5 rounded-xl text-xs mt-2 shadow-inner">
              <span className="text-white font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff6b00] animate-ping" />
                <Filter className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Combinación activa ({casos.length} sleepers de {stats.total}):</span>
              </span>

              {seguimientosSeleccionados.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold"
                >
                  Seguimiento: {s}
                  <button
                    type="button"
                    onClick={() => toggleSeguimiento(s)}
                    title="Quitar este filtro"
                    className="hover:text-white cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {intencionesSeleccionadas.map((it) => (
                <span
                  key={it}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold"
                >
                  Intención: {it}
                  <button
                    type="button"
                    onClick={() => toggleIntencion(it)}
                    title="Quitar este filtro"
                    className="hover:text-white cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {riesgosSeleccionados.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] font-bold"
                >
                  Riesgo: {r}
                  <button
                    type="button"
                    onClick={() => toggleRiesgo(r)}
                    title="Quitar este filtro"
                    className="hover:text-white cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={limpiarTodosLosFiltros}
                className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-[#ff6b00] hover:text-orange-300 underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Limpiar combinación
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Sleepers Table */}
      <div className="bg-[#141419] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#191922] border-b border-white/10 text-[#8e8e93] font-black uppercase text-[10.5px] tracking-wider font-['Outfit']">
                <th className="py-3.5 px-4">Socio / Contacto</th>
                <th className="py-3.5 px-3">
                  <div className="flex items-center gap-1">
                    <span>Fin / Vto Contrato</span>
                    <Calendar className="w-3 h-3 text-[#ff6b00]" />
                  </div>
                </th>
                <th className="py-3.5 px-3">Inasistencia</th>
                <th className="py-3.5 px-3">Riesgo & Ciclo 15 Días</th>
                <th className="py-3.5 px-3">Motivo (Desplegable)</th>
                <th className="py-3.5 px-3">Intención Volver</th>
                <th className="py-3.5 px-3">Perfil & NPS</th>
                <th className="py-3.5 px-4 text-right">Mensajería WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {casos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-[#8e8e93]">
                    No se encontraron socios sleepers que coincidan con los filtros activos.
                  </td>
                </tr>
              ) : (
                casos.map((c) => {
                  const diasRestantes = c.dias_restantes_seguimiento ?? 0;
                  const vencio15Dias = (c.fecha_envio_mensaje_1 || c.fecha_envio_mensaje) && diasRestantes < 0 && !c.fecha_envio_mensaje_2;
                  const enGracia15Dias = (c.fecha_envio_mensaje_1 || c.fecha_envio_mensaje) && diasRestantes >= 0;
                  const sinPrimerContacto = !c.fecha_envio_mensaje_1 && !c.fecha_envio_mensaje;
                  const segundoEnviado = Boolean(c.fecha_envio_mensaje_2);

                  // Contar notas del socio
                  const cantComentarios = comentarios.filter(
                    (com) => (com.socio_dni && com.socio_dni.replace(/[^0-9]/g, "") === c.dni.replace(/[^0-9]/g, "")) || com.caso_id === c.id
                  ).length;

                  return (
                    <tr key={c.id} className="hover:bg-[#181822] transition-colors group">
                      {/* Socio / Contacto */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-xs flex items-center gap-1.5">
                          <span>{c.nombre}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/5 text-[#8e8e93]">
                            {c.sede}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#8e8e93] mt-0.5">
                          DNI {c.dni} • <span className="text-zinc-400">{c.telefono}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-semibold block truncate max-w-[170px]">
                          {c.plan || "Pase Tradicional"}
                        </span>
                      </td>

                      {/* Fecha Fin / Vto Contrato */}
                      <td className="py-3.5 px-3">
                        <div className="font-black text-white text-xs font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#ff6b00]" />
                          <span>{c.fecha_fin_contrato || "A definir"}</span>
                        </div>
                        <span className="text-[10.5px] text-amber-400/90 font-medium">
                          {c.ultimo_acceso ? `Último: ${c.ultimo_acceso}` : "Sin accesos"}
                        </span>
                      </td>

                      {/* Inasistencia */}
                      <td className="py-3.5 px-3">
                        <span className="font-black text-[#ff6b00] text-xs">
                          {c.dias_sin_asistir} días
                        </span>
                        <span className="block text-[10px] text-zinc-500">sin ingresar a sede</span>
                      </td>

                      {/* Riesgo & Ciclo 15 Días */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                c.riesgo === "Alto"
                                  ? "bg-red-500/20 text-red-300 border-red-500/40"
                                  : c.riesgo === "Medio"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              }`}
                            >
                              Riesgo {c.riesgo}
                            </span>
                          </div>

                          {/* Ciclo 15 días status */}
                          {sinPrimerContacto && (
                            <span className="text-[10.5px] text-amber-400 font-semibold block">
                              ⏳ Pendiente 1° mensaje
                            </span>
                          )}

                          {enGracia15Dias && (
                            <div className="text-[10.5px] text-emerald-400 font-semibold">
                              <span>✓ 1° Enviado ({c.fecha_envio_mensaje_1 || c.fecha_envio_mensaje})</span>
                              <span className="block text-[10px] text-emerald-300/80">
                                Gracia: quedan {diasRestantes} días
                              </span>
                            </div>
                          )}

                          {vencio15Dias && (
                            <div className="text-[10.5px] text-red-400 font-black animate-pulse">
                              <span>🚨 Venció plazo 15 días</span>
                              <span className="block text-[10px] text-red-300">
                                ({Math.abs(diasRestantes)}d demorado - Enviar 2° msj)
                              </span>
                            </div>
                          )}

                          {segundoEnviado && (
                            <div className="text-[10.5px] text-purple-400 font-semibold">
                              <span>✓ 2° Mensaje enviado ({c.fecha_envio_mensaje_2})</span>
                              <span className="block text-[10px] text-zinc-400">En seguimiento gerencial</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Motivo (Desplegable) */}
                      <td className="py-3.5 px-3">
                        <select
                          value={c.motivo || ""}
                          onChange={(e) => {
                            actualizarCasoSleeper(c.id, { motivo: e.target.value as MotivoInasistencia });
                          }}
                          className="bg-[#1b1b24] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#ff6b00] w-full max-w-[170px] cursor-pointer"
                        >
                          <option value="">Seleccionar motivo...</option>
                          {MOTIVOS_LISTA.map((mot) => (
                            <option key={mot} value={mot}>
                              {mot}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Intención Volver (Si / No / Pensando) */}
                      <td className="py-3.5 px-3">
                        <select
                          value={c.intencion_volver || "Pendiente"}
                          onChange={(e) => {
                            actualizarCasoSleeper(c.id, { intencion_volver: e.target.value as IntencionVolver });
                          }}
                          className={`border rounded-lg px-2 py-1 text-xs font-bold focus:outline-none cursor-pointer w-full max-w-[130px] ${
                            c.intencion_volver === "Si"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : c.intencion_volver === "No"
                              ? "bg-red-500/20 text-red-300 border-red-500/40"
                              : c.intencion_volver === "Pensando"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-[#1b1b24] text-zinc-400 border-white/10"
                          }`}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Si">✓ Sí, vuelve</option>
                          <option value="Pensando">⏳ Pensando</option>
                          <option value="No">✕ No vuelve</option>
                        </select>
                      </td>

                      {/* Perfil & Comentarios / NPS */}
                      <td className="py-3.5 px-3">
                        <button
                          type="button"
                          onClick={() => handleAbrirPerfil(c)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1b1b24] hover:bg-[#232330] border border-white/10 hover:border-white/20 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5 text-[#ff6b00]" />
                          <span>Perfil ({cantComentarios})</span>
                          {c.nps_score !== undefined && (
                            <span className="ml-1 text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                              ★{c.nps_score}
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Acciones de Mensajería WhatsApp */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón 1er Mensaje (Empático) */}
                          <button
                            type="button"
                            onClick={() => handlePrepararMensaje(c, 1)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm ${
                              sinPrimerContacto
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25"
                                : "bg-[#1b1b24] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10"
                            }`}
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{sinPrimerContacto ? "Enviar 1° Mensaje" : "Reenviar 1°"}</span>
                          </button>

                          {/* Botón 2do Mensaje (Urgente tras 15 días) */}
                          <button
                            type="button"
                            onClick={() => handlePrepararMensaje(c, 2)}
                            title={
                              vencio15Dias
                                ? "Pasaron los 15 días reglamentarios sin respuesta: enviar 2do mensaje de rescate"
                                : "Enviar 2do mensaje de refuerzo"
                            }
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm ${
                              vencio15Dias
                                ? "bg-[#ff6b00] hover:bg-[#ea580c] text-white animate-bounce shadow-[#ff6b00]/30"
                                : segundoEnviado
                                ? "bg-purple-950/40 text-purple-300 border border-purple-500/30 hover:bg-purple-900/30"
                                : "bg-[#1b1b24] text-zinc-400 border border-white/10 hover:border-red-500/30 hover:text-red-300"
                            }`}
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>{segundoEnviado ? "2° Enviado" : "2° Mensaje"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Mensaje Dinámico de WhatsApp */}
      {socioMensaje && (
        <QuickMessageModal
          isOpen={Boolean(socioMensaje)}
          onClose={() => setSocioMensaje(null)}
          destinatario={{
            nombre: socioMensaje.socio.nombre,
            dni: socioMensaje.socio.dni,
            telefono: socioMensaje.socio.telefono,
            email: socioMensaje.socio.email,
            sede: socioMensaje.socio.sede,
            modulo: "sleepers",
            hito: socioMensaje.numeroMensaje === 1 ? "1° Contacto Empático (15d)" : "2° Mensaje Rescate Urgente",
          }}
          mensajeInicial={socioMensaje.texto}
          onMensajeEnviado={() => {
            enviarMensajeSleeper(socioMensaje.socio.id, socioMensaje.numeroMensaje);
          }}
        />
      )}

      {/* Modal Perfil Completo del Socio, Comentarios e Historial */}
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
