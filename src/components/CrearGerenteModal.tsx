import React, { useState, useEffect } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { SEDES_MEGATLON, RolUsuario, PermisosUsuario, MiembroEquipo } from "../types";
import {
  UserPlus,
  X,
  Lock,
  Mail,
  Building2,
  Shield,
  KeyRound,
  CheckCircle2,
  Copy,
  RefreshCw,
  Phone,
  Eye,
  EyeOff,
  Sliders,
  Send,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface CrearGerenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMiembroCreado?: (miembro: MiembroEquipo) => void;
}

const CARGOS_SUGERIDOS = [
  "Gerente de Sede",
  "Coordinador de Fitness & Musculación",
  "Coordinador de Clases de Técnicas & Ritmos",
  "Coordinador de Pileta & Natación",
  "Coordinador de Onboarding & Retención 30D",
  "Supervisor de Front Desk & Atención al Socio",
  "Supervisor de Operaciones y Mantenimiento",
];

export const CrearGerenteModal: React.FC<CrearGerenteModalProps> = ({
  isOpen,
  onClose,
  onMiembroCreado,
}) => {
  const { crearNuevoGerenteOCoordinador, gerente } = useMegatlon();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [sede, setSede] = useState<string>(gerente.sede || "Almagro");
  const [rol, setRol] = useState<RolUsuario>("coordinador");
  const [cargoEspecifico, setCargoEspecifico] = useState<string>("Coordinador de Fitness & Musculación");
  const [password, setPassword] = useState<string>("");
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);

  // Permisos configurables
  const [permisos, setPermisos] = useState<PermisosUsuario>({
    admin_mensajes: false,
    aprobar_gerentes: false,
    autorizar_equipo: false,
    enviar_masivo: false,
    enviar_individual: true,
    gestionar_alertas: true,
    ingestar_archivos: false,
    exportar_auditoria: false,
  });

  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [miembroExitoso, setMiembroExitoso] = useState<MiembroEquipo | null>(null);
  const [copiadoDatos, setCopiadoDatos] = useState(false);

  // Generar clave segura automática al abrir o por clic
  const generarPasswordAleatoria = () => {
    const sufijo = Math.floor(1000 + Math.random() * 9000);
    const pass = `Mega-${sufijo}!`;
    setPassword(pass);
  };

  useEffect(() => {
    if (isOpen && !password) {
      generarPasswordAleatoria();
    }
  }, [isOpen]);

  // Actualizar sugerencias de cargo y permisos según el rol seleccionado
  useEffect(() => {
    if (rol === "gerente") {
      setCargoEspecifico("Gerente de Sede");
      setPermisos({
        admin_mensajes: false,
        aprobar_gerentes: false,
        autorizar_equipo: true,
        enviar_masivo: true,
        enviar_individual: true,
        gestionar_alertas: true,
        ingestar_archivos: true,
        exportar_auditoria: true,
      });
    } else if (rol === "coordinador") {
      setCargoEspecifico("Coordinador de Fitness & Musculación");
      setPermisos({
        admin_mensajes: false,
        aprobar_gerentes: false,
        autorizar_equipo: false,
        enviar_masivo: false,
        enviar_individual: true,
        gestionar_alertas: true,
        ingestar_archivos: false,
        exportar_auditoria: false,
      });
    } else if (rol === "supervisor") {
      setCargoEspecifico("Supervisor de Front Desk & Atención al Socio");
      setPermisos({
        admin_mensajes: false,
        aprobar_gerentes: false,
        autorizar_equipo: false,
        enviar_masivo: false,
        enviar_individual: true,
        gestionar_alertas: true,
        ingestar_archivos: false,
        exportar_auditoria: false,
      });
    }
  }, [rol]);

  // Sugerencia automática de email al escribir nombre y apellido
  const handleNombreApellidoChange = (nom: string, ape: string) => {
    setNombre(nom);
    setApellido(ape);
    if (nom.trim() || ape.trim()) {
      const nomLimpio = nom.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
      const apeLimpio = ape.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
      if (nomLimpio && apeLimpio) {
        setEmail(`${nomLimpio[0]}${apeLimpio}@megatlon.com.ar`);
      } else if (nomLimpio) {
        setEmail(`${nomLimpio}@megatlon.com.ar`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMensaje(null);
    setCargando(true);

    try {
      const res = await crearNuevoGerenteOCoordinador({
        nombre,
        apellido,
        email,
        telefono,
        sede,
        rol,
        cargoEspecifico,
        password,
        permisosPersonalizados: permisos,
      });

      if (!res.ok || !res.miembro) {
        setErrorMensaje(res.error || "No se pudo generar el usuario.");
      } else {
        setMiembroExitoso(res.miembro);
        if (onMiembroCreado) {
          onMiembroCreado(res.miembro);
        }
      }
    } catch (err: any) {
      setErrorMensaje(err?.message || "Ocurrió un error al guardar en Firestore.");
    } finally {
      setCargando(false);
    }
  };

  const handleCopiarCredenciales = () => {
    if (!miembroExitoso) return;
    const texto = `¡Hola ${miembroExitoso.nombre}! Te compartimos tus credenciales de acceso para la plataforma Megatlon:
📧 Usuario: ${miembroExitoso.email}
🔑 Contraseña: ${miembroExitoso.password}
🏢 Sede: Megatlon ${miembroExitoso.sede}
💼 Cargo: ${miembroExitoso.cargoEspecifico}
🌐 Enlace: https://ais-dev-y4ge6mixpbi6nvrynlyzrx-839645878130.us-east1.run.app`;

    navigator.clipboard.writeText(texto);
    setCopiadoDatos(true);
    setTimeout(() => setCopiadoDatos(false), 2500);
  };

  const handleResetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setTelefono("");
    setMiembroExitoso(null);
    setErrorMensaje(null);
    generarPasswordAleatoria();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#181822]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#ea580c] flex items-center justify-center text-white shadow-lg shadow-[#ff6b00]/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Generar Nuevo Gerente / Coordinador
              </h2>
              <p className="text-xs text-[#8e8e93]">
                Crea credenciales con email y contraseña sincronizadas en Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {miembroExitoso ? (
            /* Success View with Copyable Credentials */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  ¡Credencial Generada Exitosamente!
                </h3>
                <p className="text-xs text-zinc-300">
                  El nuevo {miembroExitoso.rol} ya fue registrado en la base de datos de Megatlon y puede ingresar con su email y contraseña.
                </p>
              </div>

              {/* Credentials Card */}
              <div className="p-4 rounded-xl bg-[#16161f] border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-zinc-400 font-sans">Colaborador:</span>
                  <span className="text-white font-bold">{miembroExitoso.nombre} {miembroExitoso.apellido}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-zinc-400 font-sans">Sede Asignada:</span>
                  <span className="text-[#ff6b00] font-bold">Megatlon {miembroExitoso.sede}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-zinc-400 font-sans">Cargo:</span>
                  <span className="text-zinc-200">{miembroExitoso.cargoEspecifico}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-zinc-400 font-sans">Email Corporativo:</span>
                  <span className="text-blue-300 font-bold select-all">{miembroExitoso.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">Contraseña:</span>
                  <span className="text-emerald-300 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 select-all">
                    {miembroExitoso.password}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopiarCredenciales}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#ff6b00] hover:bg-[#ea580c] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#ff6b00]/25"
                >
                  {copiadoDatos ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiadoDatos ? "¡Datos Copiados al Portapapeles!" : "Copiar Datos de Acceso (WhatsApp/Email)"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Otro</span>
                </button>
              </div>
            </div>
          ) : (
            /* Creation Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMensaje && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMensaje}</span>
                </div>
              )}

              {/* Rol Selection Tabs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>Nivel y Rol de Acceso</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "gerente", label: "Gerente de Sede", desc: "Gestión ejecutiva" },
                    { id: "coordinador", label: "Coordinador", desc: "Seguimiento técnico" },
                    { id: "supervisor", label: "Supervisor", desc: "Front Desk & Atención" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRol(r.id as RolUsuario)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        rol === r.id
                          ? "bg-[#ff6b00]/15 border-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/10"
                          : "bg-[#16161f] border-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <p className="text-xs font-bold">{r.label}</p>
                      <p className="text-[10px] text-zinc-500">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sede & Cargo Específico */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#ff6b00]" />
                    <span>Sede Asignada</span>
                  </label>
                  <select
                    value={sede}
                    onChange={(e) => setSede(e.target.value)}
                    className="w-full bg-[#0b0b10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer"
                  >
                    {SEDES_MEGATLON.map((s) => (
                      <option key={s} value={s}>
                        Megatlon {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Cargo Específico</label>
                  <input
                    type="text"
                    required
                    value={cargoEspecifico}
                    onChange={(e) => setCargoEspecifico(e.target.value)}
                    list="cargos-sugeridos"
                    className="w-full bg-[#0b0b10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                    placeholder="Ej. Coordinador de Fitness"
                  />
                  <datalist id="cargos-sugeridos">
                    {CARGOS_SUGERIDOS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Nombre</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => handleNombreApellidoChange(e.target.value, apellido)}
                    placeholder="Ej. Martín"
                    className="w-full bg-[#0b0b10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Apellido</label>
                  <input
                    type="text"
                    required
                    value={apellido}
                    onChange={(e) => handleNombreApellidoChange(nombre, e.target.value)}
                    placeholder="Ej. Gómez"
                    className="w-full bg-[#0b0b10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
              </div>

              {/* Email & Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                    <span>Email Corporativo (Login)</span>
                    <span className="text-[10px] text-zinc-500">Auto-sugerido</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mgomez@megatlon.com.ar"
                      className="w-full bg-[#0b0b10] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">WhatsApp / Teléfono</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+54 9 11 5566-7788"
                      className="w-full bg-[#0b0b10] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                    />
                  </div>
                </div>
              </div>

              {/* Contraseña de Acceso */}
              <div className="p-3.5 rounded-xl bg-[#16161f] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#ff6b00]" />
                    <span>Contraseña Inicial de Acceso</span>
                  </label>
                  <button
                    type="button"
                    onClick={generarPasswordAleatoria}
                    className="text-[11px] font-bold text-[#ff6b00] hover:text-orange-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Generar otra
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={mostrarPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0b0b10] border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs text-emerald-300 font-mono font-bold focus:outline-none focus:border-[#ff6b00]"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer p-0.5"
                  >
                    {mostrarPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Podrás compartirle esta clave directamente por WhatsApp una vez creado el usuario.
                </p>
              </div>

              {/* Permisos Básicos */}
              <div className="p-3.5 rounded-xl bg-[#16161f] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#ff6b00]" />
                    <span>Permisos Operativos Asignados</span>
                  </span>
                  <span className="text-[10px] text-[#ff6b00] font-mono">Rol: {rol.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permisos.enviar_individual}
                      onChange={(e) => setPermisos({ ...permisos, enviar_individual: e.target.checked })}
                      className="rounded accent-[#ff6b00]"
                    />
                    <span>Envío individual WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permisos.gestionar_alertas}
                      onChange={(e) => setPermisos({ ...permisos, gestionar_alertas: e.target.checked })}
                      className="rounded accent-[#ff6b00]"
                    />
                    <span>Gestionar Alertas Rojas</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permisos.enviar_masivo}
                      onChange={(e) => setPermisos({ ...permisos, enviar_masivo: e.target.checked })}
                      className="rounded accent-[#ff6b00]"
                    />
                    <span>Campañas masivas</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permisos.ingestar_archivos}
                      onChange={(e) => setPermisos({ ...permisos, ingestar_archivos: e.target.checked })}
                      className="rounded accent-[#ff6b00]"
                    />
                    <span>Ingestar archivos CSV</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ea580c] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#ff6b00]/25 font-['Outfit']"
                >
                  {cargando ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Generar Credencial & Guardar</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
