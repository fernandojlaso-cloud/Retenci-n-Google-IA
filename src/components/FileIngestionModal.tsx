import React, { useState } from "react";
import { useMegatlon } from "../context/MegatlonContext";
import {
  X,
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Database,
  FileText
} from "lucide-react";

interface FileIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileIngestionModal: React.FC<FileIngestionModalProps> = ({ isOpen, onClose }) => {
  const {
    procesarCruceTripleContratos,
    importarSleepersDesdeArchivo,
    importarOnboardingDesdeArchivo,
    gerente,
  } = useMegatlon();

  const [tabActiva, setTabActiva] = useState<"contratos" | "sleepers" | "onboarding">("contratos");
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Estados de datos para cruce triple de Contratos
  const [rawContratosText, setRawContratosText] = useState<string>(
`DNI,Nombre,Telefono,Email,Sede,Plan,Vencimiento,DiasRestantes
33401920,Rodrigo De Paul,+54 9 11 4110-8822,rodrigo@gmail.com,Almagro,Pase Anual Platinum,2027-01-20,118
37890114,Marcos Acuña,+54 9 11 5019-2233,marcos@gmail.com,Almagro,Pase Semestral Oro,2026-12-30,97
35102930,Ángel Di María,+54 9 11 6720-3344,angel@gmail.com,Almagro,Pase Anual Red,2027-02-15,144`
  );

  const [rawAccesosText, setRawAccesosText] = useState<string>(
`DNI,Asistencias30d,FrecuenciaSemanal,UltimoAcceso
33401920,2,0.5,2026-09-08
37890114,14,3.5,2026-09-22
35102930,6,1.4,2026-09-17`
  );

  const [rawNpsText, setRawNpsText] = useState<string>(
`DNI,NPS,Comentario
33401920,4,Me queda incómodo el horario de la tarde por trabajo.
37890114,10,Los profes y las clases de spinning son de diez.
35102930,7,Buena sede pero a veces cuesta encontrar mancuernas.`
  );

  // Estados para Sleepers
  const [rawSleepersText, setRawSleepersText] = useState<string>(
`DNI,Nombre,Telefono,Email,Sede,DiasSinAsistir,UltimoAcceso,FinContrato,Motivo,IntencionVolver
39881024,Mariano Andújar,+54 9 11 3910-4491,mariano@gmail.com,Almagro,34,2026-08-21,2026-11-20,Falta de tiempo,Pensando
36440192,Gabriel Mercado,+54 9 11 4412-8822,gabriel@gmail.com,Almagro,42,2026-08-13,2026-10-30,Desmotivación / Pérdida de hábito,No
41002931,Leandro Paredes,+54 9 11 5820-1199,leandro@gmail.com,Almagro,21,2026-09-03,2026-12-15,Horarios / Disponibilidad de clases,Si`
  );

  // Estados para Onboarding
  const [rawOnboardingText, setRawOnboardingText] = useState<string>(
`DNI,Nombre,Telefono,Email,Sede,DiasDesdeAlta,Rama,AsistenciasReales
43110294,Enzo Fernández,+54 9 11 3190-2211,enzo@gmail.com,Almagro,2,Musculación,1
42901842,Alexis Mac Allister,+54 9 11 4902-8811,alexis@gmail.com,Almagro,5,Clases de Técnicas,3
38291044,Julián Álvarez,+54 9 11 5019-4400,julian@gmail.com,Almagro,27,Outdoor,15`
  );

  if (!isOpen) return null;

