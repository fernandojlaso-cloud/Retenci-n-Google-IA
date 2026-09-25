import { 
  CasoSleeper, 
  RegistroContrato, 
  RegistroGift, 
  PlantillaMensaje, 
  PerfilGerente, 
  ComentarioCaso, 
  FlyerCreative,
  SocioOnboarding,
  RegistroInteraccion,
  SEDES_MEGATLON as SEDES_LISTA,
  MiembroEquipo,
  RegistroAuditoria,
  ConfigMensajeSegmento,
} from "./types";

export const SEDES_MEGATLON = SEDES_LISTA;

export const GERENTE_INICIAL: PerfilGerente = {
  id: "mgr-01",
  nombre: "Fernando",
  apellido: "Laso",
  email: "flaso@megatlon.com.ar",
  rol: "gerente",
  cargo: "Gerente de Sede",
  sede: "Almagro",
  fechaIngreso: "2024-03-01",
};

export const USUARIO_INICIAL = {
  id: "usr-01",
  nombre: "Fernando Laso",
  email: "flaso@megatlon.com.ar",
  rol: "gerente" as const,
  sede: "Almagro",
  estado: "activo" as const,
};

export const ONBOARDING_INICIALES: SocioOnboarding[] = [
  // Hito 1: Día 1 a 2 - Alta Administrativa y Diagnóstico
  {
    id: "onb-001",
    dni: "42.881.042",
    nombre: "Camila Beltrán",
    telefono: "+54 9 11 4192-3301",
    email: "camila.beltran@gmail.com",
    sede: "Almagro",
    fecha_alta: "2026-09-23",
    dias_desde_alta: 1,
    rama: "Sin clasificar",
    hito_actual: "Hito 1",
    hito1_completado: false,
    hito2_completado: false,
    hito3_completado: false,
    hito4_completado: false,
    hito4_asistencia_real: 0,
    alerta_roja: false,
    tarea_urgente_asignada: false,
    tarea_resuelta: false,
    updatedAt: "2026-09-23"
  },
  {
    id: "onb-002",
    dni: "39.145.228",
    nombre: "Lucas San Román",
    telefono: "+54 9 11 5029-7711",
    email: "lucas.sanroman@outlook.com",
    sede: "Almagro",
    fecha_alta: "2026-09-22",
    dias_desde_alta: 2,
    rama: "Musculación",
    hito_actual: "Hito 1",
    hito1_completado: true,
    hito1_fecha: "2026-09-23",
    hito1_respuesta: "Confirmó que su objetivo primordial es hipertrofia y sala de pesas con profe.",
    hito2_completado: false,
    hito3_completado: false,
    hito4_completado: false,
    hito4_asistencia_real: 1,
    alerta_roja: false,
    tarea_urgente_asignada: false,
    tarea_resuelta: false,
    updatedAt: "2026-09-23"
  },
  {
    id: "onb-003",
    dni: "36.772.901",
    nombre: "Mariana Godoy",
    telefono: "+54 9 11 6391-4402",
    email: "mariana.godoy@gmail.com",
    sede: "Recoleta",
    fecha_alta: "2026-09-23",
    dias_desde_alta: 1,
    rama: "Clases de Técnicas",
    hito_actual: "Hito 1",
    hito1_completado: true,
    hito1_fecha: "2026-09-23",
    hito1_respuesta: "Interesada en Yoga, Pilates reformer y Funcional.",
    hito2_completado: false,
    hito3_completado: false,
    hito4_completado: false,
    hito4_asistencia_real: 0,
    alerta_roja: false,
    tarea_urgente_asignada: false,
    tarea_resuelta: false,
    updatedAt: "2026-09-23"
  },

  // Hito 2: Día 4 a 5 - Primer Pulso de Adaptación
  {
    id: "onb-004",
    dni: "41.200.415",
    nombre: "Nicolás Rossi",
    telefono: "+54 9 11 3820-9988",
    email: "nico.rossi@yahoo.com.ar",
    sede: "Almagro",
    fecha_alta: "2026-09-19",
    dias_desde_alta: 5,
    rama: "Musculación",
    hito_actual: "Hito 2",
    hito1_completado: true,
    hito1_fecha: "2026-09-20",
    hito2_completado: true,
    hito2_fecha: "2026-09-24",
    hito2_feedback: "Todo excelente con el profe Martín en sala. Le armó rutina para 3 días.",
    hito2_satisfaccion: "Excelente",
    hito3_completado: false,
    hito4_completado: false,
    hito4_asistencia_real: 3,
    alerta_roja: false,
    tarea_urgente_asignada: false,
    tarea_resuelta: false,
    updatedAt: "2026-09-24"
  },
  {
    id: "onb-005",
    dni: "38.650.312",
    nombre: "Valeria Benítez",
    telefono: "+54 9 11 5901-3322",
    email: "vale.benitez@gmail.com",
    sede: "Belgrano",
    fecha_alta: "2026-09-20",
    dias_desde_alta: 4,
    rama: "Pileta",
    hito_actual: "Hito 2",
    hito1_completado: true,
    hito1_fecha: "2026-09-21",
    hito2_completado: false,
    hito3_completado: false,
    hito4_completado: false,
    hito4_asistencia_real: 2,
    alerta_roja: false,
    tarea_urgente_asignada: false,
    tarea_resuelta: false,
    updatedAt: "2026-09-24"
  },
  {
    id: "onb-006",
    dni: "35.882.109",
    nombre: "Joaquín Pereyra",
    telefono: "+54 9 11 4410-8877",
    email: "joaquin.p@speedy.com.ar",
    sede: "Almagro",
    fecha_alta: "2026-09-20",
    dias_desde_alta: 4,
    rama: "Clases de Técnicas",
    hito_actual: "Hito 2",
    hito1_completado: true,
    hito1_fecha: "2026-09-21",
    hito2_completado: false,
    hito3_completado: false,
    hito4_completado: false,
    hito4_asistencia_real: 1,
    alerta_roja: false,
    tarea_urgente_asignada: false,
    tarea_resuelta: false,
    updatedAt: "2026-09-24"
  },

  // Hito 3: Día 10 a 14 - Nodo de Profundización y Ajuste
  {
    id: "onb-007",
    dni: "37.912.440",
    nombre: "Agustina Carrizo",
    telefono: "+54 9 11 7180-2214",
    email: "agustina.c@gmail.com",
    sede: "Almagro",
    fecha_alta: "2026-09-12",
    dias_desde_alta: 12,
    rama: "Outdoor",
    hito_actual: "Hito 3",
    hito1_completado: true,
    hito1_fecha: "2026-09-13",
    hito2_completado: true,
    hito2_fecha: "2026-09-16",
    hito2_satisfaccion: "Buena",
    hito3_completado: true,
    hito3_fecha: "2026-09-23",
    hito3_progreso: "Entrenando con el grupo de Running los martes y jueves en Parque Centenario.",
    hito3_frecuencia_ok: true,
    hito4_completado: false,
    hito4_asistencia_real: 6,
    alerta_roja: false,
    tarea_urgente_asignada: false,
    tarea_resuelta: false,
    updatedAt: "2026-09-23"
  },
  {
    id: "onb-008",
    dni: "34.502.811",
    nombre: "Esteban Duarte",
    telefono: "+54 9 11 4899-1123",
    email: "esteban.duarte@hotmail.com",
    sede: "Caballito",
    fecha_alta: "2026-09-13",
    dias_desde_alta: 11,
    rama: "Musculación",
    hito_actual: "Hito 3",
    hito1_completado: true,
    hito2_completado: true,
    hito2_satisfaccion: "Fricción",
    hito2_feedback: "Sintió mucha gente a las 19hs en banco plano.",
    hito3_completado: false,
    hito4_completado: false,
    hito4_asistencia_real: 2,
    alerta_roja: true,
    alerta_motivo: "Baja frecuencia en día 11 (solo 2 asistencias) y fricción con horario pico de sala.",
    tarea_urgente_asignada: true,
    tarea_resuelta: false,
    updatedAt: "2026-09-24"
  },

  // Hito 4: Día 25 a 30 - Evaluación de Cierre, Hábito y Retención (Mes 1)
  {
    id: "onb-009",
    dni: "33.910.822",
    nombre: "Pablo Varela",
    telefono: "+54 9 11 5110-9933",
    email: "pablo.varela@empresa.com",
    sede: "Almagro",
    fecha_alta: "2026-08-27",
    dias_desde_alta: 28,
    rama: "Musculación",
    hito_actual: "Hito 4",
    hito1_completado: true,
    hito2_completado: true,
    hito2_satisfaccion: "Excelente",
    hito3_completado: true,
    hito3_frecuencia_ok: true,
    hito4_completado: true,
    hito4_fecha: "2026-09-23",
    hito4_asistencia_real: 14,
    hito4_status: "Positivo",
    alerta_roja: false,
    tarea_urgente_asignada: false,
    tarea_resuelta: false,
    updatedAt: "2026-09-23"
  },
  {
    id: "onb-010",
    dni: "40.402.190",
    nombre: "Julieta Marcone",
    telefono: "+54 9 11 3290-7711",
    email: "julieta.marcone@gmail.com",
    sede: "Almagro",
    fecha_alta: "2026-08-28",
    dias_desde_alta: 27,
    rama: "Clases de Técnicas",
    hito_actual: "Hito 4",
    hito1_completado: true,
    hito2_completado: true,
    hito2_satisfaccion: "Fricción",
    hito2_feedback: "Le costó reservar turno para Pilates en la app y no volvió a intentar.",
    hito3_completado: true,
    hito3_frecuencia_ok: false,
    hito4_completado: false,
    hito4_asistencia_real: 3,
    hito4_status: "Alerta Roja",
    alerta_roja: true,
    alerta_motivo: "ALERTA ROJA MES 1: Solo 3 asistencias en 27 días y fricción registrada en Hito 2 sin resolver. Alto riesgo de abandono.",
    tarea_urgente_asignada: true,
    tarea_resuelta: false,
    updatedAt: "2026-09-24"
  }
];

