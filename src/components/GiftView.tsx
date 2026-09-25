import React, { useState, useMemo } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { RegistroGift, SEDES_MEGATLON } from "../types";
import {
  Gift,
  Search,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  Plus,
} from "lucide-react";

export const GiftView: React.FC = () => {
  const { gifts, actualizarGift, perfil, cargoFirma, filtroSedeGlobal } = useMegatlon();

  const [busqueda, setBusqueda] = useState("");
  const [filtroSede, setFiltroSede] = useState(filtroSedeGlobal || "");

  const giftsFiltrados = useMemo(() => {
    return gifts.filter((g: RegistroGift) => {
      if (filtroSede && g.sede !== filtroSede) return false;
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        const ref = g.invitado_por || g.referido_por || "";
        return (
          g.nombre.toLowerCase().includes(q) ||
          g.telefono.includes(q) ||
          ref.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [gifts, filtroSede, busqueda]);

  const handleEnviarWhatsAppGift = (g: RegistroGift) => {
    const hoy = new Date().toISOString().slice(0, 10);
    actualizarGift(g.id, { fecha_envio_1: hoy });

    const primerNombre = g.nombre.split(" ")[0];
    const texto = encodeURIComponent(
      `Hola ${primerNombre}! Te escribe ${perfil.nombre}, ${cargoFirma} de Megatlon ${g.sede}. ${g.invitado_por || "Un socio"} te regaló un Pase Libre de 7 Días para que vengas a entrenar a cualquiera de nuestras sedes. ¿Qué día te gustaría venir a conocer las instalaciones?`
    );
    const cleanPhone = g.telefono.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${texto}`, "_blank");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-[#141418] border border-[#222227] rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-lg font-black text-white tracking-tight font-['Outfit'] flex items-center gap-2">
              GESTIÓN DE PASES GIFT & REFERIDOS
              <span className="text-xs font-bold text-[#f2622a] bg-[#f2622a]/15 px-2.5 py-0.5 rounded-full border border-[#f2622a]/30">
                {giftsFiltrados.length} invitados
              </span>
            </h1>
            <p className="text-xs text-[#8e8e93] mt-0.5">
              Contactá a los prospectos invitados por socios, coordiná su visita de prueba y registrá su inscripción.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8e8e93] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar invitado, referido..."
              className="w-full bg-[#1b1b20] border border-[#2c2c34] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#f2622a]"
            />
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#222227]">
          <span className="text-[11px] font-bold text-[#8e8e93] uppercase">Filtrar Sede:</span>
          <select
            value={filtroSede}
            onChange={(e) => setFiltroSede(e.target.value)}
            className="bg-[#1b1b20] border border-[#2c2c34] rounded-xl px-3 py-1 text-xs text-[#e1e1e6] focus:outline-none cursor-pointer"
          >
            <option value="">Todas las Sedes</option>
            {SEDES_MEGATLON.map((s: string) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gifts Table */}
      <div className="bg-[#141418] border border-[#222227] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#18181e] border-b border-[#222227] text-[#8e8e93] font-bold uppercase text-[10.5px] tracking-wider">
                <th className="py-3.5 px-4">Prospecto / Referido Por</th>
                <th className="py-3.5 px-3">Sede</th>
                <th className="py-3.5 px-3">Pase Enviado</th>
                <th className="py-3.5 px-3">Cita Coordinada</th>
                <th className="py-3.5 px-3">¿Vino a Probar?</th>
                <th className="py-3.5 px-3">¿Se Inscribió?</th>
                <th className="py-3.5 px-4 text-right">Acción WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {giftsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8e8e93]">
                    No hay registros de pases gift con los filtros actuales.
                  </td>
                </tr>
              ) : (
                giftsFiltrados.map((g: RegistroGift) => {
                  return (
                    <tr key={g.id} className="hover:bg-[#191920] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-xs">{g.nombre}</div>
                        <div className="text-[11px] text-[#8e8e93]">
                          {g.telefono} {g.invitado_por || g.referido_por ? `• Ref: ${g.invitado_por || g.referido_por}` : ""}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-[#c4c4cc]">
                        {g.sede}
                      </td>

                      <td className="py-3 px-3 text-[#8e8e93]">
                        {g.fecha_envio_1 || "Pendiente"}
                      </td>

                      <td className="py-3 px-3 text-[#c4c4cc]">
                        {g.dia_hora_coordinado || "A coordinar"}
                      </td>

                      <td className="py-3 px-3">
                        <select
                          value={g.vino_a_probar}
                          onChange={(e) => actualizarGift(g.id, { vino_a_probar: e.target.value as any })}
                          className="bg-[#202028] border border-[#2d2d38] text-xs font-semibold px-2 py-1 rounded-lg text-white"
                        >
                          <option value="">-</option>
                          <option value="Si">Sí</option>
                          <option value="No">No</option>
                        </select>
                      </td>

                      <td className="py-3 px-3">
                        <select
                          value={g.se_inscribio}
                          onChange={(e) => actualizarGift(g.id, { se_inscribio: e.target.value as any })}
                          className="bg-[#202028] border border-[#2d2d38] text-xs font-semibold px-2 py-1 rounded-lg text-white"
                        >
                          <option value="">-</option>
                          <option value="Si">Sí ✓</option>
                          <option value="No">No ✕</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleEnviarWhatsAppGift(g)}
                          className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-xl bg-[#30d158]/15 hover:bg-[#30d158]/25 text-[#30d158] border border-[#30d158]/30 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Gift</span>
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
    </div>
  );
};
