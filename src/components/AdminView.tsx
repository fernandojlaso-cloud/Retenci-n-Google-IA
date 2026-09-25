import React, { useState } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import { PlantillaMensaje, SEDES_MEGATLON } from "../types";
import {
  FileCode,
  Download,
  RotateCcw,
  Plus,
  Save,
  Check,
  Trash2,
  Database,
  ShieldAlert,
} from "lucide-react";

export const AdminView: React.FC = () => {
  const {
    plantillas,
    actualizarPlantilla,
    reiniciarDatosDemo,
    casos,
    agregarCasoSleeper,
  } = useMegatlon();

  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<PlantillaMensaje>(
    plantillas[0]
  );
  const [guardadoExito, setGuardadoExito] = useState(false);

  // Quick form for manual sleeper entry
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoDni, setNuevoDni] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [nuevaSede, setNuevaSede] = useState(SEDES_MEGATLON[0]);
  const [nuevosDias, setNuevosDias] = useState(25);
  const [agregadoExito, setAgregadoExito] = useState(false);

  const handleGuardarPlantilla = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarPlantilla(plantillaSeleccionada.id, plantillaSeleccionada);
    setGuardadoExito(true);
    setTimeout(() => setGuardadoExito(false), 2500);
  };

  const handleAgregarSleeper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevoTelefono.trim()) return;

    agregarCasoSleeper({
      nombre: nuevoNombre.trim(),
      dni: nuevoDni.trim() || "12345678",
      telefono: nuevoTelefono.trim(),
      email: "socio@megatlon.com.ar",
      sede: nuevaSede,
      dias_sin_asistir: Number(nuevosDias) || 20,
      ultimo_acceso: new Date().toISOString().slice(0, 10),
      fecha_fin_contrato: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
      riesgo: nuevosDias > 45 ? "Alto" : nuevosDias > 25 ? "Medio" : "Bajo",
      estado: "Abierto",
      motivo: "Falta de tiempo",
      intencion_volver: "Pensando",
      actividad_favorita: "Musculación",
    });

    setNuevoNombre("");
    setNuevoDni("");
    setNuevoTelefono("");
    setAgregadoExito(true);
    setTimeout(() => setAgregadoExito(false), 2500);
  };

  const handleExportarCsv = () => {
    const headers = [
      "ID",
      "Nombre",
      "DNI",
      "Telefono",
      "Sede",
      "Dias_Sin_Asistir",
      "Riesgo",
      "Motivo",
      "Intencion_Volver",
      "Estado",
      "Resultado_Cierre",
      "Ultimo_Acceso",
    ];

    const rows = casos.map((c) => [
      c.id,
      `"${c.nombre}"`,
      c.dni,
      c.telefono,
      c.sede,
      c.dias_sin_asistir,
      c.riesgo,
      `"${c.motivo || ""}"`,
      c.intencion_volver || "",
      c.estado,
      c.resultado_cierre || "",
      c.ultimo_acceso,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `megatlon_sleepers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#141418] border border-[#222227] rounded-2xl p-5">
        <h1 className="text-lg font-black text-white tracking-tight font-['Outfit']">
          ADMINISTRACIÓN, PLANTILLAS & CONFIGURACIÓN
        </h1>
        <p className="text-xs text-[#8e8e93] mt-1">
          Configurá las plantillas de mensajes WhatsApp, exportá auditorías de gestión e ingresá nuevos casos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Template Editor (7 Cols) */}
        <div className="lg:col-span-7 bg-[#141418] border border-[#222227] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-[#f2622a]" />
              Plantillas de WhatsApp de la Red
            </h2>
            {guardadoExito && (
              <span className="text-[10px] font-bold text-[#30d158] flex items-center gap-1 bg-[#30d158]/10 px-2 py-0.5 rounded-md border border-[#30d158]/20">
                <Check className="w-3 h-3" /> Guardado exitoso
              </span>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {plantillas.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlantillaSeleccionada(p)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
                  plantillaSeleccionada.id === p.id
                    ? "bg-[#f2622a] text-white border-[#f2622a]"
                    : "bg-[#1b1b20] text-[#8e8e93] border-[#2c2c34] hover:text-white"
                }`}
              >
                {p.etiqueta || p.titulo || p.clave}
              </button>
            ))}
          </div>

          <form onSubmit={handleGuardarPlantilla} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#8e8e93] block mb-1">
                Etiqueta / Nombre de la Plantilla
              </label>
              <input
                type="text"
                value={plantillaSeleccionada.etiqueta || ""}
                onChange={(e) =>
                  setPlantillaSeleccionada({
                    ...plantillaSeleccionada,
                    etiqueta: e.target.value,
                  })
                }
                className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f2622a]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#8e8e93] block mb-1">
                Cuerpo del Mensaje (Placeholders disponibles: &#123;nombre&#125;, &#123;sede&#125;, &#123;cargo&#125;, &#123;dias&#125;)
              </label>
              <textarea
                value={plantillaSeleccionada.cuerpo}
                onChange={(e) =>
                  setPlantillaSeleccionada({
                    ...plantillaSeleccionada,
                    cuerpo: e.target.value,
                  })
                }
                rows={7}
                className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#f2622a] font-mono leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#f2622a] hover:bg-[#ff7a45] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Cambios de Plantilla</span>
            </button>
          </form>
        </div>

        {/* Quick Intake & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Intake */}
          <div className="bg-[#141418] border border-[#222227] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-[#f2622a]" />
              Ingreso Manual de Socio Sleeper
            </h2>

            {agregadoExito && (
              <div className="p-2.5 rounded-xl bg-[#30d158]/10 border border-[#30d158]/20 text-[#30d158] text-xs font-bold">
                ✓ Socio ingresado con éxito al tablero
              </div>
            )}

            <form onSubmit={handleAgregarSleeper} className="space-y-2 text-xs">
              <div>
                <input
                  type="text"
                  placeholder="Nombre y Apellido"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f2622a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Teléfono (ej: 1155667788)"
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f2622a]"
                  required
                />
                <input
                  type="text"
                  placeholder="DNI"
                  value={nuevoDni}
                  onChange={(e) => setNuevoDni(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#f2622a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={nuevaSede}
                  onChange={(e) => setNuevaSede(e.target.value)}
                  className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl px-3 py-2 text-white focus:outline-none cursor-pointer"
                >
                  {SEDES_MEGATLON.map((s: string) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Días sin asistir"
                  value={nuevosDias}
                  onChange={(e) => setNuevosDias(Number(e.target.value))}
                  className="w-full bg-[#1b1b20] border border-[#2b2b34] rounded-xl px-3 py-2 text-white focus:outline-none"
                  min={15}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1e1e24] hover:bg-[#282832] text-white border border-[#2d2d38] font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
              >
                + Registrar Socio en Campaña
              </button>
            </form>
          </div>

          {/* Database & Data Controls */}
          <div className="bg-[#141418] border border-[#222227] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8e8e93] flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#f2622a]" />
              Gestión de Datos & Auditoría
            </h2>

            <div className="space-y-2">
              <button
                onClick={handleExportarCsv}
                className="w-full flex items-center justify-center gap-2 bg-[#1a1a20] hover:bg-[#24242e] text-white border border-[#2a2a34] text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#f2622a]" />
                <span>Exportar Base de Sleepers (CSV)</span>
              </button>

              <button
                onClick={() => {
                  if (confirm("¿Deseás reiniciar todos los datos y recuperar el estado de fábrica de la demo?")) {
                    reiniciarDatosDemo();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#ff453a]/10 hover:bg-[#ff453a]/20 text-[#ff453a] border border-[#ff453a]/30 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Datos de Demostración</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
