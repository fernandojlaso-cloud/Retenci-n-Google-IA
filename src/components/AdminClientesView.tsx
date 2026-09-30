import React, { useState, useMemo } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { SEDES_MEGATLON } from "../types";
import {
  Users,
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Compass,
  Flame,
  FileText,
  Gift,
  Download,
  CheckSquare,
  Square,
  X,
  Phone,
  Mail,
  ShieldAlert,
  ArrowUpDown,
  History,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export interface ItemClienteUnificado {
  id: string;
  dni: string;
  nombre: string;
  email: string;
  telefono: string;
  sede: string;
  modulo: "onboarding" | "sleepers" | "contratos" | "gift";
  moduloEtiqueta: string;
  estadoOInfo: string;
  riesgoOAlerta?: string;
  alertaRoja?: boolean;
  fechaRegistro: string;
}

export const AdminClientesView: React.FC = () => {
  const {
    onboardings,
    casos,
    contratos,
    gifts,
    eliminarClienteGeneral,
    eliminarClientesLote,
    enviarWhatsApp,
    gerente,
  } = useMegatlon();

  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroModulo, setFiltroModulo] = useState<string>("todos");
  const [filtroSede, setFiltroSede] = useState<string>("todas");
  const [filtroRiesgo, setFiltroRiesgo] = useState<string>("todos");

  // Selección múltiple para baja masiva
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());

  // Diálogos de confirmación
  const [clienteAEliminar, setClienteAEliminar] = useState<ItemClienteUnificado | null>(null);
  const [isModalMasivoOpen, setIsModalMasivoOpen] = useState<boolean>(false);
  const [procesandoBaja, setProcesandoBaja] = useState<boolean>(false);
  const [mensajeResultado, setMensajeResultado] = useState<string | null>(null);

  // Consolidar todos los clientes de todos los módulos en una lista uniforme
  const todosLosClientes: ItemClienteUnificado[] = useMemo(() => {
    const list: ItemClienteUnificado[] = [];

    // 1. Onboarding 30D
    onboardings.forEach((o) => {
      list.push({
        id: o.id,
        dni: o.dni,
        nombre: o.nombre + (o.apellido ? ` ${o.apellido}` : ""),
        email: o.email || "socio@megatlon.com.ar",
        telefono: o.telefono || "",
        sede: o.sede || "Almagro",
        modulo: "onboarding",
        moduloEtiqueta: "Onboarding 30D",
        estadoOInfo: `${o.hito_actual} (${o.rama || "Musculación"})`,
        riesgoOAlerta: o.alerta_roja ? "Alerta Roja 🚨" : o.hito2_satisfaccion || "Normal",
        alertaRoja: Boolean(o.alerta_roja && !o.tarea_resuelta),
        fechaRegistro: o.fecha_alta || "Reciente",
      });
    });

    // 2. Sleepers (Inactivos)
    casos.forEach((s) => {
      list.push({
        id: s.id,
        dni: s.dni,
        nombre: s.nombre,
        email: s.email || "socio@megatlon.com.ar",
        telefono: s.telefono || "",
        sede: s.sede || "Almagro",
        modulo: "sleepers",
        moduloEtiqueta: "Sleeper (Inactivo)",
        estadoOInfo: `${s.dias_sin_asistir} días inactivo • ${s.estado}`,
        riesgoOAlerta: `Riesgo ${s.riesgo}`,
        alertaRoja: s.riesgo === "Alto",
        fechaRegistro: s.ultimo_acceso || "Sin datos",
      });
    });

    // 3. Contratos por Vencer
    contratos.forEach((c) => {
      list.push({
        id: c.id,
        dni: c.dni,
        nombre: c.nombre,
        email: c.email || "socio@megatlon.com.ar",
        telefono: c.telefono || "",
        sede: c.sede || "Almagro",
        modulo: "contratos",
        moduloEtiqueta: "Contrato a Vencer",
        estadoOInfo: `Vence en ${c.dias_para_vencer} días (Salud: ${c.score_salud}/10)`,
        riesgoOAlerta: `Riesgo ${c.riesgo_baja}`,
        alertaRoja: c.riesgo_baja === "Alto",
        fechaRegistro: c.fecha_fin_contrato || "Sin datos",
      });
    });

    // 4. Gifts
    gifts.forEach((g) => {
      list.push({
        id: g.id,
        dni: g.id,
        nombre: g.nombre,
        email: g.email || "invitado@megatlon.com.ar",
        telefono: g.telefono || "",
        sede: g.sede || "Almagro",
        modulo: "gift",
        moduloEtiqueta: "Pase Gift",
        estadoOInfo: `Invitado por: ${g.invitado_por || "Socio"} • Vino: ${g.vino_a_probar || "Pendiente"}`,
        riesgoOAlerta: g.se_inscribio === "Si" ? "Inscripto" : "No inscripto",
        alertaRoja: false,
        fechaRegistro: g.fecha_creacion || "Sin datos",
      });
    });

    return list;
  }, [onboardings, casos, contratos, gifts]);

  // Filtrado de la lista consolidada
  const clientesFiltrados = useMemo(() => {
    return todosLosClientes.filter((c) => {
      // Filtro módulo
      if (filtroModulo !== "todos" && c.modulo !== filtroModulo) {
        return false;
      }

      // Filtro sede
      if (filtroSede !== "todas" && c.sede.toLowerCase() !== filtroSede.toLowerCase()) {
        return false;
      }

      // Filtro riesgo / alerta
      if (filtroRiesgo === "alertas" && !c.alertaRoja) {
        return false;
      }
      if (filtroRiesgo === "alto" && !c.riesgoOAlerta?.toLowerCase().includes("alto")) {
        return false;
      }

      // Búsqueda por texto
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const match =
          c.nombre.toLowerCase().includes(q) ||
          c.dni.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.telefono.toLowerCase().includes(q) ||
          c.sede.toLowerCase().includes(q) ||
          c.moduloEtiqueta.toLowerCase().includes(q) ||
          c.estadoOInfo.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [todosLosClientes, filtroModulo, filtroSede, filtroRiesgo, busqueda]);

  // Métricas
  const totalOnboardings = onboardings.length;
  const totalSleepers = casos.length;
  const totalContratos = contratos.length;
  const totalGifts = gifts.length;
  const totalGeneral = todosLosClientes.length;
  const totalAlertas = todosLosClientes.filter((c) => c.alertaRoja).length;

  // Manejo de Selección
  const toggleSeleccionarTodos = () => {
    if (seleccionados.size === clientesFiltrados.length) {
      setSeleccionados(new Set());
    } else {
      setSeleccionados(new Set(clientesFiltrados.map((c) => `${c.modulo}___${c.id}`)));
    }
  };

  const toggleSeleccionarUno = (modulo: string, id: string) => {
    const key = `${modulo}___${id}`;
    const next = new Set(seleccionados);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSeleccionados(next);
  };

  // Ejecución de eliminación individual
  const confirmarEliminarIndividual = async () => {
    if (!clienteAEliminar) return;
    setProcesandoBaja(true);
    setMensajeResultado(null);

    try {
      const ok = await eliminarClienteGeneral(clienteAEliminar.id, clienteAEliminar.modulo);
      if (ok) {
        setMensajeResultado(
          `Socio ${clienteAEliminar.nombre} (DNI: ${clienteAEliminar.dni}) eliminado con éxito de la base de datos de ${clienteAEliminar.moduloEtiqueta}.`
        );
        // Deseleccionar si estaba seleccionado
        const key = `${clienteAEliminar.modulo}___${clienteAEliminar.id}`;
        if (seleccionados.has(key)) {
          const next = new Set(seleccionados);
          next.delete(key);
          setSeleccionados(next);
        }
      }
    } catch (err: any) {
      setMensajeResultado(`Error al eliminar: ${err?.message || "Ocurrió un error inesperado"}`);
    } finally {
      setProcesandoBaja(false);
      setClienteAEliminar(null);
    }
  };

  // Ejecución de eliminación masiva
  const confirmarEliminarMasivo = async () => {
    if (seleccionados.size === 0) return;
    setProcesandoBaja(true);
    setMensajeResultado(null);

    try {
      const items = Array.from(seleccionados).map((s) => {
        const [modulo, id] = s.split("___");
        return { id, modulo: modulo as any };
      });

      const res = await eliminarClientesLote(items);
      setMensajeResultado(`Baja masiva completada: Se eliminaron ${res.exitosos} socios de Firestore.`);
      setSeleccionados(new Set());
      setIsModalMasivoOpen(false);
    } catch (err: any) {
      setMensajeResultado(`Error en la baja masiva: ${err?.message || "Ocurrió un error inesperado"}`);
    } finally {
      setProcesandoBaja(false);
    }
  };

  // Exportar a CSV
  const exportarCSV = () => {
    if (clientesFiltrados.length === 0) return;
    const headers = ["DNI", "Nombre", "Email", "Telefono", "Sede", "Modulo", "Estado/Detalle", "Riesgo/Alerta", "Fecha"];
    const rows = clientesFiltrados.map((c) => [
      `"${c.dni}"`,
      `"${c.nombre}"`,
      `"${c.email}"`,
      `"${c.telefono}"`,
      `"${c.sede}"`,
      `"${c.moduloEtiqueta}"`,
      `"${c.estadoOInfo}"`,
      `"${c.riesgoOAlerta || ""}"`,
      `"${c.fechaRegistro}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clientes_megatlon_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121217] border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-red-400" />
              GESTIÓN DE BAJAS & ADMINISTRADOR MAESTRO DE CLIENTES
            </span>
            <span className="text-[10px] font-semibold text-[#8e8e93]">
              Sede activa: <strong className="text-white">Megatlon {gerente.sede}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-['Outfit'] tracking-tight">
            ADMINISTRADOR DE CLIENTES & ELIMINACIÓN DE REGISTROS
          </h1>
          <p className="text-xs text-[#8e8e93] max-w-2xl leading-relaxed">
            Consola central para buscar, auditar y <strong>eliminar socios de forma individual o en lote</strong>.
            Cualquier baja se sincroniza en tiempo real con <strong>Google Cloud Firestore</strong> y se asienta en la bitácora inmutable de auditoría.
          </p>
        </div>

        {/* Counters Summary */}
        <div className="flex flex-wrap items-center gap-2 z-10">
          <div className="px-3 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-center min-w-[90px]">
            <p className="text-[10px] font-bold uppercase text-[#8e8e93]">Total Clientes</p>
            <p className="text-xl font-black text-white font-['Outfit']">{totalGeneral}</p>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-[#ff6b00]/10 border border-[#ff6b00]/25 text-center min-w-[85px]">
            <p className="text-[10px] font-bold uppercase text-[#ff6b00]">Onboarding</p>
            <p className="text-xl font-black text-[#ff6b00] font-['Outfit']">{totalOnboardings}</p>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-red-500/10 border border-red-500/25 text-center min-w-[85px]">
            <p className="text-[10px] font-bold uppercase text-red-400">Sleepers</p>
            <p className="text-xl font-black text-red-400 font-['Outfit']">{totalSleepers}</p>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-center min-w-[85px]">
            <p className="text-[10px] font-bold uppercase text-amber-400">Contratos</p>
            <p className="text-xl font-black text-amber-400 font-['Outfit']">{totalContratos}</p>
          </div>
        </div>
      </div>

      {/* Result feedback message */}
      {mensajeResultado && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{mensajeResultado}</span>
          </div>
          <button
            onClick={() => setMensajeResultado(null)}
            className="text-emerald-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toolbar: Filters & Bulk Actions */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Live Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por DNI, Nombre, Email, Teléfono, Sede o Estado..."
              className="w-full bg-[#0b0b10] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Module */}
            <select
              value={filtroModulo}
              onChange={(e) => setFiltroModulo(e.target.value)}
              className="bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer"
            >
              <option value="todos">📁 Todos los Módulos ({totalGeneral})</option>
              <option value="onboarding">Compass Onboarding ({totalOnboardings})</option>
              <option value="sleepers">Sleepers Inactivos ({totalSleepers})</option>
              <option value="contratos">Contratos a Vencer ({totalContratos})</option>
              <option value="gift">Pases Gift ({totalGifts})</option>
            </select>

            {/* Filter by Sede */}
            <select
              value={filtroSede}
              onChange={(e) => setFiltroSede(e.target.value)}
              className="bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer"
            >
              <option value="todas">🌐 Todas las Sedes (28 Oficiales)</option>
              {SEDES_MEGATLON.map((s) => (
                <option key={s} value={s}>
                  Megatlon {s}
                </option>
              ))}
            </select>

            {/* Filter by Risk / Alert */}
            <select
              value={filtroRiesgo}
              onChange={(e) => setFiltroRiesgo(e.target.value)}
              className="bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer"
            >
              <option value="todos">Todos los Estados</option>
              <option value="alertas">🚨 Con Alertas Rojas ({totalAlertas})</option>
              <option value="alto">🔥 Riesgo Alto</option>
            </select>

            {/* Export button */}
            <button
              onClick={exportarCSV}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Exportar listado actual a CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Bar (when rows are selected) */}
        {seleccionados.size > 0 && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-red-300">
              <CheckSquare className="w-4 h-4 text-red-400" />
              <span>
                {seleccionados.size} {seleccionados.size === 1 ? "socio seleccionado" : "socios seleccionados"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSeleccionados(new Set())}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Deseleccionar
              </button>
              <button
                type="button"
                onClick={() => setIsModalMasivoOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-red-600/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar {seleccionados.size} Seleccionados</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Clients Table */}
      <div className="bg-[#121217] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#181822] text-[#8e8e93] uppercase font-bold text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSeleccionarTodos}
                    className="cursor-pointer text-zinc-400 hover:text-white"
                    title={seleccionados.size === clientesFiltrados.length ? "Deseleccionar todos" : "Seleccionar todos"}
                  >
                    {seleccionados.size > 0 && seleccionados.size === clientesFiltrados.length ? (
                      <CheckSquare className="w-4 h-4 text-[#ff6b00]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3">Socio / Cliente</th>
                <th className="py-3 px-3">DNI & Contacto</th>
                <th className="py-3 px-3">Módulo / Proceso</th>
                <th className="py-3 px-3">Sede</th>
                <th className="py-3 px-3">Estado / Alerta</th>
                <th className="py-3 px-3 text-right">Acciones de Baja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-500">
                    <Users className="w-8 h-8 mx-auto text-zinc-600 mb-2 opacity-50" />
                    <p className="font-bold text-sm text-zinc-400">No se encontraron clientes registrados</p>
                    <p className="text-xs text-zinc-600 mt-1">
                      {todosLosClientes.length === 0
                        ? "La base de datos está actualmente vacía. Podés ingestar un archivo CSV o dar de alta socios."
                        : "Probá ajustando los filtros de búsqueda o módulo."}
                    </p>
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((c) => {
                  const key = `${c.modulo}___${c.id}`;
                  const estaSeleccionado = seleccionados.has(key);

                  return (
                    <tr
                      key={key}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        estaSeleccionado ? "bg-red-500/[0.06]" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSeleccionarUno(c.modulo, c.id)}
                          className="cursor-pointer text-zinc-400 hover:text-white"
                        >
                          {estaSeleccionado ? (
                            <CheckSquare className="w-4 h-4 text-red-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Socio / Cliente */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {c.nombre.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">{c.nombre}</p>
                            <p className="text-[10px] text-zinc-500 font-mono truncate max-w-[160px]">
                              {c.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DNI & Contacto */}
                      <td className="py-3 px-3">
                        <p className="font-mono text-zinc-300 font-bold text-[11px]">{c.dni}</p>
                        <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-zinc-500" />
                          {c.telefono || "Sin teléfono"}
                        </p>
                      </td>

                      {/* Módulo / Proceso */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            c.modulo === "onboarding"
                              ? "bg-[#ff6b00]/15 text-[#ff6b00] border-[#ff6b00]/30"
                              : c.modulo === "sleepers"
                              ? "bg-red-500/15 text-red-300 border-red-500/30"
                              : c.modulo === "contratos"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                              : "bg-pink-500/15 text-pink-300 border-pink-500/30"
                          }`}
                        >
                          {c.modulo === "onboarding" && <Compass className="w-3 h-3" />}
                          {c.modulo === "sleepers" && <Flame className="w-3 h-3" />}
                          {c.modulo === "contratos" && <FileText className="w-3 h-3" />}
                          {c.modulo === "gift" && <Gift className="w-3 h-3" />}
                          <span>{c.moduloEtiqueta}</span>
                        </span>
                        <p className="text-[10px] text-zinc-400 mt-1 truncate max-w-[200px]">
                          {c.estadoOInfo}
                        </p>
                      </td>

                      {/* Sede */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="flex items-center gap-1 text-[11px] text-zinc-300">
                          <Building2 className="w-3 h-3 text-[#ff6b00]" />
                          Megatlon {c.sede}
                        </span>
                      </td>

                      {/* Estado / Alerta */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {c.alertaRoja ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            {c.riesgoOAlerta}
                          </span>
                        ) : (
                          <span className="text-[11px] text-zinc-400 font-medium">
                            {c.riesgoOAlerta || "Estable"}
                          </span>
                        )}
                      </td>

                      {/* Acciones de Baja */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.telefono && (
                            <button
                              type="button"
                              onClick={() =>
                                enviarWhatsApp(
                                  c.telefono,
                                  `Hola ${c.nombre.split(" ")[0]}, te contactamos desde Megatlon ${c.sede}.`,
                                  c.dni,
                                  c.nombre,
                                  c.modulo
                                )
                              }
                              title="Contactar por WhatsApp"
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 cursor-pointer transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Botón Eliminar Cliente Individual */}
                          <button
                            type="button"
                            onClick={() => setClienteAEliminar(c)}
                            title="Eliminar y dar de baja definitiva"
                            className="px-2.5 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Confirmación de Eliminación Individual */}
      {clienteAEliminar && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#121217] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Confirmar Baja de Cliente
                </h3>
                <p className="text-xs text-red-300">
                  Esta acción eliminará el registro de Google Cloud Firestore
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161f] border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Cliente:</span>
                <span className="font-bold text-white">{clienteAEliminar.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">DNI:</span>
                <span className="font-mono text-zinc-300">{clienteAEliminar.dni}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Módulo:</span>
                <span className="text-[#ff6b00] font-bold">{clienteAEliminar.moduloEtiqueta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Sede:</span>
                <span className="text-white">Megatlon {clienteAEliminar.sede}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              ¿Estás seguro de que querés eliminar definitivamente a este socio? Los datos y notas asociadas se removerán de la base de datos de inmediato.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={procesandoBaja}
                onClick={() => setClienteAEliminar(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={procesandoBaja}
                onClick={confirmarEliminarIndividual}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-red-600/30"
              >
                {procesandoBaja ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sí, Eliminar de la Base</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmación de Eliminación Masiva */}
      {isModalMasivoOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#121217] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Baja Masiva de Clientes
                </h3>
                <p className="text-xs text-red-300">
                  Operación destructiva sobre {seleccionados.size} registros
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-200 leading-relaxed">
              Estás a punto de eliminar <strong>{seleccionados.size} clientes</strong> seleccionados de Firestore.
              Esta acción dará de baja definitiva cada uno de los registros y quedará grabada en el registro de auditoría.
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={procesandoBaja}
                onClick={() => setIsModalMasivoOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={procesandoBaja}
                onClick={confirmarEliminarMasivo}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-red-600/30"
              >
                {procesandoBaja ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirmar Eliminación Masiva</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
