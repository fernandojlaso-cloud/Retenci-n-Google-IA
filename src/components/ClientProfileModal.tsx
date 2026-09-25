import React, { useState, useMemo } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { ComentarioCaso } from "../types";
import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Dumbbell,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Send,
  MessageSquare,
  Plus,
  Star,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Activity,
  History,
  UploadCloud,
  Layers,
  Sparkles
} from "lucide-react";

export interface SocioPerfilData {
  id?: string;
  dni: string;
  nombre: string;
  telefono: string;
  email?: string;
  sede: string;
  plan?: string;
  fecha_fin_contrato?: string;
  dias_sin_asistir?: number;
  ultimo_acceso?: string;
  accesos_mes?: number;
  nps_score?: number;
  nps_comentario?: string;
  motivo?: string;
  intencion_volver?: string;
  riesgo?: string;
  modulo?: "sleepers" | "contratos" | "onboarding";
}

interface ClientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  socio: SocioPerfilData | null;
}

export const ClientProfileModal: React.FC<ClientProfileModalProps> = ({
  isOpen,
  onClose,
  socio,
}) => {
  const {
    comentarios,
    agregarComentarioCompleto,
    actualizarNpsSocio,
    gerente,
    enviarWhatsApp,
  } = useMegatlon();

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [tipoComentario, setTipoComentario] = useState<ComentarioCaso["tipo"]>("comentario_socio");
  const [npsInput, setNpsInput] = useState<number | null>(null);
  const [npsComentarioInput, setNpsComentarioInput] = useState("");
  const [mostrarImportarTexto, setMostrarImportarTexto] = useState(false);
  const [textoImportar, setTextoImportar] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Inicializar NPS cuando se abre el modal
  React.useEffect(() => {
    if (socio?.nps_score !== undefined) {
      setNpsInput(socio.nps_score);
      setNpsComentarioInput(socio.nps_comentario || "");
    } else {
      setNpsInput(null);
      setNpsComentarioInput("");
    }
    setNuevoComentario("");
    setTextoImportar("");
    setMostrarImportarTexto(false);
  }, [socio]);

  // Filtrar comentarios históricos para este socio (por DNI o por ID de caso)
  const comentariosSocio = useMemo(() => {
    if (!socio) return [];
    const dniLimpio = socio.dni.replace(/[^0-9]/g, "");
    return comentarios.filter((c) => {
      const matchDni = c.socio_dni && c.socio_dni.replace(/[^0-9]/g, "") === dniLimpio;
      const matchCaso = socio.id && c.caso_id === socio.id;
      return matchDni || matchCaso;
    });
  }, [comentarios, socio]);

  if (!isOpen || !socio) return null;

  const handleSubmitComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    setGuardando(true);
    try {
      await agregarComentarioCompleto(
        socio.id || `soc-${socio.dni}`,
        nuevoComentario.trim(),
        tipoComentario,
        npsInput !== null ? npsInput : undefined,
        socio.dni,
        socio.nombre
      );
      setNuevoComentario("");
      setMensajeExito("Comentario guardado en el historial");
      setTimeout(() => setMensajeExito(null), 2500);
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarNps = async () => {
    if (npsInput === null) return;
    setGuardando(true);
    try {
      await actualizarNpsSocio(socio.dni, npsInput, npsComentarioInput.trim());
      // También registrar en el historial
      const cat = npsInput >= 9 ? "Promotor" : npsInput >= 7 ? "Pasivo" : "Detractor";
      await agregarComentarioCompleto(
        socio.id || `soc-${socio.dni}`,
        `Calificación NPS registrada: ${npsInput}/10 (${cat}). ${npsComentarioInput ? `"${npsComentarioInput}"` : ""}`,
        "comentario_socio",
        npsInput,
        socio.dni,
        socio.nombre
      );
      setMensajeExito(`NPS ${npsInput}/10 (${cat}) actualizado exitosamente`);
      setTimeout(() => setMensajeExito(null), 2500);
    } finally {
      setGuardando(false);
    }
  };

  const handleImportarTextoMasivo = async () => {
    if (!textoImportar.trim()) return;
    const lineas = textoImportar.trim().split("\n").filter((l) => l.trim().length > 0);
    setGuardando(true);
    try {
      for (const linea of lineas) {
        await agregarComentarioCompleto(
          socio.id || `soc-${socio.dni}`,
          linea.trim(),
          "comentario_socio",
          undefined,
          socio.dni,
          socio.nombre
        );
      }
      setTextoImportar("");
      setMostrarImportarTexto(false);
      setMensajeExito(`Se agregaron ${lineas.length} notas al historial`);
      setTimeout(() => setMensajeExito(null), 2500);
    } finally {
      setGuardando(false);
    }
  };

  const npsScoreActual = npsInput !== null ? npsInput : socio.nps_score;
  const npsCategoria =
    npsScoreActual !== undefined && npsScoreActual !== null
      ? npsScoreActual >= 9
        ? "Promotor"
        : npsScoreActual >= 7
        ? "Pasivo"
        : "Detractor"
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header (Megatlon Red Accent) */}
        <div className="bg-gradient-to-r from-[#17171d] via-[#1a1a22] to-[#121216] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#c2410c] flex items-center justify-center text-white shadow-lg shadow-[#ff6b00]/25">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight font-['Outfit'] uppercase">
                  {socio.nombre}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff6b00]/15 text-[#ff6b00] border border-[#ff6b00]/30 uppercase">
                  Sede {socio.sede}
                </span>
                {socio.riesgo && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      socio.riesgo === "Alto"
                        ? "bg-red-500/20 text-red-300 border-red-500/40"
                        : socio.riesgo === "Medio"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    }`}
                  >
                    Riesgo {socio.riesgo}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8e8e93] flex items-center gap-2 mt-0.5">
                <span>DNI {socio.dni}</span>
                <span>•</span>
                <span>{socio.telefono}</span>
                {socio.email && (
                  <>
                    <span>•</span>
                    <span className="hidden sm:inline">{socio.email}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const msg = `Hola ${socio.nombre.split(" ")[0]}, ¿cómo estás? Te escribe ${gerente.nombre} ${gerente.apellido}, gerente de Megatlon ${socio.sede}...`;
                enviarWhatsApp(socio.telefono, msg, socio.dni, socio.nombre, socio.modulo || "sleepers");
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#8e8e93] hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {mensajeExito && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#18181f] p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Fin / Vto Contrato</span>
              </div>
              <div className="text-sm font-black text-white">
                {socio.fecha_fin_contrato || "A definir"}
              </div>
              <span className="text-[10px] text-amber-400 font-semibold">
                {socio.plan || "Membresía Activa"}
              </span>
            </div>

            <div className="bg-[#18181f] p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] font-semibold mb-1">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>Asistencias / Frecuencia</span>
              </div>
              <div className="text-sm font-black text-white">
                {socio.dias_sin_asistir !== undefined
                  ? `${socio.dias_sin_asistir} días sin venir`
                  : `${socio.accesos_mes ?? 0} accesos / mes`}
              </div>
              <span className="text-[10px] text-zinc-400 font-semibold">
                Último: {socio.ultimo_acceso || "Registro digital"}
              </span>
            </div>

            <div className="bg-[#18181f] p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] font-semibold mb-1">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Intención de Volver</span>
              </div>
              <div className="text-sm font-black text-white">
                {socio.intencion_volver === "Si" && <span className="text-emerald-400">✓ Sí, desea volver</span>}
                {socio.intencion_volver === "No" && <span className="text-red-400">✕ No tiene intención</span>}
                {socio.intencion_volver === "Pensando" && <span className="text-amber-400">⏳ Lo está pensando</span>}
                {(!socio.intencion_volver || socio.intencion_volver === "Pendiente") && (
                  <span className="text-zinc-400">A consultar</span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400">
                Motivo: {socio.motivo || "Sin especificar"}
              </span>
            </div>

            <div className="bg-[#18181f] p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-[#8e8e93] font-semibold mb-1">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Puntaje NPS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">
                  {npsScoreActual !== undefined && npsScoreActual !== null
                    ? `${npsScoreActual}/10`
                    : "Sin calificar"}
                </span>
                {npsCategoria && (
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      npsCategoria === "Promotor"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : npsCategoria === "Pasivo"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {npsCategoria}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 truncate block">
                {socio.nps_comentario || "Calificación oficial"}
              </span>
            </div>
          </div>

          {/* NPS Update Section */}
          <div className="bg-[#16161d] border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-white tracking-tight font-['Outfit'] uppercase flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  Calificación NPS del Socio (Net Promoter Score)
                </h3>
                <p className="text-xs text-[#8e8e93]">
                  Seleccioná la puntuación que otorgó el cliente (0 a 6 Detractor, 7 a 8 Pasivo, 9 a 10 Promotor).
                </p>
              </div>

              {npsCategoria && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Estado NPS:</span>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                      npsCategoria === "Promotor"
                        ? "bg-emerald-500 text-white"
                        : npsCategoria === "Pasivo"
                        ? "bg-amber-500 text-black"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {npsCategoria} ({npsInput}/10)
                  </span>
                </div>
              )}
            </div>

            {/* Score Selector 0 to 10 */}
            <div className="flex items-center justify-between gap-1 sm:gap-1.5 overflow-x-auto py-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
                const isSelected = npsInput === score;
                const isPromotor = score >= 9;
                const isPasivo = score >= 7 && score <= 8;
                const isDetractor = score <= 6;

                let btnStyle = "bg-[#1f1f28] text-zinc-300 border-white/10 hover:border-white/30";
                if (isSelected) {
                  if (isPromotor) btnStyle = "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/25";
                  else if (isPasivo) btnStyle = "bg-amber-500 text-black font-black border-amber-400 shadow-md shadow-amber-500/25";
                  else btnStyle = "bg-red-600 text-white border-red-500 shadow-md shadow-red-600/25";
                }

                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setNpsInput(score)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer text-center ${btnStyle}`}
                  >
                    {score}
                  </button>
                );
              })}
            </div>

            {/* NPS Comment Input and Save */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <input
                type="text"
                value={npsComentarioInput}
                onChange={(e) => setNpsComentarioInput(e.target.value)}
                placeholder="Comentario o feedback dicho por el cliente sobre su puntuación NPS..."
                className="flex-1 w-full bg-[#1b1b24] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00]"
              />
              <button
                type="button"
                onClick={handleGuardarNps}
                disabled={npsInput === null || guardando}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#ea580c] disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-md shadow-[#ff6b00]/20"
              >
                Guardar NPS en Perfil
              </button>
            </div>
          </div>

          {/* Comment History & Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white tracking-tight font-['Outfit'] uppercase flex items-center gap-2">
                  <History className="w-4 h-4 text-[#ff6b00]" />
                  Historial de Comentarios & Registro de Contactos
                </h3>
                <p className="text-xs text-[#8e8e93]">
                  Notas, respuestas a llamadas, observaciones de sala y comentarios hechos por el socio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMostrarImportarTexto(!mostrarImportarTexto)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1a1a24] hover:bg-[#242432] border border-white/10 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>{mostrarImportarTexto ? "Cerrar importador" : "Importar / Pegar notas"}</span>
              </button>
            </div>

            {/* Bulk Text Import Area */}
            {mostrarImportarTexto && (
              <div className="bg-[#16161f] border border-dashed border-[#ff6b00]/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Pegar notas o comentarios múltiples (una línea por comentario):
                  </span>
                  <span className="text-[11px] text-zinc-400">Se guardarán con la fecha de hoy</span>
                </div>
                <textarea
                  value={textoImportar}
                  onChange={(e) => setTextoImportar(e.target.value)}
                  placeholder="Ej: 14/09: El socio llamó avisando que viaja dos semanas por trabajo.&#10;18/09: Se ofreció rutina express de 40 minutos adaptada."
                  rows={3}
                  className="w-full bg-[#121217] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff6b00]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setMostrarImportarTexto(false)}
                    className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleImportarTextoMasivo}
                    disabled={!textoImportar.trim() || guardando}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Subir al Historial
                  </button>
                </div>
              </div>
            )}

            {/* Add New Comment Form */}
            <form onSubmit={handleSubmitComentario} className="bg-[#181820] border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white">Agregar nuevo comentario o nota de gestión:</span>
                
                {/* Category selector */}
                <div className="flex items-center gap-1">
                  {(
                    [
                      { id: "comentario_socio", label: "Comentario Socio" },
                      { id: "llamada", label: "Llamada" },
                      { id: "whatsapp", label: "WhatsApp" },
                      { id: "visita_sede", label: "Visita Sede" },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setTipoComentario(cat.id)}
                      className={`px-2.5 py-0.8 rounded-md text-[10.5px] font-semibold transition-colors cursor-pointer ${
                        tipoComentario === cat.id
                          ? "bg-[#ff6b00] text-white"
                          : "bg-[#121217] text-[#8e8e93] hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe el comentario del socio, motivo de ausencia, acuerdo alcanzado, etc..."
                rows={3}
                className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00]"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#8e8e93]">
                  Registrado por: <strong>{gerente.nombre} {gerente.apellido}</strong> ({gerente.rol === "director" ? "Director" : "Gerente"})
                </span>

                <button
                  type="submit"
                  disabled={!nuevoComentario.trim() || guardando}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ea580c] hover:brightness-110 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#ff6b00]/25 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Guardar Comentario</span>
                </button>
              </div>
            </form>

            {/* Timeline List of Historical Comments */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#8e8e93] uppercase tracking-wider">
                Línea de tiempo de comentarios ({comentariosSocio.length})
              </h4>

              {comentariosSocio.length === 0 ? (
                <div className="text-center py-8 bg-[#15151c] rounded-xl border border-white/5 text-xs text-[#8e8e93]">
                  Aún no hay comentarios ni notas registradas para este socio. Sé el primero en registrar una nota arriba.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {comentariosSocio.map((com) => {
                    const esSocio = com.tipo === "comentario_socio";
                    const esLlamada = com.tipo === "llamada";
                    const esWa = com.tipo === "whatsapp";
                    const esVisita = com.tipo === "visita_sede";

                    return (
                      <div
                        key={com.id}
                        className="bg-[#16161d] border border-white/5 rounded-xl p-3.5 hover:border-white/15 transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{com.autor_nombre}</span>
                            <span className="text-[#8e8e93]">({com.autor_rol})</span>
                            <span
                              className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                                esSocio
                                  ? "bg-purple-500/20 text-purple-300"
                                  : esLlamada
                                  ? "bg-blue-500/20 text-blue-300"
                                  : esWa
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : esVisita
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-white/10 text-zinc-300"
                              }`}
                            >
                              {esSocio && "Comentario del Socio"}
                              {esLlamada && "Llamada"}
                              {esWa && "WhatsApp"}
                              {esVisita && "Visita en Sede"}
                              {!esSocio && !esLlamada && !esWa && !esVisita && "Nota General"}
                            </span>

                            {com.nps_asociado !== undefined && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                NPS {com.nps_asociado}/10
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-[#8e8e93]">
                            <Clock className="w-3 h-3" />
                            <span>{com.creado_en}</span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-200 leading-relaxed pl-1 border-l-2 border-[#ff6b00]/40">
                          {com.texto}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#14141a] border-t border-white/10 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#8e8e93]">
            Socio DNI {socio.dni} • Megatlon {socio.sede}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};
