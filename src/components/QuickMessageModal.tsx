import React, { useState, useEffect, useMemo } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { PlantillaMensaje } from "../types";
import { X, Send, Mail, Copy, Check, MessageSquare, SlidersHorizontal, Sparkles } from "lucide-react";

interface QuickMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinatario: {
    nombre: string;
    dni: string;
    telefono: string;
    email?: string;
    sede: string;
    modulo: "onboarding" | "sleepers" | "contratos" | "gift";
    hito?: string;
    rama?: string;
  };
  mensajeInicial: string;
  onMensajeEnviado?: () => void;
}

export const QuickMessageModal: React.FC<QuickMessageModalProps> = ({
  isOpen,
  onClose,
  destinatario,
  mensajeInicial,
  onMensajeEnviado,
}) => {
  const { enviarWhatsApp, enviarEmail, gerente, plantillas } = useMegatlon();
  const [mensaje, setMensaje] = useState(mensajeInicial);
  const [copiado, setCopiado] = useState(false);
  const [plantillaSeleccionadaId, setPlantillaSeleccionadaId] = useState<string>("");

  useEffect(() => {
    setMensaje(mensajeInicial);
    setPlantillaSeleccionadaId("");
  }, [mensajeInicial, isOpen]);

  // Plantillas oficiales pre-armadas disponibles para este módulo
  const plantillasModulo = useMemo(() => {
    return plantillas.filter((p) => p.tema === destinatario.modulo);
  }, [plantillas, destinatario.modulo]);

  if (!isOpen) return null;

  const handleCopiar = () => {
    navigator.clipboard.writeText(mensaje);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };

  const handleSeleccionarPlantilla = (id: string) => {
    setPlantillaSeleccionadaId(id);
    const p = plantillasModulo.find((item) => item.id === id);
    if (!p) return;

    const primerNombre = destinatario.nombre.split(" ")[0] || "Socio";
    const gerenteNombre = `${gerente.nombre} ${gerente.apellido}`;
    const cargo = gerente.cargo || "Gerente de Sede";
    const sede = destinatario.sede || gerente.sede;

    const formateado = p.cuerpo
      .replace(/\{nombre de gerente, sede\}/gi, `${gerenteNombre}, MEGATLON ${sede}`)
      .replace(/\{nombre de gerente\}/gi, gerenteNombre)
      .replace(/\{nombre\}/gi, primerNombre)
      .replace(/\{gerente\}/gi, gerenteNombre)
      .replace(/\{cargo\}/gi, cargo)
      .replace(/\{sede\}/gi, sede);

    setMensaje(formateado);
  };

  const handleWhatsApp = () => {
    enviarWhatsApp(
      destinatario.telefono,
      mensaje,
      destinatario.dni,
      destinatario.nombre,
      destinatario.modulo,
      destinatario.hito
    );
    if (onMensajeEnviado) onMensajeEnviado();
    onClose();
  };

  const handleEmail = () => {
    if (!destinatario.email) return;
    const asunto = `Novedades sobre tu membresía - MEGATLON ${destinatario.sede}`;
    enviarEmail(
      destinatario.email,
      asunto,
      mensaje,
      destinatario.dni,
      destinatario.nombre,
      destinatario.modulo,
      destinatario.hito
    );
    if (onMensajeEnviado) onMensajeEnviado();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#1c1c24] to-[#121217]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Mensajería Dinámica Oficial</h3>
                {destinatario.hito && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ff6b00]/15 text-[#ff6b00] text-[10.5px] font-bold border border-[#ff6b00]/30">
                    {destinatario.hito}
                  </span>
                )}
                {destinatario.rama && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                    {destinatario.rama}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8e8e93] mt-0.5">
                {destinatario.nombre} • DNI: {destinatario.dni} • MEGATLON {destinatario.sede}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e8e93] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Selector de plantilla pre-armada */}
          {plantillasModulo.length > 0 && (
            <div className="bg-[#181822] border border-white/10 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Mensajes Pre-armados ({plantillasModulo.length} opciones):</span>
              </div>
              <select
                value={plantillaSeleccionadaId}
                onChange={(e) => handleSeleccionarPlantilla(e.target.value)}
                className="bg-[#121217] border border-white/15 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#ff6b00] cursor-pointer"
              >
                <option value="">-- Mensaje predeterminado por el sistema --</option>
                {plantillasModulo.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titulo || p.etiqueta}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-[#8e8e93]">
            <span>Texto editable con firma de {gerente.nombre} {gerente.apellido} ({gerente.cargo || "Gerente"}):</span>
            <button
              onClick={handleCopiar}
              className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiado ? "Copiado" : "Copiar texto"}
            </button>
          </div>

          <textarea
            rows={10}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="w-full bg-[#1c1c24] border border-white/10 rounded-xl p-3.5 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-[#ff6b00] transition-colors resize-none font-sans"
            placeholder="Escriba o ajuste el mensaje..."
          />

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#8e8e93] gap-2">
            <div className="flex items-center gap-4">
              <span>📱 Teléfono: <strong className="text-white">{destinatario.telefono}</strong></span>
              {destinatario.email && (
                <span>✉️ Email: <strong className="text-white">{destinatario.email}</strong></span>
              )}
            </div>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> wa.me directo • Sin API paga
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#8e8e93] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            {destinatario.email && (
              <button
                type="button"
                onClick={handleEmail}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1c1c24] border border-white/10 hover:border-white/20 text-white flex items-center gap-2 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-blue-400" /> Abrir Email
              </button>
            )}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" /> Abrir WhatsApp (wa.me)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
