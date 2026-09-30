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

export const ONBOARDING_INICIALES: SocioOnboarding[] = [];
export const CASOS_SLEEPERS_INICIALES: CasoSleeper[] = [];
export const CONTRATOS_INICIALES: RegistroContrato[] = [];
export const GIFT_INICIALES: RegistroGift[] = [];
export const COMENTARIOS_INICIALES: ComentarioCaso[] = [];
export const REGISTROS_INTERACCION_INICIALES: RegistroInteraccion[] = [];

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
    password: "Megatlon2026!",
    estado: "activo",
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
    password: "Megatlon2026!",
    estado: "activo",
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
    password: "Megatlon2026!",
    estado: "activo",
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
    password: "Megatlon2026!",
    estado: "activo",
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
    password: "Megatlon2026!",
    estado: "activo",
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
    password: "Megatlon2026!",
    estado: "activo",
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
    password: "Megatlon2026!",
    estado: "activo",
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
    password: "Megatlon2026!",
    estado: "activo",
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
    password: "Megatlon2026!",
    estado: "activo",
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
    password: "Megatlon2026!",
    estado: "activo",
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
    password: "Megatlon2026!",
    estado: "activo",
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
    password: "Megatlon2026!",
    estado: "activo",
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