export const CASOS_SLEEPERS_INICIALES: CasoSleeper[] = [
  {
    id: "slp-101",
    nombre: "Mateo Silveyra",
    dni: "38.942.110",
    telefono: "+54 9 11 4892-3310",
    email: "mateo.silveyra@gmail.com",
    sede: "Almagro",
    dias_sin_asistir: 24,
    ultimo_acceso: "2026-08-31",
    fecha_fin_contrato: "2026-11-15",
    plan: "Pase Libre Anual",
    estado: "Gestionado",
    riesgo: "Alto", // Pasaron más de 15 días tras el 1er msj sin respuesta -> Pasa a Alto y habilita 2do msj
    estado_seguimiento: "segundo_mensaje_requerido",
    motivo: "Falta de tiempo",
    intencion_volver: "Pensando",
    fecha_envio_mensaje: "2026-09-02",
    fecha_envio_mensaje_1: "2026-09-02",
    fecha_seguimiento: "2026-09-17",
    dias_restantes_seguimiento: -7,
    actividad_favorita: "Musculación y Spinning",
    nps_score: 6,
    nps_comentario: "No me alcanzaba el tiempo libre para llegar al turno de las 19hs.",
    creado_en: "2026-09-01",
  },
  {
    id: "slp-102",
    nombre: "Florencia Carballo",
    dni: "35.210.884",
    telefono: "+54 9 11 5920-1142",
    email: "flor.carballo@hotmail.com",
    sede: "Almagro",
    dias_sin_asistir: 19,
    ultimo_acceso: "2026-09-05",
    fecha_fin_contrato: "2026-12-20",
    plan: "Pase Semestral Oro",
    estado: "Gestionado",
    riesgo: "Bajo", // 1er msj enviado hace 4 días, seguimiento en curso (gracia 15 días)
    estado_seguimiento: "primer_mensaje_enviado",
    motivo: "Desmotivación / Pérdida de hábito",
    intencion_volver: "Si",
    fecha_envio_mensaje: "2026-09-20",
    fecha_envio_mensaje_1: "2026-09-20",
    fecha_seguimiento: "2026-10-05",
    dias_restantes_seguimiento: 11,
    actividad_favorita: "Funcional y Pilates",
    nps_score: 9,
    nps_comentario: "Las clases son excelentes, solo me costó retomar la rutina después del viaje.",
    creado_en: "2026-08-20",
  },
  {
    id: "slp-103",
    nombre: "Ignacio De la Torre",
    dni: "31.402.991",
    telefono: "+54 9 11 6019-2281",
    email: "ignacio.delatorre@gmail.com",
    sede: "Almagro",
    dias_sin_asistir: 45,
    ultimo_acceso: "2026-08-08",
    fecha_fin_contrato: "2026-10-28",
    plan: "Pase Anual Red Total",
    estado: "Abierto",
    riesgo: "Alto",
    estado_seguimiento: "pendiente_primer_contacto",
    motivo: "Problemas de salud / Lesión",
    intencion_volver: "No",
    actividad_favorita: "Natación libre",
    nps_score: 5,
    nps_comentario: "Tuve una lesión de rodilla y no pude tramitar el certificado a tiempo.",
    creado_en: "2026-08-10",
  },
  {
    id: "slp-104",
    nombre: "Carolina Rossi",
    dni: "37.521.904",
    telefono: "+54 9 11 6112-9988",
    email: "caro.rossi@gmail.com",
    sede: "Almagro",
    dias_sin_asistir: 22,
    ultimo_acceso: "2026-09-02",
    fecha_fin_contrato: "2026-11-02",
    plan: "Pase Semestral",
    estado: "Gestionado",
    riesgo: "Bajo",
    estado_seguimiento: "primer_mensaje_enviado",
    motivo: "Horarios / Disponibilidad de clases",
    intencion_volver: "Pensando",
    fecha_envio_mensaje: "2026-09-18",
    fecha_envio_mensaje_1: "2026-09-18",
    fecha_seguimiento: "2026-10-03",
    dias_restantes_seguimiento: 9,
    actividad_favorita: "Yoga y Pilates",
    creado_en: "2026-09-05",
  },
  {
    id: "slp-105",
    nombre: "Gonzalo Bilbao",
    dni: "29.880.119",
    telefono: "+54 9 11 4455-8822",
    email: "gonza.bilbao@outlook.com",
    sede: "Almagro",
    dias_sin_asistir: 35,
    ultimo_acceso: "2026-08-18",
    fecha_fin_contrato: "2026-10-15",
    plan: "Pase Corporativo Tech",
    estado: "Gestionado",
    riesgo: "Alto",
    estado_seguimiento: "segundo_mensaje_requerido",
    motivo: "Motivos económicos / Precio",
    intencion_volver: "Pensando",
    fecha_envio_mensaje: "2026-08-28",
    fecha_envio_mensaje_1: "2026-08-28",
    fecha_seguimiento: "2026-09-12",
    dias_restantes_seguimiento: -12,
    actividad_favorita: "Musculación",
    creado_en: "2026-08-25",
  }
];

export const CONTRATOS_INICIALES: RegistroContrato[] = [
  {
    id: "cnt-201",
    nombre: "Martín Palermo Gómez",
    dni: "32.441.902",
    telefono: "+54 9 11 4782-1090",
    email: "martin.palermo@gmail.com",
    sede: "Almagro",
    plan: "Pase Libre Anual Platinum",
    fecha_fin_contrato: "2027-01-15",
    dias_para_vencer: 115,
    score_salud: 2,
    frecuencia_semanal_promedio: 0.6,
    accesos_mes: 3, // GRUPO C (1-4 accesos al mes)
    grupo_acceso: "GRUPO C",
    nps_score: 5, // Detractor (0-6)
    categoria_nps: "Detractor",
    nps_comentario: "Siento que las máquinas del sector de fuerza están ocupadas siempre a mi hora.",
    riesgo_baja: "Alto",
    estado: "Abierto",
    resultado_gestion: "Lo está pensado",
    fecha_ultimo_contacto: "2026-09-12",
    notas: "Manifestó que viaja mucho por trabajo, se le propuso plan corporativo con congelamiento.",
  },
  {
    id: "cnt-202",
    nombre: "Julieta Larrarte",
    dni: "36.882.114",
    telefono: "+54 9 11 5291-7703",
    email: "julieta.larrarte@hotmail.com",
    sede: "Almagro",
    plan: "Pase Semestral Oro",
    fecha_fin_contrato: "2026-12-28",
    dias_para_vencer: 95,
    score_salud: 9,
    frecuencia_semanal_promedio: 3.4,
    accesos_mes: 15, // GRUPO A (>=12 accesos al mes)
    grupo_acceso: "GRUPO A",
    nps_score: 9, // Promotor (9-10)
    categoria_nps: "Promotor",
    nps_comentario: "Las clases de Yoga y el ambiente del club son insuperables.",
    riesgo_baja: "Bajo",
    estado: "Seguimiento",
    resultado_gestion: "Renueva",
    fecha_ultimo_contacto: "2026-09-20",
    notas: "Muy conforme con las clases. Se le ofreció bonificación por renovación anticipada.",
  },
  {
    id: "cnt-203",
    nombre: "Carlos Menem Jr.",
    dni: "30.119.442",
    telefono: "+54 9 11 6310-9922",
    email: "carlos.menem@gmail.com",
    sede: "Almagro",
    plan: "Pase Anual Red Total",
    fecha_fin_contrato: "2027-02-10",
    dias_para_vencer: 140,
    score_salud: 5,
    frecuencia_semanal_promedio: 1.8,
    accesos_mes: 8, // GRUPO B (5-11 accesos al mes)
    grupo_acceso: "GRUPO B",
    nps_score: 7, // Pasivo (7-8)
    categoria_nps: "Pasivo",
    nps_comentario: "El precio se fue un poco alto respecto al tiempo real que puedo aprovechar.",
    riesgo_baja: "Medio",
    estado: "Abierto",
    resultado_gestion: "",
    notas: "Requiere contacto del gerente para ofrecerle plan 3 días por semana.",
  },
  {
    id: "cnt-204",
    nombre: "Lucía Santoro",
    dni: "39.401.552",
    telefono: "+54 9 11 4981-3344",
    email: "lucia.santoro@gmail.com",
    sede: "Almagro",
    plan: "Pase Anual Platinum",
    fecha_fin_contrato: "2027-01-05",
    dias_para_vencer: 105,
    score_salud: 10,
    frecuencia_semanal_promedio: 4.1,
    accesos_mes: 18, // GRUPO A (>=12)
    grupo_acceso: "GRUPO A",
    nps_score: 10, // Promotor (9-10)
    categoria_nps: "Promotor",
    nps_comentario: "Excelente sede, el natatorio y los vestuarios están siempre impecables.",
    riesgo_baja: "Bajo",
    estado: "Seguimiento",
    resultado_gestion: "Renueva",
    notas: "Socia sumamente fidelizada. Coordinar con recepción para regalo de fidelidad.",
  },
  {
    id: "cnt-205",
    nombre: "Esteban Quiroga",
    dni: "33.820.194",
    telefono: "+54 9 11 5829-1100",
    email: "esteban.q@empresa.com",
    sede: "Almagro",
    plan: "Pase Semestral",
    fecha_fin_contrato: "2026-12-10",
    dias_para_vencer: 78,
    score_salud: 3,
    frecuencia_semanal_promedio: 0.9,
    accesos_mes: 4, // GRUPO C (1-4)
    grupo_acceso: "GRUPO C",
    nps_score: 6, // Detractor (0-6)
    categoria_nps: "Detractor",
    nps_comentario: "Mucha demora en la app para reservar clase de spinning al salir del trabajo.",
    riesgo_baja: "Alto",
    estado: "Abierto",
    resultado_gestion: "Lo está pensado",
    notas: "Prioridad de llamada gerencial antes de fin de mes.",
  },
  {
    id: "cnt-206",
    nombre: "Romina Balcarce",
    dni: "37.199.301",
    telefono: "+54 9 11 6720-4491",
    email: "romina.b@hotmail.com",
    sede: "Almagro",
    plan: "Pase Anual Red",
    fecha_fin_contrato: "2027-02-28",
    dias_para_vencer: 155,
    score_salud: 7,
    frecuencia_semanal_promedio: 2.2,
    accesos_mes: 9, // GRUPO B (5-11)
    grupo_acceso: "GRUPO B",
    nps_score: 8, // Pasivo (7-8)
    categoria_nps: "Pasivo",
    nps_comentario: "Muy contenta con las profes de zumba, mejoraría la climatización en verano.",
    riesgo_baja: "Medio",
    estado: "Abierto",
    resultado_gestion: "",
    notas: "Contactar a 90 días del vencimiento.",
  }
];

