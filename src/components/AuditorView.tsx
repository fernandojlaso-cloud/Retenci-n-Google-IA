import React, { useState, useMemo } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { MiembroEquipo, PermisosUsuario, SEDES_MEGATLON } from "../types";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Users,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Sliders,
  Check,
  X,
  FileSpreadsheet,
  Lock,
  Unlock,
  KeyRound,
  History,
  Info
} from "lucide-react";

export const AuditorView: React.FC = () => {
  const {
    gerente,
    setGerente,
    actualizarPerfilGerente,
    equipo,
    aprobarGerentePorDirector,
    autorizarEquipoPorGerente,
    actualizarPermisosMiembro,
    agregarMiembroEquipo,
    eliminarMiembroEquipo,
    registrosAuditoria,
    registrarAccionAuditoria
  } = useMegatlon();

  const esDirector = gerente.rol === "director";

  // Pestañas internas del módulo auditor
  const [solapaAuditor, setSolapaAuditor] = useState<"jerarquia" | "matriz" | "bitacora">("jerarquia");

  // Filtros
  const [filtroSede, setFiltroSede] = useState<string>("todas");
  const [filtroRol, setFiltroRol] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");

  // Modal para agregar nuevo miembro
  const [isModalAltaOpen, setIsModalAltaOpen] = useState<boolean>(false);
  const [nuevoNombre, setNuevoNombre] = useState<string>("");
  const [nuevoApellido, setNuevoApellido] = useState<string>("");
  const [nuevoEmail, setNuevoEmail] = useState<string>("");
  const [nuevoTelefono, setNuevoTelefono] = useState<string>("");
  const [nuevaSede, setNuevaSede] = useState<string>(gerente.sede || "Almagro");
  const [nuevoRol, setNuevoRol] = useState<MiembroEquipo["rol"]>("coordinador");
  const [nuevoCargo, setNuevoCargo] = useState<string>("Coordinador de Fitness & Musculación");

  // Miembros filtrados
  const miembrosFiltrados = useMemo(() => {
    return equipo.filter((m) => {
      if (filtroSede !== "todas" && m.sede.toLowerCase() !== filtroSede.toLowerCase()) {
        return false;
      }
      if (filtroRol !== "todos" && m.rol !== filtroRol) {
        return false;
      }
      if (filtroEstado === "aprobados") {
        if (m.rol === "gerente" && !m.aprobadoPorDirector) return false;
        if (m.rol !== "gerente" && m.rol !== "director" && !m.autorizadoPorGerente) return false;
      }
      if (filtroEstado === "pendientes") {
        if (m.rol === "gerente" && m.aprobadoPorDirector) return false;
        if (m.rol !== "gerente" && m.rol !== "director" && m.autorizadoPorGerente) return false;
      }
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        const match =
          m.nombre.toLowerCase().includes(q) ||
          m.apellido.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.cargoEspecifico.toLowerCase().includes(q) ||
          m.sede.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [equipo, filtroSede, filtroRol, filtroEstado, busqueda]);

  // Agrupación por sedes para la jerarquía
  const sedesConEquipo = useMemo(() => {
    const map = new Map<string, { gerenteSede?: MiembroEquipo; equipoSede: MiembroEquipo[] }>();

    miembrosFiltrados.forEach((m) => {
      if (!map.has(m.sede)) {
        map.set(m.sede, { equipoSede: [] });
      }
      const entry = map.get(m.sede)!;
      if (m.rol === "gerente") {
        entry.gerenteSede = m;
      } else {
        entry.equipoSede.push(m);
      }
    });

    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [miembrosFiltrados]);

  // Métricas de auditoría
  const totalGerentes = equipo.filter((m) => m.rol === "gerente").length;
  const gerentesAprobados = equipo.filter((m) => m.rol === "gerente" && m.aprobadoPorDirector).length;
  const totalCoordinadores = equipo.filter((m) => m.rol === "coordinador" || m.rol === "supervisor").length;
  const coordinadoresAutorizados = equipo.filter(
    (m) => (m.rol === "coordinador" || m.rol === "supervisor") && m.autorizadoPorGerente
  ).length;

  // Manejar creación de nuevo colaborador
  const handleCrearMiembro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevoApellido.trim()) return;

    await agregarMiembroEquipo({
      nombre: nuevoNombre.trim(),
      apellido: nuevoApellido.trim(),
      email: nuevoEmail.trim() || `${nuevoNombre.toLowerCase()}.${nuevoApellido.toLowerCase()}@megatlon.com.ar`,
      telefono: nuevoTelefono.trim() || "+54 9 11 0000-0000",
      sede: nuevaSede,
      rol: nuevoRol,
      cargoEspecifico: nuevoCargo.trim() || (nuevoRol === "gerente" ? `Gerente de Sede ${nuevaSede}` : "Coordinador"),
      aprobadoPorDirector: nuevoRol === "director" ? true : false,
      estadoAprobacionDirector: nuevoRol === "gerente" ? "pendiente" : "aprobado",
      autorizadoPorGerente: false,
      estadoAutorizacionGerente: "pendiente",
      permisos: {
        admin_mensajes: nuevoRol === "director",
        aprobar_gerentes: nuevoRol === "director",
        autorizar_equipo: nuevoRol === "director" || nuevoRol === "gerente",
        enviar_masivo: nuevoRol === "director",
        enviar_individual: true,
        gestionar_alertas: true,
        ingestar_archivos: nuevoRol === "director",
        exportar_auditoria: nuevoRol === "director" || nuevoRol === "gerente"
      }
    });

    setNuevoNombre("");
    setNuevoApellido("");
    setNuevoEmail("");
    setNuevoTelefono("");
    setIsModalAltaOpen(false);
  };

  // Simular sesión como un usuario de equipo
  const handleSimularUsuario = (m: MiembroEquipo) => {
    actualizarPerfilGerente(m.nombre, m.apellido, m.sede, m.rol === "director" ? "director" : "gerente");
    registrarAccionAuditoria(
      "Simulación de Sesión de Usuario",
      "seguridad",
      `El usuario inició una sesión de prueba bajo el perfil de ${m.nombre} ${m.apellido} (${m.rol}) en Sede ${m.sede}.`,
      m.sede
    );
  };

  // Exportar auditoría de equipo a CSV
  const handleExportarCsv = () => {
    const headers = [
      "ID",
      "Nombre",
      "Apellido",
      "Email",
      "Telefono",
      "Sede",
      "Rol",
      "Cargo",
      "Aprobado_Por_Director",
      "Fecha_Aprobacion_Director",
      "Autorizado_Por_Gerente",
      "Fecha_Autorizacion_Gerente",
      "Permiso_Admin_Mensajes",
      "Permiso_Aprobar_Gerentes",
      "Permiso_Autorizar_Equipo",
      "Permiso_Enviar_Masivo",
      "Permiso_Enviar_Individual",
      "Permiso_Gestionar_Alertas",
      "Permiso_Ingestar_Archivos",
      "Permiso_Exportar_Auditoria"
    ];

    const rows = equipo.map((m) => [
      m.id,
      `"${m.nombre}"`,
      `"${m.apellido}"`,
      m.email,
      m.telefono || "",
      m.sede,
      m.rol,
      `"${m.cargoEspecifico}"`,
      m.aprobadoPorDirector ? "SI" : "NO",
      m.fechaAprobacionDirector || "",
      m.autorizadoPorGerente ? "SI" : "NO",
      m.fechaAutorizacionGerente || "",
      m.permisos.admin_mensajes ? "1" : "0",
      m.permisos.aprobar_gerentes ? "1" : "0",
      m.permisos.autorizar_equipo ? "1" : "0",
      m.permisos.enviar_masivo ? "1" : "0",
      m.permisos.enviar_individual ? "1" : "0",
      m.permisos.gestionar_alertas ? "1" : "0",
      m.permisos.ingestar_archivos ? "1" : "0",
      m.permisos.exportar_auditoria ? "1" : "0"
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `megatlon_auditoria_permisos_equipo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Auditor */}
      <div className="bg-[#121217] border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> MÓDULO AUDITOR & GOBERNANZA RBAC
            </span>
            <span className="text-[10px] font-semibold text-[#8e8e93]">
              Sesión actual: <strong className="text-white capitalize">{gerente.rol}</strong> ({gerente.nombre} {gerente.apellido})
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-['Outfit'] tracking-tight">
            AUDITORÍA DE EQUIPO & CADENA DE APROBACIÓN
          </h1>
          <p className="text-xs text-[#8e8e93] max-w-2xl leading-relaxed">
            Esquema jerárquico de gobernanza de 2 niveles: <strong>El Director aprueba al Gerente de Sede</strong>, y luego <strong>el Gerente de Sede autoriza a su equipo</strong> de coordinadores y supervisores con matriz granular de permisos.
          </p>
        </div>

        {/* Métricas de Gobernanza */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <div className="px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center min-w-[105px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8e8e93]">Gerentes</p>
            <p className="text-lg font-black text-white font-['Outfit']">
              {gerentesAprobados} <span className="text-xs font-normal text-[#8e8e93]">/ {totalGerentes}</span>
            </p>
            <span className="text-[9px] font-bold text-emerald-400">Aprobados Dir.</span>
          </div>

          <div className="px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center min-w-[105px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8e8e93]">Equipo Sede</p>
            <p className="text-lg font-black text-white font-['Outfit']">
              {coordinadoresAutorizados} <span className="text-xs font-normal text-[#8e8e93]">/ {totalCoordinadores}</span>
            </p>
            <span className="text-[9px] font-bold text-cyan-400">Autorizados Sede</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setIsModalAltaOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#ea580c] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6b00]/25 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Alta de Colaborador</span>
            </button>
            <button
              onClick={handleExportarCsv}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cadena de Aprobación Jerárquica: Diagrama visual */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 via-[#121217] to-emerald-950/20 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            1
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">NIVEL 1 DE GOBERNANZA</span>
            <p className="text-white font-bold">El Director General aprueba al Gerente de Sede</p>
            <p className="text-[#8e8e93] text-[11px]">Habilita la representación legal y facultades ejecutivas de la sucursal.</p>
          </div>
        </div>

        <ArrowRight className="w-5 h-5 text-[#8e8e93] hidden md:block" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            2
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">NIVEL 2 DE GOBERNANZA</span>
            <p className="text-white font-bold">El Gerente de Sede autoriza a su Equipo Local</p>
            <p className="text-[#8e8e93] text-[11px]">Autoriza a coordinadores de fitness, técnicas y front desk con permisos puntuales.</p>
          </div>
        </div>

        <div className="pl-4 md:border-l border-white/10">
          <button
            onClick={() => actualizarPerfilGerente(gerente.nombre, gerente.apellido, gerente.sede, esDirector ? "gerente" : "director")}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Alternar Rol: {esDirector ? "Pasar a Gerente" : "Pasar a Director"}</span>
          </button>
        </div>
      </div>

      {/* Navegación Interna del Auditor */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSolapaAuditor("jerarquia")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              solapaAuditor === "jerarquia"
                ? "bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25"
                : "text-[#8e8e93] hover:text-white hover:bg-white/5"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Jerarquía por Sedes</span>
          </button>

          <button
            onClick={() => setSolapaAuditor("matriz")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              solapaAuditor === "matriz"
                ? "bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25"
                : "text-[#8e8e93] hover:text-white hover:bg-white/5"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Matriz de Permisos Detallada</span>
          </button>

          <button
            onClick={() => setSolapaAuditor("bitacora")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              solapaAuditor === "bitacora"
                ? "bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25"
                : "text-[#8e8e93] hover:text-white hover:bg-white/5"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Bitácora de Auditoría Inmutable ({registrosAuditoria.length})</span>
          </button>
        </div>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[#8e8e93] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-[#1c1c24] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
            />
          </div>

          <select
            value={filtroSede}
            onChange={(e) => setFiltroSede(e.target.value)}
            className="bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer"
          >
            <option value="todas">🌐 Todas las Sedes (28 Oficiales)</option>
            {SEDES_MEGATLON.map((s) => (
              <option key={s} value={s}>
                Megatlon {s}
              </option>
            ))}
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer"
          >
            <option value="todos">Todos los Estados</option>
            <option value="aprobados">✓ Aprobados / Autorizados</option>
            <option value="pendientes">⏳ Pendientes de Validación</option>
          </select>
        </div>
      </div>

      {/* SOLAPA 1: Jerarquía por Sedes (Director -> Gerente de Sede -> Equipo) */}
      {solapaAuditor === "jerarquia" && (
        <div className="space-y-6">
          {sedesConEquipo.length === 0 ? (
            <div className="p-12 text-center bg-[#121217] rounded-3xl border border-white/10 text-[#8e8e93]">
              No se encontraron registros de colaboradores para los filtros seleccionados.
            </div>
          ) : (
            sedesConEquipo.map(([nombreSede, { gerenteSede, equipoSede }]) => (
              <div
                key={nombreSede}
                className="bg-[#121217] border border-white/10 rounded-3xl p-6 space-y-4 shadow-lg hover:border-white/20 transition-all"
              >
                {/* Header de la Sede */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white">
                      <Building2 className="w-5 h-5 text-[#ff6b00]" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white font-['Outfit']">
                        Sucursal Megatlon {nombreSede}
                      </h2>
                      <p className="text-[11px] text-[#8e8e93]">
                        {equipoSede.length + (gerenteSede ? 1 : 0)} colaboradores registrados
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {gerenteSede?.aprobadoPorDirector ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" /> Gerencia Oficial Habilitada
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3" /> Gerencia Pendiente de Aprobación
                      </span>
                    )}
                  </div>
                </div>

                {/* NIVEL 1: Gerente de Sede (Aprobado por el Director) */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Nivel 1 • Gerente de Sucursal
                    </span>
                    <span className="text-[10px] text-[#8e8e93]">
                      Requiere Aprobación Exclusiva de Dirección General
                    </span>
                  </div>

                  {gerenteSede ? (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-sm">
                          {gerenteSede.nombre.charAt(0)}{gerenteSede.apellido.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-white font-['Outfit']">
                              {gerenteSede.nombre} {gerenteSede.apellido}
                            </h3>
                            <span className="text-[10px] px-2 py-0.2 rounded-md bg-white/10 text-zinc-300 font-semibold">
                              {gerenteSede.cargoEspecifico}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#8e8e93]">
                            {gerenteSede.email} • Tel: {gerenteSede.telefono || "11-XXXX-XXXX"}
                          </p>
                          <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-2">
                            {gerenteSede.aprobadoPorDirector ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                ✓ Aprobado por Director: {gerenteSede.directorAprobadorNombre || "Dirección General"} ({gerenteSede.fechaAprobacionDirector || "Oficial"})
                              </span>
                            ) : (
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                ⏳ Pendiente de visado del Director General
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción del Gerente de Sede */}
                      <div className="flex flex-wrap items-center gap-2">
                        {esDirector ? (
                          gerenteSede.aprobadoPorDirector ? (
                            <button
                              onClick={() => aprobarGerentePorDirector(gerenteSede.id, false)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
                            >
                              Suspender Aprobación
                            </button>
                          ) : (
                            <button
                              onClick={() => aprobarGerentePorDirector(gerenteSede.id, true)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/25"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Aprobar Gerente de Sede</span>
                            </button>
                          )
                        ) : (
                          <span className="text-[11px] text-[#8e8e93] italic">
                            Solo el Director puede modificar la aprobación
                          </span>
                        )}

                        <button
                          onClick={() => handleSimularUsuario(gerenteSede)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
                        >
                          Simular Perfil
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-[#8e8e93] flex items-center justify-between">
                      <span>No hay un Gerente de Sede formalmente asignado para {nombreSede}.</span>
                      <button
                        onClick={() => {
                          setNuevaSede(nombreSede);
                          setNuevoRol("gerente");
                          setNuevoCargo(`Gerente de Sede ${nombreSede}`);
                          setIsModalAltaOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all cursor-pointer"
                      >
                        + Designar Gerente
                      </button>
                    </div>
                  )}
                </div>

                {/* NIVEL 2: Equipo de la Sede (Autorizado por el Gerente de Sede) */}
                <div className="pl-4 md:pl-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Nivel 2 • Equipo de Coordinación & Front Desk ({equipoSede.length})
                    </span>
                    <span className="text-[10px] text-[#8e8e93]">
                      Autorizado por el Gerente de Sede {nombreSede}
                    </span>
                  </div>

                  {equipoSede.length === 0 ? (
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-xs text-[#8e8e93] flex items-center justify-between">
                      <span>No hay coordinadores o supervisores registrados para el equipo de {nombreSede}.</span>
                      <button
                        onClick={() => {
                          setNuevaSede(nombreSede);
                          setNuevoRol("coordinador");
                          setIsModalAltaOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all cursor-pointer"
                      >
                        + Agregar Miembro
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {equipoSede.map((colaborador) => {
                        const puedeAutorizarEsteEquipo =
                          esDirector || (gerente.rol === "gerente" && gerente.sede === nombreSede);

                        return (
                          <div
                            key={colaborador.id}
                            className="p-3.5 rounded-2xl bg-white/[0.015] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/[0.03] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300 text-xs">
                                {colaborador.nombre.charAt(0)}{colaborador.apellido.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-black text-white font-['Outfit']">
                                    {colaborador.nombre} {colaborador.apellido}
                                  </h4>
                                  <span className="text-[10px] px-2 py-0.2 rounded-md bg-white/10 text-zinc-300">
                                    {colaborador.cargoEspecifico}
                                  </span>
                                </div>
                                <p className="text-[10px] text-[#8e8e93]">
                                  {colaborador.email} • {colaborador.telefono}
                                </p>
                                <div className="text-[9px] mt-0.5">
                                  {colaborador.autorizadoPorGerente ? (
                                    <span className="text-emerald-400 font-semibold">
                                      ✓ Autorizado por Gerente de Sede ({colaborador.gerenteAutorizadorNombre || "Sede Almagro"})
                                    </span>
                                  ) : (
                                    <span className="text-amber-400 font-semibold">
                                      ⏳ Pendiente de autorización del Gerente de Sede
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Acciones de Autorización por Gerente */}
                            <div className="flex flex-wrap items-center gap-2">
                              {puedeAutorizarEsteEquipo ? (
                                colaborador.autorizadoPorGerente ? (
                                  <button
                                    onClick={() => autorizarEquipoPorGerente(colaborador.id, false)}
                                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 text-[11px] font-semibold transition-all cursor-pointer"
                                  >
                                    Revocar Autorización
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => autorizarEquipoPorGerente(colaborador.id, true)}
                                    className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-cyan-600/20"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Autorizar Equipo</span>
                                  </button>
                                )
                              ) : (
                                <span className="text-[10px] text-[#8e8e93] italic">
                                  Solo Gerente de {nombreSede} o Director
                                </span>
                              )}

                              <button
                                onClick={() => handleSimularUsuario(colaborador)}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[11px] font-semibold transition-all cursor-pointer"
                              >
                                Probar Sesión
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SOLAPA 2: Matriz de Permisos Detallada por Miembro */}
      {solapaAuditor === "matriz" && (
        <div className="bg-[#121217] border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-white font-['Outfit']">
                MATRIZ DE PERMISOS OPERATIVOS POR ROL Y USUARIO
              </h2>
              <p className="text-xs text-[#8e8e93]">
                Hacé clic en cualquier casilla para activar o desactivar un permiso específico. Los cambios se asientan de inmediato en la bitácora de auditoría.
              </p>
            </div>
            <div className="text-xs text-[#8e8e93]">
              Mostrando <strong className="text-white">{miembrosFiltrados.length} miembros</strong>
            </div>
          </div>

          <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0c0c0f]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#16161d] text-[#8e8e93] text-[10px] uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3 font-bold">Colaborador / Sede</th>
                    <th className="p-3 font-bold text-center">Rol</th>
                    <th className="p-3 font-bold text-center text-amber-400">Admin Mensajes (Solo Dir)</th>
                    <th className="p-3 font-bold text-center text-amber-400">Aprobar Gerentes</th>
                    <th className="p-3 font-bold text-center text-emerald-400">Autorizar Equipo</th>
                    <th className="p-3 font-bold text-center">Envío Masivo</th>
                    <th className="p-3 font-bold text-center">WhatsApp 1a1</th>
                    <th className="p-3 font-bold text-center">Alertas Rojas</th>
                    <th className="p-3 font-bold text-center">Ingesta CSV</th>
                    <th className="p-3 font-bold text-center">Exportar CSV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {miembrosFiltrados.map((m) => {
                    const puedeEditarEsteMiembro =
                      esDirector || (gerente.rol === "gerente" && gerente.sede === m.sede && m.rol !== "gerente");

                    return (
                      <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">{m.nombre} {m.apellido}</div>
                          <div className="text-[10px] text-[#8e8e93]">
                            Megatlon {m.sede} • {m.cargoEspecifico}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              m.rol === "director"
                                ? "bg-amber-500/10 text-amber-300 border-amber-500/25"
                                : m.rol === "gerente"
                                ? "bg-blue-500/10 text-blue-300 border-blue-500/25"
                                : "bg-cyan-500/10 text-cyan-300 border-cyan-500/25"
                            }`}
                          >
                            {m.rol}
                          </span>
                        </td>

                        {/* Permiso 1: Admin Mensajes */}
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            disabled={!esDirector}
                            checked={m.permisos.admin_mensajes}
                            onChange={(e) =>
                              actualizarPermisosMiembro(m.id, { admin_mensajes: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] bg-[#1c1c24] border-white/20 cursor-pointer disabled:opacity-40"
                          />
                        </td>

                        {/* Permiso 2: Aprobar Gerentes */}
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            disabled={!esDirector}
                            checked={m.permisos.aprobar_gerentes}
                            onChange={(e) =>
                              actualizarPermisosMiembro(m.id, { aprobar_gerentes: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] bg-[#1c1c24] border-white/20 cursor-pointer disabled:opacity-40"
                          />
                        </td>

                        {/* Permiso 3: Autorizar Equipo */}
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            disabled={!esDirector}
                            checked={m.permisos.autorizar_equipo}
                            onChange={(e) =>
                              actualizarPermisosMiembro(m.id, { autorizar_equipo: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] bg-[#1c1c24] border-white/20 cursor-pointer disabled:opacity-40"
                          />
                        </td>

                        {/* Permiso 4: Enviar Masivo */}
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            disabled={!puedeEditarEsteMiembro}
                            checked={m.permisos.enviar_masivo}
                            onChange={(e) =>
                              actualizarPermisosMiembro(m.id, { enviar_masivo: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] bg-[#1c1c24] border-white/20 cursor-pointer disabled:opacity-40"
                          />
                        </td>

                        {/* Permiso 5: Enviar Individual */}
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            disabled={!puedeEditarEsteMiembro}
                            checked={m.permisos.enviar_individual}
                            onChange={(e) =>
                              actualizarPermisosMiembro(m.id, { enviar_individual: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] bg-[#1c1c24] border-white/20 cursor-pointer disabled:opacity-40"
                          />
                        </td>

                        {/* Permiso 6: Gestionar Alertas */}
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            disabled={!puedeEditarEsteMiembro}
                            checked={m.permisos.gestionar_alertas}
                            onChange={(e) =>
                              actualizarPermisosMiembro(m.id, { gestionar_alertas: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] bg-[#1c1c24] border-white/20 cursor-pointer disabled:opacity-40"
                          />
                        </td>

                        {/* Permiso 7: Ingestar CSV */}
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            disabled={!esDirector}
                            checked={m.permisos.ingestar_archivos}
                            onChange={(e) =>
                              actualizarPermisosMiembro(m.id, { ingestar_archivos: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] bg-[#1c1c24] border-white/20 cursor-pointer disabled:opacity-40"
                          />
                        </td>

                        {/* Permiso 8: Exportar Auditoría */}
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            disabled={!puedeEditarEsteMiembro}
                            checked={m.permisos.exportar_auditoria}
                            onChange={(e) =>
                              actualizarPermisosMiembro(m.id, { exportar_auditoria: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] bg-[#1c1c24] border-white/20 cursor-pointer disabled:opacity-40"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SOLAPA 3: Bitácora de Auditoría Inmutable */}
      {solapaAuditor === "bitacora" && (
        <div className="bg-[#121217] border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-white font-['Outfit']">
                BITÁCORA DE AUDITORÍA & LOGS INMUTABLES
              </h2>
              <p className="text-xs text-[#8e8e93]">
                Registro cronológico detallado de aprobaciones de directores, autorizaciones de gerentes y modificaciones de mensajes de segmento.
              </p>
            </div>
            <span className="text-xs text-[#8e8e93]">
              {registrosAuditoria.length} eventos auditados
            </span>
          </div>

          <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0c0c0f]">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#16161d] text-[#8e8e93] text-[10px] uppercase tracking-wider sticky top-0 border-b border-white/10">
                  <tr>
                    <th className="p-3 font-bold">Fecha / Hora</th>
                    <th className="p-3 font-bold">Usuario Ejecutor</th>
                    <th className="p-3 font-bold">Acción Realizada</th>
                    <th className="p-3 font-bold">Categoría</th>
                    <th className="p-3 font-bold">Detalle Operativo</th>
                    <th className="p-3 font-bold">Sede</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registrosAuditoria.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 text-[#8e8e93] font-mono text-[11px] whitespace-nowrap">
                        {log.fecha}
                      </td>
                      <td className="p-3 font-medium text-white whitespace-nowrap">
                        <div className="font-bold">{log.usuarioNombre}</div>
                        <div className="text-[10px] text-[#8e8e93] capitalize">{log.usuarioRol}</div>
                      </td>
                      <td className="p-3 font-semibold text-white">
                        {log.accion}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            log.categoria === "aprobacion_gerente"
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/25"
                              : log.categoria === "autorizacion_equipo"
                              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/25"
                              : log.categoria === "mensajes_segmento"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                              : "bg-white/10 text-zinc-300 border-white/10"
                          }`}
                        >
                          {log.categoria.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-300 leading-relaxed text-[11px]">
                        {log.detalles}
                      </td>
                      <td className="p-3 text-zinc-400 text-[11px] whitespace-nowrap">
                        {log.sede || "General"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Agregar Nuevo Miembro de Equipo */}
      {isModalAltaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121217] border border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-[#ff6b00]" />
                <h3 className="text-base font-black font-['Outfit']">
                  Alta de Colaborador o Gerente
                </h3>
              </div>
              <button
                onClick={() => setIsModalAltaOpen(false)}
                className="text-[#8e8e93] hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearMiembro} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8e8e93] mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    placeholder="Ej. Lucas"
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#8e8e93] mb-1">Apellido</label>
                  <input
                    type="text"
                    required
                    value={nuevoApellido}
                    onChange={(e) => setNuevoApellido(e.target.value)}
                    placeholder="Ej. San Román"
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8e8e93] mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={nuevoTelefono}
                    onChange={(e) => setNuevoTelefono(e.target.value)}
                    placeholder="+54 9 11 5000-0000"
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#8e8e93] mb-1">Email</label>
                  <input
                    type="email"
                    value={nuevoEmail}
                    onChange={(e) => setNuevoEmail(e.target.value)}
                    placeholder="colaborador@megatlon.com.ar"
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8e8e93] mb-1">Sucursal Asignada</label>
                  <select
                    value={nuevaSede}
                    onChange={(e) => setNuevaSede(e.target.value)}
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer"
                  >
                    {SEDES_MEGATLON.map((s) => (
                      <option key={s} value={s}>
                        Megatlon {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#8e8e93] mb-1">Rol Operativo</label>
                  <select
                    value={nuevoRol}
                    onChange={(e) => setNuevoRol(e.target.value as any)}
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer"
                  >
                    <option value="coordinador">Coordinador de Sede</option>
                    <option value="supervisor">Supervisor Front Desk</option>
                    <option value="gerente">Gerente de Sede (Requiere Aprobación Dir)</option>
                    {esDirector && <option value="director">Director General</option>}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8e8e93] mb-1">Cargo Específico</label>
                <input
                  type="text"
                  value={nuevoCargo}
                  onChange={(e) => setNuevoCargo(e.target.value)}
                  placeholder="Ej. Coordinador de Musculación & Fitness"
                  className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff6b00]"
                />
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px] text-[#8e8e93]">
                {nuevoRol === "gerente" ? (
                  <p>
                    ⚠️ Al ingresar como <strong>Gerente de Sede</strong>, quedará en estado <em>Pendiente de Aprobación</em> hasta que el Director General valide sus credenciales.
                  </p>
                ) : (
                  <p>
                    ℹ️ Como <strong>{nuevoRol}</strong>, su habilitación operativa dependerá de la autorización del Gerente de Sede {nuevaSede}.
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalAltaOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ff6b00] hover:bg-[#ea580c] text-white font-bold transition-all shadow-md shadow-[#ff6b00]/25 cursor-pointer"
                >
                  Guardar y Dar de Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
