import React, { useState, useRef } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { FlyerCreative, SEDES_MEGATLON } from "../types";
import {
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Wand2,
  Layers,
  Image as ImageIcon,
  MessageCircle,
  Dumbbell,
  Sliders,
} from "lucide-react";

const PROMPT_PRESETS = [
  {
    label: "Regreso Motivacional",
    prompt: "A focused, determined athlete tying running shoes on gym floor, modern premium fitness club with sleek equipment in background, cinematic warm lighting with Megatlon orange accent (#F2622A), high contrast, aspirational, photorealistic 8k",
    headline: "TU LUGAR TE ESTÁ ESPERANDO",
    subheadline: "Volver cuesta un solo día. Te preparamos una rutina express para retomar a tu ritmo.",
    tag: "PROGRAMA RE-START",
    cta: "RESERVÁ TU SESIÓN GRATUITA",
  },
  {
    label: "Semana Re-Activación 2x1",
    prompt: "Two energetic friends doing high-five in modern crossfit gym after workout, smiling, athletic wear, clean state-of-the-art weights in background, energetic sports advertising lighting, vivid orange color highlights",
    headline: "1 SEMANA SIN CARGO",
    subheadline: "Vení a entrenar gratis los próximos 7 días y traé un amigo con pase de cortesía.",
    tag: "BENEFICIO EXCLUSIVO",
    cta: "ACTIVAR MI PASE AHORA",
  },
  {
    label: "Pileta & Spa Relax",
    prompt: "Crystal clear indoor Olympic swimming pool in luxury fitness club, warm evening atmospheric lighting, modern architectural glass roof, reflection on water, serene and energetic wellness vibe, high resolution",
    headline: "RELAX, PILETA & BIENESTAR",
    subheadline: "Retomá con natación libre, hidroterapia o aquagym. Cero impacto, máximo resultado.",
    tag: "MEGATLON AGUA",
    cta: "CONOCER HORARIOS DE PILETA",
  },
  {
    label: "Renovación Anticipada Black",
    prompt: "Close up of an athlete holding a heavy dumbbell with focused eyes, dramatic cinematic side lighting, premium black and orange metallic fitness club ambience, ultra-realistic textures, magazine sports photography",
    headline: "BENEFICIO RENOVACIÓN BLACK",
    subheadline: "Congelá tu cuota anual y asegurá acceso ilimitado a todas las sedes de la red.",
    tag: "SOCIOS DE PRIMERA LÍNEA",
    cta: "CONGELAR MI TARIFA HOY",
  },
];

