import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  CasoSleeper,
  RegistroContrato,
  RegistroGift,
  ComentarioCaso,
  PlantillaMensaje,
  PerfilGerente,
  FlyerCreative,
  SocioOnboarding,
  RegistroInteraccion,
  RamaOnboarding,
  HitoOnboarding,
  SEDES_MEGATLON,
  RolUsuario,
  MiembroEquipo,
  RegistroAuditoria,
  ConfigMensajeSegmento,
  PermisosUsuario,
} from "../types";
import {
  GERENTE_INICIAL,
  ONBOARDING_INICIALES,
  CASOS_SLEEPERS_INICIALES,
  CONTRATOS_INICIALES,
  PLANTILLAS_INICIALES,
  FLYERS_CREATIVOS,
  REGISTROS_INTERACCION_INICIALES,
  GIFT_INICIALES,
  COMENTARIOS_INICIALES,
  CONFIG_MENSAJES_SEGMENTOS_INICIALES,
  MIEMBROS_EQUIPO_INICIALES,
  AUDITORIA_INICIALES,
} from "../mockData";
import { db } from "../firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot
} from "firebase/firestore";

interface IngestionContratoItem {
  dni: string;
  nombre: string;
  telefono?: string;
  email?: string;
  sede: string;
  plan: string;
  fecha_fin_contrato: string;
  dias_para_vencer?: number;
}

interface IngestionAccesoItem {
  dni: string;
  asistencias_30d: number;
  frecuencia_semanal: number;
  ultimo_acceso?: string;
}

interface IngestionNpsItem {
  dni: string;
  nps_score: number;
  nps_comentario?: string;
}

interface MegatlonContextType {
  // Gerente / Sesión & Multisede
  gerente: PerfilGerente;
  setGerente: (g: PerfilGerente) => void;
  actualizarPerfilGerente: (nombre: string, apellido: string, sede: string, rol?: RolUsuario) => void;
  soloMiSede: boolean;
  setSoloMiSede: (val: boolean) => void;
  sedeFiltroActiva: string;
  setSedeFiltroActiva: (sede: string) => void;
  filtroSedeGlobal: string;
  setFiltroSedeGlobal: (sede: string) => void;
  perfil: { id: string; nombre: string; email: string; rol: any; sede: string; estado: "activo" };
  setPerfil: (p: any) => void;
  cargoFirma: string;
  setCargoFirma: (c: string) => void;

  // Onboarding 30 Días
  onboardings: SocioOnboarding[];
  onboardingsFiltrados: SocioOnboarding[];
  actualizarHitoOnboarding: (id: string, hito: HitoOnboarding, datos?: Partial<SocioOnboarding>) => Promise<void>;
  actualizarRamaOnboarding: (id: string, rama: RamaOnboarding) => Promise<void>;
  resolverAlertaRoja: (id: string, notas: string) => Promise<void>;
  agregarSocioOnboarding: (socio: Omit<SocioOnboarding, "id">) => Promise<void>;

  // Sleepers & Contratos & Interacciones & Gifts
  casos: CasoSleeper[];
  casosFiltrados: CasoSleeper[];
  contratos: RegistroContrato[];
  contratosFiltrados: RegistroContrato[];
  gifts: RegistroGift[];
  comentarios: ComentarioCaso[];
  interacciones: RegistroInteraccion[];
  plantillas: PlantillaMensaje[];
  flyers: FlyerCreative[];

  actualizarCasoSleeper: (id: string, campos: Partial<CasoSleeper>) => Promise<void>;
  agregarCasoSleeper: (caso: Omit<CasoSleeper, "id" | "creado_en">) => Promise<void>;
  enviarMensajeSleeper: (id: string, numeroMensaje: 1 | 2) => Promise<void>;
  actualizarContrato: (id: string, campos: Partial<RegistroContrato>) => Promise<void>;
  actualizarGift: (id: string, campos: Partial<RegistroGift>) => void;
  agregarComentario: (casoId: string, texto: string) => void;
  agregarComentarioCompleto: (
    casoId: string, 
    texto: string, 
    tipo?: ComentarioCaso["tipo"], 
    nps?: number, 
    dni?: string, 
    nombre?: string
  ) => Promise<void>;
  actualizarNpsSocio: (socioDni: string, score: number, comentario?: string) => Promise<void>;
  actualizarPlantilla: (id: string, campos: Partial<PlantillaMensaje>) => Promise<void>;
  agregarFlyer: (flyer: FlyerCreative) => void;

  // Generador dinámico de mensajería (WhatsApp Click-to-Chat & Email)
  construirMensajeHito: (socio: SocioOnboarding) => string;
  registrarInteraccion: (
    socioDni: string,
    socioNombre: string,
    canal: "whatsapp" | "email" | "llamada" | "presencial",
    modulo: "onboarding" | "sleepers" | "contratos" | "gift",
    mensaje: string,
    hito?: string
  ) => Promise<void>;
  enviarWhatsApp: (
    telefono: string,
    mensaje: string,
    socioDni: string,
    socioNombre: string,
    modulo: "onboarding" | "sleepers" | "contratos" | "gift",
    hito?: string
  ) => void;
  enviarEmail: (
    email: string,
    asunto: string,
    mensaje: string,
    socioDni: string,
    socioNombre: string,
    modulo: "onboarding" | "sleepers" | "contratos" | "gift",
    hito?: string
  ) => void;

  // Ingesta de archivos con cruce por DNI
  importarSleepersDesdeArchivo: (lista: Array<Partial<CasoSleeper>>) => Promise<number>;
  procesarCruceTripleContratos: (
    contratosRaw: IngestionContratoItem[],
    accesosRaw: IngestionAccesoItem[],
    npsRaw: IngestionNpsItem[]
  ) => Promise<number>;
  importarOnboardingDesdeArchivo: (lista: Array<Partial<SocioOnboarding>>) => Promise<number>;

  // Administración de Mensajes por Segmento (Solo Director)
  configMensajesSegmentos: ConfigMensajeSegmento[];
  actualizarMensajeSegmento: (id: string, nuevoMensaje: string, nuevoAsunto?: string) => Promise<void>;
  aplicarMensajeAClientesSeleccionados: (
    segmentoClave: string,
    mensajeTexto: string,
    socios: Array<{ dni: string; nombre: string; telefono?: string; email?: string; sede: string; modulo: "onboarding" | "sleepers" | "contratos" | "gift" }>
  ) => Promise<{ enviados: number }>;

  // Auditor & Jerarquía de Equipo
  equipo: MiembroEquipo[];
  aprobarGerentePorDirector: (miembroId: string, aprobado: boolean) => Promise<void>;
  autorizarEquipoPorGerente: (miembroId: string, autorizado: boolean) => Promise<void>;
  actualizarPermisosMiembro: (miembroId: string, permisos: Partial<PermisosUsuario>) => Promise<void>;
  agregarMiembroEquipo: (miembro: Omit<MiembroEquipo, "id" | "fechaIngreso">) => Promise<void>;
  eliminarMiembroEquipo: (miembroId: string) => Promise<void>;
  registrosAuditoria: RegistroAuditoria[];
  registrarAccionAuditoria: (accion: string, categoria: RegistroAuditoria["categoria"], detalles: string, sede?: string) => Promise<void>;

  reiniciarDatosDemo: () => Promise<void>;
  restaurarMensajesOficiales: () => void;
  isFirebaseSynced: boolean;
}