export const GIFT_INICIALES: RegistroGift[] = [
  {
    id: "gft-301",
    nombre: "Camila Varela",
    telefono: "+54 9 11 4019-8233",
    email: "cami.varela@gmail.com",
    sede: "Almagro",
    invitado_por: "Lucas San Román",
    referido_por: "Lucas San Román",
    fecha_creacion: "2026-09-20",
    fecha_envio_1: "2026-09-21",
    dia_hora_coordinado: "2026-09-25 18:00",
    vino_a_probar: "Si",
    se_inscribio: "Si"
  },
  {
    id: "gft-302",
    nombre: "Mariano Pereyra",
    telefono: "+54 9 11 5110-3344",
    email: "mariano.p@gmail.com",
    sede: "Almagro",
    invitado_por: "Pablo Varela",
    referido_por: "Pablo Varela",
    fecha_creacion: "2026-09-22",
    fecha_envio_1: "2026-09-23",
    vino_a_probar: "No",
    se_inscribio: ""
  }
];

export const COMENTARIOS_INICIALES: ComentarioCaso[] = [
  {
    id: "com-01",
    caso_id: "slp-101",
    socio_dni: "38.942.110",
    socio_nombre: "Mateo Silveyra",
    autor_nombre: "Fernando Laso",
    autor_rol: "Gerente",
    texto: "Se le ofreció cambio de horario matutino en sede Almagro para evitar congestión de las 19hs. Comentó que lo está pensando con su pareja.",
    tipo: "llamada",
    nps_asociado: 6,
    creado_en: "2026-09-14 11:20",
  },
  {
    id: "com-02",
    caso_id: "slp-101",
    socio_dni: "38.942.110",
    socio_nombre: "Mateo Silveyra",
    autor_nombre: "Fernando Laso",
    autor_rol: "Gerente",
    texto: "Primer mensaje de WhatsApp enviado el 02/09. Pasaron los 15 días reglamentarios sin confirmación de asistencia. Se pasa a Riesgo Alto y se prepara 2do mensaje de rescate con rutina express.",
    tipo: "whatsapp",
    creado_en: "2026-09-17 10:00",
  },
  {
    id: "com-03",
    caso_id: "slp-102",
    socio_dni: "35.210.884",
    socio_nombre: "Florencia Carballo",
    autor_nombre: "Fernando Laso",
    autor_rol: "Gerente",
    texto: "Socia contactada por WhatsApp el 20/09. Respondió con muy buena predisposición: vuelve a sala el próximo martes con rutina de reinicio.",
    tipo: "comentario_socio",
    nps_asociado: 9,
    creado_en: "2026-09-21 16:45",
  },
  {
    id: "com-04",
    caso_id: "cnt-201",
    socio_dni: "32.441.902",
    socio_nombre: "Martín Palermo Gómez",
    autor_nombre: "Fernando Laso",
    autor_rol: "Gerente",
    texto: "El socio manifiesta que por motivos de viajes frecuentes no aprovecha el pase completo. Se le ofreció freeze sin cargo por 45 días al renovar el anual.",
    tipo: "visita_sede",
    nps_asociado: 5,
    creado_en: "2026-09-12 18:30",
  }
];

export const REGISTROS_INTERACCION_INICIALES: RegistroInteraccion[] = [
  {
    id: "int-01",
    socio_dni: "39.145.228",
    socio_nombre: "Lucas San Román",
    canal: "whatsapp",
    modulo: "onboarding",
    hito: "Hito 1",
    mensaje: "Hola Lucas, bienvenido a Megatlon Almagro! Te escribe Fernando, gerente de la sede...",
    gerente_nombre: "Fernando Laso",
    sede: "Almagro",
    fecha: "2026-09-23 11:30"
  }
];

