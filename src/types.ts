export type RolUsuario = "director" | "gerente" | "supervisor" | "coordinador";

export interface PermisosUsuario {
  admin_mensajes: boolean; // Solo Director
  aprobar_gerentes: boolean; // Solo Director
  autorizar_equipo: boolean; // Director y Gerente
  enviar_masivo: boolean;
  enviar_individual: boolean;
  gestionar_alertas: boolean;
  ingestar_archivos: boolean;
  exportar_auditoria: boolean;
}

export interface MiembroEquipo {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  sede: string;
  rol: RolUsuario;
  cargoEspecifico: string; // ej: "Gerente de Sede", "Coordinador de Fitness & Musculación", "Supervisor de Front Desk", "Coordinador Clases de Técnicas"
  avatar?: string;
  fechaIngreso: string;
  
  // Nivel 1 de Aprobación Jerárquica: El Director aprueba al Gerente de Sede
  aprobadoPorDirector: boolean;
  fechaAprobacionDirector?: string;
  directorAprobadorNombre?: string;
  estadoAprobacionDirector?: "aprobado" | "pendiente" | "suspendido";
  
  // Nivel 2 de Aprobación Jerárquica: El Gerente de Sede autoriza a su Equipo (Coordinadores, Supervisores)
  autorizadoPorGerente: boolean;
  fechaAutorizacionGerente?: string;
  gerenteAutorizadorNombre?: string;
  estadoAutorizacionGerente?: "autorizado" | "pendiente" | "revocado";
  
  permisos: PermisosUsuario;
  notasAuditoria?: string;
}

export interface RegistroAuditoria {
  id: string;
  fecha: string;
  usuarioNombre: string;
  usuarioRol: RolUsuario;
  usuarioEmail: string;
  accion: string;
  categoria: "aprobacion_gerente" | "autorizacion_equipo" | "permisos" | "mensajes_segmento" | "seguridad";
  detalles: string;
  sede?: string;
}

export type CategoriaSegmento = "contratos" | "sleepers" | "onboarding" | "gift";

export interface ConfigMensajeSegmento {
  id: string;
  categoria: CategoriaSegmento;
  clave: string;
  nombreSegmento: string;
  descripcion: string;
  criterioFiltro: string;
  asunto: string;
  mensaje: string;
  variablesDisponibles: string[];
  actualizadoPor: string;
  actualizadoEn: string;
  version: number;
  totalEnviosHistoricos: number;
}

export interface PerfilGerente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  sede: string;
  rol: RolUsuario;
  cargo?: string;
  avatar?: string;
  fechaIngreso?: string;
}

export type RamaOnboarding = 
  | "Musculación" 
  | "Clases de Técnicas" 
  | "Pileta" 
  | "Outdoor" 
  | "Sin clasificar";

export type HitoOnboarding = 
  | "Hito 1" // Día 1 a 2: Alta y Diagnóstico
  | "Hito 2" // Día 4 a 5: Primer Pulso de Adaptación
  | "Hito 3" // Día 10 a 14: Nodo de Profundización y Ajuste
  | "Hito 4" // Día 25 a 30: Evaluación de Cierre, Hábito y Retención
  | "Completado";

export interface SocioOnboarding {
  id: string;
  dni: string;
  nombre: string;
  apellido?: string;
  telefono: string;
  email: string;
  sede: string;
  fecha_alta: string;
  dias_desde_alta: number;
  rama: RamaOnboarding;
  hito_actual: HitoOnboarding;
  
  // Hito 1 (Día 1-2)
  hito1_completado: boolean;
  hito1_fecha?: string;
  hito1_respuesta?: string;
  
  // Hito 2 (Día 4-5)
  hito2_completado: boolean;
  hito2_fecha?: string;
  hito2_feedback?: string;
  hito2_satisfaccion?: "Excelente" | "Buena" | "Fricción" | "No responde" | "";
  
  // Hito 3 (Día 10-14)
  hito3_completado: boolean;
  hito3_fecha?: string;
  hito3_progreso?: string;
  hito3_frecuencia_ok?: boolean;
  
  // Hito 4 (Día 25-30)
  hito4_completado: boolean;
  hito4_fecha?: string;
  hito4_asistencia_real: number; // Asistencias acumuladas en el mes
  hito4_status?: "Positivo" | "Alerta Roja" | "En evaluación";
  
  // Gestión de Alerta Roja
  alerta_roja: boolean;
  alerta_motivo?: string;
  tarea_urgente_asignada: boolean;
  tarea_resuelta: boolean;
  resolucion_notas?: string;
  
  ultimo_contacto?: string;
  updatedAt?: string;
}

export type NivelRiesgo = "Alto" | "Medio" | "Bajo";
export type EstadoCaso = "Abierto" | "Gestionado" | "Cerrado";
export type IntencionVolver = "Si" | "No" | "Pensando" | "Pendiente" | "";

export type MotivoInasistencia = 
  | "Falta de tiempo" 
  | "Motivos económicos / Precio" 
  | "Problemas de salud / Lesión"
  | "Mudanza / Distancia" 
  | "Desmotivación / Pérdida de hábito" 
  | "Horarios / Disponibilidad de clases" 
  | "Disconformidad con servicio / profes" 
  | "Otro motivo"
  | "Sin especificar"
  | "";

