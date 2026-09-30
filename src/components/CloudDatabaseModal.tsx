import React, { useState } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Server,
  Layers,
  Users,
  Flame,
  FileText,
  Gift,
  History,
  X,
  Lock,
  Globe,
  Trash2,
} from "lucide-react";

interface CloudDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudDatabaseModal: React.FC<CloudDatabaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    isFirebaseSynced,
    estadoResguardo,
    ultimaSincronizacion,
    resguardarTodoEnFirestore,
    onboardings,
    casos,
    contratos,
    gifts,
    comentarios,
    interacciones,
    equipo,
    registrosAuditoria,
    vaciarTodosLosClientes,
  } = useMegatlon();

  const [copiadoProd, setCopiadoProd] = useState(false);
  const [copiadoDev, setCopiadoDev] = useState(false);
  const [copiadoDbId, setCopiadoDbId] = useState(false);
  const [mensajeResultado, setMensajeResultado] = useState<string | null>(null);

  if (!isOpen) return null;

  const urlProduccion = "https://ais-pre-y4ge6mixpbi6nvrynlyzrx-839645878130.us-east1.run.app";
  const urlDesarrollo = "https://ais-dev-y4ge6mixpbi6nvrynlyzrx-839645878130.us-east1.run.app";
  const firestoreDbId = "ai-studio-megatlonsleeperv-718f97f7-abcd-40c6-aa26-149f86e7f442";
  const firebaseProjectId = "ancient-fuze-h8chg";
  const firestoreConsoleUrl = `https://console.firebase.google.com/project/${firebaseProjectId}/firestore/databases/${firestoreDbId}/data`;

  const totalClientes =
    onboardings.length +
    casos.length +
    contratos.length +
    gifts.length +
    comentarios.length +
    interacciones.length;

  const totalRegistros = totalClientes + equipo.length + registrosAuditoria.length;

  const handleCopiar = (texto: string, tipo: "prod" | "dev" | "dbid") => {
    navigator.clipboard.writeText(texto);
    if (tipo === "prod") {
      setCopiadoProd(true);
      setTimeout(() => setCopiadoProd(false), 2500);
    } else if (tipo === "dev") {
      setCopiadoDev(true);
      setTimeout(() => setCopiadoDev(false), 2500);
    } else {
      setCopiadoDbId(true);
      setTimeout(() => setCopiadoDbId(false), 2500);
    }
  };

  const handleEjecutarResguardo = async () => {
    setMensajeResultado(null);
    const res = await resguardarTodoEnFirestore();
    if (res.ok) {
      setMensajeResultado(`¡Éxito! Se resguardaron y sincronizaron ${res.count} documentos completos en Firestore.`);
    } else {
      setMensajeResultado(`Error al resguardar: ${res.error || "Ocurrió un error inesperado"}`);
    }
  };

  const handleVaciarClientes = async () => {
    if (!window.confirm("¿Confirmás que querés vaciar todos los clientes cargados y dejar la base en blanco para comenzar con datos reales?")) {
      return;
    }
    setMensajeResultado(null);
    const res = await vaciarTodosLosClientes();
    if (res.ok) {
      setMensajeResultado("Base de datos de clientes vaciada con éxito. La aplicación quedó 100% limpia sin ningún cliente cargado.");
    } else {
      setMensajeResultado("Hubo un inconveniente al vaciar los clientes.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#171722] to-[#121217]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#c2410c] flex items-center justify-center shadow-lg shadow-[#ff6b00]/25">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-['Montserrat',sans-serif]">
                  Base de Datos & Enlaces de Publicación
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Nube Conectada
                </span>
              </div>
              <p className="text-xs text-[#8e8e93]">
                Resguardo en Google Cloud Firestore Enterprise con sincronización en tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Status Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#181822] border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Motor Cloud</span>
                <Server className="w-4 h-4 text-[#ff6b00]" />
              </div>
              <p className="text-sm font-bold text-white">Firestore Enterprise</p>
              <p className="text-[11px] text-zinc-400">Google Cloud (us-east1)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#181822] border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Reglas de Seguridad</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-sm font-bold text-emerald-400">Protegidas & Desplegadas</p>
              <p className="text-[11px] text-zinc-400">Validación ABAC en 8 colecciones</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#181822] border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Último Resguardo</span>
                <History className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-sm font-bold text-white">
                {ultimaSincronizacion || "En tiempo real activo"}
              </p>
              <p className="text-[11px] text-zinc-400">{totalRegistros} documentos totales</p>
            </div>
          </div>

          {/* Database Details & ID */}
          <div className="p-4 rounded-xl bg-[#181822] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#ff6b00]" />
                Instancia de Firestore Conectada
              </span>
              <button
                onClick={() => handleCopiar(firestoreDbId, "dbid")}
                className="text-[11px] font-bold text-[#ff6b00] hover:text-orange-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiadoDbId ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiadoDbId ? "¡ID Copiado!" : "Copiar ID"}
              </button>
            </div>
            <div className="bg-[#0f0f14] p-2.5 rounded-lg border border-white/5 font-mono text-[11px] text-zinc-300 break-all select-all flex items-center justify-between">
              <span>{firestoreDbId}</span>
            </div>
          </div>

          {/* Breakdown of Protected Collections */}
          <div>
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#ff6b00]" />
              Catálogo de Datos Resguardados en la Base
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#16161f] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Onboardings</span>
                  <Users className="w-3 h-3 text-[#ff6b00]" />
                </div>
                <p className="text-base font-black text-white mt-1">{onboardings.length}</p>
                <p className="text-[10px] text-zinc-400">socios 30D</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#16161f] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Sleepers</span>
                  <Flame className="w-3 h-3 text-red-400" />
                </div>
                <p className="text-base font-black text-white mt-1">{casos.length}</p>
                <p className="text-[10px] text-zinc-400">inactivos</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#16161f] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Contratos</span>
                  <FileText className="w-3 h-3 text-amber-400" />
                </div>
                <p className="text-base font-black text-white mt-1">{contratos.length}</p>
                <p className="text-[10px] text-zinc-400">vencimientos</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#16161f] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Pases & Gifts</span>
                  <Gift className="w-3 h-3 text-pink-400" />
                </div>
                <p className="text-base font-black text-white mt-1">{gifts.length}</p>
                <p className="text-[10px] text-zinc-400">invitaciones</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#16161f] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Comentarios</span>
                  <History className="w-3 h-3 text-blue-400" />
                </div>
                <p className="text-base font-black text-white mt-1">{comentarios.length}</p>
                <p className="text-[10px] text-zinc-400">notas de caso</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#16161f] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Interacciones</span>
                  <Globe className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-base font-black text-white mt-1">{interacciones.length}</p>
                <p className="text-[10px] text-zinc-400">contactos</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#16161f] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Equipo</span>
                  <ShieldCheck className="w-3 h-3 text-purple-400" />
                </div>
                <p className="text-base font-black text-white mt-1">{equipo.length}</p>
                <p className="text-[10px] text-zinc-400">colaboradores</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#16161f] border border-white/5">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span>Auditoría</span>
                  <Lock className="w-3 h-3 text-zinc-400" />
                </div>
                <p className="text-base font-black text-white mt-1">{registrosAuditoria.length}</p>
                <p className="text-[10px] text-zinc-400">eventos inmutables</p>
              </div>
            </div>
          </div>

          {/* Action Buttons: Resguardar y Vaciar Clientes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#ff6b00]/10 via-[#ff6b00]/5 to-transparent border border-[#ff6b00]/30 flex flex-col justify-between gap-2.5">
              <div>
                <p className="text-xs font-bold text-white">Resguardo en la Nube</p>
                <p className="text-[11px] text-zinc-400">
                  Guarda de forma forzada cada uno de los {totalRegistros} documentos en Firestore.
                </p>
              </div>
              <button
                onClick={handleEjecutarResguardo}
                disabled={estadoResguardo === "resguardando"}
                className="w-full px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ea580c] hover:brightness-110 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition-all cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${estadoResguardo === "resguardando" ? "animate-spin" : ""}`}
                />
                <span>
                  {estadoResguardo === "resguardando"
                    ? "Resguardando en Nube..."
                    : "Resguardar Todo en la Nube"}
                </span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col justify-between gap-2.5">
              <div>
                <p className="text-xs font-bold text-red-300">Vaciar Clientes (Base en Blanco)</p>
                <p className="text-[11px] text-zinc-400">
                  {totalClientes === 0
                    ? "La base ya se encuentra 100% limpia sin clientes cargados."
                    : `Elimina de forma permanente los ${totalClientes} socios de prueba para empezar de cero.`}
                </p>
              </div>
              <button
                onClick={handleVaciarClientes}
                disabled={totalClientes === 0}
                className="w-full px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 disabled:opacity-40 disabled:hover:bg-red-600/20 text-red-300 border border-red-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{totalClientes === 0 ? "✓ Base Limpia (0 Clientes)" : "Vaciar Clientes a Cero"}</span>
              </button>
            </div>
          </div>

          {mensajeResultado && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{mensajeResultado}</span>
            </div>
          )}

          {/* Publishing & Shared Links Section */}
          <div className="pt-2 border-t border-white/10 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#ff6b00]" />
                Páginas para Publicar y Acceder a la Aplicación
              </h3>
              <p className="text-xs text-[#8e8e93]">
                Podés compartir estos enlaces con los gerentes de sede, directores y equipo de Megatlon:
              </p>
            </div>

            {/* Link 1: Active Dev App */}
            <div className="p-3.5 rounded-xl bg-[#16161f] border border-[#ff6b00]/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">Enlace Activo Directo (Entorno Operativo)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Activo y Funcionando Ahora
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={urlDesarrollo}
                  className="flex-1 bg-[#0d0d12] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono select-all focus:outline-none"
                />
                <button
                  onClick={() => handleCopiar(urlDesarrollo, "dev")}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copiadoDev ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiadoDev ? "Copiado" : "Copiar"}</span>
                </button>
                <a
                  href={urlDesarrollo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-[#ff6b00] hover:bg-[#ea580c] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir App</span>
                </a>
              </div>
            </div>

            {/* Link 2: Shared / Production App */}
            <div className="p-3.5 rounded-xl bg-[#16161f] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-xs font-bold text-white">Enlace Público Compartido (Shared URL)</span>
                  <span className="text-[10px] text-zinc-400">
                    (Requiere pulsar el botón "Share" en AI Studio para publicarlo)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={urlProduccion}
                  className="flex-1 bg-[#0d0d12] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono select-all focus:outline-none"
                />
                <button
                  onClick={() => handleCopiar(urlProduccion, "prod")}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copiadoProd ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiadoProd ? "Copiado" : "Copiar"}</span>
                </button>
                <a
                  href={urlProduccion}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir</span>
                </a>
              </div>
            </div>

            {/* Link 3: Firebase Console Data */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-zinc-400">
                <Cloud className="w-4 h-4 text-[#ff6b00]" />
                <span>Consola Firebase Firestore (Administración Cloud Directa)</span>
              </div>
              <a
                href={firestoreConsoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#ff6b00] hover:text-orange-300 flex items-center gap-1 transition-colors"
              >
                <span>Ver Colecciones</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0e0e12] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
