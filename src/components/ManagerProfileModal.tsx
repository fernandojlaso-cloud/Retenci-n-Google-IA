import React, { useState } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { SEDES_MEGATLON, RolUsuario } from "../types";
import { X, UserCheck, Building2, Shield, Check, Crown, Award, Activity, Headphones } from "lucide-react";

interface ManagerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManagerProfileModal: React.FC<ManagerProfileModalProps> = ({ isOpen, onClose }) => {
  const { gerente, actualizarPerfilGerente, soloMiSede, setSoloMiSede } = useMegatlon();

  const [nombre, setNombre] = useState(gerente.nombre);
  const [apellido, setApellido] = useState(gerente.apellido);
  const [sede, setSede] = useState(gerente.sede);
  const [rol, setRol] = useState<RolUsuario>(gerente.rol || "gerente");
  const [guardado, setGuardado] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarPerfilGerente(nombre.trim(), apellido.trim(), sede, rol);
    setGuardado(true);
    setTimeout(() => {
      setGuardado(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#1c1c24] to-[#121217]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff6b00]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sesión de Sucursal & Gerente</h3>
              <p className="text-xs text-[#8e8e93]">Red Megatlon (28 sedes oficiales - megatlon.com)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e8e93] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8e8e93] mb-1.5">Nombre</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-colors"
                placeholder="Ej. Fernando"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8e8e93] mb-1.5">Apellido</label>
              <input
                type="text"
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-colors"
                placeholder="Ej. Laso"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8e8e93] mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#ff6b00]" />
              Sucursal a Cargo (28 Sedes Oficiales)
            </label>
            <select
              value={sede}
              onChange={(e) => setSede(e.target.value)}
              className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-colors cursor-pointer"
            >
              {SEDES_MEGATLON.map((s) => (
                <option key={s} value={s}>
                  Megatlon {s}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#8e8e93] mt-1">
              Todos los datos, métricas y mensajes de WhatsApp se asociarán por defecto a esta sucursal.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8e8e93] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Rol Operativo en la Red
              </span>
              <span className="text-[10px] text-zinc-400">
                Determina permisos de visualización
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRol("director")}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  rol === "director"
                    ? "bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500/30"
                    : "bg-[#1c1c24] border-white/5 text-[#8e8e93] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Director General</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                  👑 Acceso a Admin Mensajes & Aprobación de Gerentes
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRol("gerente")}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  rol === "gerente"
                    ? "bg-[#ff6b00]/15 border-[#ff6b00] text-white ring-1 ring-[#ff6b00]/30"
                    : "bg-[#1c1c24] border-white/5 text-[#8e8e93] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Award className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>Gerente de Sede</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                  🏢 Autoriza equipo local y gestiona su sucursal
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRol("coordinador")}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  rol === "coordinador"
                    ? "bg-cyan-500/15 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/30"
                    : "bg-[#1c1c24] border-white/5 text-[#8e8e93] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Coordinador</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                  🏃 Contacto 1a1, rutinas y alertas rojas
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRol("supervisor")}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  rol === "supervisor"
                    ? "bg-purple-500/15 border-purple-500 text-purple-300 ring-1 ring-purple-500/30"
                    : "bg-[#1c1c24] border-white/5 text-[#8e8e93] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Headphones className="w-3.5 h-3.5 text-purple-400" />
                  <span>Supervisor</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                  🛎️ Atención al socio y front desk
                </p>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={soloMiSede}
                onChange={(e) => setSoloMiSede(e.target.checked)}
                className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] bg-[#1c1c24] border-white/20"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">Filtrar estrictamente por mi sucursal</p>
                <p className="text-[11px] text-[#8e8e93]">
                  Oculta datos de otras sedes para evitar distracciones operativas.
                </p>
              </div>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#8e8e93] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ff6b00] hover:bg-[#ea580c] text-white flex items-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition-all cursor-pointer"
            >
              {guardado ? (
                <>
                  <Check className="w-4 h-4" /> Guardado
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" /> Activar Sesión
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