export const PLANTILLAS_INICIALES: PlantillaMensaje[] = [
  // --- SLEEPER ---
  {
    id: "plt-slp-01",
    tema: "sleepers",
    clave: "slp_primer_contacto",
    etiqueta: "Sleeper: 1° Mensaje (Primer Contacto)",
    titulo: "1° Mensaje — Reencuentro & Empujón para volver",
    cuerpo: `Hola {nombre}, ¿cómo estás?

Soy {gerente}, {cargo} de MEGATLON {sede}.

En MEGATLON tenemos un sistema que nos permite identificar cuando alguno de nuestros socios lleva un tiempo sin venir a entrenar. Y esta vez nos apareciste vos, por eso te estoy escribiendo.

Todos tenemos momentos en los que nuestras rutinas cambian, los tiempos se acomodan de otra manera y, a veces, después de un tiempo sin venir, lo que más cuesta es simplemente volver.

¡Así que tomá este mensaje como un pequeño empujón! Armate el bolso y volvé, que nosotros te estamos esperando.

Y ya que estamos en contacto, si querés contarme algo, hacerme alguna consulta o necesitas que te ayude con algo relacionado con el gimnasio, escribime. Estoy acá para ayudarte.

Un abrazo,`,
    activa: true
  },
  {
    id: "plt-slp-02",
    tema: "sleepers",
    clave: "slp_segundo_contacto",
    etiqueta: "Sleeper: 2° Mensaje (15 días después)",
    titulo: "2° Mensaje — Motivación & Consulta de Experiencia",
    cuerpo: `Hola {nombre}, ¿cómo estás?

Acá nuevamente {gerente}, {cargo} de MEGATLON {sede}.

Hace unos días te escribí, ya que hacía un tiempo que no te veíamos por acá. Hoy insisto un poquito más, con ganas de motivarte a volver y que nos encontremos nuevamente en MEGATLON.

Y también aprovecho para consultarte algo que no hice en el mensaje anterior: ¿hubo algo de tu experiencia en nuestra sede que no resultó tal como esperabas? ¿O hay algo que buscabas para tu entrenamiento y no encontraste?

De ser así, no dudes en compartírmelo. Si está a nuestro alcance, vamos a buscar la mejor manera de ayudarte.

Un abrazo,`,
    activa: true
  },

  // --- CONTRATOS A VENCER (9 CASOS) ---
  {
    id: "plt-cnt-01",
    tema: "contratos",
    clave: "cnt_caso_1_baja_detractor",
    etiqueta: "Contratos: 1- Riesgo de baja — Baja asistencia + Detractor",
    titulo: "1- Riesgo de baja — Baja asistencia + Detractor",
    cuerpo: `Hola {nombre},

Estuve viendo que en estos últimos días no estuviste viniendo mucho por el gimnasio y, además, leí el comentario que dejaste sobre tu experiencia. Me importa un montón que estés a gusto y quiero ver de qué forma podemos solucionarlo.

Contame qué fue lo que pasó o qué te hizo sentir así cuando puedas, así nos ponemos con esto y lo resolvemos juntos por acá.

¡Gracias por la sinceridad!`,
    activa: true
  },
  {
    id: "plt-cnt-02",
    tema: "contratos",
    clave: "cnt_caso_2_baja_pasivo",
    etiqueta: "Contratos: 2- Riesgo de baja — Baja asistencia + Pasivo (score 2)",
    titulo: "2- Riesgo de baja — Baja asistencia + Pasivo (score 2)",
    cuerpo: `Hola {nombre},

¿Cómo estás? Estuve viendo que estas últimas semanas bajaste un poco la frecuencia con la que venís a entrenar. Quería escribirte para saber si hay algo en lo que te pueda dar una mano o si algo te está complicando venir con regularidad.

Si querés, podemos armar un cambio en tu rutina o ajustar el plan para que te resulte más cómodo retomar con todo. Escribime por acá y lo vemos.

¡Gracias!`,
    activa: true
  },
  {
    id: "plt-cnt-03",
    tema: "contratos",
    clave: "cnt_caso_3_media_detractor",
    etiqueta: "Contratos: 3- En seguimiento — Media asistencia + Detractor",
    titulo: "3- En seguimiento — Media asistencia + Detractor",
    cuerpo: `Hola {nombre},

¿Cómo va? Estuve leyendo tu comentario y vi que hay algunas cosas de tu paso por el gimnasio que no te cerraron del todo. Me interesa un montón saber qué podemos mejorar para que la experiencia sea otra.

Contame por acá qué fue lo que no te gustó o qué esperabas encontrar, así lo revisamos y vemos cómo lo podemos ajustar.

¡Gracias por la buena onda para decirlo!`,
    activa: true
  },
  {
    id: "plt-cnt-04",
    tema: "contratos",
    clave: "cnt_caso_4_baja_promotor",
    etiqueta: "Contratos: 4- Caso especial — Baja asistencia + Promotor",
    titulo: "4- Caso especial — Baja asistencia + Promotor",
    cuerpo: `Hola {nombre},

¡Sabemos que la mejor onda es mutua y eso nos encanta! Pero noté que hace unos días no te cruzamos por el gimnasio.

Si querés, te armo una rutina corta o te reservo un lugar en alguna clase para que vuelvas con ganas esta semana. Escribime por acá qué día te queda cómodo y lo dejamos listo.

¡Gracias!`,
    activa: true
  },
  {
    id: "plt-cnt-05",
    tema: "contratos",
    clave: "cnt_caso_5_media_pasivo",
    etiqueta: "Contratos: 5- En seguimiento — Media asistencia + Pasivo",
    titulo: "5- En seguimiento — Media asistencia + Pasivo",
    cuerpo: `Hola {nombre},

¡Hola! Quería escribirte para saber cómo venís con tus entrenamientos y si hay algo en lo que te podamos dar una mano para que disfrutes más de tu paso por el gimnasio.

Contame cómo viene tu semana y qué te está faltando para aprovecharlo al máximo.

¡Gracias!`,
    activa: true
  },
  {
    id: "plt-cnt-06",
    tema: "contratos",
    clave: "cnt_caso_6_alta_detractor",
    etiqueta: "Contratos: 6- Caso especial — Alta asistencia + Detractor",
    titulo: "6- Caso especial — Alta asistencia + Detractor",
    cuerpo: `Hola {nombre},

¡Te veo entrenando un montón y te agradezco un montón la constancia! Por otro lado, vi que tu devolución no fue del todo positiva y quiero entender por qué. Viniendo tanto, tu experiencia tiene que ser impecable.

¿Charlamos un minutito la próxima vez que pases por recepción?

¡Gracias!`,
    activa: true
  },
  {
    id: "plt-cnt-07",
    tema: "contratos",
    clave: "cnt_caso_7_media_promotor",
    etiqueta: "Contratos: 7- Fidelizado — Media asistencia + Promotor",
    titulo: "7- Fidelizado — Media asistencia + Promotor",
    cuerpo: `Hola {nombre},

¡Qué bueno tenerte siempre firme entrenando con nosotros! Quería escribirte para saber cómo venís y si querés que le peguemos una mirada a tu rutina para renovarla o si querés chusmear alguna de las clases nuevas.

Contame qué te anda dando vueltas por la cabeza y lo armamos por acá.

¡Gracias por la buena onda de siempre!`,
    activa: true
  },
  {
    id: "plt-cnt-08",
    tema: "contratos",
    clave: "cnt_caso_8_alta_pasivo",
    etiqueta: "Contratos: 8- Fidelizado — Alta asistencia + Pasivo",
    titulo: "8- Fidelizado — Alta asistencia + Pasivo",
    cuerpo: `Hola {nombre},

Te vemos siempre entrenando por acá y nos encanta tu constancia — ¡gracias por elegirnos! Te escribo simplemente para saber cómo la estás pasando y si hay algo que podamos sumar para mejorar tu día a día en el gimnasio.

Contame con confianza si se te ocurre algo que podamos ajustar por acá.

¡Gracias!`,
    activa: true
  },
  {
    id: "plt-cnt-09",
    tema: "contratos",
    clave: "cnt_caso_9_alta_promotor",
    etiqueta: "Contratos: 9- Fidelizado — Alta asistencia + Promotor",
    titulo: "9- Fidelizado — Alta asistencia + Promotor",
    cuerpo: `Hola {nombre},

¡Se nota un montón tu compromiso viniendo tan seguido, gracias por la buena energía de siempre! Queríamos saludarte y recordarte que estamos para lo que necesites por acá.

Ah, y si tenés algún amigo o familiar que quiera sumarse a entrenar, avisame y te paso la info de los beneficios que tenemos para ustedes.

¡Gracias por estar siempre!`,
    activa: true
  },
  {
    id: "plt-cnt-10",
    tema: "contratos",
    clave: "cnt_caso_10_baja_sinnps",
    etiqueta: "Contratos: 10- Sin NPS — Baja asistencia",
    titulo: "10- Sin NPS — Baja asistencia",
    cuerpo: `Hola {nombre},

Soy {nombre de gerente, sede} y hace un tiempo que no te veo por el club y quería saber cómo estás y si hay algo en lo que te pueda ayudar.

¿Tenés unos minutos para Escribirme, o preferís que te llame?

¡Gracias!`,
    activa: true
  },
  {
    id: "plt-cnt-11",
    tema: "contratos",
    clave: "cnt_caso_11_media_sinnps",
    etiqueta: "Contratos: 11- Sin NPS — Media asistencia",
    titulo: "11- Sin NPS — Media asistencia",
    cuerpo: `Hola {nombre},

Soy {nombre de gerente, sede} y quería contactarte para ver cómo venís entrenando últimamente y si hay algo en lo que te pueda dar una mano.

¿Cómo viene tu semana?

¡Gracias!`,
    activa: true
  },
  {
    id: "plt-cnt-12",
    tema: "contratos",
    clave: "cnt_caso_12_alta_sinnps",
    etiqueta: "Contratos: 12- Sin NPS — Alta asistencia",
    titulo: "12- Sin NPS — Alta asistencia",
    cuerpo: `Hola {nombre},

Soy {nombre de gerente, sede} y te veo entrenando seguido y quería agradecerte la constancia. Contame si hay algo en lo que te pueda ayudar o si estás pensando en renovar tu plan.

¡Gracias!`,
    activa: true
  },

  // --- ONBOARDING 30 DÍAS (EN BASE A LOS MENSAJES ANTERIORES) ---
  {
    id: "plt-onb-01",
    tema: "onboarding",
    clave: "onb_hito1_diagnostico",
    etiqueta: "Onboarding H1: Bienvenida & Diagnóstico de inicio (Día 1-2)",
    titulo: "Hito 1: Bienvenida & Diagnóstico de Actividad",
    cuerpo: `Hola {nombre}, ¿cómo estás?

Soy {gerente}, {cargo} de MEGATLON {sede}.

¡Te doy una muy cálida bienvenida a la comunidad de MEGATLON! Nos alegra un montón que hayas decidido empezar a entrenar con nosotros.

Mi idea es acompañarte desde este primer día para que tu experiencia en el club sea impecable y te sientas como en casa.

Para darte una mano y conectarte directo con el profe indicado: ¿qué tenés pensado priorizar en esta primera etapa? (¿sala de pesas/musculación, alguna clase guiada, pileta o outdoor?).

Contame por acá y te dejamos todo preparado para cuando vengas.

¡Nos vemos en el club!`,
    activa: true
  },
  {
    id: "plt-onb-02",
    tema: "onboarding",
    clave: "onb_hito2_adaptacion",
    etiqueta: "Onboarding H2: Primer Pulso de Adaptación (Día 4-5)",
    titulo: "Hito 2: Chequeo de Primeras Sensaciones & Profes",
    cuerpo: `Hola {nombre}, ¿cómo estás?

Acá nuevamente {gerente}, {cargo} de MEGATLON {sede}.

Ya pasaron tus primeros días entrenando con nosotros y te escribo para saber cómo te sentiste: ¿pudiste conectar bien con los profes? ¿Te resultó cómoda la sede y las máquinas o las clases?

Si hay algo que no haya resultado tal como esperabas o tenés alguna duda sobre tu rutina, no dudes en compartírmelo. Estoy acá para darte una mano y ayudarte a disfrutar cada entrenamiento.

¡Que tengas un gran día!`,
    activa: true
  },
  {
    id: "plt-onb-02b",
    tema: "onboarding",
    clave: "onb_hito2_friccion",
    etiqueta: "Onboarding H2: Alerta Temprana / Fricción (Día 4-5)",
    titulo: "Hito 2: Alerta Temprana — Solución Inmediata",
    cuerpo: `Hola {nombre}, ¿cómo va?

Te escribe {gerente}, {cargo} de MEGATLON {sede}.

Estuve revisando las primeras devoluciones y vi que en estos primeros días hubo algunas cosas que no te cerraron del todo o que se hicieron cuesta arriba. Me importa un montón que estés a gusto desde el comienzo y quiero ver de qué forma podemos solucionarlo.

Contame qué fue lo que pasó o qué esperabas encontrar, así lo revisamos juntos y lo ajustamos ya mismo.

¡Gracias por la sinceridad!`,
    activa: true
  },
  {
    id: "plt-onb-03",
    tema: "onboarding",
    clave: "onb_hito3_regular",
    etiqueta: "Onboarding H3: Consolidación de Hábito (Día 10-14)",
    titulo: "Hito 3: Consolidación de Hábito & Ajuste de Rutina",
    cuerpo: `Hola {nombre}, ¿cómo estás?

¡Qué bueno ver que venís sosteniendo el ritmo en estas dos primeras semanas en MEGATLON {sede}! Te escribe {gerente}.

Ya conociendo mejor los ejercicios y la dinámica del gimnasio: ¿sentís que el plan actual es el adecuado para lo que buscás o querés que le peguemos una mirada con los profes para renovar ejercicios o probar alguna clase nueva?

Contame qué te anda dando vueltas por la cabeza y lo armamos por acá.

¡A seguir metiéndole con todo!`,
    activa: true
  },
  {
    id: "plt-onb-03b",
    tema: "onboarding",
    clave: "onb_hito3_baja_frecuencia",
    etiqueta: "Onboarding H3: Rescate de Frecuencia (Día 10-14)",
    titulo: "Hito 3: Rescate — Pequeño empujón y rutina express",
    cuerpo: `Hola {nombre}, ¿cómo estás?

Te escribe {gerente}, {cargo} de MEGATLON {sede}.

Estuve viendo que en estos últimos días te costó un poco venir con la regularidad que te habías propuesto. Todos sabemos que instalar el hábito las primeras semanas a veces se complica con la rutina del trabajo y los tiempos personales.

Si querés, podemos armar un cambio en tu rutina, ajustar un plan express de 35 minutos o ver qué te está faltando para que te resulte más cómodo retomar.

¡Tomá este mensaje como un pequeño empujón! Escribime por acá y lo vemos juntos.`,
    activa: true
  },
  {
    id: "plt-onb-04a",
    tema: "onboarding",
    clave: "onb_hito4_fidelizado",
    etiqueta: "Onboarding H4: Cierre Mes 1 Fidelizado & Pase Amigo (Día 25-30)",
    titulo: "Hito 4: Felicitaciones Mes 1 & Pase Amigo de 7 Días",
    cuerpo: `Hola {nombre},

¡Felicitaciones! Cumpliste tu primer mes entrenando en MEGATLON {sede} y se nota un montón tu compromiso y constancia. Te escribe {gerente}.

Nos encanta tenerte entrenando firme con nosotros. Para celebrar este primer paso en tu hábito, te habilitamos un Pase Libre de 7 Días para un amigo o familiar, para que venga a entrenar con vos gratis esta semana.

Pasame su nombre y teléfono por acá y se lo dejamos listo en recepción.

¡Gracias por la buena energía de siempre y vamos por otro mes genial!`,
    activa: true
  },
  {
    id: "plt-onb-04b",
    tema: "onboarding",
    clave: "onb_hito4_alerta_roja",
    etiqueta: "Onboarding H4: Alerta Roja Mes 1 (Rescate Personalizado)",
    titulo: "Hito 4: Alerta Roja — Invitación a café y reprogramación",
    cuerpo: `Hola {nombre}, ¿cómo estás?

Soy {gerente}, {cargo} de MEGATLON {sede}.

Te escribo personalmente porque veo que en este primer mes no pudiste venir con la regularidad que planeabas, y me importa un montón que no pierdas tu inversión ni las ganas de entrenar.

A veces es simplemente una cuestión de horarios, de rutina o de encontrar la actividad justa. Me encantaría invitarte un café acá en la sede y charlar 5 minutos para ver cómo podemos reorganizar tu plan para que realmente te sirva.

¿Qué día y horario te queda más cómodo para que nos crucemos?

Un abrazo,`,
    activa: true
  },

  // --- GIFT ---
  {
    id: "plt-gft-01",
    tema: "gift",
    clave: "gft_bienvenida",
    etiqueta: "Gift: Pase de Cortesía Invitado",
    titulo: "Gift: Invitación & Coordinación de Turno",
    cuerpo: `¡Hola {nombre}! Te escribe {gerente}, {cargo} de MEGATLON {sede}.
Tu amigo te obsequió un Pase de Cortesía para que vengas a entrenar gratis y conozcas nuestro club.
Tenés acceso a la sala de musculación, clases grupales y pileta.
¿Qué día de esta semana te gustaría venir a probar las instalaciones? Con gusto te reservamos un lugar preferencial.`,
    activa: true
  }
];