export type EstadoSeguimientoSleeper = 
  | "pendiente_primer_contacto"
  | "primer_mensaje_enviado"
  | "segundo_mensaje_requerido"
  | "segundo_mensaje_enviado"
  | "respondido_recuperado"
  | "cerrado_no_vuelve";

export type GrupoAccesoMensual = "GRUPO A" | "GRUPO B" | "GRUPO C" | "Sin accesos";
export type CategoriaNps = "Promotor" | "Pasivo" | "Detractor" | "Sin calificar";

export type TonoMensaje = "calido_empatico" | "motivacional" | "directo_beneficio" | "director_vip";
export type ResultadoGestionContrato = "Renueva" | "No Renueva" | "Lo está pensado" | "";

export interface ComentarioCaso {
  id: string;
  caso_id: string; // Puede ser id de sleeper, contrato u onboarding, o dni
  socio_dni?: string;
  socio_nombre?: string;
  autor_nombre: string;
  autor_rol: string;
  texto: string;
  tipo?: "comentario_socio" | "llamada" | "whatsapp" | "visita_sede" | "resolucion" | "general";
  nps_asociado?: number;
  creado_en: string;
}

export interface CasoSleeper {
  id: string;
  nombre: string;
  dni: string;
  telefono: string;
  email: string;
  sede: string;
  dias_sin_asistir: number;
  ultimo_acceso: string;
  fecha_fin_contrato: string; // Vencimiento o fin de contrato
  plan?: string;
  estado: EstadoCaso;
  riesgo: NivelRiesgo; // Bajo tras 1er msj (15d gracia), Alto si venció 15d sin responder
  estado_seguimiento?: EstadoSeguimientoSleeper;
  motivo: MotivoInasistencia;
  intencion_volver: IntencionVolver; // "Si", "No", "Pensando"
  fecha_envio_mensaje?: string;
  fecha_envio_mensaje_1?: string;
  fecha_envio_mensaje_2?: string;
  fecha_seguimiento?: string; // Fecha límite para el 2do mensaje (15 días post 1er msj)
  dias_restantes_seguimiento?: number;
  resultado_cierre?: "Recuperado" | "Baja definitiva" | "";
  actividad_favorita?: string;
  nps_score?: number;
  nps_comentario?: string;
  creado_en: string;
}

export interface RegistroContrato {
  id: string;
  nombre: string;
  socio_nombre?: string;
  dni: string;
  telefono: string;
  email?: string;
  sede: string;
  plan: string;
  fecha_fin_contrato: string;
  fecha_vencimiento?: string;
  fecha_contacto?: string;
  dias_para_vencer: number;
  score_salud: number; // 1 to 10
  frecuencia_semanal_promedio: number;
  accesos_mes?: number; // Total de accesos en el mes
  grupo_acceso?: GrupoAccesoMensual; // GRUPO A: >=12, GRUPO B: 5-11, GRUPO C: 1-4
  nps_score?: number; // 0 to 10
  nps_comentario?: string;
  categoria_nps?: CategoriaNps; // Promotor (9-10), Pasivo (7-8), Detractor (0-6)
  riesgo_baja: NivelRiesgo; // Calculado cruzando vencimiento + accesos + NPS
  estado: "Abierto" | "Seguimiento" | "Cerrado";
  resultado_gestion: ResultadoGestionContrato;
  fecha_ultimo_contacto?: string;
  notas?: string;
}

export interface RegistroGift {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  sede: string;
  invitado_por?: string;
  referido_por?: string;
  fecha_creacion: string;
  fecha_envio_1?: string;
  dia_hora_coordinado?: string;
  vino_a_probar: "Si" | "No" | "";
  se_inscribio: "Si" | "No" | "";
  motivo_no_inscripcion?: string;
}

export interface PlantillaMensaje {
  id: string;
  tema: "onboarding" | "sleepers" | "contratos" | "gift";
  clave: string;
  etiqueta: string;
  titulo?: string;
  cuerpo: string;
  activa: boolean;
}

export interface RegistroInteraccion {
  id: string;
  socio_dni: string;
  socio_nombre: string;
  canal: "whatsapp" | "email" | "llamada" | "presencial";
  modulo: "onboarding" | "sleepers" | "contratos" | "gift";
  hito?: string;
  mensaje: string;
  gerente_nombre: string;
  sede: string;
  fecha: string;
}

export interface FlyerCreative {
  id: string;
  title: string;
  category: "retorno" | "promo" | "clases" | "gift" | "renovacion" | "onboarding";
  imageUrl: string;
  headline: string;
  subheadline: string;
  tag: string;
  cta: string;
}

// Lista oficial exclusiva de las 28 sedes de la red publicadas en megatlon.com
export const SEDES_MEGATLON: string[] = [
  "Alcorta",
  "Almagro",
  "Alto Rosario",
  "Añelo",
  "Ateneo de la Juventud",
  "Barracas",
  "Barrio Jardín (Córdoba)",
  "Barrio Norte",
  "Belgrano",
  "Caballito",
  "Center",
  "Centro (Córdoba)",
  "Cerro (Córdoba)",
  "Devoto",
  "Distrito Arcos",
  "Distrito Tecnológico",
  "Floresta",
  "Gonnet",
  "La Imprenta",
  "Martínez",
  "Núñez",
  "Olivos",
  "Pilar",
  "Puerto Madero",
  "Racing Club",
  "Recoleta",
  "Rosario",
  "Villa Crespo"
];