const MegatlonContext = createContext<MegatlonContextType | null>(null);

export const MegatlonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Gerente logueado
  const [gerente, setGerenteState] = useState<PerfilGerente>(() => {
    try {
      const s = localStorage.getItem("megatlon_gerente_sesion");
      return s ? JSON.parse(s) : GERENTE_INICIAL;
    } catch {
      return GERENTE_INICIAL;
    }
  });

  const [soloMiSede, setSoloMiSede] = useState<boolean>(true);
  const [sedeFiltroActiva, setSedeFiltroActiva] = useState<string>(gerente.sede || "Almagro");
  const [cargoFirma, setCargoFirma] = useState<string>("Gerente");
  const [isFirebaseSynced, setIsFirebaseSynced] = useState<boolean>(false);

  // Estados de colecciones
  const [onboardings, setOnboardings] = useState<SocioOnboarding[]>(() => {
    try {
      const s = localStorage.getItem("megatlon_onboardings");
      return s ? JSON.parse(s) : ONBOARDING_INICIALES;
    } catch {
      return ONBOARDING_INICIALES;
    }
  });

  const [casos, setCasos] = useState<CasoSleeper[]>(() => {
    try {
      const s = localStorage.getItem("megatlon_casos");
      return s ? JSON.parse(s) : CASOS_SLEEPERS_INICIALES;
    } catch {
      return CASOS_SLEEPERS_INICIALES;
    }
  });

  const [contratos, setContratos] = useState<RegistroContrato[]>(() => {
    try {
      const s = localStorage.getItem("megatlon_contratos");
      return s ? JSON.parse(s) : CONTRATOS_INICIALES;
    } catch {
      return CONTRATOS_INICIALES;
    }
  });

  const [gifts, setGifts] = useState<RegistroGift[]>(() => {
    try {
      const s = localStorage.getItem("megatlon_gifts");
      return s ? JSON.parse(s) : GIFT_INICIALES;
    } catch {
      return GIFT_INICIALES;
    }
  });

  const [comentarios, setComentarios] = useState<ComentarioCaso[]>(() => {
    try {
      const s = localStorage.getItem("megatlon_comentarios");
      return s ? JSON.parse(s) : COMENTARIOS_INICIALES;
    } catch {
      return COMENTARIOS_INICIALES;
    }
  });

  const [interacciones, setInteracciones] = useState<RegistroInteraccion[]>(() => {
    try {
      const s = localStorage.getItem("megatlon_interacciones");
      return s ? JSON.parse(s) : REGISTROS_INTERACCION_INICIALES;
    } catch {
      return REGISTROS_INTERACCION_INICIALES;
    }
  });

  const [plantillas, setPlantillas] = useState<PlantillaMensaje[]>(() => {
    try {
      const s = localStorage.getItem("megatlon_plantillas_v6");
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.some((p: PlantillaMensaje) => p.clave === "cnt_caso_10_baja_sinnps")) {
          return parsed;
        }
      }
      localStorage.setItem("megatlon_plantillas_v6", JSON.stringify(PLANTILLAS_INICIALES));
      return PLANTILLAS_INICIALES;
    } catch {
      return PLANTILLAS_INICIALES;
    }
  });

  const [flyers, setFlyers] = useState<FlyerCreative[]>(FLYERS_CREATIVOS);

  // Administración de Mensajes por Segmento (Solo Director)
  const [configMensajesSegmentos, setConfigMensajesSegmentos] = useState<ConfigMensajeSegmento[]>(() => {
    try {
      const s = localStorage.getItem("megatlon_mensajes_segmentos_v6");
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.some((c: ConfigMensajeSegmento) => c.clave === "cnt_caso_10_baja_sinnps")) {
          return parsed;
        }
      }
      localStorage.setItem("megatlon_mensajes_segmentos_v6", JSON.stringify(CONFIG_MENSAJES_SEGMENTOS_INICIALES));
      return CONFIG_MENSAJES_SEGMENTOS_INICIALES;
    } catch {
      return CONFIG_MENSAJES_SEGMENTOS_INICIALES;
    }
  });

  // Auditor & Jerarquía de Equipo
  const [equipo, setEquipo] = useState<MiembroEquipo[]>(() => {
    try {
      const s = localStorage.getItem("megatlon_equipo");
      return s ? JSON.parse(s) : MIEMBROS_EQUIPO_INICIALES;
    } catch {
      return MIEMBROS_EQUIPO_INICIALES;
    }
  });

  // Bitácora de Auditoría Inmutable
  const [registrosAuditoria, setRegistrosAuditoria] = useState<RegistroAuditoria[]>(() => {
    try {
      const s = localStorage.getItem("megatlon_auditoria");
      return s ? JSON.parse(s) : AUDITORIA_INICIALES;
    } catch {
      return AUDITORIA_INICIALES;
    }
  });

  // Sincronización en tiempo real con Firestore
  useEffect(() => {
    let unsubs: Array<() => void> = [];

    try {
      const unsubOnb = onSnapshot(collection(db, "onboardings"), (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SocioOnboarding));
          setOnboardings(docs);
        }
      }, (err) => {
        console.warn("Firestore onSnapshot onboardings (local cache active):", err.message);
      });
      unsubs.push(unsubOnb);

      const unsubSleepers = onSnapshot(collection(db, "sleepers"), (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CasoSleeper));
          setCasos(docs);
        }
      }, (err) => {
        console.warn("Firestore onSnapshot sleepers:", err.message);
      });
      unsubs.push(unsubSleepers);

      const unsubContratos = onSnapshot(collection(db, "contratos"), (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as RegistroContrato));
          setContratos(docs);
        }
      }, (err) => {
        console.warn("Firestore onSnapshot contratos:", err.message);
      });
      unsubs.push(unsubContratos);

      const unsubInteractions = onSnapshot(collection(db, "interactions"), (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as RegistroInteraccion));
          setInteracciones(docs);
        }
      }, (err) => {
        console.warn("Firestore onSnapshot interactions:", err.message);
      });
      unsubs.push(unsubInteractions);

      setIsFirebaseSynced(true);
    } catch (e) {
      console.warn("Error setting up Firestore snapshot listeners:", e);
    }

    return () => {
      unsubs.forEach((u) => u());
    };
  }, []);

  // Persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("megatlon_gerente_sesion", JSON.stringify(gerente));
    } catch {}
  }, [gerente]);

  useEffect(() => {
    try {
      localStorage.setItem("megatlon_onboardings", JSON.stringify(onboardings));
    } catch {}
  }, [onboardings]);

  useEffect(() => {
    try {
      localStorage.setItem("megatlon_casos", JSON.stringify(casos));
    } catch {}
  }, [casos]);

  useEffect(() => {
    try {
      localStorage.setItem("megatlon_contratos", JSON.stringify(contratos));
    } catch {}
  }, [contratos]);

  useEffect(() => {
    try {
      localStorage.setItem("megatlon_gifts", JSON.stringify(gifts));
    } catch {}
  }, [gifts]);

  useEffect(() => {
    try {
      localStorage.setItem("megatlon_comentarios", JSON.stringify(comentarios));
    } catch {}
  }, [comentarios]);

  useEffect(() => {
    try {
      localStorage.setItem("megatlon_interacciones", JSON.stringify(interacciones));
    } catch {}
  }, [interacciones]);

  useEffect(() => {
    try {
      localStorage.setItem("megatlon_mensajes_segmentos", JSON.stringify(configMensajesSegmentos));
    } catch {}
  }, [configMensajesSegmentos]);

  useEffect(() => {
    try {
      localStorage.setItem("megatlon_equipo", JSON.stringify(equipo));
    } catch {}
  }, [equipo]);

  useEffect(() => {
    try {
      localStorage.setItem("megatlon_auditoria", JSON.stringify(registrosAuditoria));
    } catch {}
  }, [registrosAuditoria]);

  // Actualizar perfil de gerente
  const setGerente = (g: PerfilGerente) => {
    setGerenteState(g);
    setSedeFiltroActiva(g.sede);
  };

  const actualizarPerfilGerente = (
    nombre: string,
    apellido: string,
    sede: string,
    rol: RolUsuario = "gerente"
  ) => {
    const nuevo: PerfilGerente = {
      ...gerente,
      nombre,
      apellido,
      sede,
      rol,
    };
    setGerente(nuevo);

    try {
      setDoc(doc(db, "managers", nuevo.id), nuevo, { merge: true }).catch(() => {});
    } catch {}
  };

  // Filtrado Multisede y cálculo dinámico de reglas de negocio
  const sedeActiva = soloMiSede ? gerente.sede : sedeFiltroActiva;

  const onboardingsFiltrados = onboardings.filter((o) => {
    if (!sedeActiva || sedeActiva === "Todas las sedes") return true;
    return o.sede.toLowerCase().trim() === sedeActiva.toLowerCase().trim();
  });

  const casosFiltrados = useMemo(() => {
    const filtrados = casos.filter((c) => {
      if (!sedeActiva || sedeActiva === "Todas las sedes") return true;
      return c.sede.toLowerCase().trim() === sedeActiva.toLowerCase().trim();
    });

    const now = new Date();

    // Normalizar y calcular regla de 15 días de riesgo:
    const calculados = filtrados.map((c) => {
      let riesgo = c.riesgo;
      let estadoSeguimiento = c.estado_seguimiento || "pendiente_primer_contacto";
      let diasRestantes = c.dias_restantes_seguimiento;

      if (c.fecha_envio_mensaje_1 || c.fecha_envio_mensaje) {
        const fechaBase = c.fecha_envio_mensaje_1 || c.fecha_envio_mensaje || "";
        const fechaSeg = c.fecha_seguimiento || (() => {
          const d = new Date(fechaBase);
          d.setDate(d.getDate() + 15);
          return d.toISOString().slice(0, 10);
        })();

        const segDate = new Date(fechaSeg);
        diasRestantes = Math.round((segDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

        if (c.estado === "Cerrado" || c.resultado_cierre === "Recuperado") {
          estadoSeguimiento = "respondido_recuperado";
        } else if (c.fecha_envio_mensaje_2) {
          estadoSeguimiento = "segundo_mensaje_enviado";
          riesgo = "Alto";
        } else if (diasRestantes < 0) {
          // Pasaron más de 15 días sin respuesta -> pasa a RIESGO ALTO y se activa 2do mensaje
          riesgo = "Alto";
          estadoSeguimiento = "segundo_mensaje_requerido";
        } else {
          // Se envió el 1er mensaje y aún está en la ventana de 15 días -> RIESGO BAJO
          riesgo = "Bajo";
          estadoSeguimiento = "primer_mensaje_enviado";
        }
      }

      return {
        ...c,
        riesgo,
        estado_seguimiento: estadoSeguimiento,
        dias_restantes_seguimiento: diasRestantes,
      };
    });

    // Ordenar por fecha de fin de contrato (más próximos a vencer primero)
    return calculados.sort((a, b) => {
      const dateA = a.fecha_fin_contrato ? new Date(a.fecha_fin_contrato).getTime() : 9999999999999;
      const dateB = b.fecha_fin_contrato ? new Date(b.fecha_fin_contrato).getTime() : 9999999999999;
      return dateA - dateB;
    });
  }, [casos, sedeActiva]);

  const contratosFiltrados = useMemo(() => {
    const filtrados = contratos.filter((cnt) => {
      if (!sedeActiva || sedeActiva === "Todas las sedes") return true;
      return cnt.sede.toLowerCase().trim() === sedeActiva.toLowerCase().trim();
    });

    return filtrados.map((c) => {
      const accesos = c.accesos_mes ?? Math.max(0, Math.round(c.frecuencia_semanal_promedio * 4.3));
      
      // Categorización por accesos al mes requerida por Megatlon:
      // GRUPO A: Mas de 12 accesos en el mes (>=12)
      // GRUPO B: Entre 5 y 11 accesos al mes (>=5 && <=11)
      // GRUPO C: Entre 1 y 4 accesos al mes (>=1 && <=4)
      let grupoAcceso: "GRUPO A" | "GRUPO B" | "GRUPO C" | "Sin accesos" = "Sin accesos";
      if (accesos >= 12) grupoAcceso = "GRUPO A";
      else if (accesos >= 5) grupoAcceso = "GRUPO B";
      else if (accesos >= 1) grupoAcceso = "GRUPO C";

      // Categorización por NPS:
      // 10 y 9 promotor, 8 y 7 pasivo, 6 a 0 detractor
      let catNps: "Promotor" | "Pasivo" | "Detractor" | "Sin calificar" = "Sin calificar";
      const score = c.nps_score;
      if (typeof score === "number" && !isNaN(score)) {
        if (score >= 9) catNps = "Promotor";
        else if (score >= 7) catNps = "Pasivo";
        else catNps = "Detractor";
      }

      // Cálculo de Riesgo de Baja cruzando vencimiento + accesos + NPS
      let riesgo: "Alto" | "Medio" | "Bajo" = c.riesgo_baja;
      if (grupoAcceso === "GRUPO C" || grupoAcceso === "Sin accesos" || catNps === "Detractor") {
        riesgo = "Alto";
      } else if (grupoAcceso === "GRUPO A" && catNps === "Promotor") {
        riesgo = "Bajo";
      } else {
        riesgo = "Medio";
      }

      return {
        ...c,
        accesos_mes: accesos,
        grupo_acceso: grupoAcceso,
        categoria_nps: catNps,
        riesgo_baja: riesgo,
      };
    });
  }, [contratos, sedeActiva]);

  const filtroSedeGlobal = soloMiSede ? gerente.sede : (sedeFiltroActiva || "");
  const setFiltroSedeGlobal = (sede: string) => {
    setSedeFiltroActiva(sede);
    if (sede && sede !== gerente.sede) {
      setSoloMiSede(false);
    }
  };

  const perfil = {
    id: gerente.id,
    nombre: `${gerente.nombre} ${gerente.apellido}`,
    email: gerente.email,
    rol: gerente.rol,
    sede: gerente.sede,
    estado: "activo" as const,
  };

  const setPerfil = (p: any) => {
    if (p.nombre) {
      const partes = p.nombre.split(" ");
      actualizarPerfilGerente(partes[0] || "", partes.slice(1).join(" ") || "", p.sede || gerente.sede, p.rol);
    }
  };

  // Operaciones de Onboarding
  const actualizarHitoOnboarding = async (
    id: string,
    hito: HitoOnboarding,
    datos: Partial<SocioOnboarding> = {}
  ) => {
    setOnboardings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hito_actual: hito, ...datos, updatedAt: new Date().toISOString() } : item))
    );

    try {
      await updateDoc(doc(db, "onboardings", id), {
        hito_actual: hito,
        ...datos,
        updatedAt: new Date().toISOString()
      });
    } catch {}
  };

  const actualizarRamaOnboarding = async (id: string, rama: RamaOnboarding) => {
    setOnboardings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, rama, updatedAt: new Date().toISOString() } : item))
    );

    try {
      await updateDoc(doc(db, "onboardings", id), {
        rama,
        updatedAt: new Date().toISOString()
      });
    } catch {}
  };

  const resolverAlertaRoja = async (id: string, notas: string) => {
    setOnboardings((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              tarea_resuelta: true,
              alerta_roja: false,
              resolucion_notas: notas,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    try {
      await updateDoc(doc(db, "onboardings", id), {
        tarea_resuelta: true,
        alerta_roja: false,
        resolucion_notas: notas,
        updatedAt: new Date().toISOString()
      });
    } catch {}
  };

  const agregarSocioOnboarding = async (socio: Omit<SocioOnboarding, "id">) => {
    const id = `onb-${Date.now()}`;
    const nuevo: SocioOnboarding = {
      ...socio,
      id,
      updatedAt: new Date().toISOString()
    };

    setOnboardings((prev) => [nuevo, ...prev]);

    try {
      await setDoc(doc(db, "onboardings", id), nuevo);
    } catch {}
  };

  // Operaciones de Sleepers, Contratos, Gifts
  const actualizarCasoSleeper = async (id: string, campos: Partial<CasoSleeper>) => {
    setCasos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...campos } : c))
    );

    try {
      await updateDoc(doc(db, "sleepers", id), campos);
    } catch {}
  };

  const enviarMensajeSleeper = async (id: string, numeroMensaje: 1 | 2) => {
    const today = new Date().toISOString().slice(0, 10);
    const fechaSeg = new Date();
    fechaSeg.setDate(fechaSeg.getDate() + 15);
    const fechaSegStr = fechaSeg.toISOString().slice(0, 10);

    const camposActualizacion: Partial<CasoSleeper> = numeroMensaje === 1
      ? {
          estado: "Gestionado",
          estado_seguimiento: "primer_mensaje_enviado",
          fecha_envio_mensaje: today,
          fecha_envio_mensaje_1: today,
          fecha_seguimiento: fechaSegStr,
          dias_restantes_seguimiento: 15,
          riesgo: "Bajo", // Se inicia período de 15 días con riesgo bajo
        }
      : {
          estado: "Gestionado",
          estado_seguimiento: "segundo_mensaje_enviado",
          fecha_envio_mensaje_2: today,
          riesgo: "Alto",
        };

    await actualizarCasoSleeper(id, camposActualizacion);
  };

  const agregarCasoSleeper = async (caso: Omit<CasoSleeper, "id" | "creado_en">) => {
    const id = `slp-${Date.now()}`;
    const nuevo: CasoSleeper = {
      ...caso,
      id,
      creado_en: new Date().toISOString().slice(0, 10),
    };
    setCasos((prev) => [nuevo, ...prev]);

    try {
      await setDoc(doc(db, "sleepers", id), nuevo);
    } catch {}
  };

  const actualizarContrato = async (id: string, campos: Partial<RegistroContrato>) => {
    setContratos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...campos } : c))
    );

    try {
      await updateDoc(doc(db, "contratos", id), campos);
    } catch {}
  };

  const actualizarGift = (id: string, campos: Partial<RegistroGift>) => {
    setGifts((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...campos } : g))
    );
  };

  const agregarComentario = (casoId: string, texto: string) => {
    const nuevo: ComentarioCaso = {
      id: `com-${Date.now()}`,
      caso_id: casoId,
      autor_nombre: `${gerente.nombre} ${gerente.apellido}`,
      autor_rol: gerente.rol === "director" ? "Director" : "Gerente",
      texto,
      creado_en: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    setComentarios((prev) => [nuevo, ...prev]);
  };

  const agregarComentarioCompleto = async (
    casoId: string,
    texto: string,
    tipo: ComentarioCaso["tipo"] = "general",
    nps?: number,
    dni?: string,
    nombre?: string
  ) => {
    const id = `com-${Date.now()}`;
    const nuevo: ComentarioCaso = {
      id,
      caso_id: casoId,
      socio_dni: dni,
      socio_nombre: nombre,
      autor_nombre: `${gerente.nombre} ${gerente.apellido}`,
      autor_rol: gerente.rol === "director" ? "Director de Sede" : "Gerente de Sede",
      texto,
      tipo,
      nps_asociado: nps,
      creado_en: new Date().toISOString().replace("T", " ").slice(0, 16),
    };

    setComentarios((prev) => [nuevo, ...prev]);

    // Si viene con NPS, actualizar el perfil del socio correspondiente
    if (typeof nps === "number" && dni) {
      await actualizarNpsSocio(dni, nps, texto);
    }

    try {
      await setDoc(doc(db, "comments", id), nuevo);
    } catch {}
  };

  const actualizarNpsSocio = async (socioDni: string, score: number, comentario?: string) => {
    const cleanDni = socioDni.replace(/[^0-9]/g, "");

    // Actualizar en contratos si existe
    setContratos((prev) =>
      prev.map((cnt) => {
        if (cnt.dni.replace(/[^0-9]/g, "") === cleanDni) {
          const cat = score >= 9 ? "Promotor" : score >= 7 ? "Pasivo" : "Detractor";
          return {
            ...cnt,
            nps_score: score,
            nps_comentario: comentario || cnt.nps_comentario,
            categoria_nps: cat as any,
          };
        }
        return cnt;
      })
    );

    // Actualizar en sleepers si existe
    setCasos((prev) =>
      prev.map((c) => {
        if (c.dni.replace(/[^0-9]/g, "") === cleanDni) {
          return {
            ...c,
            nps_score: score,
            nps_comentario: comentario || c.nps_comentario,
          };
        }
        return c;
      })
    );
  };

  const actualizarPlantilla = async (id: string, campos: Partial<PlantillaMensaje>) => {
    setPlantillas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...campos } : p))
    );
  };

  const agregarFlyer = (flyer: FlyerCreative) => {
    setFlyers((prev) => [flyer, ...prev]);
  };

  // --- BITÁCORA DE AUDITORÍA INMUTABLE ---
  const registrarAccionAuditoria = async (
    accion: string,
    categoria: RegistroAuditoria["categoria"],
    detalles: string,
    sede?: string
  ) => {
    const nuevoLog: RegistroAuditoria = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      fecha: new Date().toISOString().replace("T", " ").slice(0, 16),
      usuarioNombre: `${gerente.nombre} ${gerente.apellido}`,
      usuarioRol: gerente.rol,
      usuarioEmail: gerente.email,
      accion,
      categoria,
      detalles,
      sede: sede || gerente.sede,
    };
    setRegistrosAuditoria((prev) => [nuevoLog, ...prev]);
  };

  // --- ADMINISTRACIÓN DE MENSAJES POR SEGMENTO (SOLO DIRECTOR) ---
  const actualizarMensajeSegmento = async (id: string, nuevoMensaje: string, nuevoAsunto?: string) => {
    const segmentoActual = configMensajesSegmentos.find((s) => s.id === id);
    const nombreSeg = segmentoActual ? segmentoActual.nombreSegmento : id;

    setConfigMensajesSegmentos((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              mensaje: nuevoMensaje,
              asunto: nuevoAsunto ?? s.asunto,
              version: s.version + 1,
              actualizadoPor: `${gerente.nombre} ${gerente.apellido} (${gerente.rol === "director" ? "Director" : "Gerente"})`,
              actualizadoEn: new Date().toISOString().replace("T", " ").slice(0, 16),
            }
          : s
      )
    );

    await registrarAccionAuditoria(
      "Modificación de Mensaje de Segmento",
      "mensajes_segmento",
      `Se actualizó el mensaje oficial para el segmento "${nombreSeg}". Nueva versión aplicada con éxito.`,
      "Red Multisede"
    );
  };

  const aplicarMensajeAClientesSeleccionados = async (
    segmentoClave: string,
    mensajeTexto: string,
    socios: Array<{ dni: string; nombre: string; telefono?: string; email?: string; sede: string; modulo: "onboarding" | "sleepers" | "contratos" | "gift" }>
  ) => {
    const fechaHora = new Date().toISOString().replace("T", " ").slice(0, 16);
    let count = 0;

    for (const s of socios) {
      const personalMensaje = mensajeTexto
        .replace(/\{nombre\}/gi, s.nombre)
        .replace(/\{sede\}/gi, s.sede || gerente.sede)
        .replace(/\{gerente\}/gi, `${gerente.nombre} ${gerente.apellido}`)
        .replace(/\{cargo\}/gi, gerente.rol === "director" ? "Director General" : "Gerente de Sede");

      const nuevaInteraccion: RegistroInteraccion = {
        id: `int-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        socio_dni: s.dni,
        socio_nombre: s.nombre,
        canal: "whatsapp",
        modulo: s.modulo,
        hito: segmentoClave,
        mensaje: personalMensaje,
        gerente_nombre: `${gerente.nombre} ${gerente.apellido}`,
        sede: s.sede || gerente.sede,
        fecha: fechaHora,
      };

      setInteracciones((prev) => [nuevaInteraccion, ...prev]);

      if (s.modulo === "sleepers") {
        setCasos((prev) =>
          prev.map((c) =>
            c.dni === s.dni
              ? {
                  ...c,
                  fecha_envio_mensaje: fechaHora,
                  fecha_envio_mensaje_1: c.fecha_envio_mensaje_1 || fechaHora,
                  estado_seguimiento: "primer_mensaje_enviado",
                  estado: "Gestionado",
                }
              : c
          )
        );
      } else if (s.modulo === "contratos") {
        setContratos((prev) =>
          prev.map((c) =>
            c.dni === s.dni
              ? {
                  ...c,
                  fecha_ultimo_contacto: fechaHora,
                  estado: "Seguimiento",
                }
              : c
          )
        );
      } else if (s.modulo === "onboarding") {
        setOnboardings((prev) =>
          prev.map((o) =>
            o.dni === s.dni
              ? {
                  ...o,
                  ultimo_contacto: fechaHora,
                  tarea_urgente_asignada: false,
                }
              : o
          )
        );
      }

      count++;
    }

    setConfigMensajesSegmentos((prev) =>
      prev.map((seg) =>
        seg.clave === segmentoClave
          ? { ...seg, totalEnviosHistoricos: seg.totalEnviosHistoricos + count }
          : seg
      )
    );

    await registrarAccionAuditoria(
      "Envío y Aplicación de Mensaje a Clientes",
      "mensajes_segmento",
      `Se aplicó y envió el mensaje del segmento "${segmentoClave}" a ${count} clientes seleccionados.`,
      gerente.sede
    );

    return { enviados: count };
  };

  // --- AUDITOR & CADENA DE APROBACIÓN JERÁRQUICA ---
  // 1. El Director aprueba al Gerente de Sede
  const aprobarGerentePorDirector = async (miembroId: string, aprobado: boolean) => {
    const miembro = equipo.find((m) => m.id === miembroId);
    const nombreMiembro = miembro ? `${miembro.nombre} ${miembro.apellido}` : miembroId;
    const sedeMiembro = miembro ? miembro.sede : "General";

    setEquipo((prev) =>
      prev.map((m) =>
        m.id === miembroId
          ? {
              ...m,
              aprobadoPorDirector: aprobado,
              estadoAprobacionDirector: aprobado ? "aprobado" : "suspendido",
              fechaAprobacionDirector: aprobado ? new Date().toISOString().slice(0, 10) : undefined,
              directorAprobadorNombre: aprobado ? `${gerente.nombre} ${gerente.apellido} (Director)` : undefined,
              permisos: {
                ...m.permisos,
                autorizar_equipo: aprobado,
                enviar_masivo: aprobado,
                ingestar_archivos: aprobado,
                exportar_auditoria: aprobado,
              },
            }
          : m
      )
    );

    await registrarAccionAuditoria(
      aprobado ? "Aprobación Ejecutiva de Gerente de Sede" : "Suspensión de Gerente de Sede",
      "aprobacion_gerente",
      aprobado
        ? `El Director ratificó y aprobó a ${nombreMiembro} como Gerente de Sede ${sedeMiembro} con facultades completas.`
        : `El Director suspendió la aprobación ejecutiva de ${nombreMiembro} en Sede ${sedeMiembro}. Permisos pausados.`,
      sedeMiembro
    );
  };

  // 2. El Gerente de Sede autoriza a su Equipo (Coordinadores, Supervisores)
  const autorizarEquipoPorGerente = async (miembroId: string, autorizado: boolean) => {
    const miembro = equipo.find((m) => m.id === miembroId);
    const nombreMiembro = miembro ? `${miembro.nombre} ${miembro.apellido}` : miembroId;
    const sedeMiembro = miembro ? miembro.sede : gerente.sede;

    setEquipo((prev) =>
      prev.map((m) =>
        m.id === miembroId
          ? {
              ...m,
              autorizadoPorGerente: autorizado,
              estadoAutorizacionGerente: autorizado ? "autorizado" : "revocado",
              fechaAutorizacionGerente: autorizado ? new Date().toISOString().slice(0, 10) : undefined,
              gerenteAutorizadorNombre: autorizado ? `${gerente.nombre} ${gerente.apellido} (${gerente.rol})` : undefined,
              permisos: {
                ...m.permisos,
                enviar_individual: autorizado,
                gestionar_alertas: autorizado,
              },
            }
          : m
      )
    );

    await registrarAccionAuditoria(
      autorizado ? "Autorización de Colaborador por Gerente de Sede" : "Revocación de Permiso a Colaborador",
      "autorizacion_equipo",
      autorizado
        ? `El Gerente de Sede autorizó a ${nombreMiembro} (${miembro?.cargoEspecifico || "Equipo"}) en Sede ${sedeMiembro}.`
        : `El Gerente de Sede revocó la autorización operativa de ${nombreMiembro} en Sede ${sedeMiembro}.`,
      sedeMiembro
    );
  };

  const actualizarPermisosMiembro = async (miembroId: string, permisosNuevos: Partial<PermisosUsuario>) => {
    const miembro = equipo.find((m) => m.id === miembroId);
    const nombreMiembro = miembro ? `${miembro.nombre} ${miembro.apellido}` : miembroId;

    setEquipo((prev) =>
      prev.map((m) =>
        m.id === miembroId
          ? {
              ...m,
              permisos: {
                ...m.permisos,
                ...permisosNuevos,
              },
            }
          : m
      )
    );

    await registrarAccionAuditoria(
      "Ajuste en Matriz de Permisos",
      "permisos",
      `Se modificaron los permisos de ${nombreMiembro}: ${Object.entries(permisosNuevos).map(([k, v]) => `${k}:${v}`).join(", ")}`,
      miembro?.sede
    );
  };

  const agregarMiembroEquipo = async (nuevo: Omit<MiembroEquipo, "id" | "fechaIngreso">) => {
    const id = `mbr-${Date.now()}`;
    const miembroCompleto: MiembroEquipo = {
      ...nuevo,
      id,
      fechaIngreso: new Date().toISOString().slice(0, 10),
    };

    setEquipo((prev) => [miembroCompleto, ...prev]);

    await registrarAccionAuditoria(
      "Alta de Nuevo Miembro de Equipo",
      "autorizacion_equipo",
      `Se registró en el sistema a ${miembroCompleto.nombre} ${miembroCompleto.apellido} como ${miembroCompleto.cargoEspecifico} en Sede ${miembroCompleto.sede}.`,
      miembroCompleto.sede
    );
  };

  const eliminarMiembroEquipo = async (miembroId: string) => {
    const miembro = equipo.find((m) => m.id === miembroId);
    setEquipo((prev) => prev.filter((m) => m.id !== miembroId));

    if (miembro) {
      await registrarAccionAuditoria(
        "Baja de Miembro de Equipo",
        "seguridad",
        `Se eliminó del registro a ${miembro.nombre} ${miembro.apellido} de Sede ${miembro.sede}.`,
        miembro.sede
      );
    }
  };

  // Motor de Mensajería: Construcción de plantilla dinámica
  const construirMensajeHito = useCallback((socio: SocioOnboarding): string => {
    const primerNombre = socio.nombre.split(" ")[0] || "Socio";
    const nombreGerente = `${gerente.nombre} ${gerente.apellido}`;
    const cargo = gerente.cargo || "Gerente de Sede";
    const nombreSede = socio.sede || gerente.sede;

    if (socio.hito_actual === "Hito 1") {
      return `Hola ${primerNombre}, ¿cómo estás?

Soy ${nombreGerente}, ${cargo} de MEGATLON ${nombreSede}.

¡Te doy una muy cálida bienvenida a la comunidad de MEGATLON! Nos alegra un montón que hayas decidido empezar a entrenar con nosotros.

Mi idea es acompañarte desde este primer día para que tu experiencia en el club sea impecable y te sientas como en casa.

Para darte una mano y conectarte directo con el profe indicado: ¿qué tenés pensado priorizar en esta primera etapa? (¿sala de pesas/musculación, alguna clase guiada, pileta o outdoor?).

Contame por acá y te dejamos todo preparado para cuando vengas.

¡Nos vemos en el club!`;
    }

    if (socio.hito_actual === "Hito 2") {
      if (socio.hito2_satisfaccion === "Fricción" || socio.alerta_roja) {
        return `Hola ${primerNombre}, ¿cómo va?

Te escribe ${nombreGerente}, ${cargo} de MEGATLON ${nombreSede}.

Estuve revisando las primeras devoluciones y vi que en estos primeros días hubo algunas cosas que no te cerraron del todo o que se hicieron cuesta arriba. Me importa un montón que estés a gusto desde el comienzo y quiero ver de qué forma podemos solucionarlo.

Contame qué fue lo que pasó o qué esperabas encontrar, así lo revisamos juntos y lo ajustamos ya mismo.

¡Gracias por la sinceridad!`;
      }
      return `Hola ${primerNombre}, ¿cómo estás?

Acá nuevamente ${nombreGerente}, ${cargo} de MEGATLON ${nombreSede}.

Ya pasaron tus primeros días entrenando con nosotros y te escribo para saber cómo te sentiste: ¿pudiste conectar bien con los profes? ¿Te resultó cómoda la sede y las máquinas o las clases?

Si hay algo que no haya resultado tal como esperabas o tenés alguna duda sobre tu rutina, no dudes en compartírmelo. Estoy acá para darte una mano y ayudarte a disfrutar cada entrenamiento.

¡Que tengas un gran día!`;
    }

    if (socio.hito_actual === "Hito 3") {
      if (socio.hito3_frecuencia_ok === false) {
        return `Hola ${primerNombre}, ¿cómo estás?

Te escribe ${nombreGerente}, ${cargo} de MEGATLON ${nombreSede}.

Estuve viendo que en estos últimos días te costó un poco venir con la regularidad que te habías propuesto. Todos sabemos que instalar el hábito las primeras semanas a veces se complica con la rutina del trabajo y los tiempos personales.

Si querés, podemos armar un cambio en tu rutina, ajustar un plan express de 35 minutos o ver qué te está faltando para que te resulte más cómodo retomar.

¡Tomá este mensaje como un pequeño empujón! Escribime por acá y lo vemos juntos.`;
      }
      return `Hola ${primerNombre}, ¿cómo estás?

¡Qué bueno ver que venís sosteniendo el ritmo en estas dos primeras semanas en MEGATLON ${nombreSede}! Te escribe ${nombreGerente}.

Ya conociendo mejor los ejercicios y la dinámica del gimnasio: ¿sentís que el plan actual es el adecuado para lo que buscás o querés que le peguemos una mirada con los profes para renovar ejercicios o probar alguna clase nueva?

Contame qué te anda dando vueltas por la cabeza y lo armamos por acá.

¡A seguir metiéndole con todo!`;
    }

    if (socio.alerta_roja || (socio.hito4_asistencia_real < 5 && socio.hito4_status === "Alerta Roja")) {
      return `Hola ${primerNombre}, ¿cómo estás?

Soy ${nombreGerente}, ${cargo} de MEGATLON ${nombreSede}.

Te escribo personalmente porque veo que en este primer mes no pudiste venir con la regularidad que planeabas, y me importa un montón que no pierdas tu inversión ni las ganas de entrenar.

A veces es simplemente una cuestión de horarios, de rutina o de encontrar la actividad justa. Me encantaría invitarte un café acá en la sede y charlar 5 minutos para ver cómo podemos reorganizar tu plan para que realmente te sirva.

¿Qué día y horario te queda más cómodo para que nos crucemos?

Un abrazo,`;
    }

    return `Hola ${primerNombre},

¡Felicitaciones! Cumpliste tu primer mes entrenando en MEGATLON ${nombreSede} y se nota un montón tu compromiso y constancia. Te escribe ${nombreGerente}.

Nos encanta tenerte entrenando firme con nosotros. Para celebrar este primer paso en tu hábito, te habilitamos un Pase Libre de 7 Días para un amigo o familiar, para que venga a entrenar con vos gratis esta semana.

Pasame su nombre y teléfono por acá y se lo dejamos listo en recepción.

¡Gracias por la buena energía de siempre y vamos por otro mes genial!`;
  }, [gerente]);

  // Registro de interacción
  const registrarInteraccion = async (
    socioDni: string,
    socioNombre: string,
    canal: "whatsapp" | "email" | "llamada" | "presencial",
    modulo: "onboarding" | "sleepers" | "contratos" | "gift",
    mensaje: string,
    hito?: string
  ) => {
    const id = `int-${Date.now()}`;
    const nuevo: RegistroInteraccion = {
      id,
      socio_dni: socioDni,
      socio_nombre: socioNombre,
      canal,
      modulo,
      hito: hito || "",
      mensaje,
      gerente_nombre: `${gerente.nombre} ${gerente.apellido}`,
      sede: gerente.sede,
      fecha: new Date().toISOString().replace("T", " ").slice(0, 16)
    };

    setInteracciones((prev) => [nuevo, ...prev]);

    try {
      await setDoc(doc(db, "interactions", id), nuevo);
    } catch {}
  };

  const enviarWhatsApp = (
    telefono: string,
    mensaje: string,
    socioDni: string,
    socioNombre: string,
    modulo: "onboarding" | "sleepers" | "contratos" | "gift",
    hito?: string
  ) => {
    const limpio = telefono.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${limpio}?text=${encodeURIComponent(mensaje)}`;
    
    registrarInteraccion(socioDni, socioNombre, "whatsapp", modulo, mensaje, hito);

    if (modulo === "onboarding") {
      setOnboardings((prev) =>
        prev.map((o) =>
          o.dni === socioDni ? { ...o, ultimo_contacto: new Date().toISOString().slice(0, 10) } : o
        )
      );
    } else if (modulo === "sleepers") {
      setCasos((prev) =>
        prev.map((c) =>
          c.dni === socioDni
            ? { ...c, estado: "Gestionado", fecha_envio_mensaje: new Date().toISOString().slice(0, 10) }
            : c
        )
      );
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const enviarEmail = (
    email: string,
    asunto: string,
    mensaje: string,
    socioDni: string,
    socioNombre: string,
    modulo: "onboarding" | "sleepers" | "contratos" | "gift",
    hito?: string
  ) => {
    const url = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;
    
    registrarInteraccion(socioDni, socioNombre, "email", modulo, mensaje, hito);

    if (modulo === "onboarding") {
      setOnboardings((prev) =>
        prev.map((o) =>
          o.dni === socioDni ? { ...o, ultimo_contacto: new Date().toISOString().slice(0, 10) } : o
        )
      );
    }

    window.open(url, "_blank");
  };

  // Ingestión de Sleepers
  const importarSleepersDesdeArchivo = async (lista: Array<Partial<CasoSleeper>>) => {
    let agregados = 0;
    const nuevosCasos = [...casos];

    for (const item of lista) {
      if (!item.dni || !item.nombre) continue;
      const dniLimpio = item.dni.replace(/[^0-9]/g, "");
      const existeIdx = nuevosCasos.findIndex((c) => c.dni.replace(/[^0-9]/g, "") === dniLimpio);

      const defaultFechaFin = new Date();
      defaultFechaFin.setMonth(defaultFechaFin.getMonth() + 2);
      const defaultFechaFinStr = defaultFechaFin.toISOString().slice(0, 10);

      const casoNormalizado: CasoSleeper = {
        id: existeIdx >= 0 ? nuevosCasos[existeIdx].id : `slp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        dni: item.dni,
        nombre: item.nombre,
        telefono: item.telefono || "+54 9 11 0000-0000",
        email: item.email || "socio@megatlon.com.ar",
        sede: item.sede || gerente.sede,
        plan: item.plan || "Pase Anual Megatlon",
        dias_sin_asistir: Number(item.dias_sin_asistir) || 20,
        ultimo_acceso: item.ultimo_acceso || new Date().toISOString().slice(0, 10),
        fecha_fin_contrato: item.fecha_fin_contrato || defaultFechaFinStr,
        estado: item.estado || "Abierto",
        riesgo: item.riesgo || ((Number(item.dias_sin_asistir) || 20) > 30 ? "Alto" : "Medio"),
        motivo: item.motivo || "",
        intencion_volver: item.intencion_volver || "Pensando",
        actividad_favorita: item.actividad_favorita || "Musculación",
        nps_score: typeof item.nps_score === "number" ? item.nps_score : undefined,
        creado_en: new Date().toISOString().slice(0, 10),
      };

      if (existeIdx >= 0) {
        nuevosCasos[existeIdx] = { ...nuevosCasos[existeIdx], ...casoNormalizado };
      } else {
        nuevosCasos.unshift(casoNormalizado);
      }

      agregados++;
      try {
        setDoc(doc(db, "sleepers", casoNormalizado.id), casoNormalizado, { merge: true }).catch(() => {});
      } catch {}
    }

    setCasos(nuevosCasos);
    return agregados;
  };

  // Ingestión y Cruce Triple para Contratos (DNI + NPS + Accesos)
  const procesarCruceTripleContratos = async (
    contratosRaw: IngestionContratoItem[],
    accesosRaw: IngestionAccesoItem[],
    npsRaw: IngestionNpsItem[]
  ) => {
    const accesosMap = new Map<string, IngestionAccesoItem>();
    accesosRaw.forEach((a) => {
      const clean = a.dni.replace(/[^0-9]/g, "");
      accesosMap.set(clean, a);
    });

    const npsMap = new Map<string, IngestionNpsItem>();
    npsRaw.forEach((n) => {
      const clean = n.dni.replace(/[^0-9]/g, "");
      npsMap.set(clean, n);
    });

    const nuevosContratos = [...contratos];
    let procesados = 0;

    for (const c of contratosRaw) {
      if (!c.dni || !c.nombre) continue;
      const cleanDni = c.dni.replace(/[^0-9]/g, "");
      const acceso = accesosMap.get(cleanDni);
      const nps = npsMap.get(cleanDni);

      const frecuencia = acceso ? acceso.frecuencia_semanal : 1.2;
      const npsScore = nps ? nps.nps_score : 7;
      const npsComentario = nps?.nps_comentario || "";
      const diasVencer = c.dias_para_vencer || 110;

      let scoreSalud = 5;
      if (frecuencia >= 3) scoreSalud += 3;
      else if (frecuencia >= 1.5) scoreSalud += 1;
      else scoreSalud -= 2;

      if (npsScore >= 9) scoreSalud += 2;
      else if (npsScore <= 6) scoreSalud -= 2;

      scoreSalud = Math.max(1, Math.min(10, scoreSalud));

      let riesgoBaja: "Alto" | "Medio" | "Bajo" = "Medio";
      if (scoreSalud <= 4 || frecuencia < 1.0 || npsScore <= 6) {
        riesgoBaja = "Alto";
      } else if (scoreSalud >= 8 && frecuencia >= 2.5 && npsScore >= 8) {
        riesgoBaja = "Bajo";
      }

      const idx = nuevosContratos.findIndex((item) => item.dni.replace(/[^0-9]/g, "") === cleanDni);
      const contratoFinal: RegistroContrato = {
        id: idx >= 0 ? nuevosContratos[idx].id : `cnt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        dni: c.dni,
        nombre: c.nombre,
        telefono: c.telefono || "+54 9 11 0000-0000",
        email: c.email || "socio@megatlon.com.ar",
        sede: c.sede || gerente.sede,
        plan: c.plan || "Pase Anual Megatlon",
        fecha_fin_contrato: c.fecha_fin_contrato,
        dias_para_vencer: diasVencer,
        score_salud: scoreSalud,
        frecuencia_semanal_promedio: frecuencia,
        nps_score: npsScore,
        nps_comentario: npsComentario,
        riesgo_baja: riesgoBaja,
        estado: "Abierto",
        resultado_gestion: "",
        notas: `Cruce por DNI automático: Frecuencia ${frecuencia}x/sem | NPS: ${npsScore}/10 ${npsComentario ? `("${npsComentario}")` : ""}`
      };

      if (idx >= 0) {
        nuevosContratos[idx] = { ...nuevosContratos[idx], ...contratoFinal };
      } else {
        nuevosContratos.unshift(contratoFinal);
      }

      procesados++;
      try {
        setDoc(doc(db, "contratos", contratoFinal.id), contratoFinal, { merge: true }).catch(() => {});
      } catch {}
    }

    setContratos(nuevosContratos);
    return procesados;
  };

  // Ingestión de Onboarding
  const importarOnboardingDesdeArchivo = async (lista: Array<Partial<SocioOnboarding>>) => {
    let importados = 0;
    const nuevos = [...onboardings];

    for (const item of lista) {
      if (!item.dni || !item.nombre) continue;
      const cleanDni = item.dni.replace(/[^0-9]/g, "");
      const idx = nuevos.findIndex((o) => o.dni.replace(/[^0-9]/g, "") === cleanDni);

      const diasAlta = Number(item.dias_desde_alta) || 1;
      let hito: HitoOnboarding = "Hito 1";
      if (diasAlta >= 25) hito = "Hito 4";
      else if (diasAlta >= 10) hito = "Hito 3";
      else if (diasAlta >= 4) hito = "Hito 2";

      const socioFinal: SocioOnboarding = {
        id: idx >= 0 ? nuevos[idx].id : `onb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        dni: item.dni,
        nombre: item.nombre,
        telefono: item.telefono || "+54 9 11 0000-0000",
        email: item.email || "nuevo.socio@megatlon.com.ar",
        sede: item.sede || gerente.sede,
        fecha_alta: item.fecha_alta || new Date().toISOString().slice(0, 10),
        dias_desde_alta: diasAlta,
        rama: item.rama || "Sin clasificar",
        hito_actual: item.hito_actual || hito,
        hito1_completado: diasAlta >= 3,
        hito2_completado: diasAlta >= 6,
        hito3_completado: diasAlta >= 15,
        hito4_completado: diasAlta >= 30,
        hito4_asistencia_real: Number(item.hito4_asistencia_real) || Math.min(diasAlta, 8),
        alerta_roja: Boolean(item.alerta_roja) || (diasAlta >= 25 && (Number(item.hito4_asistencia_real) || 0) < 4),
        alerta_motivo: item.alerta_motivo || "",
        tarea_urgente_asignada: Boolean(item.tarea_urgente_asignada),
        tarea_resuelta: false,
        updatedAt: new Date().toISOString()
      };

      if (idx >= 0) {
        nuevos[idx] = { ...nuevos[idx], ...socioFinal };
      } else {
        nuevos.unshift(socioFinal);
      }

      importados++;
      try {
        setDoc(doc(db, "onboardings", socioFinal.id), socioFinal, { merge: true }).catch(() => {});
      } catch {}
    }

    setOnboardings(nuevos);
    return importados;
  };

  const restaurarMensajesOficiales = () => {
    setPlantillas(PLANTILLAS_INICIALES);
    setConfigMensajesSegmentos(CONFIG_MENSAJES_SEGMENTOS_INICIALES);
    localStorage.setItem("megatlon_plantillas_v6", JSON.stringify(PLANTILLAS_INICIALES));
    localStorage.setItem("megatlon_mensajes_segmentos_v6", JSON.stringify(CONFIG_MENSAJES_SEGMENTOS_INICIALES));
  };

  const reiniciarDatosDemo = async () => {
    setOnboardings(ONBOARDING_INICIALES);
    setCasos(CASOS_SLEEPERS_INICIALES);
    setContratos(CONTRATOS_INICIALES);
    setGifts(GIFT_INICIALES);
    setComentarios(COMENTARIOS_INICIALES);
    setPlantillas(PLANTILLAS_INICIALES);
    setConfigMensajesSegmentos(CONFIG_MENSAJES_SEGMENTOS_INICIALES);

    localStorage.removeItem("megatlon_onboardings");
    localStorage.removeItem("megatlon_casos");
    localStorage.removeItem("megatlon_contratos");
    localStorage.removeItem("megatlon_gifts");
    localStorage.removeItem("megatlon_comentarios");
    localStorage.removeItem("megatlon_interacciones");
    localStorage.removeItem("megatlon_plantillas");
    localStorage.setItem("megatlon_plantillas_v5", JSON.stringify(PLANTILLAS_INICIALES));
    localStorage.setItem("megatlon_mensajes_segmentos_v5", JSON.stringify(CONFIG_MENSAJES_SEGMENTOS_INICIALES));

    try {
      for (const onb of ONBOARDING_INICIALES) {
        await setDoc(doc(db, "onboardings", onb.id), onb);
      }
      for (const slp of CASOS_SLEEPERS_INICIALES) {
        await setDoc(doc(db, "sleepers", slp.id), slp);
      }
      for (const cnt of CONTRATOS_INICIALES) {
        await setDoc(doc(db, "contratos", cnt.id), cnt);
      }
    } catch {}
  };

  return (
    <MegatlonContext.Provider
      value={{
        gerente,
        setGerente,
        actualizarPerfilGerente,
        soloMiSede,
        setSoloMiSede,
        sedeFiltroActiva,
        setSedeFiltroActiva,
        filtroSedeGlobal,
        setFiltroSedeGlobal,
        perfil,
        setPerfil,
        cargoFirma,
        setCargoFirma,

        onboardings,
        onboardingsFiltrados,
        actualizarHitoOnboarding,
        actualizarRamaOnboarding,
        resolverAlertaRoja,
        agregarSocioOnboarding,

        casos,
        casosFiltrados,
        contratos,
        contratosFiltrados,
        gifts,
        comentarios,
        interacciones,
        plantillas,
        flyers,

        actualizarCasoSleeper,
        agregarCasoSleeper,
        enviarMensajeSleeper,
        actualizarContrato,
        actualizarGift,
        agregarComentario,
        agregarComentarioCompleto,
        actualizarNpsSocio,
        actualizarPlantilla,
        agregarFlyer,

        construirMensajeHito,
        registrarInteraccion,
        enviarWhatsApp,
        enviarEmail,

        importarSleepersDesdeArchivo,
        procesarCruceTripleContratos,
        importarOnboardingDesdeArchivo,

        // Administración de Mensajes por Segmento (Solo Director)
        configMensajesSegmentos,
        actualizarMensajeSegmento,
        aplicarMensajeAClientesSeleccionados,

        // Auditor & Jerarquía de Equipo
        equipo,
        aprobarGerentePorDirector,
        autorizarEquipoPorGerente,
        actualizarPermisosMiembro,
        agregarMiembroEquipo,
        eliminarMiembroEquipo,
        registrosAuditoria,
        registrarAccionAuditoria,

        reiniciarDatosDemo,
        restaurarMensajesOficiales,
        isFirebaseSynced,
      }}
    >
      {children}
    </MegatlonContext.Provider>
  );
};

export const useMegatlon = () => {
  const context = useContext(MegatlonContext);
  if (!context) {
    throw new Error("useMegatlon must be used within a MegatlonProvider");
  }
  return context;
};