export const CreativeStudio: React.FC = () => {
  const { flyers, agregarFlyer, filtroSedeGlobal } = useMegatlon();

  const [promptInput, setPromptInput] = useState(PROMPT_PRESETS[0].prompt);
  const [headline, setHeadline] = useState(PROMPT_PRESETS[0].headline);
  const [subheadline, setSubheadline] = useState(PROMPT_PRESETS[0].subheadline);
  const [tag, setTag] = useState(PROMPT_PRESETS[0].tag);
  const [cta, setCta] = useState(PROMPT_PRESETS[0].cta);
  const [nombreSocio, setNombreSocio] = useState("Mateo");
  const [sedeSeleccionada, setSedeSeleccionada] = useState(filtroSedeGlobal || "Belgrano");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "9:16">("1:1");

  const [currentImage, setCurrentImage] = useState<string>(flyers[0]?.imageUrl || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const previewCardRef = useRef<HTMLDivElement>(null);

  const handleSelectPreset = (preset: typeof PROMPT_PRESETS[0]) => {
    setPromptInput(preset.prompt);
    setHeadline(preset.headline);
    setSubheadline(preset.subheadline);
    setTag(preset.tag);
    setCta(preset.cta);
  };

  const handleGenerateAiImage = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptInput,
          aspectRatio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fallbackNeeded) {
          // If GEMINI_API_KEY is not configured, pick next high-quality curated sports graphic
          const fallbackImages = [
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop",
          ];
          const nextImg = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
          setCurrentImage(nextImg);
          setErrorMessage(
            "API Key en modo demostración. Se aplicó una composición fotográfica atlética en alta definición para el flyer."
          );
        } else {
          throw new Error(data.error || "Error generando imagen con IA");
        }
      } else if (data.imageUrl) {
        setCurrentImage(data.imageUrl);

        // Save newly generated flyer to collection
        const newFlyer: FlyerCreative = {
          id: `flyer-${Date.now()}`,
          title: headline,
          category: "retorno",
          imageUrl: data.imageUrl,
          headline,
          subheadline,
          tag,
          cta,
        };
        agregarFlyer(newFlyer);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || "Error de conexión al generar imagen. Probá con un preset visual."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    const text = `*MEGATLON ${sedeSeleccionada.toUpperCase()}*\n\nHola ${nombreSocio}!\n*${headline}*\n\n${subheadline}\n\n👉 *${cta}*\n\nTe esperamos esta semana en tu sede.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-[#141418] border border-[#222227] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f2622a]/20 border border-[#f2622a]/40 flex items-center justify-center text-[#f2622a]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight font-['Outfit']">
              ESTUDIO VISUAL & GENERADOR DE FLYERS IA
            </h1>
            <span className="bg-gradient-to-r from-[#f2622a]/20 to-[#ff7a45]/20 text-[#ff8f5a] border border-[#f2622a]/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Gemini Image Studio
            </span>
          </div>
          <p className="text-xs text-[#8e8e93] mt-1">
            Diseñá tarjetas motivacionales y flyers de alta conversión para compartir por WhatsApp con socios inactivos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-2 bg-[#1e1e24] hover:bg-[#282830] text-white border border-[#2d2d35] font-semibold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#30d158]" /> : <Copy className="w-4 h-4 text-[#8e8e93]" />}
            <span>{copied ? "¡Copiado!" : "Copiar Texto WhatsApp"}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Controls & Right Live Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Prompt & Flyer Copy Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Preset selector */}
          <div className="bg-[#141418] border border-[#222227] rounded-2xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8e8e93] mb-3 flex items-center gap-2">
              <Wand2 className="w-3.5 h-3.5 text-[#f2622a]" />
              Plantillas Creativas de Alto Rendimiento
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PROMPT_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className={`text-left p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    headline === p.headline
                      ? "bg-[#f2622a]/15 border-[#f2622a] text-white"
                      : "bg-[#19191f] border-[#25252d] text-[#8e8e93] hover:text-white hover:border-[#383842]"
                  }`}
                >
                  <div className="font-bold text-white text-[11.5px] truncate">{p.label}</div>
                  <div className="text-[10px] text-[#8e8e93] truncate mt-0.5">{p.tag}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Image Generation Generator Box */}
          <div className="bg-[#141418] border border-[#222227] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#f2622a]" />
                Generador de Imagen por IA (Gemini Image)
              </h2>
              {/* Aspect ratio */}
              <div className="flex items-center gap-1 bg-[#1c1c22] p-1 rounded-xl border border-[#2b2b34]">
                <button
                  onClick={() => setAspectRatio("1:1")}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    aspectRatio === "1:1" ? "bg-[#f2622a] text-white" : "text-[#8e8e93]"
                  }`}
                >
                  1:1 (Chat)
                </button>
                <button
                  onClick={() => setAspectRatio("9:16")}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    aspectRatio === "9:16" ? "bg-[#f2622a] text-white" : "text-[#8e8e93]"
                  }`}
                >
                  9:16 (Estado)
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e93] block mb-1.5">
                Prompt de Generación Visual
              </label>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
                placeholder="Describí la escena atlética que querés generar..."
                className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f2622a] transition-all resize-none font-mono"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-[#ffd426]/10 border border-[#ffd426]/20 text-[#ffd426] text-xs">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleGenerateAiImage}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#f2622a] to-[#ff7a45] hover:opacity-95 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-[#f2622a]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sintetizando imagen con Gemini IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Nueva Imagen con IA</span>
                </>
              )}
            </button>
          </div>

          {/* Copy Customization (Typography & Messaging) */}
          <div className="bg-[#141418] border border-[#222227] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8e8e93] flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#f2622a]" />
              Personalización de Textos y Datos del Socio
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#8e8e93] uppercase block mb-1">
                  Nombre del Socio
                </label>
                <input
                  type="text"
                  value={nombreSocio}
                  onChange={(e) => setNombreSocio(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f2622a]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8e8e93] uppercase block mb-1">
                  Sede Megatlon
                </label>
                <select
                  value={sedeSeleccionada}
                  onChange={(e) => setSedeSeleccionada(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f2622a] cursor-pointer"
                >
                  {SEDES_MEGATLON.map((s: string) => (
                    <option key={s} value={s} className="bg-[#1b1b20]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#8e8e93] uppercase block mb-1">
                  Etiqueta Superior (Tag)
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f2622a]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#8e8e93] uppercase block mb-1">
                  Titular Principal
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#f2622a]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#8e8e93] uppercase block mb-1">
                  Bajada / Beneficio
                </label>
                <textarea
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f2622a] resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#8e8e93] uppercase block mb-1">
                  Botón de Acción (Call to Action)
                </label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f2622a]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Flyer Graphic Canvas Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#141418] border border-[#222227] rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-[#f2622a]" />
                Vista Previa del Flyer en Vivo
              </h2>
              <span className="text-[10px] text-[#8e8e93] bg-[#1c1c22] px-2 py-0.5 rounded-md border border-[#27272f]">
                {aspectRatio === "1:1" ? "Formato Cuadrado (Chat)" : "Formato Historia (Estado)"}
              </span>
            </div>

            {/* Canvas Graphic Card Preview */}
            <div className="flex justify-center p-2 bg-[#09090b] rounded-2xl border border-[#222228]">
              <div
                ref={previewCardRef}
                className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 w-full flex flex-col justify-between ${
                  aspectRatio === "9:16" ? "max-w-[280px] aspect-[9/16]" : "max-w-[360px] aspect-square"
                }`}
                style={{
                  backgroundImage: `url(${currentImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Premium Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-[#09090c]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#09090c]/70 via-transparent to-transparent" />

                {/* Top Header inside Flyer */}
                <div className="relative z-10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-[#09090c]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <Dumbbell className="w-3.5 h-3.5 text-[#f2622a]" />
                    <span className="text-[10px] font-black text-white font-['Outfit'] tracking-wider">
                      <span className="text-[#f2622a]">MEGATLON</span>
                    </span>
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-wider bg-[#f2622a] text-white px-2 py-0.5 rounded-full shadow-sm shadow-[#f2622a]/40">
                    SEDE {sedeSeleccionada.toUpperCase()}
                  </span>
                </div>

                {/* Center / Bottom Content */}
                <div className="relative z-10 p-5 space-y-2">
                  <span className="inline-block text-[9.5px] font-black tracking-widest uppercase text-[#ffd426] bg-[#ffd426]/15 px-2 py-0.5 rounded-md border border-[#ffd426]/30">
                    {tag}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-['Outfit'] tracking-tight drop-shadow-md">
                    {headline}
                  </h3>

                  {nombreSocio && (
                    <div className="text-xs font-semibold text-[#f2622a]">
                      ¡Hola {nombreSocio}, te extrañamos en el club!
                    </div>
                  )}

                  <p className="text-[11px] text-[#e1e1e6] line-clamp-3 leading-relaxed drop-shadow">
                    {subheadline}
                  </p>

                  <div className="pt-2">
                    <div className="w-full text-center bg-gradient-to-r from-[#f2622a] to-[#ff7a45] text-white font-black text-xs py-2.5 px-4 rounded-xl uppercase tracking-wider shadow-lg shadow-[#f2622a]/40 border border-white/20">
                      {cta}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions underneath */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={handleCopyText}
                className="flex items-center justify-center gap-1.5 bg-[#1a1a20] hover:bg-[#252530] text-white text-xs font-bold py-2.5 rounded-xl border border-[#2b2b35] transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#f2622a]" />
                <span>Compartir Texto</span>
              </button>

              <a
                href={currentImage}
                target="_blank"
                rel="noreferrer"
                download="megatlon-flyer.png"
                className="flex items-center justify-center gap-1.5 bg-[#f2622a]/15 hover:bg-[#f2622a]/25 text-[#f2622a] border border-[#f2622a]/40 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer text-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Imagen</span>
              </a>
            </div>
          </div>

          {/* Curated Library of Ready-to-use Athletic Images */}
          <div className="bg-[#141418] border border-[#222227] rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8e8e93] mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#f2622a]" />
              Galería de Fondos Atléticos Megatlon
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {flyers.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(f.imageUrl)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                    currentImage === f.imageUrl
                      ? "border-[#f2622a] ring-2 ring-[#f2622a]/30"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={f.imageUrl}
                    alt={f.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white truncate p-0.5 text-center">
                    {f.title.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
