import React, { useState, useMemo } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { RegistroContrato, ResultadoGestionContrato, GrupoAccesoMensual, CategoriaNps } from "../types";
import { QuickMessageModal } from "./QuickMessageModal";
import { ClientProfileModal, SocioPerfilData } from "./ClientProfileModal";
import {
  FileText,
  Search,
  Calendar,
  Sparkles,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  Building2,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Send,
  HelpCircle,
  Layers,
  Star,
  History,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Check,
  RotateCcw,
  X
} from "lucide-react";

export interface InfoCasoContrato {
  casoNumero: number;
  clave: string;
  nombreCaso: string;
  categoriaTipo: "Riesgo de baja" | "En seguimiento" | "Caso especial" | "Fidelizado" | "Sin NPS";
  badgeColor: string;
}

export const detectarCasoContrato = (c: RegistroContrato): InfoCasoContrato => {
  const accesos = c.accesos_mes ?? 0;
  const esBaja = accesos <= 4 || c.grupo_acceso === "GRUPO C";
  const esMedia = (accesos >= 5 && accesos <= 11) || c.grupo_acceso === "GRUPO B";
  const esAlta = accesos >= 12 || c.grupo_acceso === "GRUPO A";

  const tieneNps = c.nps_score !== null && c.nps_score !== undefined && c.categoria_nps && c.categoria_nps !== "Sin calificar";

  // Casos 10, 11, 12: Sin NPS
  if (!tieneNps) {
    if (esBaja) {
      return {
        casoNumero: 10,
        clave: "cnt_caso_10_baja_sinnps",
        nombreCaso: "10- Sin NPS — Baja asistencia",
        categoriaTipo: "Sin NPS",
        badgeColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
      };
    }
    if (esMedia) {
      return {
        casoNumero: 11,
        clave: "cnt_caso_11_media_sinnps",
        nombreCaso: "11- Sin NPS — Media asistencia",
        categoriaTipo: "Sin NPS",
        badgeColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
      };
    }
    return {
      casoNumero: 12,
      clave: "cnt_caso_12_alta_sinnps",
      nombreCaso: "12- Sin NPS — Alta asistencia",
      categoriaTipo: "Sin NPS",
      badgeColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
    };
  }

  const nps = c.nps_score ?? (c.categoria_nps === "Detractor" ? 4 : c.categoria_nps === "Promotor" ? 10 : 7);
  const esDetractor = nps <= 6 || c.categoria_nps === "Detractor";
  const esPasivo = (nps === 7 || nps === 8) || c.categoria_nps === "Pasivo";
  const esPromotor = nps >= 9 || c.categoria_nps === "Promotor";

  // 1- Riesgo de baja — Baja asistencia + Detractor
  if (esBaja && esDetractor) {
    return {
      casoNumero: 1,
      clave: "cnt_caso_1_baja_detractor",
      nombreCaso: "1- Riesgo de baja — Baja + Detractor",
      categoriaTipo: "Riesgo de baja",
      badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
    };
  }

  // 2- Riesgo de baja — Baja asistencia + Pasivo (score 2)
  if (esBaja && esPasivo) {
    return {
      casoNumero: 2,
      clave: "cnt_caso_2_baja_pasivo",
      nombreCaso: "2- Riesgo de baja — Baja + Pasivo",
      categoriaTipo: "Riesgo de baja",
      badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    };
  }

  // 3- En seguimiento — Media asistencia + Detractor
  if (esMedia && esDetractor) {
    return {
      casoNumero: 3,
      clave: "cnt_caso_3_media_detractor",
      nombreCaso: "3- En seguimiento — Media + Detractor",
      categoriaTipo: "En seguimiento",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    };
  }

  // 4- Caso especial — Baja asistencia + Promotor
  if (esBaja && esPromotor) {
    return {
      casoNumero: 4,
      clave: "cnt_caso_4_baja_promotor",
      nombreCaso: "4- Caso especial — Baja + Promotor",
      categoriaTipo: "Caso especial",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    };
  }

  // 5- En seguimiento — Media asistencia + Pasivo
  if (esMedia && esPasivo) {
    return {
      casoNumero: 5,
      clave: "cnt_caso_5_media_pasivo",
      nombreCaso: "5- En seguimiento — Media + Pasivo",
      categoriaTipo: "En seguimiento",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    };
  }

  // 6- Caso especial — Alta asistencia + Detractor
  if (esAlta && esDetractor) {
    return {
      casoNumero: 6,
      clave: "cnt_caso_6_alta_detractor",
      nombreCaso: "6- Caso especial — Alta + Detractor",
      categoriaTipo: "Caso especial",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    };
  }

  // 7- Fidelizado — Media asistencia + Promotor
  if (esMedia && esPromotor) {
    return {
      casoNumero: 7,
      clave: "cnt_caso_7_media_promotor",
      nombreCaso: "7- Fidelizado — Media + Promotor",
      categoriaTipo: "Fidelizado",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/40",
    };
  }

  // 8- Fidelizado — Alta asistencia + Pasivo
  if (esAlta && esPasivo) {
    return {
      casoNumero: 8,
      clave: "cnt_caso_8_alta_pasivo",
      nombreCaso: "8- Fidelizado — Alta + Pasivo",
      categoriaTipo: "Fidelizado",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    };
  }

  // 9- Fidelizado — Alta asistencia + Promotor (por defecto)
  return {
    casoNumero: 9,
    clave: "cnt_caso_9_alta_promotor",
    nombreCaso: "9- Fidelizado — Alta + Promotor",
    categoriaTipo: "Fidelizado",
    badgeColor: "bg-emerald-500/30 text-emerald-200 border-emerald-500/60",
  };
};