export const FLYERS_DEFAULT: FlyerCreative[] = [
  {
    id: "fly-01",
    title: "Vuelve a tu ritmo",
    category: "retorno",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    headline: "TU CUERPO NO SE OLVIDA DE ENTRENAR",
    subheadline: "Retomá hoy con una rutina express de 40 minutos guiada por nuestros profes.",
    tag: "MEGATLON RETENCIÓN",
    cta: "VOLVÉ A TU MEJOR VERSIÓN"
  },
  {
    id: "fly-02",
    title: "Bienvenido al Club - Onboarding 30D",
    category: "onboarding",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    headline: "LOS PRIMEROS 30 DÍAS TRANSFORMAN TU VIDA",
    subheadline: "Un acompañamiento personalizado paso a paso para construir un hábito imparable.",
    tag: "ONBOARDING 30 DÍAS",
    cta: "CONOCÉ A TU PROFE GUÍA"
  }
];

export const FLYERS_CREATIVOS = FLYERS_DEFAULT;

export const CONFIG_MENSAJES_SEGMENTOS_INICIALES: ConfigMensajeSegmento[] = [
  // --- CONTRATOS A VENCER (9 CASOS OFICIALES) ---
  {
    id: "cfg-cnt-caso-1",
    categoria: "contratos",
    clave: "cnt_caso_1_baja_detractor",
    nombreSegmento: "1- Riesgo de baja — Baja asistencia + Detractor",
    descripcion: "Baja frecuencia de entrenamiento (1-4 accesos) y calificación insatisfecha (NPS 0-6). Enfoque: Empatía y solución de disconformidad.",
    criterioFiltro: "Contratos con Baja Asistencia (Grupo C) + NPS Detractor (≤6)",
    asunto: "Tu experiencia en MEGATLON nos importa",
    mensaje: `Hola {nombre},

Estuve viendo que en estos últimos días no estuviste viniendo mucho por el gimnasio y, además, leí el comentario que dejaste sobre tu experiencia. Me importa un montón que estés a gusto y quiero ver de qué forma podemos solucionarlo.

Contame qué fue lo que pasó o qué te hizo sentir así cuando puedas, así nos ponemos con esto y lo resolvemos juntos por acá.

¡Gracias por la sinceridad!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 42
  },
  {
    id: "cfg-cnt-caso-2",
    categoria: "contratos",
    clave: "cnt_caso_2_baja_pasivo",
    nombreSegmento: "2- Riesgo de baja — Baja asistencia + Pasivo (score 2)",
    descripcion: "Baja asistencia y evaluación pasiva. Enfoque: Dar una mano, ajuste de rutina express o plan cómodo.",
    criterioFiltro: "Contratos con Baja Asistencia (Grupo C) + NPS Pasivo / Neutro (7-8)",
    asunto: "¿Cómo te podemos dar una mano en MEGATLON?",
    mensaje: `Hola {nombre},

¿Cómo estás? Estuve viendo que estas últimas semanas bajaste un poco la frecuencia con la que venís a entrenar. Quería escribirte para saber si hay algo en lo que te pueda dar una mano o si algo te está complicando venir con regularidad.

Si querés, podemos armar un cambio en tu rutina o ajustar el plan para que te resulte más cómodo retomar con todo. Escribime por acá y lo vemos.

¡Gracias!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 35
  },
  {
    id: "cfg-cnt-caso-3",
    categoria: "contratos",
    clave: "cnt_caso_3_media_detractor",
    nombreSegmento: "3- En seguimiento — Media asistencia + Detractor",
    descripcion: "Frecuencia media (5-11 accesos) pero insatisfacción o devolución negativa. Enfoque: Ajuste y escucha activa.",
    criterioFiltro: "Contratos con Media Asistencia (Grupo B) + NPS Detractor (≤6)",
    asunto: "Queremos mejorar tu experiencia en MEGATLON",
    mensaje: `Hola {nombre},

¿Cómo va? Estuve leyendo tu comentario y vi que hay algunas cosas de tu paso por el gimnasio que no te cerraron del todo. Me interesa un montón saber qué podemos mejorar para que la experiencia sea otra.

Contame por acá qué fue lo que no te gustó o qué esperabas encontrar, así lo revisamos y vemos cómo lo podemos ajustar.

¡Gracias por la buena onda para decirlo!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 28
  },
  {
    id: "cfg-cnt-caso-4",
    categoria: "contratos",
    clave: "cnt_caso_4_baja_promotor",
    nombreSegmento: "4- Caso especial — Baja asistencia + Promotor",
    descripcion: "Socio con excelente predisposición pero baja asistencia reciente. Enfoque: Rutina corta o reserva de clase.",
    criterioFiltro: "Contratos con Baja Asistencia (Grupo C) + NPS Promotor (9-10)",
    asunto: "¡Te extrañamos en MEGATLON!",
    mensaje: `Hola {nombre},

¡Sabemos que la mejor onda es mutua y eso nos encanta! Pero noté que hace unos días no te cruzamos por el gimnasio.

Si querés, te armo una rutina corta o te reservo un lugar en alguna clase para que vuelvas con ganas esta semana. Escribime por acá qué día te queda cómodo y lo dejamos listo.

¡Gracias!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 19
  },
  {
    id: "cfg-cnt-caso-5",
    categoria: "contratos",
    clave: "cnt_caso_5_media_pasivo",
    nombreSegmento: "5- En seguimiento — Media asistencia + Pasivo",
    descripcion: "Asistencia moderada y evaluación pasiva. Enfoque: Chequeo de semana y qué le está faltando.",
    criterioFiltro: "Contratos con Media Asistencia (Grupo B) + NPS Pasivo (7-8)",
    asunto: "¿Cómo vienen tus entrenamientos esta semana?",
    mensaje: `Hola {nombre},

¡Hola! Quería escribirte para saber cómo venís con tus entrenamientos y si hay algo en lo que te podamos dar una mano para que disfrutes más de tu paso por el gimnasio.

Contame cómo viene tu semana y qué te está faltando para aprovecharlo al máximo.

¡Gracias!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 31
  },
  {
    id: "cfg-cnt-caso-6",
    categoria: "contratos",
    clave: "cnt_caso_6_alta_detractor",
    nombreSegmento: "6- Caso especial — Alta asistencia + Detractor",
    descripcion: "Alta frecuencia (≥12 accesos) pero devolución insatisfecha. Enfoque: Invitación a recepción para resolverlo.",
    criterioFiltro: "Contratos con Alta Asistencia (Grupo A) + NPS Detractor (≤6)",
    asunto: "Tu experiencia tiene que ser impecable",
    mensaje: `Hola {nombre},

¡Te veo entrenando un montón y te agradezco un montón la constancia! Por otro lado, vi que tu devolución no fue del todo positiva y quiero entender por qué. Viniendo tanto, tu experiencia tiene que ser impecable.

¿Charlamos un minutito la próxima vez que pases por recepción?

¡Gracias!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 16
  },
  {
    id: "cfg-cnt-caso-7",
    categoria: "contratos",
    clave: "cnt_caso_7_media_promotor",
    nombreSegmento: "7- Fidelizado — Media asistencia + Promotor",
    descripcion: "Buena constancia y promotor entusiasta. Enfoque: Renovación de rutina y clases nuevas.",
    criterioFiltro: "Contratos con Media Asistencia (Grupo B) + NPS Promotor (9-10)",
    asunto: "¡Qué bueno tenerte siempre firme entrenando con nosotros!",
    mensaje: `Hola {nombre},

¡Qué bueno tenerte siempre firme entrenando con nosotros! Quería escribirte para saber cómo venís y si querés que le peguemos una mirada a tu rutina para renovarla o si querés chusmear alguna de las clases nuevas.

Contame qué te anda dando vueltas por la cabeza y lo armamos por acá.

¡Gracias por la buena onda de siempre!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 54
  },
  {
    id: "cfg-cnt-caso-8",
    categoria: "contratos",
    clave: "cnt_caso_8_alta_pasivo",
    nombreSegmento: "8- Fidelizado — Alta asistencia + Pasivo",
    descripcion: "Alta asistencia sostenida. Enfoque: Agradecimiento por constancia y escucha de sugerencias.",
    criterioFiltro: "Contratos con Alta Asistencia (Grupo A) + NPS Pasivo (7-8)",
    asunto: "Gracias por tu constancia en MEGATLON",
    mensaje: `Hola {nombre},

Te vemos siempre entrenando por acá y nos encanta tu constancia — ¡gracias por elegirnos! Te escribo simplemente para saber cómo la estás pasando y si hay algo que podamos sumar para mejorar tu día a día en el gimnasio.

Contame con confianza si se te ocurre algo que podamos ajustar por acá.

¡Gracias!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 47
  },
  {
    id: "cfg-cnt-caso-9",
    categoria: "contratos",
    clave: "cnt_caso_9_alta_promotor",
    nombreSegmento: "9- Fidelizado — Alta asistencia + Promotor",
    descripcion: "Máxima fidelización (Grupo A + Promotor). Enfoque: Reconocimiento por energía y beneficio pase para amigo/familiar.",
    criterioFiltro: "Contratos con Alta Asistencia (Grupo A) + NPS Promotor (9-10)",
    asunto: "¡Gracias por tu tremenda energía en MEGATLON!",
    mensaje: `Hola {nombre},

¡Se nota un montón tu compromiso viniendo tan seguido, gracias por la buena energía de siempre! Queríamos saludarte y recordarte que estamos para lo que necesites por acá.

Ah, y si tenés algún amigo o familiar que quiera sumarse a entrenar, avisame y te paso la info de los beneficios que tenemos para ustedes.

¡Gracias por estar siempre!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 68
  },
  {
    id: "cfg-cnt-caso-10",
    categoria: "contratos",
    clave: "cnt_caso_10_baja_sinnps",
    nombreSegmento: "10- Sin NPS — Baja asistencia",
    descripcion: "Contratos próximos a vencer sin encuesta NPS y baja asistencia reciente. Enfoque: Pregunta si prefiere escribir o ser llamado.",
    criterioFiltro: "Contratos con Baja Asistencia (Grupo C / ≤4 accesos) sin evaluación NPS",
    asunto: "Queríamos saber cómo estás - MEGATLON",
    mensaje: `Hola {nombre},

Soy {nombre de gerente, sede} y hace un tiempo que no te veo por el club y quería saber cómo estás y si hay algo en lo que te pueda ayudar.

¿Tenés unos minutos para Escribirme, o preferís que te llame?

¡Gracias!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}", "{nombre de gerente, sede}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 23
  },
  {
    id: "cfg-cnt-caso-11",
    categoria: "contratos",
    clave: "cnt_caso_11_media_sinnps",
    nombreSegmento: "11- Sin NPS — Media asistencia",
    descripcion: "Contratos próximos a vencer sin encuesta NPS y asistencia media. Enfoque: Ver cómo viene entrenando y dar una mano.",
    criterioFiltro: "Contratos con Media Asistencia (Grupo B / 5-11 accesos) sin evaluación NPS",
    asunto: "¿Cómo viene tu semana en MEGATLON?",
    mensaje: `Hola {nombre},

Soy {nombre de gerente, sede} y quería contactarte para ver cómo venís entrenando últimamente y si hay algo en lo que te pueda dar una mano.

¿Cómo viene tu semana?

¡Gracias!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}", "{nombre de gerente, sede}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 38
  },
  {
    id: "cfg-cnt-caso-12",
    categoria: "contratos",
    clave: "cnt_caso_12_alta_sinnps",
    nombreSegmento: "12- Sin NPS — Alta asistencia",
    descripcion: "Contratos próximos a vencer sin encuesta NPS y alta asistencia. Enfoque: Agradecer la constancia y consultar sobre renovación.",
    criterioFiltro: "Contratos con Alta Asistencia (Grupo A / ≥12 accesos) sin evaluación NPS",
    asunto: "Gracias por tu constancia en MEGATLON",
    mensaje: `Hola {nombre},

Soy {nombre de gerente, sede} y te veo entrenando seguido y quería agradecerte la constancia. Contame si hay algo en lo que te pueda ayudar o si estás pensando en renovar tu plan.

¡Gracias!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}", "{nombre de gerente, sede}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 49
  },

  // --- SLEEPERS (INACTIVOS) ---
  {
    id: "cfg-slp-contacto-1",
    categoria: "sleepers",
    clave: "slp_primer_contacto",
    nombreSegmento: "Sleeper: 1° Contacto Empático",
    descripcion: "Socios que llevan un tiempo sin venir. Mensaje empático, motivacional ('tomá este mensaje como un pequeño empujón') y apertura total a consultas.",
    criterioFiltro: "Sleepers en estado pendiente_primer_contacto o con días_sin_asistir >= 15",
    asunto: "¡Un pequeño empujón para volver a entrenar en MEGATLON!",
    mensaje: `Hola {nombre}, ¿cómo estás?

Soy {gerente}, {cargo} de MEGATLON {sede}.

En MEGATLON tenemos un sistema que nos permite identificar cuando alguno de nuestros socios lleva un tiempo sin venir a entrenar. Y esta vez nos apareciste vos, por eso te estoy escribiendo.

Todos tenemos momentos en los que nuestras rutinas cambian, los tiempos se acomodan de otra manera y, a veces, después de un tiempo sin venir, lo que más cuesta es simplemente volver.

¡Así que tomá este mensaje como un pequeño empujón! Armate el bolso y volvé, que nosotros te estamos esperando.

Y ya que estamos en contacto, si querés contarme algo, hacerme alguna consulta o necesitas que te ayude con algo relacionado con el gimnasio, escribime. Estoy acá para ayudarte.

Un abrazo,`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 89
  },
  {
    id: "cfg-slp-contacto-2",
    categoria: "sleepers",
    clave: "slp_segundo_contacto",
    nombreSegmento: "Sleeper: 2° Contacto (15 días después)",
    descripcion: "Enviado 15 días después de haber enviado el 1° sin respuesta. Enfoque: Insistir con motivación y consultar si algo de la experiencia no resultó.",
    criterioFiltro: "Sleepers en estado segundo_mensaje_requerido o con 15 días desde el 1° envío",
    asunto: "¿Hubo algo de tu experiencia que no resultó como esperabas?",
    mensaje: `Hola {nombre}, ¿cómo estás?

Acá nuevamente {gerente}, {cargo} de MEGATLON {sede}.

Hace unos días te escribí, ya que hacía un tiempo que no te veíamos por acá. Hoy insisto un poquito más, con ganas de motivarte a volver y que nos encontremos nuevamente en MEGATLON.

Y también aprovecho para consultarte algo que no hice en el mensaje anterior: ¿hubo algo de tu experiencia en nuestra sede que no resultó tal como esperabas? ¿O hay algo que buscabas para tu entrenamiento y no encontraste?

De ser así, no dudes en compartírmelo. Si está a nuestro alcance, vamos a buscar la mejor manera de ayudarte.

Un abrazo,`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 52
  },

  // --- ONBOARDING 30 DÍAS (EN BASE A LOS MENSAJES ANTERIORES) ---
  {
    id: "cfg-onb-hito1",
    categoria: "onboarding",
    clave: "onb_hito1_diagnostico",
    nombreSegmento: "Onboarding: Hito 1 (Día 1-2 Alta & Diagnóstico)",
    descripcion: "Socios recién ingresados. Enfoque: Bienvenida gerencial muy cálida y consulta abierta de actividad prioritaria.",
    criterioFiltro: "Onboarding en Hito 1 (Días 1 a 2 desde el alta)",
    asunto: "¡Bienvenido a MEGATLON! Empezamos a entrenar juntos",
    mensaje: `Hola {nombre}, ¿cómo estás?

Soy {gerente}, {cargo} de MEGATLON {sede}.

¡Te doy una muy cálida bienvenida a la comunidad de MEGATLON! Nos alegra un montón que hayas decidido empezar a entrenar con nosotros.

Mi idea es acompañarte desde este primer día para que tu experiencia en el club sea impecable y te sientas como en casa.

Para darte una mano y conectarte directo con el profe indicado: ¿qué tenés pensado priorizar en esta primera etapa? (¿sala de pesas/musculación, alguna clase guiada, pileta o outdoor?).

Contame por acá y te dejamos todo preparado para cuando vengas.

¡Nos vemos en el club!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 118
  },
  {
    id: "cfg-onb-hito2-adaptacion",
    categoria: "onboarding",
    clave: "onb_hito2_adaptacion",
    nombreSegmento: "Onboarding: Hito 2 (Día 4-5 Primer Pulso)",
    descripcion: "Chequeo de primeras sensaciones: conexión con profes, comodidad de instalaciones, máquinas y clases.",
    criterioFiltro: "Onboarding en Hito 2 (Días 4 a 5)",
    asunto: "¿Cómo te sentiste en tus primeros días en MEGATLON?",
    mensaje: `Hola {nombre}, ¿cómo estás?

Acá nuevamente {gerente}, {cargo} de MEGATLON {sede}.

Ya pasaron tus primeros días entrenando con nosotros y te escribo para saber cómo te sentiste: ¿pudiste conectar bien con los profes? ¿Te resultó cómoda la sede y las máquinas o las clases?

Si hay algo que no haya resultado tal como esperabas o tenés alguna duda sobre tu rutina, no dudes en compartírmelo. Estoy acá para darte una mano y ayudarte a disfrutar cada entrenamiento.

¡Que tengas un gran día!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 92
  },
  {
    id: "cfg-onb-hito2-friccion",
    categoria: "onboarding",
    clave: "onb_hito2_friccion",
    nombreSegmento: "Onboarding: Hito 2 (Alerta Temprana / Fricción)",
    descripcion: "Socio nuevo con insatisfacción o dificultad inicial. Enfoque: Escucha atenta, empatía y resolución rápida.",
    criterioFiltro: "Onboarding Hito 2 con feedback negativo o disconformidad",
    asunto: "Queremos solucionar cualquier inconveniente en MEGATLON",
    mensaje: `Hola {nombre}, ¿cómo va?

Te escribe {gerente}, {cargo} de MEGATLON {sede}.

Estuve revisando las primeras devoluciones y vi que en estos primeros días hubo algunas cosas que no te cerraron del todo o que se hicieron cuesta arriba. Me importa un montón que estés a gusto desde el comienzo y quiero ver de qué forma podemos solucionarlo.

Contame qué fue lo que pasó o qué esperabas encontrar, así lo revisamos juntos y lo ajustamos ya mismo.

¡Gracias por la sinceridad!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 23
  },
  {
    id: "cfg-onb-hito3-regular",
    categoria: "onboarding",
    clave: "onb_hito3_regular",
    nombreSegmento: "Onboarding: Hito 3 (Día 10-14 Consolidación de Hábito)",
    descripcion: "Socio con regularidad adecuada en sus primeras dos semanas. Enfoque: Ajuste de rutina, renovación de ejercicios y clases.",
    criterioFiltro: "Onboarding en Hito 3 con asistencia regular",
    asunto: "¡Gran constancia en tus primeras dos semanas en MEGATLON!",
    mensaje: `Hola {nombre}, ¿cómo estás?

¡Qué bueno ver que venís sosteniendo el ritmo en estas dos primeras semanas en MEGATLON {sede}! Te escribe {gerente}.

Ya conociendo mejor los ejercicios y la dinámica del gimnasio: ¿sentís que el plan actual es el adecuado para lo que buscás o querés que le peguemos una mirada con los profes para renovar ejercicios o probar alguna clase nueva?

Contame qué te anda dando vueltas por la cabeza y lo armamos por acá.

¡A seguir metiéndole con todo!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 74
  },
  {
    id: "cfg-onb-hito3-baja",
    categoria: "onboarding",
    clave: "onb_hito3_baja_frecuencia",
    nombreSegmento: "Onboarding: Hito 3 (Día 10-14 Rescate de Frecuencia)",
    descripcion: "Socio nuevo al que le costó mantener la frecuencia. Enfoque: Empatía por las rutinas diarias, rutina express de 35 min y pequeño empujón.",
    criterioFiltro: "Onboarding en Hito 3 con baja frecuencia",
    asunto: "Un empujón para no perder el hábito en MEGATLON",
    mensaje: `Hola {nombre}, ¿cómo estás?

Te escribe {gerente}, {cargo} de MEGATLON {sede}.

Estuve viendo que en estos últimos días te costó un poco venir con la regularidad que te habías propuesto. Todos sabemos que instalar el hábito las primeras semanas a veces se complica con la rutina del trabajo y los tiempos personales.

Si querés, podemos armar un cambio en tu rutina, ajustar un plan express de 35 minutos o ver qué te está faltando para que te resulte más cómodo retomar.

¡Tomá este mensaje como un pequeño empujón! Escribime por acá y lo vemos juntos.`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 41
  },
  {
    id: "cfg-onb-hito4-fidelizado",
    categoria: "onboarding",
    clave: "onb_hito4_fidelizado",
    nombreSegmento: "Onboarding: Hito 4 (Día 25-30 Cierre Mes 1 Fidelizado)",
    descripcion: "Socio que completó su primer mes con constancia. Enfoque: Felicitaciones y premio Pase Libre de 7 días para un amigo.",
    criterioFiltro: "Onboarding Hito 4 con asistencia positiva",
    asunto: "¡Felicitaciones por tu primer mes en MEGATLON! Te premiamos",
    mensaje: `Hola {nombre},

¡Felicitaciones! Cumpliste tu primer mes entrenando en MEGATLON {sede} y se nota un montón tu compromiso y constancia. Te escribe {gerente}.

Nos encanta tenerte entrenando firme con nosotros. Para celebrar este primer paso en tu hábito, te habilitamos un Pase Libre de 7 Días para un amigo o familiar, para que venga a entrenar con vos gratis esta semana.

Pasame su nombre y teléfono por acá y se lo dejamos listo en recepción.

¡Gracias por la buena energía de siempre y vamos por otro mes genial!`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 85
  },
  {
    id: "cfg-onb-alerta-roja",
    categoria: "onboarding",
    clave: "onb_hito4_alerta_roja",
    nombreSegmento: "Onboarding: Hito 4 (Alerta Roja / Rescate Humano)",
    descripcion: "Socios nuevos en sus primeros 30 días con inasistencia crítica o insatisfacción. Enfoque: Invitación a café y reprogramación.",
    criterioFiltro: "Onboarding con alerta_roja activa o inasistencia en mes 1",
    asunto: "Te invitamos un café en MEGATLON para rearmar tu plan",
    mensaje: `Hola {nombre}, ¿cómo estás?

Soy {gerente}, {cargo} de MEGATLON {sede}.

Te escribo personalmente porque veo que en este primer mes no pudiste venir con la regularidad que planeabas, y me importa un montón que no pierdas tu inversión ni las ganas de entrenar.

A veces es simplemente una cuestión de horarios, de rutina o de encontrar la actividad justa. Me encantaría invitarte un café acá en la sede y charlar 5 minutos para ver cómo podemos reorganizar tu plan para que realmente te sirva.

¿Qué día y horario te queda más cómodo para que nos crucemos?

Un abrazo,`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 33
  },

  // --- GIFT (INVITADOS) ---
  {
    id: "cfg-gft-bienvenida",
    categoria: "gift",
    clave: "gft_bienvenida",
    nombreSegmento: "Gift: Invitación & Pase de Cortesía",
    descripcion: "Invitados referidos por socios actuales para conocer las instalaciones. Enfoque: Bienvenida y coordinación de turno.",
    criterioFiltro: "Registros Gift pendientes de coordinación",
    asunto: "Tenés un pase libre de cortesía en Megatlon",
    mensaje: `¡Hola {nombre}! Te escribe {gerente}, {cargo} de MEGATLON {sede}.
Tu amigo te obsequió un Pase de Cortesía para que vengas a entrenar gratis y conozcas nuestro club.
Tenés acceso a la sala de musculación, clases grupales y pileta.
¿Qué día de esta semana te gustaría venir a probar las instalaciones? Con gusto te reservamos un lugar preferencial.`,
    variablesDisponibles: ["{nombre}", "{sede}", "{gerente}", "{cargo}"],
    actualizadoPor: "Fernando Laso (Director)",
    actualizadoEn: "2026-09-25 10:00",
    version: 1,
    totalEnviosHistoricos: 35
  }
];