  // Procesar Cruce Triple
  const handleProcesarCruceContratos = async () => {
    setCargando(true);
    try {
      // Parse CSV Contratos
      const contratosLines = rawContratosText.trim().split("\n").slice(1);
      const contratos = contratosLines.map((line) => {
        const [dni, nombre, telefono, email, sede, plan, fecha_fin, dias] = line.split(",").map((s) => s.trim());
        return {
          dni,
          nombre,
          telefono,
          email,
          sede: sede || gerente.sede,
          plan,
          fecha_fin_contrato: fecha_fin,
          dias_para_vencer: Number(dias) || 110,
        };
      });

      // Parse CSV Accesos
      const accesosLines = rawAccesosText.trim().split("\n").slice(1);
      const accesos = accesosLines.map((line) => {
        const [dni, asist, frec, ult] = line.split(",").map((s) => s.trim());
        return {
          dni,
          asistencias_30d: Number(asist) || 0,
          frecuencia_semanal: Number(frec) || 1.0,
          ultimo_acceso: ult,
        };
      });

      // Parse CSV NPS
      const npsLines = rawNpsText.trim().split("\n").slice(1);
      const nps = npsLines.map((line) => {
        const [dni, score, ...comentarioParts] = line.split(",").map((s) => s.trim());
        return {
          dni,
          nps_score: Number(score) || 7,
          nps_comentario: comentarioParts.join(","),
        };
      });

      const count = await procesarCruceTripleContratos(contratos, accesos, nps);
      setMensajeExito(`¡Cruce triple exitoso! Se sincronizaron y calificaron ${count} contratos con riesgo de baja.`);
      setTimeout(() => {
        setMensajeExito(null);
        onClose();
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  // Procesar Sleepers
  const handleProcesarSleepers = async () => {
    setCargando(true);
    try {
      const lines = rawSleepersText.trim().split("\n").slice(1);
      const lista = lines.map((l) => {
        const parts = l.split(",").map((s) => s.trim());
        const dni = parts[0];
        const nombre = parts[1];
        const telefono = parts[2];
        const email = parts[3];
        const sede = parts[4];
        const dias = parts[5];
        const ultimo = parts[6];
        const finContrato = parts[7];
        const motivo = parts[8];
        const intencion = parts[9];

        return {
          dni,
          nombre,
          telefono,
          email,
          sede: sede || gerente.sede,
          dias_sin_asistir: Number(dias) || 20,
          ultimo_acceso: ultimo,
          fecha_fin_contrato: finContrato || new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
          motivo: (motivo || "") as any,
          intencion_volver: (intencion || "Pensando") as any,
        };
      });

      const count = await importarSleepersDesdeArchivo(lista);
      setMensajeExito(`Se importaron ${count} casos de socios sleepers en Firebase.`);
      setTimeout(() => {
        setMensajeExito(null);
        onClose();
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  // Procesar Onboarding
  const handleProcesarOnboarding = async () => {
    setCargando(true);
    try {
      const lines = rawOnboardingText.trim().split("\n").slice(1);
      const lista = lines.map((l) => {
        const [dni, nombre, telefono, email, sede, dias, rama, asist] = l.split(",").map((s) => s.trim());
        return {
          dni,
          nombre,
          telefono,
          email,
          sede: sede || gerente.sede,
          dias_desde_alta: Number(dias) || 1,
          rama: rama as any,
          hito4_asistencia_real: Number(asist) || 0,
        };
      });

      const count = await importarOnboardingDesdeArchivo(lista);
      setMensajeExito(`Se importaron ${count} socios al Customer Journey de 30 Días.`);
      setTimeout(() => {
        setMensajeExito(null);
        onClose();
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#1c1c24] to-[#121217] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ingesta de Archivos & Cruce por DNI</h3>
              <p className="text-xs text-[#8e8e93]">
                Carga masiva (CSV/Excel/JSON) vinculada a Megatlon {gerente.sede}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e8e93] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 bg-[#16161d] shrink-0">
          <button
            onClick={() => setTabActiva("contratos")}
            className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              tabActiva === "contratos"
                ? "border-[#ff6b00] text-white bg-white/[0.02]"
                : "border-transparent text-[#8e8e93] hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" /> Cruce Triple Contratos (DNI + NPS + Accesos)
          </button>
          <button
            onClick={() => setTabActiva("sleepers")}
            className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              tabActiva === "sleepers"
                ? "border-[#ff6b00] text-white bg-white/[0.02]"
                : "border-transparent text-[#8e8e93] hover:text-white"
            }`}
          >
            <Database className="w-4 h-4 text-blue-400" /> Base Sleepers
          </button>
          <button
            onClick={() => setTabActiva("onboarding")}
            className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              tabActiva === "onboarding"
                ? "border-[#ff6b00] text-white bg-white/[0.02]"
                : "border-transparent text-[#8e8e93] hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" /> Onboarding 30 Días
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {mensajeExito && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 flex items-center gap-3 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              {mensajeExito}
            </div>
          )}

          {/* TAB 1: Cruce Triple Contratos */}
          {tabActiva === "contratos" && (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-xs text-amber-200/90 leading-relaxed">
                <strong>Motor de Cruce Inteligente:</strong> El sistema une automáticamente las 3 fuentes utilizando el <strong>DNI</strong> del cliente como clave primaria:
                <br />
                1. <strong>Contratos a vencer:</strong> determina los días restantes (ventana 90-150 días).
                <br />
                2. <strong>Registro de accesos:</strong> calcula frecuencia semanal real en los últimos 30 días.
                <br />
                3. <strong>Puntuación NPS:</strong> mide satisfacción (1-10) y comentarios de fricción.
                <br />
                El sistema califica en tiempo real el <strong>Riesgo de Baja</strong> para priorizar el contacto del gerente.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Contratos */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    1. Base Contratos (90-150d)
                  </label>
                  <textarea
                    rows={6}
                    value={rawContratosText}
                    onChange={(e) => setRawContratosText(e.target.value)}
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl p-2.5 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>

                {/* 2. Accesos */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    2. Registro Accesos
                  </label>
                  <textarea
                    rows={6}
                    value={rawAccesosText}
                    onChange={(e) => setRawAccesosText(e.target.value)}
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl p-2.5 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>

                {/* 3. NPS */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    3. Notas & Comentarios NPS
                  </label>
                  <textarea
                    rows={6}
                    value={rawNpsText}
                    onChange={(e) => setRawNpsText(e.target.value)}
                    className="w-full bg-[#1c1c24] border border-white/10 rounded-xl p-2.5 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-[#ff6b00]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={cargando}
                  onClick={handleProcesarCruceContratos}
                  className="px-6 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#ea580c] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#ff6b00]/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  {cargando ? "Cruzando por DNI..." : "Cruzar Fuentes & Guardar en Firestore"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Sleepers */}
          {tabActiva === "sleepers" && (
            <div className="space-y-4">
              <p className="text-xs text-[#8e8e93]">
                Pega o edita el archivo CSV de socios inactivos que pagan cuota pero registran más de 15 días sin asistir al club.
              </p>

              <div>
                <label className="block text-xs font-bold text-white mb-1">CSV de Sleepers (DNI, Nombre, Teléfono, Email, Sede, DíasSinAsistir, ÚltimoAcceso, Motivo):</label>
                <textarea
                  rows={8}
                  value={rawSleepersText}
                  onChange={(e) => setRawSleepersText(e.target.value)}
                  className="w-full bg-[#1c1c24] border border-white/10 rounded-xl p-3 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-[#ff6b00]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={cargando}
                  onClick={handleProcesarSleepers}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  {cargando ? "Importando..." : "Importar Sleepers a Firestore"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Onboarding */}
          {tabActiva === "onboarding" && (
            <div className="space-y-4">
              <p className="text-xs text-[#8e8e93]">
                Pega o edita la lista de socios nuevos para ingresar a la línea de tiempo de Onboarding de 30 Días.
              </p>

              <div>
                <label className="block text-xs font-bold text-white mb-1">CSV Onboarding (DNI, Nombre, Teléfono, Email, Sede, DíasDesdeAlta, Rama, AsistenciasReales):</label>
                <textarea
                  rows={8}
                  value={rawOnboardingText}
                  onChange={(e) => setRawOnboardingText(e.target.value)}
                  className="w-full bg-[#1c1c24] border border-white/10 rounded-xl p-3 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-[#ff6b00]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={cargando}
                  onClick={handleProcesarOnboarding}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  {cargando ? "Importando..." : "Importar a Onboarding 30D"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
