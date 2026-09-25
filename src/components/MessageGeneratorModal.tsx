import React, { useState } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { CasoSleeper, TonoMensaje } from "../types";
import {
  Sparkles,
  X,
  MessageCircle,
  Copy,
  Check,
  RefreshCw,
  Send,
  User,
  Sliders,
} from "lucide-react";

interface MessageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  socio: CasoSleeper | null;
}

export const MessageGeneratorModal: React.FC<MessageGeneratorModalProps> = ({
  isOpen,
  onClose,
  socio,
}) => {
  const { perfil, cargoFirma, actualizarCasoSleeper, agregarComentario } = useMegatlon();

  const [tono, setTono] = useState<TonoMensaje>("calido_empatico");
  const [beneficio, setBeneficio] = useState("Semana de pase libre sin cargo con rutina personalizada");
  const [generando, setGenerando] = useState(false);
  const [mensajeGenerado, setMensajeGenerado] = useState("");
  const [asunto, setAsunto] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !socio) return null;

  const handleGenerarMensaje = async () => {
    setGenerando(true);
    setError(null);
    try {
      const res = await fetch("/api/gemini/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socioNombre: socio.nombre,
          diasSinAsistir: socio.dias_sin_asistir,
          motivo: socio.motivo,
          sede: socio.sede,
          actividadFavorita: socio.actividad_favorita,
          cargoRemitente: `${cargoFirma} de Megatlon ${socio.sede}`,
          nombreRemitente: perfil.nombre,
          tono,
          beneficioOfrecido: beneficio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error generando mensaje");
      }

      setMensajeGenerado(data.mensaje);
      setAsunto(data.asunto || "");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "No se pudo generar el mensaje.");
    } finally {
      setGenerando(false);
    }
  };

  const handleCopiar = () => {
    navigator.clipboard.writeText(mensajeGenerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleEnviarWhatsApp = () => {
    const hoy = new Date().toISOString().slice(0, 10);
    actualizarCasoSleeper(socio.id, {
      fecha_envio_mensaje: hoy,
      estado: socio.estado === "Abierto" ? "Gestionado" : socio.estado,
    });

    agregarComentario(
      socio.id,
      `WhatsApp enviado con beneficio "${beneficio}" (Tono: ${tono})`
    );

    const encoded = encodeURIComponent(mensajeGenerado);
    const cleanPhone = socio.telefono.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141418] border border-[#26262e] w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-fadeIn">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#222228] flex items-center justify-between bg-gradient-to-r from-[#17171d] to-[#141418]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f2622a]/20 border border-[#f2622a]/40 flex items-center justify-center text-[#f2622a]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white font-['Outfit']">
                REDACTOR DE MENSAJES PERSONALIZADOS CON IA
              </h2>
              <p className="text-xs text-[#8e8e93]">
                Para <strong className="text-white">{socio.nombre}</strong> ({socio.dias_sin_asistir} días inactivo • {socio.sede})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1e1e24] hover:bg-[#282830] text-[#8e8e93] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Controls: Tone & Benefit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#18181e] p-4 rounded-2xl border border-[#24242c]">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#8e8e93] block mb-1.5">
                Tono de Comunicación
              </label>
              <select
                value={tono}
                onChange={(e) => setTono(e.target.value as TonoMensaje)}
                className="w-full bg-[#1e1e24] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f2622a] cursor-pointer"
              >
                <option value="calido_empatico">Cálido y Empático</option>
                <option value="motivacional">Motivacional y Energético</option>
                <option value="directo_beneficio">Directo con Beneficio</option>
                <option value="director_vip">Institucional VIP (Firma Directiva)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#8e8e93] block mb-1.5">
                Beneficio de Retorno Ofrecido
              </label>
              <select
                value={beneficio}
                onChange={(e) => setBeneficio(e.target.value)}
                className="w-full bg-[#1e1e24] border border-[#2d2d38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f2622a] cursor-pointer"
              >
                <option value="Semana de pase libre sin cargo con rutina personalizada">
                  1 Semana sin cargo + Rutina Express
                </option>
                <option value="Pase de cortesía para entrenar con un amigo">
                  Pase de cortesía para un amigo
                </option>
                <option value="Sesión personalizada gratuita de evaluación física">
                  Sesión personalizada con entrenador
                </option>
                <option value="Congelamiento de tarifa por 12 meses">
                  Congelamiento de cuota por 12 meses
                </option>
                <option value="Pase libre para pileta y spa sin costo extra">
                  Pase libre de pileta y spa
                </option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                onClick={handleGenerarMensaje}
                disabled={generando}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#f2622a] to-[#ff7a45] text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-[#f2622a]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {generando ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Redactando mensaje con Gemini IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{mensajeGenerado ? "Regenerar Mensaje" : "Redactar Mensaje Ahora"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#ff453a]/10 border border-[#ff453a]/25 text-[#ff453a] text-xs">
              {error}
            </div>
          )}

          {/* Generated Message Preview Area */}
          {mensajeGenerado ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-[#30d158]" />
                  Vista Previa del Mensaje para WhatsApp
                </span>
                <button
                  onClick={handleCopiar}
                  className="flex items-center gap-1 text-[11px] text-[#8e8e93] hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  {copiado ? <Check className="w-3.5 h-3.5 text-[#30d158]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiado ? "Copiado" : "Copiar texto"}</span>
                </button>
              </div>

              {/* WhatsApp styled bubble */}
              <div className="bg-[#121b16] border border-[#1f382a] rounded-2xl p-4 text-xs text-[#d1e7dd] space-y-2 font-sans relative shadow-inner">
                {asunto && (
                  <div className="text-[10px] text-[#30d158] font-bold uppercase tracking-wider">
                    Asunto: {asunto}
                  </div>
                )}
                <textarea
                  value={mensajeGenerado}
                  onChange={(e) => setMensajeGenerado(e.target.value)}
                  rows={6}
                  className="w-full bg-transparent text-xs text-white leading-relaxed focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleEnviarWhatsApp}
                  className="flex items-center gap-2 bg-[#30d158] hover:brightness-110 text-black font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#30d158]/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Abrir WhatsApp y Enviar</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-[#2b2b35] rounded-2xl p-8 text-center text-[#8e8e93] text-xs">
              Hacé click en <strong>"Redactar Mensaje Ahora"</strong> para que Gemini cree una propuesta individualizada considerando la inactividad de {socio.nombre}, su actividad favorita ({socio.actividad_favorita || "Fitness"}) y el motivo registrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