export const MIEMBROS_EQUIPO_INICIALES: MiembroEquipo[] = [
  // 1. Director General
  {
    id: "mbr-dir-01",
    nombre: "Fernando",
    apellido: "Laso",
    email: "flaso@megatlon.com.ar",
    telefono: "+54 9 11 9988-7766",
    sede: "Almagro",
    rol: "director",
    cargoEspecifico: "Director General de Operaciones & Retención",
    fechaIngreso: "2022-01-10",
    aprobadoPorDirector: true,
    fechaAprobacionDirector: "2022-01-10",
    directorAprobadorNombre: "Directorio Megatlon S.A.",
    estadoAprobacionDirector: "aprobado",
    autorizadoPorGerente: true,
    estadoAutorizacionGerente: "autorizado",
    permisos: {
      admin_mensajes: true,
      aprobar_gerentes: true,
      autorizar_equipo: true,
      enviar_masivo: true,
      enviar_individual: true,
      gestionar_alertas: true,
      ingestar_archivos: true,
      exportar_auditoria: true
    },
    notasAuditoria: "Máxima autoridad de la red de clubes. Habilitación total de módulos."
  },

  // 2. Gerentes de Sede
  {
    id: "mbr-ger-01",
    nombre: "Pablo",
    apellido: "Varela",
    email: "pvarela@megatlon.com.ar",
    telefono: "+54 9 11 4455-6677",
    sede: "Almagro",
    rol: "gerente",
    cargoEspecifico: "Gerente de Sede Almagro",
    fechaIngreso: "2023-04-15",
    aprobadoPorDirector: true,
    fechaAprobacionDirector: "2023-04-18",
    directorAprobadorNombre: "Fernando Laso (Director)",
    estadoAprobacionDirector: "aprobado",
    autorizadoPorGerente: true,
    estadoAutorizacionGerente: "autorizado",
    permisos: {
      admin_mensajes: false,
      aprobar_gerentes: false,
      autorizar_equipo: true,
      enviar_masivo: true,
      enviar_individual: true,
      gestionar_alertas: true,
      ingestar_archivos: true,
      exportar_auditoria: true
    },
    notasAuditoria: "Aprobado oficialmente para gestión integral de sede Almagro."
  },
  {
    id: "mbr-ger-02",
    nombre: "Martín",
    apellido: "Palermo Gómez",
    email: "mpalermo@megatlon.com.ar",
    telefono: "+54 9 11 3344-5566",
    sede: "Belgrano",
    rol: "gerente",
    cargoEspecifico: "Gerente de Sede Belgrano",
    fechaIngreso: "2023-08-01",
    aprobadoPorDirector: true,
    fechaAprobacionDirector: "2023-08-05",
    directorAprobadorNombre: "Fernando Laso (Director)",
    estadoAprobacionDirector: "aprobado",
    autorizadoPorGerente: true,
    estadoAutorizacionGerente: "autorizado",
    permisos: {
      admin_mensajes: false,
      aprobar_gerentes: false,
      autorizar_equipo: true,
      enviar_masivo: true,
      enviar_individual: true,
      gestionar_alertas: true,
      ingestar_archivos: true,
      exportar_auditoria: true
    },
    notasAuditoria: "Gerencia confirmada en auditoría anual Q3."
  },
  {
    id: "mbr-ger-03",
    nombre: "Carolina",
    apellido: "Méndez",
    email: "cmendez@megatlon.com.ar",
    telefono: "+54 9 11 6677-8899",
    sede: "Recoleta",
    rol: "gerente",
    cargoEspecifico: "Gerente de Sede Recoleta",
    fechaIngreso: "2024-01-15",
    aprobadoPorDirector: true,
    fechaAprobacionDirector: "2024-01-20",
    directorAprobadorNombre: "Fernando Laso (Director)",
    estadoAprobacionDirector: "aprobado",
    autorizadoPorGerente: true,
    estadoAutorizacionGerente: "autorizado",
    permisos: {
      admin_mensajes: false,
      aprobar_gerentes: false,
      autorizar_equipo: true,
      enviar_masivo: true,
      enviar_individual: true,
      gestionar_alertas: true,
      ingestar_archivos: true,
      exportar_auditoria: true
    }
  },
  {
    id: "mbr-ger-04",
    nombre: "Valeria",
    apellido: "Castro",
    email: "vcastro@megatlon.com.ar",
    telefono: "+54 9 11 7788-9900",
    sede: "Alcorta",
    rol: "gerente",
    cargoEspecifico: "Gerente de Sede Alcorta (Designada)",
    fechaIngreso: "2026-09-01",
    aprobadoPorDirector: false,
    estadoAprobacionDirector: "pendiente",
    autorizadoPorGerente: true,
    estadoAutorizacionGerente: "autorizado",
    permisos: {
      admin_mensajes: false,
      aprobar_gerentes: false,
      autorizar_equipo: false,
      enviar_masivo: false,
      enviar_individual: true,
      gestionar_alertas: false,
      ingestar_archivos: false,
      exportar_auditoria: false
    },
    notasAuditoria: "Esperando confirmación y aprobación de Director General para habilitar permisos ejecutivos."
  },
  {
    id: "mbr-ger-05",
    nombre: "Lucas",
    apellido: "San Román",
    email: "lsanroman@megatlon.com.ar",
    telefono: "+54 9 11 5029-7711",
    sede: "Caballito",
    rol: "gerente",
    cargoEspecifico: "Gerente de Sede Caballito",
    fechaIngreso: "2026-09-10",
    aprobadoPorDirector: false,
    estadoAprobacionDirector: "pendiente",
    autorizadoPorGerente: true,
    estadoAutorizacionGerente: "autorizado",
    permisos: {
      admin_mensajes: false,
      aprobar_gerentes: false,
      autorizar_equipo: false,
      enviar_masivo: false,
      enviar_individual: true,
      gestionar_alertas: false,
      ingestar_archivos: false,
      exportar_auditoria: false
    },
    notasAuditoria: "Nuevo traspaso de sucursal. Requiere visado de Dirección."
  },

  // 3. Coordinadores y Supervisores de Sede (Autorizados por Gerente de Sede)
  {
    id: "mbr-coo-01",
    nombre: "Matías",
    apellido: "Benítez",
    email: "mbenitez@megatlon.com.ar",
    telefono: "+54 9 11 2233-4455",
    sede: "Almagro",
    rol: "coordinador",
    cargoEspecifico: "Coordinador de Fitness & Musculación",
    fechaIngreso: "2023-05-10",
    aprobadoPorDirector: true,
    autorizadoPorGerente: true,
    fechaAutorizacionGerente: "2023-05-12",
    gerenteAutorizadorNombre: "Pablo Varela (Gerente Almagro)",
    estadoAutorizacionGerente: "autorizado",
    permisos: {
      admin_mensajes: false,
      aprobar_gerentes: false,
      autorizar_equipo: false,
      enviar_masivo: false,
      enviar_individual: true,
      gestionar_alertas: true,
      ingestar_archivos: false,
      exportar_auditoria: false
    },
    notasAuditoria: "Autorizado para seguimiento técnico de socios y resolución de alertas de musculación."
  },
  {
    id: "mbr-coo-02",
    nombre: "Daniela",
    apellido: "Roitman",
    email: "droitman@megatlon.com.ar",
    telefono: "+54 9 11 8899-0011",
    sede: "Almagro",
    rol: "coordinador",
    cargoEspecifico: "Coordinadora de Clases de Técnicas & Ritmos",
    fechaIngreso: "2023-09-01",
    aprobadoPorDirector: true,
    autorizadoPorGerente: true,
    fechaAutorizacionGerente: "2023-09-05",
    gerenteAutorizadorNombre: "Pablo Varela (Gerente Almagro)",
    estadoAutorizacionGerente: "autorizado",
    permisos: {
      admin_mensajes: false,
      aprobar_gerentes: false,
      autorizar_equipo: false,
      enviar_masivo: false,
      enviar_individual: true,
      gestionar_alertas: true,
      ingestar_archivos: false,
      exportar_auditoria: false
    }
  },
  {
    id: "mbr-sup-01",
    nombre: "Rodrigo",
    apellido: "Espósito",
    email: "resposito@megatlon.com.ar",
    telefono: "+54 9 11 6655-4433",
    sede: "Almagro",
    rol: "supervisor",
    cargoEspecifico: "Supervisor de Front Desk & Atención al Socio",
    fechaIngreso: "2026-09-18",
    aprobadoPorDirector: false,
    autorizadoPorGerente: false,
    estadoAutorizacionGerente: "pendiente",
    permisos: {
      admin_mensajes: false,
      aprobar_gerentes: false,
      autorizar_equipo: false,
      enviar_masivo: false,
      enviar_individual: false,
      gestionar_alertas: false,
      ingestar_archivos: false,
      exportar_auditoria: false
    },
    notasAuditoria: "Esperando autorización del Gerente de Sede Pablo Varela para activar WhatsApp de recepción."
  },
  {
    id: "mbr-coo-03",
    nombre: "Julieta",
    apellido: "Rossi",
    email: "jrossi@megatlon.com.ar",
    telefono: "+54 9 11 3322-1100",
    sede: "Belgrano",
    rol: "coordinador",
    cargoEspecifico: "Coordinadora de Fitness & Cross",
    fechaIngreso: "2024-02-15",
    aprobadoPorDirector: true,
    autorizadoPorGerente: true,
    fechaAutorizacionGerente: "2024-02-18",
    gerenteAutorizadorNombre: "Martín Palermo Gómez",
    estadoAutorizacionGerente: "autorizado",
    permisos: {
      admin_mensajes: false,
      aprobar_gerentes: false,
      autorizar_equipo: false,
      enviar_masivo: false,
      enviar_individual: true,
      gestionar_alertas: true,
      ingestar_archivos: false,
      exportar_auditoria: false
    }
  },
  {
    id: "mbr-sup-02",
    nombre: "Esteban",
    apellido: "Morales",
    email: "emorales@megatlon.com.ar",
    telefono: "+54 9 11 4433-2211",
    sede: "Recoleta",
    rol: "supervisor",
    cargoEspecifico: "Supervisor de Retención & Front Desk",
    fechaIngreso: "2024-03-01",
    aprobadoPorDirector: true,
    autorizadoPorGerente: true,
    fechaAutorizacionGerente: "2024-03-03",
    gerenteAutorizadorNombre: "Carolina Méndez",
    estadoAutorizacionGerente: "autorizado",
    permisos: {
      admin_mensajes: false,
      aprobar_gerentes: false,
      autorizar_equipo: false,
      enviar_masivo: false,
      enviar_individual: true,
      gestionar_alertas: true,
      ingestar_archivos: false,
      exportar_auditoria: false
    }
  },
  {
    id: "mbr-coo-04",
    nombre: "Sofía",
    apellido: "Larrea",
    email: "slarrea@megatlon.com.ar",
    telefono: "+54 9 11 5566-7788",
    sede: "Recoleta",
    rol: "coordinador",
    cargoEspecifico: "Coordinadora de Natación & Pileta",
    fechaIngreso: "2026-09-15",
    aprobadoPorDirector: false,
    autorizadoPorGerente: false,
    estadoAutorizacionGerente: "pendiente",
    permisos: {
      admin_mensajes: false,
      aprobar_gerentes: false,
      autorizar_equipo: false,
      enviar_masivo: false,
      enviar_individual: false,
      gestionar_alertas: false,
      ingestar_archivos: false,
      exportar_auditoria: false
    },
    notasAuditoria: "Ingreso reciente a pileta Recoleta. Requiere alta del Gerente de Sede."
  }
];

