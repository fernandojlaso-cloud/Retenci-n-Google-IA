import React, { useState, useMemo } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import {
  History,
  X,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Download,
  Building2,
  Calendar,
  Lock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
} from "lucide-react";

interface HistorialAccesosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistorialAccesosModal: React.FC<HistorialAccesosModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { historialAccesos } = useMegatlon();

  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  const accesosFiltrados = useMemo(() => {
    return historialAccesos.filter((log) => {
      if (filtroTipo === "exitosos" && !log.accion.toLowerCase().includes("exitoso")) {
        return false;
      }
      if (filtroTipo === "fallidos" && !log.accion.toLowerCase().includes("fallido")) {
        return false;
      }
      if (filtroTipo === "cierre" && !log.accion.toLowerCase().includes("cierre")) {
        return false;
      }

      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const match =
          log.usuarioNombre.toLowerCase().includes(q) ||
          log.usuarioEmail.toLowerCase().includes(q) ||
          (log.sede && log.sede.toLowerCase().includes(q)) ||
          log.detalles.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [historialAccesos, busqueda, filtroTipo]);

  const metricas = useMemo(() => {
    const total = historialAccesos.length;
    const exitosos = historialAccesos.filter((l) => l.accion.toLowerCase().includes("exitoso")).length;
    const fallidos = historialAccesos.filter((l) => l.accion.toLowerCase().includes("fallido")).length;
    const cierres = historialAccesos.filter((l) => l.accion.toLowerCase().includes("cierre")).length;
    return { total, exitosos, fallidos, cierres };
  }, [historialAccesos]);

  const exportarCSV = () => {
    if (accesosFiltrados.length === 0) return;
    const headers = ["ID", "Fecha y Hora", "Usuario", "Email", "Rol", "Sede", "Evento", "Detalles"];
    const rows = accesosFiltrados.map((l) => [
      l.id,
      `"${l.fecha}"`,
      `"${l.usuarioNombre}"`,
      `"${l.usuarioEmail}"`,
      `"${l.usuarioRol}"`,
      `"${l.sede || "Megatlon"}"`,
      `"${l.accion}"`,
      `"${l.detalles.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `log_accesos_megatlon_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#181822]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <span>Log de Accesos & Seguridad Corporativa</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  En Tiempo Real
                </span>
              </h2>
              <p className="text-xs text-[#8e8e93]">
                Registro inmutable de inicios de sesión, intentos fallidos y eventos de credenciales
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Metrics Summary Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#16161f] border border-white/5">
              <span className="text-xs text-zinc-400">Total Eventos</span>
              <p className="text-xl font-black text-white mt-0.5">{metricas.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Accesos Exitosos
              </span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{metricas.exitosos}</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <span className="text-xs text-red-300 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Intentos Fallidos
              </span>
              <p className="text-xl font-black text-red-400 mt-0.5">{metricas.fallidos}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-800/50 border border-white/5">
              <span className="text-xs text-zinc-400">Cierres de Sesión</span>
              <p className="text-xl font-black text-zinc-300 mt-0.5">{metricas.cierres}</p>
            </div>
          </div>

          {/* Filters & Export Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por usuario, email o sede..."
                className="w-full bg-[#0b0b10] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1 bg-[#0b0b10] border border-white/10 rounded-xl p-1 text-xs">
                {[
                  { id: "todos", label: "Todos" },
                  { id: "exitosos", label: "Exitosos" },
                  { id: "fallidos", label: "Fallidos" },
                  { id: "cierre", label: "Cierres" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFiltroTipo(f.id)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      filtroTipo === f.id
                        ? "bg-[#ff6b00] text-white font-bold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                onClick={exportarCSV}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Log Table */}
          <div className="bg-[#141419] border border-white/5 rounded-2xl overflow-hidden shadow-inner">
            <div className="overflow-x-auto max-h-[380px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-[#181822] text-[#8e8e93] uppercase font-bold text-[10px] tracking-wider z-10 border-b border-white/10">
                  <tr>
                    <th className="py-3 px-3.5">Fecha y Hora</th>
                    <th className="py-3 px-3">Usuario & Cargo</th>
                    <th className="py-3 px-3">Sede</th>
                    <th className="py-3 px-3">Evento</th>
                    <th className="py-3 px-3.5">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {accesosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-500 text-xs">
                        No hay registros de acceso que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    accesosFiltrados.map((log) => {
                      const esExito = log.accion.toLowerCase().includes("exitoso");
                      const esFallo = log.accion.toLowerCase().includes("fallido");

                      return (
                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-2.5 px-3.5 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                            {log.fecha}
                          </td>
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-white text-xs">{log.usuarioNombre}</p>
                            <p className="text-[10px] text-zinc-400 truncate max-w-[180px]">
                              {log.usuarioEmail}
                            </p>
                          </td>
                          <td className="py-2.5 px-3 text-zinc-300 whitespace-nowrap">
                            <span className="flex items-center gap-1 text-[11px]">
                              <Building2 className="w-3 h-3 text-[#ff6b00]" />
                              {log.sede || "Megatlon"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {esExito ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" /> Acceso Exitoso
                              </span>
                            ) : esFallo ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold animate-pulse">
                                <AlertTriangle className="w-3 h-3" /> Intento Rechazado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-700/30 text-zinc-400 border border-zinc-600/30 text-[10px]">
                                {log.accion}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3.5 text-zinc-400 text-[11px] max-w-xs truncate">
                            {log.detalles}
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

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#181822] flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-[#ff6b00]" />
            Bitácora inmutable protegida por Google Cloud Firestore
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
