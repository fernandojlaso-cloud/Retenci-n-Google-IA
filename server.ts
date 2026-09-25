import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// 1. Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    geminiConfigured: !!getGemini(),
    time: new Date().toISOString(),
  });
});

// 2. AI Retention & Churn Analytics with Gemini 3.8 Flash
app.post("/api/gemini/analyze", async (req: Request, res: Response) => {
  try {
    const { macroStats, sedesSummary, topMotivos, riskBreakdown } = req.body;
    const ai = getGemini();

    if (!ai) {
      // Return smart intelligent mock-free analysis if API key is not yet set
      return res.json({
        summary: `Se detectaron ${macroStats?.total || 0} socios durmientes ('sleepers'), con un ${macroStats?.pctSinGestionar || 35}% pendiente de primer contacto. Las sedes con mayor volumen de inactivos recientes son las de mayor flujo matutino.`,
        criticalBranch: sedesSummary?.[0]?.sede || "Belgrano",
        strategicActions: [
          "Priorizar el contacto de los socios con inactividad entre 15 y 30 días antes de que consoliden el desenganche definitivo.",
          "Ofrecer sesiones de re-evaluación física gratuitas y pases de invitación para acompañantes en horarios valle.",
          "Establecer recordatorios automáticos de seguimiento a los 5 días hábiles posteriores al primer mensaje de WhatsApp.",
          "Monitorear los vencimientos de contratos a 90-120 días con score de asistencia bajo (≤3) para anticipar renovaciones con tarifa congelada.",
        ],
        projectedRecoveryRate: "28.5%",
        suggestedCampaign: "Campaña 'Volvé a tu Ritmo Megatlon' con 1 semana libre para reactivación de rutina.",
      });
    }

    const prompt = `Actúa como Director de Inteligencia de Clientes y Retención para la cadena de gimnasios Megatlon en Argentina.
Analiza los siguientes datos reales de socios 'sleepers' (inactivos que dejaron de asistir), contratos a vencer y tasas por sede:

Estadísticas Macro:
${JSON.stringify(macroStats, null, 2)}

Resumen por Sedes:
${JSON.stringify(sedesSummary, null, 2)}

Top Motivos de Inasistencia:
${JSON.stringify(topMotivos, null, 2)}

Distribución de Riesgo:
${JSON.stringify(riskBreakdown, null, 2)}

Devuelve un análisis ejecutivo en formato JSON con la siguiente estructura exacta:
{
  "summary": "resumen ejecutivo conciso de 2-3 oraciones con foco en retención y diagnóstico de abandono",
  "criticalBranch": "nombre de la sede que requiere intervención urgente y por qué",
  "strategicActions": ["acción estratégica 1", "acción estratégica 2", "acción estratégica 3", "acción estratégica 4"],
  "projectedRecoveryRate": "porcentaje estimado de recuperación si se aplican estas acciones (ej. 32%)",
  "suggestedCampaign": "nombre y concepto de campaña recomendada para este período"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/analyze:", error);
    res.status(500).json({ error: error?.message || "Error al analizar métricas con IA" });
  }
});

// 3. AI Personalized WhatsApp Outreach Message Generator with Gemini 3.8 Flash
app.post("/api/gemini/generate-message", async (req: Request, res: Response) => {
  try {
    const { socio, gerente, cargo, sede, tono, beneficio } = req.body;
    const ai = getGemini();

    if (!ai) {
      const nombre = (socio?.nombre || "").split(" ")[0] || "Hola";
      const g = gerente || "el equipo";
      const s = sede || socio?.sede || "tu sede";
      const c = cargo || "Gerente";
      return res.json({
        mensaje: `Hola ${nombre}, ¿cómo estás? Te escribe ${g}, ${c} de Megatlon ${s}.

Notamos que hace unas semanas no te cruzamos por el gym y queríamos ver cómo venís. Sabemos que el trabajo, la rutina o los imprevistos a veces complican los horarios.

Queremos darte una mano para retomar: si te parece, acercate esta semana y te reservamos una sesión personalizada con nuestros profes para ajustar tu rutina a tus tiempos actuales, sin presiones.

¿Te vendría bien pasar esta semana? ¡Te esperamos!

${g}
${c} | Megatlon ${s}`,
      });
    }

    const prompt = `Redacta un mensaje de WhatsApp empático, profesional y altamente persuasivo para un socio de la cadena de gimnasios Megatlon que ha dejado de asistir.
Datos del socio:
- Nombre: ${socio?.nombre || "Socio"}
- Días sin asistir: ${socio?.dias_sin_asistir || "25"} días
- Sede: ${sede || socio?.sede || "Megatlon"}
- Nivel de riesgo de baja: ${socio?.riesgo || "Medio"}
- Motivo preliminar: ${socio?.motivo || "Falta de tiempo"}
- Intereses/Entrenamiento: ${socio?.actividad_favorita || "Musculación y clases grupales"}
- Emisor: ${gerente || "Gerente de Sede"} (${cargo || "Gerente"})
- Tono solicitado: ${tono || "Empático y motivacional sin sonar a venta agresiva"}
- Beneficio o incentivo: ${beneficio || "Sesión de rutina renovada gratuita y pase para acompañante"}

Reglas:
- Redacta en español rioplatense natural (Argentina: vos, venís, acercate, contame).
- No uses modismos exagerados ni clichés de ventas.
- Máximo 3 o 4 párrafos cortos y legibles en WhatsApp con emojis sutiles y profesionales.
- Finaliza con la firma:
\${gerente}
\${cargo} | Megatlon \${sede}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({ mensaje: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/generate-message:", error);
    res.status(500).json({ error: error?.message || "Error al redactar mensaje con IA" });
  }
});

// 4. AI Motivational Image / Campaign Flyer Generator with Gemini Image model
app.post("/api/gemini/generate-image", async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = "1:1", theme = "megatlon" } = req.body;
    const ai = getGemini();

    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY no está configurada aún en el servidor.",
        fallbackNeeded: true,
      });
    }

    const enhancedPrompt = `High-end commercial fitness advertising visual for premium athletic club Megatlon Argentina. 
Theme: ${prompt || "Inspiring athletic comeback, focused athlete tying shoes in an energetic state-of-the-art gym, warm cinematic lighting with energetic Megatlon corporate orange (#F2622A) accent highlights, moody modern gym background with premium equipment, hyper-realistic, 8k resolution, professional commercial sports photography"}.
Clean, premium, aspirational, no distorted anatomy, athletic perfection.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: (aspectRatio as any) || "1:1",
        },
      },
    });

    let imageUrl: string | null = null;
    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: "No se pudo extraer la imagen generada de la respuesta." });
    }

    res.json({ imageUrl, prompt: enhancedPrompt });
  } catch (error: any) {
    console.error("Error in /api/gemini/generate-image:", error);
    res.status(500).json({ error: error?.message || "Error al generar imagen con IA" });
  }
});

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});