export const AUDITORIA_INICIALES: RegistroAuditoria[] = [
  {
    id: "aud-01",
    fecha: "2026-09-24 10:15",
    usuarioNombre: "Fernando Laso",
    usuarioRol: "director",
    usuarioEmail: "flaso@megatlon.com.ar",
    accion: "Actualización de Mensaje Oficial de Segmento",
    categoria: "mensajes_segmento",
    detalles: "Se actualizó la plantilla oficial para el segmento 'Contratos: GRUPO A (≥12 accesos)' versión v3 con congelamiento de tarifa 12 meses.",
    sede: "Red Multisede"
  },
  {
    id: "aud-02",
    fecha: "2026-09-24 09:40",
    usuarioNombre: "Fernando Laso",
    usuarioRol: "director",
    usuarioEmail: "flaso@megatlon.com.ar",
    accion: "Aprobación Ejecutiva de Gerente de Sede",
    categoria: "aprobacion_gerente",
    detalles: "El Director aprobó a Carolina Méndez como Gerente Oficial de Sede Recoleta tras revisión de metas semestrales.",
    sede: "Recoleta"
  },
  {
    id: "aud-03",
    fecha: "2026-09-23 16:20",
    usuarioNombre: "Pablo Varela",
    usuarioRol: "gerente",
    usuarioEmail: "pvarela@megatlon.com.ar",
    accion: "Autorización de Miembro del Equipo de Sede",
    categoria: "autorizacion_equipo",
    detalles: "El Gerente de Sede autorizó a Daniela Roitman como Coordinadora de Clases de Técnicas con permiso de contacto individual a socios.",
    sede: "Almagro"
  },
  {
    id: "aud-04",
    fecha: "2026-09-23 11:30",
    usuarioNombre: "Fernando Laso",
    usuarioRol: "director",
    usuarioEmail: "flaso@megatlon.com.ar",
    accion: "Aprobación Ejecutiva de Gerente de Sede",
    categoria: "aprobacion_gerente",
    detalles: "El Director ratificó la asignación y permisos plenos de Pablo Varela como Gerente de Sede Almagro.",
    sede: "Almagro"
  },
  {
    id: "aud-05",
    fecha: "2026-09-22 17:05",
    usuarioNombre: "Martín Palermo Gómez",
    usuarioRol: "gerente",
    usuarioEmail: "mpalermo@megatlon.com.ar",
    accion: "Autorización de Miembro del Equipo de Sede",
    categoria: "autorizacion_equipo",
    detalles: "El Gerente de Sede autorizó a Julieta Rossi con permisos para resolver Alertas Rojas de Onboarding.",
    sede: "Belgrano"
  }
];

