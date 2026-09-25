import React, { useState, useMemo } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { ConfigMensajeSegmento, SEDES_MEGATLON } from "../types";
import {
  MessageSquareText,
  ShieldAlert,
  ShieldCheck,
  Save,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  Clock,
  ArrowRight,
  Eye,
  Check,
  X,
  FileText,
  UserCheck
} from "lucide-react";

export const AdminMensajesView: React.FC = () => {
  const {
    gerente,
    actualizarPerfilGerente,
    configMensajesSegmentos,
    actualizarMensajeSegmento,
    aplicarMensajeAClientesSeleccionados,
    restaurarMensajesOficiales,
    contratos,
    casos,
    onboardings,
    gifts,
  } = useMegatlon();

  const esDirector = gerente.rol === "director";

  // Categoría activa de mensajes
  const [categoriaActiva, setCategoriaActiva] = useState<"contratos" | "sleepers" | "onboarding" | "gift">("contratos");
  
  // Segmento seleccionado dentro de la categoría
  const segmentosCategoria = useMemo(() => {
    return configMensajesSegmentos.filter((s) => s.categoria === categoriaActiva);
  }, [configMensajesSegmentos, categoriaActiva]);

  const [segmentoSeleccionadoId, setSegmentoSeleccionadoId] = useState<string>(
    segmentosCategoria[0]?.id || "cfg-cnt-grupo-a"
  );

  // Asegurar que al cambiar de categoría se seleccione el primer segmento válido
  const segmentoActual: ConfigMensajeSegmento = useMemo(() => {
    const found = configMensajesSegmentos.find((s) => s.id === segmentoSeleccionadoId);
    if (found && found.categoria === categoriaActiva) return found;
    return segmentosCategoria[0] || configMensajesSegmentos[0];
  }, [configMensajesSegmentos, segmentoSeleccionadoId, categoriaActiva, segmentosCategoria]);

  // Estado del editor
  const [mensajeEditado, setMensajeEditado] = useState<string>(segmentoActual?.mensaje || "");
  const [asuntoEditado, setAsuntoEditado] = useState<string>(segmentoActual?.asunto || "");
  const [guardadoExito, setGuardadoExito] = useState<boolean>(false);
  const [copiadoExito, setCopiadoExito] = useState<boolean>(false);

  // Sincronizar editor cuando cambia el segmento seleccionado
  React.useEffect(() => {
    if (segmentoActual) {
      setMensajeEditado(segmentoActual.mensaje);
      setAsuntoEditado(segmentoActual.asunto);
      setGuardadoExito(false);
    }
  }, [segmentoActual.id]);

  // Filtros para la selección de clientes
  const [filtroSedeClientes, setFiltroSedeClientes] = useState<string>("todas");
  const [busquedaCliente, setBusquedaCliente] = useState<string>("");
  const [sociosSeleccionadosDni, setSociosSeleccionadosDni] = useState<string[]>([]);
  const [mostrarModalEnvio, setMostrarModalEnvio] = useState<boolean>(false);
  const [resultadoEnvio, setResultadoEnvio] = useState<{ count: number; socios: any[] } | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Clientes pertenecientes al segmento actual
  const clientesDelSegmento = useMemo(() => {
    let rawList: Array<{
      dni: string;
      nombre: string;
      telefono?: string;
      email?: string;
      sede: string;
      metricaClave: string;
      riesgo: string;
      estado: string;
      ultimoContacto?: string;
      modulo: "onboarding" | "sleepers" | "contratos" | "gift";
    }> = [];

    switch (segmentoActual.clave) {
      // --- CONTRATOS (9 CASOS OFICIALES) ---
      case "cnt_caso_1_baja_detractor":
        rawList = contratos
          .filter((c) => ((c.accesos_mes ?? 0) <= 4 || c.grupo_acceso === "GRUPO C") && ((c.nps_score ?? 10) <= 6 || c.categoria_nps === "Detractor"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Baja Asistencia (${c.accesos_mes ?? 2} acc) + Detractor (${c.nps_score ?? 4}/10)`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      case "cnt_caso_2_baja_pasivo":
        rawList = contratos
          .filter((c) => ((c.accesos_mes ?? 0) <= 4 || c.grupo_acceso === "GRUPO C") && ((c.nps_score === 7 || c.nps_score === 8) || c.categoria_nps === "Pasivo"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Baja Asistencia (${c.accesos_mes ?? 3} acc) + Pasivo (${c.nps_score ?? 7}/10)`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      case "cnt_caso_3_media_detractor":
        rawList = contratos
          .filter((c) => (((c.accesos_mes ?? 0) >= 5 && (c.accesos_mes ?? 0) <= 11) || c.grupo_acceso === "GRUPO B") && ((c.nps_score ?? 10) <= 6 || c.categoria_nps === "Detractor"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Media Asistencia (${c.accesos_mes ?? 8} acc) + Detractor (${c.nps_score ?? 5}/10)`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      case "cnt_caso_4_baja_promotor":
        rawList = contratos
          .filter((c) => ((c.accesos_mes ?? 0) <= 4 || c.grupo_acceso === "GRUPO C") && ((c.nps_score ?? 0) >= 9 || c.categoria_nps === "Promotor"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Baja Asistencia (${c.accesos_mes ?? 3} acc) + Promotor (${c.nps_score ?? 10}/10)`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      case "cnt_caso_5_media_pasivo":
        rawList = contratos
          .filter((c) => (((c.accesos_mes ?? 0) >= 5 && (c.accesos_mes ?? 0) <= 11) || c.grupo_acceso === "GRUPO B") && ((c.nps_score === 7 || c.nps_score === 8) || c.categoria_nps === "Pasivo"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Media Asistencia (${c.accesos_mes ?? 8} acc) + Pasivo (${c.nps_score ?? 7}/10)`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      case "cnt_caso_6_alta_detractor":
        rawList = contratos
          .filter((c) => ((c.accesos_mes ?? 0) >= 12 || c.grupo_acceso === "GRUPO A") && ((c.nps_score ?? 10) <= 6 || c.categoria_nps === "Detractor"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Alta Asistencia (${c.accesos_mes ?? 14} acc) + Detractor (${c.nps_score ?? 5}/10)`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      case "cnt_caso_7_media_promotor":
        rawList = contratos
          .filter((c) => (((c.accesos_mes ?? 0) >= 5 && (c.accesos_mes ?? 0) <= 11) || c.grupo_acceso === "GRUPO B") && ((c.nps_score ?? 0) >= 9 || c.categoria_nps === "Promotor"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Media Asistencia (${c.accesos_mes ?? 8} acc) + Promotor (${c.nps_score ?? 9}/10)`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      case "cnt_caso_8_alta_pasivo":
        rawList = contratos
          .filter((c) => ((c.accesos_mes ?? 0) >= 12 || c.grupo_acceso === "GRUPO A") && ((c.nps_score === 7 || c.nps_score === 8) || c.categoria_nps === "Pasivo"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Alta Asistencia (${c.accesos_mes ?? 15} acc) + Pasivo (${c.nps_score ?? 8}/10)`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      case "cnt_caso_9_alta_promotor":
      case "cnt_grupo_a":
        rawList = contratos
          .filter((c) => ((c.accesos_mes ?? 0) >= 12 || c.grupo_acceso === "GRUPO A") && ((c.nps_score ?? 0) >= 9 || c.categoria_nps === "Promotor"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Alta Asistencia (${c.accesos_mes ?? 16} acc) + Promotor VIP`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      case "cnt_caso_10_baja_sinnps":
        rawList = contratos
          .filter((c) => ((c.accesos_mes ?? 0) <= 4 || c.grupo_acceso === "GRUPO C") && (c.nps_score === null || c.nps_score === undefined || !c.categoria_nps || c.categoria_nps === "Sin calificar"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Baja Asistencia (${c.accesos_mes ?? 2} acc) • Sin NPS`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      case "cnt_caso_11_media_sinnps":
        rawList = contratos
          .filter((c) => (((c.accesos_mes ?? 0) >= 5 && (c.accesos_mes ?? 0) <= 11) || c.grupo_acceso === "GRUPO B") && (c.nps_score === null || c.nps_score === undefined || !c.categoria_nps || c.categoria_nps === "Sin calificar"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Media Asistencia (${c.accesos_mes ?? 7} acc) • Sin NPS`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      case "cnt_caso_12_alta_sinnps":
        rawList = contratos
          .filter((c) => ((c.accesos_mes ?? 0) >= 12 || c.grupo_acceso === "GRUPO A") && (c.nps_score === null || c.nps_score === undefined || !c.categoria_nps || c.categoria_nps === "Sin calificar"))
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `Alta Asistencia (${c.accesos_mes ?? 15} acc) • Sin NPS`,
            riesgo: c.riesgo_baja,
            estado: c.estado,
            ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
            modulo: "contratos",
          }));
        break;

      // --- SLEEPERS ---
      case "slp_primer_contacto":
        rawList = casos
          .filter((c) => c.dias_sin_asistir >= 15)
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `${c.dias_sin_asistir} días inactivo (1° Contacto)`,
            riesgo: c.riesgo,
            estado: c.estado,
            ultimoContacto: c.fecha_envio_mensaje || "Pendiente 1° mensaje",
            modulo: "sleepers",
          }));
        break;

      case "slp_segundo_contacto":
        rawList = casos
          .filter((c) => c.riesgo === "Alto" || c.dias_sin_asistir >= 30)
          .map((c) => ({
            dni: c.dni,
            nombre: c.nombre,
            telefono: c.telefono,
            email: c.email,
            sede: c.sede,
            metricaClave: `${c.dias_sin_asistir} días inactivo (2° Mensaje)`,
            riesgo: c.riesgo,
            estado: c.estado,
            ultimoContacto: c.fecha_seguimiento || "2° mensaje requerido",
            modulo: "sleepers",
          }));
        break;

      // --- ONBOARDING ---
      case "onb_hito1_diagnostico":
      case "onb_hito1":
        rawList = onboardings
          .filter((o) => o.hito_actual === "Hito 1")
          .map((o) => ({
            dni: o.dni,
            nombre: o.nombre,
            telefono: o.telefono,
            email: o.email,
            sede: o.sede,
            metricaClave: `Hito 1 (${o.dias_desde_alta}d desde alta)`,
            riesgo: o.alerta_roja ? "Alto" : "Bajo",
            estado: o.hito1_completado ? "Completado" : "Pendiente",
            ultimoContacto: o.ultimo_contacto || "Bienvenida pendiente",
            modulo: "onboarding",
          }));
        break;

      case "onb_hito2_adaptacion":
        rawList = onboardings
          .filter((o) => o.hito_actual === "Hito 2" && !o.alerta_roja && o.hito2_satisfaccion !== "Fricción")
          .map((o) => ({
            dni: o.dni,
            nombre: o.nombre,
            telefono: o.telefono,
            email: o.email,
            sede: o.sede,
            metricaClave: `Hito 2 (Día 4-5 Adaptación)`,
            riesgo: "Bajo",
            estado: o.hito2_completado ? "Completado" : "Pendiente",
            ultimoContacto: o.ultimo_contacto || "Chequeo pendiente",
            modulo: "onboarding",
          }));
        break;

      case "onb_hito2_friccion":
        rawList = onboardings
          .filter((o) => o.hito_actual === "Hito 2" && (o.alerta_roja || o.hito2_satisfaccion === "Fricción"))
          .map((o) => ({
            dni: o.dni,
            nombre: o.nombre,
            telefono: o.telefono,
            email: o.email,
            sede: o.sede,
            metricaClave: `Hito 2 (Alerta Temprana / Fricción)`,
            riesgo: "Alto",
            estado: "Urgente",
            ultimoContacto: o.ultimo_contacto || "Sin contacto",
            modulo: "onboarding",
          }));
        break;

      case "onb_hito3_regular":
        rawList = onboardings
          .filter((o) => o.hito_actual === "Hito 3" && o.hito3_frecuencia_ok !== false)
          .map((o) => ({
            dni: o.dni,
            nombre: o.nombre,
            telefono: o.telefono,
            email: o.email,
            sede: o.sede,
            metricaClave: `Hito 3 (Consolidación Regular)`,
            riesgo: "Bajo",
            estado: o.hito3_completado ? "Completado" : "Pendiente",
            ultimoContacto: o.ultimo_contacto || "Ajuste pendiente",
            modulo: "onboarding",
          }));
        break;

      case "onb_hito3_baja_frecuencia":
      case "onb_hito3_baja":
        rawList = onboardings
          .filter((o) => o.hito_actual === "Hito 3" && o.hito3_frecuencia_ok === false)
          .map((o) => ({
            dni: o.dni,
            nombre: o.nombre,
            telefono: o.telefono,
            email: o.email,
            sede: o.sede,
            metricaClave: `Hito 3 (Baja Frecuencia / Rescate)`,
            riesgo: "Medio",
            estado: "Pendiente",
            ultimoContacto: o.ultimo_contacto || "Sin contacto",
            modulo: "onboarding",
          }));
        break;

      case "onb_hito4_fidelizado":
        rawList = onboardings
          .filter((o) => (o.hito_actual === "Hito 4" || o.hito_actual === "Completado") && !o.alerta_roja)
          .map((o) => ({
            dni: o.dni,
            nombre: o.nombre,
            telefono: o.telefono,
            email: o.email,
            sede: o.sede,
            metricaClave: `Hito 4 (Cierre Positivo Mes 1)`,
            riesgo: "Bajo",
            estado: "Fidelizado",
            ultimoContacto: o.ultimo_contacto || "Premio pendiente",
            modulo: "onboarding",
          }));
        break;

      case "onb_hito4_alerta_roja":
      case "onb_alerta_roja":
        rawList = onboardings
          .filter((o) => o.alerta_roja && !o.tarea_resuelta)
          .map((o) => ({
            dni: o.dni,
            nombre: o.nombre,
            telefono: o.telefono,
            email: o.email,
            sede: o.sede,
            metricaClave: `🚨 Alerta Roja (${o.alerta_motivo || "Inasistencia"})`,
            riesgo: "Alto",
            estado: "Urgente",
            ultimoContacto: o.ultimo_contacto || "Sin contacto",
            modulo: "onboarding",
          }));
        break;

      case "gft_bienvenida":
        rawList = gifts
          .filter((g) => g.vino_a_probar !== "Si")
          .map((g) => ({
            dni: `GFT-${g.id}`,
            nombre: g.nombre,
            telefono: g.telefono,
            email: g.email,
            sede: g.sede,
            metricaClave: `Referido por ${g.referido_por || "Socio"}`,
            riesgo: "Medio",
            estado: "Pendiente Visita",
            ultimoContacto: g.fecha_envio_1 || "Invitación inicial",
            modulo: "gift",
          }));
        break;

      default:
        rawList = contratos.slice(0, 10).map((c) => ({
          dni: c.dni,
          nombre: c.nombre,
          telefono: c.telefono,
          email: c.email,
          sede: c.sede,
          metricaClave: `Accesos: ${c.accesos_mes ?? 8}`,
          riesgo: c.riesgo_baja,
          estado: c.estado,
          ultimoContacto: c.fecha_ultimo_contacto || "Sin contacto",
          modulo: "contratos",
        }));
    }

    // Filtrar por sede si aplica
    if (filtroSedeClientes !== "todas") {
      rawList = rawList.filter((c) => c.sede.toLowerCase() === filtroSedeClientes.toLowerCase());
    }

    // Filtrar por búsqueda
    if (busquedaCliente.trim()) {
      const q = busquedaCliente.toLowerCase();
      rawList = rawList.filter(
        (c) => c.nombre.toLowerCase().includes(q) || c.dni.toLowerCase().includes(q)
      );
    }

    return rawList;
  }, [segmentoActual.clave, contratos, casos, onboardings, gifts, filtroSedeClientes, busquedaCliente]);

  // Manejar selección individual / masiva
  const handleToggleSeleccionSocio = (dni: string) => {
    setSociosSeleccionadosDni((prev) =>
      prev.includes(dni) ? prev.filter((d) => d !== dni) : [...prev, dni]
    );
  };

  const handleSeleccionarTodos = () => {
    if (sociosSeleccionadosDni.length === clientesDelSegmento.length) {
      setSociosSeleccionadosDni([]);
    } else {
      setSociosSeleccionadosDni(clientesDelSegmento.map((c) => c.dni));
    }
  };

  // Guardar como plantilla predeterminada del segmento
  const handleGuardarPlantillaOficial = async () => {
    await actualizarMensajeSegmento(segmentoActual.id, mensajeEditado, asuntoEditado);
    setGuardadoExito(true);
    setTimeout(() => setGuardadoExito(false), 3000);
  };

  // Insertar variable dinámica en el editor
  const handleInsertarVariable = (variable: string) => {
    setMensajeEditado((prev) => prev + " " + variable);
  };

  // Ejecutar aplicación y envío a socios seleccionados
  const handleEjecutarEnvioASeleccion = async () => {
    if (sociosSeleccionadosDni.length === 0) return;
    setIsSending(true);

    const sociosAEnviar = clientesDelSegmento.filter((c) =>
      sociosSeleccionadosDni.includes(c.dni)
    );

    const res = await aplicarMensajeAClientesSeleccionados(
      segmentoActual.clave,
      mensajeEditado,
      sociosAEnviar
    );

    setIsSending(false);
    setResultadoEnvio({
      count: res.enviados,
      socios: sociosAEnviar,
    });
    setMostrarModalEnvio(true);
    setSociosSeleccionadosDni([]);
  };

  // Previsualización personalizada con el primer socio seleccionado o ejemplo
  const socioEjemplo = useMemo(() => {
    if (sociosSeleccionadosDni.length > 0) {
      const s = clientesDelSegmento.find((c) => c.dni === sociosSeleccionadosDni[0]);
      if (s) return s;
    }
    return clientesDelSegmento[0] || {
      dni: "38.942.110",
      nombre: "Mateo Silveyra",
      sede: gerente.sede || "Almagro",
      telefono: "+54 9 11 5544-3322",
    };
  }, [sociosSeleccionadosDni, clientesDelSegmento, gerente.sede]);

  const mensajePrevisualizado = useMemo(() => {
    const gerenteNombre = `${gerente.nombre} ${gerente.apellido}`;
    const sedeNombre = socioEjemplo.sede || gerente.sede;
    return mensajeEditado
      .replace(/\{nombre de gerente, sede\}/gi, `${gerenteNombre}, MEGATLON ${sedeNombre}`)
      .replace(/\{nombre de gerente\}/gi, gerenteNombre)
      .replace(/\{nombre\}/gi, socioEjemplo.nombre)
      .replace(/\{sede\}/gi, sedeNombre)
      .replace(/\{gerente\}/gi, gerenteNombre)
      .replace(/\{cargo\}/gi, gerente.cargo || "Gerente")
      .replace(/\{frecuencia\}/gi, "3.5")
      .replace(/\{dias\}/gi, "22")
      .replace(/\{vencimiento\}/gi, "15 de Diciembre")
      .replace(/\{plan\}/gi, "Pase Anual Red");
  }, [mensajeEditado, socioEjemplo, gerente]);

  // Si no es director, mostrar pantalla de restricción RBAC
  if (!esDirector) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        <div className="bg-[#121217] border border-amber-500/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block mb-3">
            CONTROL DE ACCESO • SOLO DIRECCIÓN GENERAL
          </span>

          <h1 className="text-2xl font-black text-white font-['Outfit'] mb-2">
            Administración Oficial de Mensajes por Segmento
          </h1>
          <p className="text-sm text-[#8e8e93] max-w-xl mx-auto mb-6 leading-relaxed">
            Esta sección está reservada estrictamente para el <strong>Director General</strong>.
            Desde aquí se definen las políticas corporativas de red, redacción de textos por segmento y asignación masiva de comunicaciones para todas las 28 sedes oficiales de Megatlon.
          </p>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 max-w-md mx-auto mb-6 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-[#8e8e93]">
              <span>Usuario actual:</span>
              <strong className="text-white">{gerente.nombre} {gerente.apellido}</strong>
            </div>
            <div className="flex items-center justify-between text-[#8e8e93]">
              <span>Rol asignado:</span>
              <span className="capitalize text-amber-300 font-bold">{gerente.rol}</span>
            </div>
            <div className="flex items-center justify-between text-[#8e8e93]">
              <span>Sede activa:</span>
              <span className="text-white">{gerente.sede}</span>
            </div>
          </div>

          <button
            onClick={() => actualizarPerfilGerente(gerente.nombre, gerente.apellido, gerente.sede, "director")}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 cursor-pointer inline-flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Activar Rol de Director General (Demostración de Permisos)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Directivo */}
      <div className="bg-[#121217] border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> Exclusivo Dirección General
            </span>
            <span className="text-[10px] font-semibold text-[#8e8e93]">
              Red Multisede (28 Sedes Oficiales)
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-['Outfit'] tracking-tight">
            ADMINISTRACIÓN DE MENSAJES POR SEGMENTO
          </h1>
          <p className="text-xs text-[#8e8e93] max-w-2xl leading-relaxed">
            Configuración centralizada de copys oficiales por segmento de clientes. Modificá el mensaje predeterminado y aplicalo en caliente a toda la base o seleccionando clientes específicos.
          </p>
        </div>

        {/* Indicadores Clave & Acciones */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            type="button"
            onClick={() => {
              restaurarMensajesOficiales();
              setGuardadoExito(true);
              setTimeout(() => setGuardadoExito(false), 2500);
            }}
            className="px-3.5 py-3 rounded-2xl bg-[#1b1b24] hover:bg-[#232330] border border-white/10 hover:border-white/20 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            title="Recargar los copys pre-armados oficiales de MEGATLON para Sleepers, Contratos (9 casos) y Onboarding 30D"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#ff6b00]" />
            <span>Restaurar Copys Oficiales</span>
          </button>
          <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center min-w-[100px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8e8e93]">Segmentos</p>
            <p className="text-xl font-black text-white font-['Outfit']">{configMensajesSegmentos.length}</p>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center min-w-[110px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8e8e93]">Envíos Totales</p>
            <p className="text-xl font-black text-emerald-400 font-['Outfit']">
              {configMensajesSegmentos.reduce((acc, s) => acc + s.totalEnviosHistoricos, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Categorías (Solapas Superiores) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#121217] border border-white/10 rounded-2xl">
        <button
          onClick={() => {
            setCategoriaActiva("contratos");
            const first = configMensajesSegmentos.find((s) => s.categoria === "contratos");
            if (first) setSegmentoSeleccionadoId(first.id);
          }}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            categoriaActiva === "contratos"
              ? "bg-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/25"
              : "text-[#8e8e93] hover:text-white hover:bg-white/5"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Contratos a Vencer ({configMensajesSegmentos.filter((s) => s.categoria === "contratos").length})</span>
        </button>

        <button
          onClick={() => {
            setCategoriaActiva("sleepers");
            const first = configMensajesSegmentos.find((s) => s.categoria === "sleepers");
            if (first) setSegmentoSeleccionadoId(first.id);
          }}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            categoriaActiva === "sleepers"
              ? "bg-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/25"
              : "text-[#8e8e93] hover:text-white hover:bg-white/5"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Sleepers / Inactivos ({configMensajesSegmentos.filter((s) => s.categoria === "sleepers").length})</span>
        </button>

        <button
          onClick={() => {
            setCategoriaActiva("onboarding");
            const first = configMensajesSegmentos.find((s) => s.categoria === "onboarding");
            if (first) setSegmentoSeleccionadoId(first.id);
          }}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            categoriaActiva === "onboarding"
              ? "bg-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/25"
              : "text-[#8e8e93] hover:text-white hover:bg-white/5"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Onboarding 30D ({configMensajesSegmentos.filter((s) => s.categoria === "onboarding").length})</span>
        </button>

        <button
          onClick={() => {
            setCategoriaActiva("gift");
            const first = configMensajesSegmentos.find((s) => s.categoria === "gift");
            if (first) setSegmentoSeleccionadoId(first.id);
          }}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            categoriaActiva === "gift"
              ? "bg-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/25"
              : "text-[#8e8e93] hover:text-white hover:bg-white/5"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Gifts & Pases Free ({configMensajesSegmentos.filter((s) => s.categoria === "gift").length})</span>
        </button>
      </div>

      {/* Sub-selector de Segmentos dentro de la categoría */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {segmentosCategoria.map((seg) => {
          const isActive = seg.id === segmentoActual.id;
          return (
            <button
              key={seg.id}
              onClick={() => {
                setSegmentoSeleccionadoId(seg.id);
                setSociosSeleccionadosDni([]);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-white/10 text-white border-white/20 shadow-md"
                  : "bg-[#141418] text-[#8e8e93] border-white/5 hover:text-white hover:border-white/15"
              }`}
            >
              <span>{seg.nombreSegmento}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-zinc-300">
                v{seg.version}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel Principal: Editor & Simulador WhatsApp */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor de Mensaje (7 cols) */}
        <div className="lg:col-span-7 bg-[#121217] border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 uppercase">
                  Segmento Seleccionado
                </span>
                <span className="text-[11px] text-[#8e8e93]">
                  Versión actual: <strong>v{segmentoActual.version}</strong> • Modificado por {segmentoActual.actualizadoPor}
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-1 font-['Outfit']">
                {segmentoActual.nombreSegmento}
              </h2>
              <p className="text-xs text-[#8e8e93] mt-0.5">
                {segmentoActual.descripcion}
              </p>
            </div>

            {guardadoExito && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl flex items-center gap-1.5 shrink-0 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Guardado Oficial
              </span>
            )}
          </div>

          {/* Asunto opcional */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e93] block mb-1">
              Asunto / Título del Mensaje
            </label>
            <input
              type="text"
              value={asuntoEditado}
              onChange={(e) => setAsuntoEditado(e.target.value)}
              className="w-full bg-[#1c1c24] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b00] transition-colors"
              placeholder="Asunto oficial"
            />
          </div>

          {/* Chips de variables dinámicas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e93] block">
                Variables Dinámicas Disponibles (Hacé clic para insertar)
              </label>
              <span className="text-[10px] text-zinc-400">
                Se reemplazan en tiempo real por los datos del socio
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {segmentoActual.variablesDisponibles.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleInsertarVariable(v)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  +{v}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleInsertarVariable("{sede}")}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                +&#123;sede&#125;
              </button>
              <button
                type="button"
                onClick={() => handleInsertarVariable("{gerente}")}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                +&#123;gerente&#125;
              </button>
            </div>
          </div>

          {/* Textarea del mensaje */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e93] block">
                Cuerpo del Mensaje (Compatible con formato WhatsApp: *negrita*, _cursiva_)
              </label>
              <span className="text-[10px] text-[#8e8e93]">
                {mensajeEditado.length} caracteres
              </span>
            </div>
            <textarea
              rows={8}
              value={mensajeEditado}
              onChange={(e) => setMensajeEditado(e.target.value)}
              className="w-full bg-[#1c1c24] border border-white/10 rounded-2xl p-4 text-xs text-white leading-relaxed font-mono focus:outline-none focus:border-[#ff6b00] transition-colors resize-y"
              placeholder="Escribí el mensaje oficial para este segmento..."
            />
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
            <div className="text-[11px] text-[#8e8e93]">
              Criterio de segmentación: <strong className="text-white">{segmentoActual.criterioFiltro}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGuardarPlantillaOficial}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Mensaje Predeterminado</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const elem = document.getElementById("seccion-clientes-segmento");
                  elem?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#ea580c] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#ff6b00]/25"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Ver Clientes del Segmento ({clientesDelSegmento.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Simulador WhatsApp en Tiempo Real (5 cols) */}
        <div className="lg:col-span-5 bg-[#121217] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                Simulador WhatsApp en Tiempo Real
              </h3>
              <span className="text-[10px] text-[#8e8e93] px-2 py-0.5 rounded-full bg-white/5">
                Previsualización Dinámica
              </span>
            </div>

            {/* Smartphone mockup frame */}
            <div className="bg-[#0b141a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* WhatsApp header */}
              <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                    M
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">
                      Megatlon {socioEjemplo.sede || "Almagro"}
                    </p>
                    <p className="text-[10px] text-emerald-400 leading-tight">
                      Canal Oficial Verificado
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-400">
                  {socioEjemplo.nombre}
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="p-4 min-h-[260px] max-h-[360px] overflow-y-auto space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="text-center">
                  <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#182229] text-zinc-400 border border-white/5">
                    Hoy • Mensaje Corporativo Megatlon
                  </span>
                </div>

                {/* Message Bubble */}
                <div className="ml-auto max-w-[90%] bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-none p-3.5 shadow-md relative text-xs leading-relaxed space-y-1">
                  <div className="whitespace-pre-wrap font-sans">
                    {mensajePrevisualizado}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-[#8696a0] pt-1">
                    <span>10:45</span>
                    <span className="text-cyan-400 font-bold">✓✓</span>
                  </div>
                </div>
              </div>

              {/* Chat footer info */}
              <div className="bg-[#202c33] px-4 py-2 text-[10px] text-zinc-400 flex items-center justify-between border-t border-white/5">
                <span>Destinatario: <strong className="text-white">{socioEjemplo.nombre}</strong></span>
                <span>Tel: {socioEjemplo.telefono || "11-XXXX-XXXX"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#8e8e93]">
              ¿Querés copiar el texto simulado?
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(mensajePrevisualizado);
                setCopiadoExito(true);
                setTimeout(() => setCopiadoExito(false), 2000);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiadoExito ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiadoExito ? "Copiado!" : "Copiar Texto"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN: Aplicación y Selección de Clientes del Segmento */}
      <div id="seccion-clientes-segmento" className="bg-[#121217] border border-white/10 rounded-3xl p-6 lg:p-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff6b00]/20 text-[#ff6b00] uppercase">
                Base de Clientes en Tiempo Real
              </span>
              <span className="text-[11px] text-[#8e8e93]">
                Total en este segmento: <strong className="text-white">{clientesDelSegmento.length} socios</strong>
              </span>
            </div>
            <h2 className="text-lg font-black text-white font-['Outfit'] mt-1">
              APLICAR MENSAJE A CLIENTES DEL SEGMENTO: {segmentoActual.nombreSegmento}
            </h2>
            <p className="text-xs text-[#8e8e93]">
              Seleccioná uno, varios o todos los clientes para enviarles el mensaje personalizado o actualizar su estado de gestión.
            </p>
          </div>

          {/* Filtros rápidos de clientes */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Buscador */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-[#8e8e93] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre o DNI..."
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
                className="w-full bg-[#1c1c24] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
              />
            </div>

            {/* Filtro Sede */}
            <select
              value={filtroSedeClientes}
              onChange={(e) => setFiltroSedeClientes(e.target.value)}
              className="bg-[#1c1c24] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer"
            >
              <option value="todas">🌐 Todas las sedes ({clientesDelSegmento.length})</option>
              {SEDES_MEGATLON.map((s) => (
                <option key={s} value={s}>
                  Sede {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Barra de Selección Masiva & Disparador */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSeleccionarTodos}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {sociosSeleccionadosDni.length === clientesDelSegmento.length && clientesDelSegmento.length > 0
                  ? "Deseleccionar Todos"
                  : `Seleccionar Todos (${clientesDelSegmento.length})`}
              </span>
            </button>

            <span className="text-xs text-[#8e8e93]">
              Seleccionados:{" "}
              <strong className="text-emerald-400 font-bold">
                {sociosSeleccionadosDni.length}
              </strong>{" "}
              de {clientesDelSegmento.length} socios
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={sociosSeleccionadosDni.length === 0 || isSending}
              onClick={handleEjecutarEnvioASeleccion}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                sociosSeleccionadosDni.length > 0
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                  : "bg-white/5 text-[#8e8e93] border border-white/5 cursor-not-allowed"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {isSending
                  ? "Enviando..."
                  : `Aplicar y Enviar a Selección (${sociosSeleccionadosDni.length})`}
              </span>
            </button>
          </div>
        </div>

        {/* Tabla de Clientes del Segmento */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0c0c0f]">
          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16161d] text-[#8e8e93] text-[10px] uppercase tracking-wider sticky top-0 z-10 border-b border-white/10">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        sociosSeleccionadosDni.length === clientesDelSegmento.length &&
                        clientesDelSegmento.length > 0
                      }
                      onChange={handleSeleccionarTodos}
                      className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] bg-[#1c1c24] border-white/20 cursor-pointer"
                    />
                  </th>
                  <th className="p-3 font-bold">Socio / DNI</th>
                  <th className="p-3 font-bold">Sede</th>
                  <th className="p-3 font-bold">Métrica del Segmento</th>
                  <th className="p-3 font-bold">Riesgo</th>
                  <th className="p-3 font-bold">Estado</th>
                  <th className="p-3 font-bold">Último Contacto</th>
                  <th className="p-3 font-bold text-right">Acción Directa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clientesDelSegmento.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[#8e8e93]">
                      No se encontraron clientes para este segmento con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  clientesDelSegmento.map((socio) => {
                    const isChecked = sociosSeleccionadosDni.includes(socio.dni);
                    return (
                      <tr
                        key={socio.dni}
                        className={`hover:bg-white/[0.02] transition-colors ${
                          isChecked ? "bg-emerald-500/[0.05]" : ""
                        }`}
                      >
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSeleccionSocio(socio.dni)}
                            className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] bg-[#1c1c24] border-white/20 cursor-pointer"
                          />
                        </td>
                        <td className="p-3 font-medium text-white">
                          <div className="font-bold">{socio.nombre}</div>
                          <div className="text-[10px] text-[#8e8e93]">DNI: {socio.dni}</div>
                        </td>
                        <td className="p-3 text-zinc-300">
                          Megatlon {socio.sede}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-white">
                            {socio.metricaClave}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              socio.riesgo === "Alto"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : socio.riesgo === "Medio"
                                ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}
                          >
                            {socio.riesgo}
                          </span>
                        </td>
                        <td className="p-3 text-zinc-400">
                          {socio.estado}
                        </td>
                        <td className="p-3 text-zinc-400 text-[11px]">
                          {socio.ultimoContacto}
                        </td>
                        <td className="p-3 text-right">
                          <a
                            href={`https://wa.me/${(socio.telefono || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              mensajeEditado
                                .replace(/\{nombre\}/gi, socio.nombre)
                                .replace(/\{sede\}/gi, socio.sede)
                                .replace(/\{gerente\}/gi, `${gerente.nombre} ${gerente.apellido}`)
                                .replace(/\{cargo\}/gi, "Director General")
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
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

      {/* Modal de Confirmación de Envíos Masivos */}
      {mostrarModalEnvio && resultadoEnvio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121217] border border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-base font-black text-white font-['Outfit']">
                  ¡Mensajes Aplicados con Éxito!
                </h3>
              </div>
              <button
                onClick={() => setMostrarModalEnvio(false)}
                className="text-[#8e8e93] hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-zinc-300">
                Se aplicó la plantilla <strong>{segmentoActual.nombreSegmento}</strong> y se registraron las interacciones oficiales para los <strong>{resultadoEnvio.count} clientes seleccionados</strong>.
              </p>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 max-h-48 overflow-y-auto">
                <p className="font-bold text-white text-[11px] uppercase tracking-wider">
                  Detalle de Socios Impactados:
                </p>
                {resultadoEnvio.socios.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-[#8e8e93] py-0.5">
                    <span className="text-white font-semibold">{s.nombre} ({s.sede})</span>
                    <a
                      href={`https://wa.me/${(s.telefono || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        mensajeEditado
                          .replace(/\{nombre\}/gi, s.nombre)
                          .replace(/\{sede\}/gi, s.sede)
                          .replace(/\{gerente\}/gi, `${gerente.nombre} ${gerente.apellido}`)
                          .replace(/\{cargo\}/gi, "Director General")
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>Abrir chat</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                ✓ Quedó asentada la auditoría inmutable de envío masivo con firma de Dirección General.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setMostrarModalEnvio(false)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-all"
              >
                Entendido y Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
