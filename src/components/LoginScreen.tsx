import React, { useState } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  History,
} from "lucide-react";
import { MiembroEquipo } from "../types";

interface LoginScreenProps {
  onOpenHistorial?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onOpenHistorial }) => {
  const { iniciarSesion, equipo, historialAccesos } = useMegatlon();

  const [email, setEmail] = useState<string>("flaso@megatlon.com.ar");
  const [password, setPassword] = useState<string>("Megatlon2026!");
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMensaje(null);
    setCargando(true);

    try {
      const resultado = await iniciarSesion(email, password);
      if (!resultado.ok) {
        setErrorMensaje(resultado.error || "Error al validar credenciales.");
      }
    } catch (err: any) {
      setErrorMensaje(err?.message || "Ocurrió un error inesperado al procesar el acceso.");
    } finally {
      setCargando(false);
    }
  };

  const seleccionarUsuarioRapido = (miembro: MiembroEquipo) => {
    setEmail(miembro.email);
    setPassword(miembro.password || "Megatlon2026!");
    setErrorMensaje(null);
  };

  // Últimos 3 accesos para el preview del log de seguridad
  const ultimosAccesos = historialAccesos.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#09090d] flex flex-col justify-center items-center p-4 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-15%] left-[20%] w-[550px] h-[550px] bg-[#ff6b00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[20%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10 space-y-5 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-[#181822] border border-white/10 shadow-lg mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b00] animate-pulse" />
            <span className="text-xs font-black tracking-widest text-white uppercase font-['Outfit']">
              MEGATLON RED DE CLUBES
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
            Log de Acceso Corporativo
          </h1>
          <p className="text-xs sm:text-sm text-[#8e8e93]">
            Portal unificado para Gerentes de Sede, Directores y Coordinadores
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-[#121218]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMensaje && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Error de Autenticación</p>
                  <p className="text-[11px] text-red-300/90 mt-0.5">{errorMensaje}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>Correo Electrónico Corporativo</span>
                <span className="text-[10px] text-zinc-500">@megatlon.com.ar</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@megatlon.com.ar"
                  className="w-full bg-[#0b0b10] border border-white/10 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>Contraseña de Acceso</span>
                <span className="text-[10px] text-zinc-500">Credencial Protegida</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={mostrarPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0b0b10] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer p-0.5"
                  title={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {mostrarPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff6b00] via-[#ff781a] to-[#ea580c] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition-all cursor-pointer font-['Outfit']"
            >
              {cargando ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar a la Plataforma</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security details note */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Registro de Auditoría Activo
            </span>
            {onOpenHistorial && (
              <button
                type="button"
                onClick={onOpenHistorial}
                className="text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <History className="w-3 h-3 text-[#ff6b00]" />
                Ver Log de Accesos
              </button>
            )}
          </div>
        </div>

        {/* Quick Access Account Selector (Demo & Test Convenience) */}
        <div className="bg-[#121218]/60 border border-white/5 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#ff6b00]" />
              Acceso Rápido por Rol
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">1 clic para completar</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {equipo.slice(0, 4).map((miembro) => (
              <button
                key={miembro.id}
                type="button"
                onClick={() => seleccionarUsuarioRapido(miembro)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  email === miembro.email
                    ? "bg-[#ff6b00]/15 border-[#ff6b00]/50 text-white shadow-md shadow-[#ff6b00]/10"
                    : "bg-[#0d0d12] hover:bg-[#161620] border-white/5 text-zinc-300 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6b00]">
                    {miembro.rol === "director" ? "Director" : miembro.rol === "gerente" ? "Gerente" : "Coordinador"}
                  </span>
                  <span className="text-[9px] text-zinc-400">{miembro.sede}</span>
                </div>
                <p className="text-xs font-bold truncate mt-0.5">{miembro.nombre} {miembro.apellido}</p>
                <p className="text-[10px] text-zinc-500 truncate">{miembro.cargoEspecifico}</p>
              </button>
            ))}
          </div>

          <div className="pt-2 text-center">
            <p className="text-[10px] text-zinc-500">
              Contraseña predeterminada de prueba para todos los usuarios:{" "}
              <code className="text-zinc-300 font-bold bg-white/5 px-1.5 py-0.5 rounded">Megatlon2026!</code>
            </p>
          </div>
        </div>

        {/* Recent Access Log Mini Preview */}
        {ultimosAccesos.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#0f0f15]/50 border border-white/5 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="font-semibold flex items-center gap-1.5">
                <History className="w-3 h-3 text-[#ff6b00]" /> Últimos Eventos de Acceso Registrados
              </span>
              <span className="text-[10px] text-zinc-500">En tiempo real</span>
            </div>
            <div className="space-y-1">
              {ultimosAccesos.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-1 border-b border-white/5 last:border-0 text-zinc-400 text-[10px]"
                >
                  <span className="truncate max-w-[200px]">
                    <strong className="text-zinc-300">{log.usuarioNombre}</strong> ({log.sede || "Megatlon"})
                  </span>
                  <span className="text-zinc-500 font-mono">{log.fecha}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