export const ContratosView: React.FC = () => {
  const {
    contratosFiltrados,
    actualizarContrato,
    gerente,
    soloMiSede,
    comentarios,
  } = useMegatlon();

  const [busqueda, setBusqueda] = useState("");
  // Filtros acumulativos / combinables (Multi-select)
  const [gruposSeleccionados, setGruposSeleccionados] = useState<string[]>([]);
  const [npsSeleccionados, setNpsSeleccionados] = useState<string[]>([]);
  const [riesgosSeleccionados, setRiesgosSeleccionados] = useState<string[]>([]);
  const [resultadosSeleccionados, setResultadosSeleccionados] = useState<string[]>([]);
  const [ordenDiasAsc, setOrdenDiasAsc] = useState<boolean>(true);

  const [socioMensaje, setSocioMensaje] = useState<RegistroContrato | null>(null);
  const [socioPerfilModal, setSocioPerfilModal] = useState<SocioPerfilData | null>(null);

  // Toggle handlers para permitir sumar o alternar filtros
  const toggleGrupo = (id: string) => {
    if (!id) {
      setGruposSeleccionados([]);
      return;
    }
    setGruposSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const toggleNps = (id: string) => {
    if (!id) {
      setNpsSeleccionados([]);
      return;
    }
    setNpsSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const toggleRiesgo = (id: string) => {
    if (!id) {
      setRiesgosSeleccionados([]);
      return;
    }
    setRiesgosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleResultado = (id: string) => {
    if (!id) {
      setResultadosSeleccionados([]);
      return;
    }
    setResultadosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((res) => res !== id) : [...prev, id]
    );
  };

  const limpiarTodosLosFiltros = () => {
    setGruposSeleccionados([]);
    setNpsSeleccionados([]);
    setRiesgosSeleccionados([]);
    setResultadosSeleccionados([]);
    setBusqueda("");
  };

  const totalFiltrosActivos =
    gruposSeleccionados.length +
    npsSeleccionados.length +
    riesgosSeleccionados.length +
    resultadosSeleccionados.length;

  // Estadísticas tabuladas por Grupo de Acceso y por NPS
  const stats = useMemo(() => {
    const total = contratosFiltrados.length;
    
    // Conteo por Grupos de Acceso
    const grupoA = contratosFiltrados.filter((c) => c.grupo_acceso === "GRUPO A").length;
    const grupoB = contratosFiltrados.filter((c) => c.grupo_acceso === "GRUPO B").length;
    const grupoC = contratosFiltrados.filter((c) => c.grupo_acceso === "GRUPO C" || c.grupo_acceso === "Sin accesos").length;

    // Conteo por NPS
    const promotores = contratosFiltrados.filter((c) => c.categoria_nps === "Promotor").length;
    const pasivos = contratosFiltrados.filter((c) => c.categoria_nps === "Pasivo").length;
    const detractores = contratosFiltrados.filter((c) => c.categoria_nps === "Detractor").length;

    const renuevan = contratosFiltrados.filter((c) => c.resultado_gestion === "Renueva").length;

    return { total, grupoA, grupoB, grupoC, promotores, pasivos, detractores, renuevan };
  }, [contratosFiltrados]);

  // Lista filtrada con tabulación cruzada combinable (ej. Grupo A + Promotor, etc.)
  const listaFiltrada = useMemo(() => {
    const list = contratosFiltrados.filter((c) => {
      // Filtro múltiple por Grupo de Acceso (ej: GRUPO A, GRUPO B, GRUPO C)
      if (gruposSeleccionados.length > 0) {
        const matchesGrupo = gruposSeleccionados.some((g) => {
          if (g === "GRUPO C") {
            return c.grupo_acceso === "GRUPO C" || c.grupo_acceso === "Sin accesos";
          }
          return c.grupo_acceso === g;
        });
        if (!matchesGrupo) return false;
      }

      // Filtro múltiple por NPS (ej: Promotor, Pasivo, Detractor)
      if (npsSeleccionados.length > 0) {
        if (!npsSeleccionados.includes(c.categoria_nps || "")) return false;
      }

      // Filtro múltiple por Riesgo (ej: Alto, Medio, Bajo)
      if (riesgosSeleccionados.length > 0) {
        if (!riesgosSeleccionados.includes(c.riesgo_baja)) return false;
      }

      // Filtro múltiple por Estado de gestión
      if (resultadosSeleccionados.length > 0) {
        if (!resultadosSeleccionados.includes(c.resultado_gestion || "")) return false;
      }

      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const nombre = c.nombre || c.socio_nombre || "";
        return (
          nombre.toLowerCase().includes(q) ||
          c.dni.includes(q) ||
          c.telefono.includes(q) ||
          c.plan.toLowerCase().includes(q) ||
          (c.nps_comentario && c.nps_comentario.toLowerCase().includes(q))
        );
      }
      return true;
    });

    return list.sort((a, b) => {
      return ordenDiasAsc ? a.dias_para_vencer - b.dias_para_vencer : b.dias_para_vencer - a.dias_para_vencer;
    });
  }, [
    contratosFiltrados,
    gruposSeleccionados,
    npsSeleccionados,
    riesgosSeleccionados,
    resultadosSeleccionados,
    busqueda,
    ordenDiasAsc,
  ]);

  const generarTextoContrato = (c: RegistroContrato, forzarCaso?: number) => {
    const primerNombre = c.nombre.split(" ")[0] || "Socio";
    const caso = forzarCaso || detectarCasoContrato(c).casoNumero;

    switch (caso) {
      case 1:
        return `Hola ${primerNombre},

Estuve viendo que en estos últimos días no estuviste viniendo mucho por el gimnasio y, además, leí el comentario que dejaste sobre tu experiencia. Me importa un montón que estés a gusto y quiero ver de qué forma podemos solucionarlo.

Contame qué fue lo que pasó o qué te hizo sentir así cuando puedas, así nos ponemos con esto y lo resolvemos juntos por acá.

¡Gracias por la sinceridad!`;

      case 2:
        return `Hola ${primerNombre},

¿Cómo estás? Estuve viendo que estas últimas semanas bajaste un poco la frecuencia con la que venís a entrenar. Quería escribirte para saber si hay algo en lo que te pueda dar una mano o si algo te está complicando venir con regularidad.

Si querés, podemos armar un cambio en tu rutina o ajustar el plan para que te resulte más cómodo retomar con todo. Escribime por acá y lo vemos.

¡Gracias!`;

      case 3:
        return `Hola ${primerNombre},

¿Cómo va? Estuve leyendo tu comentario y vi que hay algunas cosas de tu paso por el gimnasio que no te cerraron del todo. Me interesa un montón saber qué podemos mejorar para que la experiencia sea otra.

Contame por acá qué fue lo que no te gustó o qué esperabas encontrar, así lo revisamos y vemos cómo lo podemos ajustar.

¡Gracias por la buena onda para decirlo!`;

      case 4:
        return `Hola ${primerNombre},

¡Sabemos que la mejor onda es mutua y eso nos encanta! Pero noté que hace unos días no te cruzamos por el gimnasio.

Si querés, te armo una rutina corta o te reservo un lugar en alguna clase para que vuelvas con ganas esta semana. Escribime por acá qué día te queda cómodo y lo dejamos listo.

¡Gracias!`;

      case 5:
        return `Hola ${primerNombre},

¡Hola! Quería escribirte para saber cómo venís con tus entrenamientos y si hay algo en lo que te podamos dar una mano para que disfrutes más de tu paso por el gimnasio.

Contame cómo viene tu semana y qué te está faltando para aprovecharlo al máximo.

¡Gracias!`;

      case 6:
        return `Hola ${primerNombre},

¡Te veo entrenando un montón y te agradezco un montón la constancia! Por otro lado, vi que tu devolución no fue del todo positiva y quiero entender por qué. Viniendo tanto, tu experiencia tiene que ser impecable.

¿Charlamos un minutito la próxima vez que pases por recepción?

¡Gracias!`;

      case 7:
        return `Hola ${primerNombre},

¡Qué bueno tenerte siempre firme entrenando con nosotros! Quería escribirte para saber cómo venís y si querés que le peguemos una mirada a tu rutina para renovarla o si querés chusmear alguna de las clases nuevas.

Contame qué te anda dando vueltas por la cabeza y lo armamos por acá.

¡Gracias por la buena onda de siempre!`;

      case 8:
        return `Hola ${primerNombre},

Te vemos siempre entrenando por acá y nos encanta tu constancia — ¡gracias por elegirnos! Te escribo simplemente para saber cómo la estás pasando y si hay algo que podamos sumar para mejorar tu día a día en el gimnasio.

Contame con confianza si se te ocurre algo que podamos ajustar por acá.

¡Gracias!`;

      case 9:
        return `Hola ${primerNombre},

¡Se nota un montón tu compromiso viniendo tan seguido, gracias por la buena energía de siempre! Queríamos saludarte y recordarte que estamos para lo que necesites por acá.

Ah, y si tenés algún amigo o familiar que quiera sumarse a entrenar, avisame y te paso la info de los beneficios que tenemos para ustedes.

¡Gracias por estar siempre!`;

      case 10:
        return `Hola ${primerNombre},

Soy ${gerente.nombre} ${gerente.apellido}, ${gerente.sede} y hace un tiempo que no te veo por el club y quería saber cómo estás y si hay algo en lo que te pueda ayudar.

¿Tenés unos minutos para Escribirme, o preferís que te llame?

¡Gracias!`;

      case 11:
        return `Hola ${primerNombre},

Soy ${gerente.nombre} ${gerente.apellido}, ${gerente.sede} y quería contactarte para ver cómo venís entrenando últimamente y si hay algo en lo que te pueda dar una mano.

¿Cómo viene tu semana?

¡Gracias!`;

      case 12:
      default:
        return `Hola ${primerNombre},

Soy ${gerente.nombre} ${gerente.apellido}, ${gerente.sede} y te veo entrenando seguido y quería agradecerte la constancia. Contame si hay algo en lo que te pueda ayudar o si estás pensando en renovar tu plan.

¡Gracias!`;
    }
  };

  const handleAbrirPerfil = (c: RegistroContrato) => {
    setSocioPerfilModal({
      id: c.id,
      dni: c.dni,
      nombre: c.nombre,
      telefono: c.telefono,
      email: c.email,
      sede: c.sede,
      plan: c.plan,
      fecha_fin_contrato: c.fecha_fin_contrato,
      accesos_mes: c.accesos_mes,
      nps_score: c.nps_score,
      nps_comentario: c.nps_comentario,
      riesgo: c.riesgo_baja,
      intencion_volver: c.resultado_gestion === "Renueva" ? "Si" : c.resultado_gestion === "No Renueva" ? "No" : "Pensando",
      modulo: "contratos",
    });
  };

  return (
    <div className="space-y-5">
      {/* Header & Metric Cards */}
      <div className="bg-[#141419] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-[#ff6b00] text-white text-[10.5px] font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <Layers className="w-3.5 h-3.5" /> Cruce Multivariable: Contratos + Accesos + NPS
              </span>
              <span className="text-xs text-[#8e8e93] font-semibold">
                {soloMiSede ? `Megatlon ${gerente.sede}` : "Todas las sedes (Red)"}
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-['Outfit'] uppercase">
              Contratos a Vencer (Ventana 90 a 150 Días)
            </h1>
            <p className="text-xs text-[#8e8e93] mt-1 max-w-3xl">
              Podés <strong>hacer clic en las tarjetas y botones</strong> para filtrar de forma individual o <strong>sumar varios filtros combinados</strong> (ejemplo: <em>Grupo A + Promotor</em>, <em>Grupo C + Detractor</em>, etc.).
            </p>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="w-4 h-4 text-[#8e8e93] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por DNI, Nombre, Plan o Comentario..."
                className="w-full bg-[#1b1b22] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00]"
              />
            </div>

            <button
              onClick={() => setOrdenDiasAsc(!ordenDiasAsc)}
              title="Cambiar orden por días restantes de contrato"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1b1b22] border border-white/10 hover:border-white/30 text-xs font-bold text-zinc-300 transition-colors cursor-pointer shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span className="hidden sm:inline">{ordenDiasAsc ? "Más Próximos" : "Más Lejanos"}</span>
            </button>
          </div>
        </div>

        {/* Tabulación de KPIs Interactivos: Grupos de Acceso y NPS (Clickeables y combinables) */}
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

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
            {/* Total Contratos */}
            <button
              type="button"
              onClick={limpiarTodosLosFiltros}
              title="Ver todos los contratos sin filtros"
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                totalFiltrosActivos === 0
                  ? "bg-[#1f1f2e] border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.08)] ring-1 ring-white/20"
                  : "bg-[#191922] border-white/5 hover:border-white/20 hover:bg-[#1e1e28]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8e8e93] font-bold uppercase block">Total Contratos</span>
                {totalFiltrosActivos === 0 && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </div>
              <span className="text-lg font-black text-white block mt-0.5">{stats.total}</span>
              <span className="text-[9.5px] text-zinc-400 font-semibold block mt-0.5">
                {totalFiltrosActivos === 0 ? "✓ Mostrando todos" : "Clic para ver todos"}
              </span>
            </button>

            {/* Grupo A */}
            <button
              type="button"
              onClick={() => toggleGrupo("GRUPO A")}
              title="Filtrar por GRUPO A (≥12 accesos/mes). Podés combinar con Promotor u otros."
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                gruposSeleccionados.includes("GRUPO A")
                  ? "bg-emerald-950/60 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500/50"
                  : "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-950/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-300 font-black block uppercase tracking-wide">
                  GRUPO A ({'>='}12 acc)
                </span>
                {gruposSeleccionados.includes("GRUPO A") && (
                  <span className="p-0.5 rounded-full bg-emerald-500 text-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-black text-emerald-400">{stats.grupoA}</span>
                <span className="text-[10px] text-emerald-300/80 font-bold">Fidelizados</span>
              </div>
              <span className="text-[9.5px] text-emerald-400/90 font-semibold block mt-0.5">
                {gruposSeleccionados.includes("GRUPO A") ? "✓ Filtro activo" : "+ Sumar a filtro"}
              </span>
            </button>

            {/* Grupo B */}
            <button
              type="button"
              onClick={() => toggleGrupo("GRUPO B")}
              title="Filtrar por GRUPO B (5 a 11 accesos/mes). Podés combinar con otros filtros."
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                gruposSeleccionados.includes("GRUPO B")
                  ? "bg-blue-950/60 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)] ring-2 ring-blue-500/50"
                  : "bg-blue-950/20 border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-950/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-blue-300 font-black block uppercase tracking-wide">
                  GRUPO B (5-11 acc)
                </span>
                {gruposSeleccionados.includes("GRUPO B") && (
                  <span className="p-0.5 rounded-full bg-blue-500 text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-black text-blue-400">{stats.grupoB}</span>
                <span className="text-[10px] text-blue-300/80 font-bold">Regular</span>
              </div>
              <span className="text-[9.5px] text-blue-400/90 font-semibold block mt-0.5">
                {gruposSeleccionados.includes("GRUPO B") ? "✓ Filtro activo" : "+ Sumar a filtro"}
              </span>
            </button>

            {/* Grupo C */}
            <button
              type="button"
              onClick={() => toggleGrupo("GRUPO C")}
              title="Filtrar por GRUPO C (1 a 4 accesos/mes). Podés combinar con Detractores u otros."
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                gruposSeleccionados.includes("GRUPO C")
                  ? "bg-red-950/60 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.35)] ring-2 ring-red-500/50"
                  : "bg-red-950/25 border-red-500/40 hover:border-red-500/70 hover:bg-red-950/35"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-red-300 font-black block uppercase tracking-wide">
                  GRUPO C (1-4 acc)
                </span>
                {gruposSeleccionados.includes("GRUPO C") && (
                  <span className="p-0.5 rounded-full bg-red-500 text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-black text-red-400">{stats.grupoC}</span>
                <span className="text-[10px] text-red-300/80 font-bold">Crítico 🚨</span>
              </div>
              <span className="text-[9.5px] text-red-400/90 font-semibold block mt-0.5">
                {gruposSeleccionados.includes("GRUPO C") ? "✓ Filtro activo" : "+ Sumar a filtro"}
              </span>
            </button>

            {/* NPS Promotores */}
            <button
              type="button"
              onClick={() => toggleNps("Promotor")}
              title="Filtrar por NPS Promotores (9 y 10). Podés combinar con Grupo A, B o C."
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                npsSeleccionados.includes("Promotor")
                  ? "bg-emerald-950/60 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500/50"
                  : "bg-emerald-950/20 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-950/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-300 font-bold block uppercase">
                  NPS Promotor (9-10)
                </span>
                {npsSeleccionados.includes("Promotor") && (
                  <span className="p-0.5 rounded-full bg-emerald-500 text-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-black text-emerald-400">{stats.promotores}</span>
                <span className="text-[10px] text-emerald-300 font-bold">🟢 Alta fidelidad</span>
              </div>
              <span className="text-[9.5px] text-emerald-400/90 font-semibold block mt-0.5">
                {npsSeleccionados.includes("Promotor") ? "✓ Filtro activo" : "+ Sumar a filtro"}
              </span>
            </button>

            {/* NPS Pasivos */}
            <button
              type="button"
              onClick={() => toggleNps("Pasivo")}
              title="Filtrar por NPS Pasivos (7 y 8). Podés combinar con otros filtros."
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                npsSeleccionados.includes("Pasivo")
                  ? "bg-amber-950/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-2 ring-amber-500/50"
                  : "bg-amber-950/20 border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-950/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-300 font-bold block uppercase">
                  NPS Pasivo (7-8)
                </span>
                {npsSeleccionados.includes("Pasivo") && (
                  <span className="p-0.5 rounded-full bg-amber-500 text-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-black text-amber-400">{stats.pasivos}</span>
                <span className="text-[10px] text-amber-300 font-bold">🟡 Neutro</span>
              </div>
              <span className="text-[9.5px] text-amber-400/90 font-semibold block mt-0.5">
                {npsSeleccionados.includes("Pasivo") ? "✓ Filtro activo" : "+ Sumar a filtro"}
              </span>
            </button>

            {/* NPS Detractores */}
            <button
              type="button"
              onClick={() => toggleNps("Detractor")}
              title="Filtrar por NPS Detractores (0 a 6). Podés combinar con Grupo C, Riesgo Alto, etc."
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                npsSeleccionados.includes("Detractor")
                  ? "bg-red-950/60 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.35)] ring-2 ring-red-500/50"
                  : "bg-red-950/20 border-red-500/20 hover:border-red-500/50 hover:bg-red-950/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-red-300 font-bold block uppercase">
                  NPS Detractor (0-6)
                </span>
                {npsSeleccionados.includes("Detractor") && (
                  <span className="p-0.5 rounded-full bg-red-500 text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-black text-red-400">{stats.detractores}</span>
                <span className="text-[10px] text-red-300 font-bold">🔴 Riesgo</span>
              </div>
              <span className="text-[9.5px] text-red-400/90 font-semibold block mt-0.5">
                {npsSeleccionados.includes("Detractor") ? "✓ Filtro activo" : "+ Sumar a filtro"}
              </span>
            </button>
          </div>
        </div>

        {/* Tabulación Interactiva: Filtros Rápidos por Acceso y NPS con soporte Multi-Select */}
        <div className="space-y-2 pt-3 border-t border-white/5">
          {/* Filtro por Accesos */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#8e8e93] font-bold flex items-center gap-1.5 min-w-[170px]">
              <Activity className="w-3.5 h-3.5 text-blue-400" /> Accesos Mensuales:
            </span>
            <button
              type="button"
              onClick={() => setGruposSeleccionados([])}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                gruposSeleccionados.length === 0
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#1b1b22] text-[#8e8e93] hover:text-white"
              }`}
            >
              Todos los grupos
            </button>
            {[
              { id: "GRUPO A", label: "GRUPO A: ≥12 accesos (Alta)" },
              { id: "GRUPO B", label: "GRUPO B: 5 a 11 accesos (Media)" },
              { id: "GRUPO C", label: "GRUPO C: 1 a 4 accesos (Baja / Crítica)" },
            ].map((g) => {
              const activo = gruposSeleccionados.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleGrupo(g.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activo
                      ? "bg-[#ff6b00] text-white shadow-md font-bold ring-1 ring-white/30"
                      : "bg-[#1b1b22] text-[#8e8e93] hover:text-white hover:bg-[#252530]"
                  }`}
                >
                  {activo && <Check className="w-3 h-3 stroke-[3]" />}
                  {g.label}
                </button>
              );
            })}
          </div>

          {/* Filtro por NPS */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#8e8e93] font-bold flex items-center gap-1.5 min-w-[170px]">
              <Star className="w-3.5 h-3.5 text-amber-400" /> Tabulación NPS:
            </span>
            <button
              type="button"
              onClick={() => setNpsSeleccionados([])}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                npsSeleccionados.length === 0
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#1b1b22] text-[#8e8e93] hover:text-white"
              }`}
            >
              Todos los NPS
            </button>
            {[
              { id: "Promotor", label: "Promotores (9 y 10) 🟢" },
              { id: "Pasivo", label: "Pasivos (7 y 8) 🟡" },
              { id: "Detractor", label: "Detractores (0 a 6) 🔴" },
            ].map((n) => {
              const activo = npsSeleccionados.includes(n.id);
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggleNps(n.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activo
                      ? "bg-[#ff6b00] text-white shadow-md font-bold ring-1 ring-white/30"
                      : "bg-[#1b1b22] text-[#8e8e93] hover:text-white hover:bg-[#252530]"
                  }`}
                >
                  {activo && <Check className="w-3 h-3 stroke-[3]" />}
                  {n.label}
                </button>
              );
            })}

            {/* Filtro por Riesgo */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[#8e8e93] font-bold">Riesgo Churn:</span>
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

          {/* Filtro por Estado de Negociación */}
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
            <span className="text-[#8e8e93] font-bold flex items-center gap-1.5 min-w-[170px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Estado Negociación:
            </span>
            <button
              type="button"
              onClick={() => setResultadosSeleccionados([])}
              className={`px-2.5 py-0.8 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                resultadosSeleccionados.length === 0
                  ? "bg-white/20 text-white font-bold"
                  : "bg-[#1b1b22] text-[#8e8e93] hover:text-white"
              }`}
            >
              Todos los estados
            </button>
            {[
              { id: "Renueva", label: "✓ Renueva" },
              { id: "Lo está pensado", label: "⏳ Lo está pensando" },
              { id: "No Renueva", label: "✕ No Renueva" },
              { id: "", label: "Pendiente de contacto" },
            ].map((res) => {
              const activo = resultadosSeleccionados.includes(res.id);
              return (
                <button
                  key={res.id || "pendiente"}
                  type="button"
                  onClick={() => toggleResultado(res.id)}
                  className={`px-2.5 py-0.8 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    activo
                      ? "bg-[#ff6b00] text-white font-bold ring-1 ring-white/30"
                      : "bg-[#1b1b22] text-[#8e8e93] hover:text-white hover:bg-[#252530]"
                  }`}
                >
                  {activo && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  {res.label}
                </button>
              );
            })}
          </div>

          {/* Barra de Filtros Combinados Activos */}
          {totalFiltrosActivos > 0 && (
            <div className="flex flex-wrap items-center gap-2 bg-[#0c0c10] border border-[#ff6b00]/40 p-2.5 rounded-xl text-xs mt-2 shadow-inner">
              <span className="text-white font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff6b00] animate-ping" />
                <Filter className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Combinación activa ({listaFiltrada.length} socios de {stats.total}):</span>
              </span>

              {gruposSeleccionados.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold"
                >
                  <Activity className="w-3 h-3 text-blue-400" />
                  {g}
                  <button
                    type="button"
                    onClick={() => toggleGrupo(g)}
                    title="Quitar este filtro"
                    className="hover:text-white cursor-pointer ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {npsSeleccionados.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold"
                >
                  <Star className="w-3 h-3 text-amber-400" />
                  NPS {n}
                  <button
                    type="button"
                    onClick={() => toggleNps(n)}
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
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  Riesgo {r}
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

              {resultadosSeleccionados.map((res) => (
                <span
                  key={res || "pendiente"}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {res ? `Estado: ${res}` : "Estado: Pendiente"}
                  <button
                    type="button"
                    onClick={() => toggleResultado(res)}
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

      {/* Contracts Table */}
      <div className="bg-[#141419] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#191922] border-b border-white/10 text-[#8e8e93] font-black uppercase text-[10.5px] tracking-wider font-['Outfit']">
                <th className="py-3.5 px-4">Socio / DNI</th>
                <th className="py-3.5 px-3">Plan & Vencimiento</th>
                <th className="py-3.5 px-3">
                  <div className="flex items-center gap-1 text-blue-400">
                    <Activity className="w-3 h-3" />
                    <span>Grupo Accesos (Mes)</span>
                  </div>
                </th>
                <th className="py-3.5 px-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3" />
                    <span>NPS & Satisfacción</span>
                  </div>
                </th>
                <th className="py-3.5 px-3">Riesgo Churn</th>
                <th className="py-3.5 px-3">Estado Negociación</th>
                <th className="py-3.5 px-3">Perfil & Notas</th>
                <th className="py-3.5 px-4 text-right">Acción WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {listaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-[#8e8e93]">
                    No se encontraron contratos que coincidan con la tabulación de accesos y NPS seleccionada.
                  </td>
                </tr>
              ) : (
                listaFiltrada.map((c) => {
                  const cantComentarios = comentarios.filter(
                    (com) => (com.socio_dni && com.socio_dni.replace(/[^0-9]/g, "") === c.dni.replace(/[^0-9]/g, "")) || com.caso_id === c.id
                  ).length;

                  // Styling para Grupo de Acceso
                  const esGrupoA = c.grupo_acceso === "GRUPO A";
                  const esGrupoB = c.grupo_acceso === "GRUPO B";
                  const esGrupoC = c.grupo_acceso === "GRUPO C" || c.grupo_acceso === "Sin accesos";

                  // Styling para NPS
                  const esPromotor = c.categoria_nps === "Promotor";
                  const esPasivo = c.categoria_nps === "Pasivo";
                  const esDetractor = c.categoria_nps === "Detractor";

                  const casoInfo = detectarCasoContrato(c);

                  return (
                    <tr key={c.id} className="hover:bg-[#181822] transition-colors group">
                      {/* Socio / DNI */}
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
                        <div className="mt-1">
                          <span className={`inline-block text-[9.5px] font-bold px-2 py-0.5 rounded border ${casoInfo.badgeColor}`} title={casoInfo.nombreCaso}>
                            {casoInfo.nombreCaso}
                          </span>
                        </div>
                      </td>

                      {/* Plan & Vencimiento */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-white text-xs">{c.plan}</div>
                        <div className="text-[11px] text-amber-400 font-mono font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{c.fecha_fin_contrato}</span>
                          <span className="text-zinc-400 text-[10px]">({c.dias_para_vencer} días)</span>
                        </div>
                      </td>

                      {/* Grupo Accesos Mensuales */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <span
                            className={`inline-block text-[10.5px] font-black px-2 py-0.5 rounded border ${
                              esGrupoA
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : esGrupoB
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                : "bg-red-500/25 text-red-300 border-red-500/50"
                            }`}
                          >
                            {c.grupo_acceso || "Sin accesos"}
                          </span>
                          <div className="text-[11px] font-bold text-white flex items-center gap-1">
                            <Activity className="w-3 h-3 text-zinc-400" />
                            <span>{c.accesos_mes ?? Math.round(c.frecuencia_semanal_promedio * 4.3)} accesos / mes</span>
                          </div>
                        </div>
                      </td>

                      {/* NPS & Satisfacción */}
                      <td className="py-3.5 px-3 max-w-[210px]">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                esPromotor
                                  ? "bg-emerald-500 text-white"
                                  : esPasivo
                                  ? "bg-amber-500 text-black"
                                  : esDetractor
                                  ? "bg-red-600 text-white"
                                  : "bg-zinc-800 text-zinc-300"
                              }`}
                            >
                              {c.categoria_nps || "Sin NPS"} ({c.nps_score !== undefined ? `${c.nps_score}/10` : "-"})
                            </span>
                          </div>
                          {c.nps_comentario ? (
                            <p className="text-[10.5px] text-zinc-300 italic truncate" title={c.nps_comentario}>
                              "{c.nps_comentario}"
                            </p>
                          ) : (
                            <span className="text-[10px] text-zinc-500">Sin observaciones de NPS</span>
                          )}
                        </div>
                      </td>

                      {/* Riesgo de Churn */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 font-black text-xs px-2.5 py-0.5 rounded-full border ${
                            c.riesgo_baja === "Alto"
                              ? "bg-red-500/20 text-red-300 border-red-500/40"
                              : c.riesgo_baja === "Medio"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          }`}
                        >
                          {c.riesgo_baja === "Alto" && "🔴 Alto"}
                          {c.riesgo_baja === "Medio" && "🟡 Medio"}
                          {c.riesgo_baja === "Bajo" && "🟢 Bajo"}
                        </span>
                      </td>

                      {/* Estado Negociación */}
                      <td className="py-3.5 px-3">
                        <select
                          value={c.resultado_gestion || ""}
                          onChange={(e) => {
                            const val = e.target.value as ResultadoGestionContrato;
                            actualizarContrato(c.id, { resultado_gestion: val });
                          }}
                          className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer w-full max-w-[140px] ${
                            c.resultado_gestion === "Renueva"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : c.resultado_gestion === "No Renueva"
                              ? "bg-red-500/20 text-red-300 border-red-500/40"
                              : c.resultado_gestion === "Lo está pensado"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-[#1b1b24] text-[#8e8e93] border-white/10"
                          }`}
                        >
                          <option value="">Pendiente</option>
                          <option value="Lo está pensado">⏳ Lo está pensando</option>
                          <option value="Renueva">✓ Renueva</option>
                          <option value="No Renueva">✕ No Renueva</option>
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
                        </button>
                      </td>

                      {/* Botón WhatsApp */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSocioMensaje(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Mensaje */}
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
            modulo: "contratos",
            hito: detectarCasoContrato(socioMensaje).nombreCaso,
          }}
          mensajeInicial={generarTextoContrato(socioMensaje)}
        />
      )}

      {/* Modal Perfil Completo y Comentarios */}
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
