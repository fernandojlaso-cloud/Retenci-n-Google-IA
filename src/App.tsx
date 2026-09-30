/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MegatlonProvider, useMegatlon } from "./context/MegatlonContext";
import { Navbar } from "./components/Navbar";
import { OnboardingJourneyView } from "./components/OnboardingJourneyView";
import { SleepersView } from "./components/SleepersView";
import { ContratosView } from "./components/ContratosView";
import { PanoramaDashboard } from "./components/PanoramaDashboard";
import { CreativeStudio } from "./components/CreativeStudio";
import { ManagerProfileModal } from "./components/ManagerProfileModal";
import { FileIngestionModal } from "./components/FileIngestionModal";
import { AiInsightsModal } from "./components/AiInsightsModal";
import { MessageGeneratorModal } from "./components/MessageGeneratorModal";
import { CloudDatabaseModal } from "./components/CloudDatabaseModal";
import { AdminMensajesView } from "./components/AdminMensajesView";
import { AuditorView } from "./components/AuditorView";
import { AdminClientesView } from "./components/AdminClientesView";
import { LoginScreen } from "./components/LoginScreen";
import { CrearGerenteModal } from "./components/CrearGerenteModal";
import { HistorialAccesosModal } from "./components/HistorialAccesosModal";
import { CasoSleeper } from "./types";

function MainContent() {
  const [solapaActual, setSolapaActual] = useState<string>("onboarding");
  const [isAiInsightsOpen, setIsAiInsightsOpen] = useState<boolean>(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState<boolean>(false);
  const [isFileIngestionOpen, setIsFileIngestionOpen] = useState<boolean>(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState<boolean>(false);
  const [isCrearGerenteOpen, setIsCrearGerenteOpen] = useState<boolean>(false);
  const [isHistorialAccesosOpen, setIsHistorialAccesosOpen] = useState<boolean>(false);
  const [selectedSocioForMessage, setSelectedSocioForMessage] = useState<CasoSleeper | null>(null);

  const { gerente, usuarioAutenticado } = useMegatlon();

  // Si el usuario no ha iniciado sesión con email y contraseña, mostrar pantalla de Log de Acceso
  if (!usuarioAutenticado) {
    return (
      <>
        <LoginScreen onOpenHistorial={() => setIsHistorialAccesosOpen(true)} />
        <HistorialAccesosModal
          isOpen={isHistorialAccesosOpen}
          onClose={() => setIsHistorialAccesosOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090c] text-[#e1e1e6] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-[#ff6b00] selection:text-white">
      {/* Navigation Header */}
      <Navbar
        solapaActual={solapaActual}
        setSolapaActual={setSolapaActual}
        onOpenManagerModal={() => setIsManagerModalOpen(true)}
        onOpenFileIngestion={() => setIsFileIngestionOpen(true)}
        onOpenAiInsights={() => setIsAiInsightsOpen(true)}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        onOpenCrearGerente={() => setIsCrearGerenteOpen(true)}
        onOpenHistorialAccesos={() => setIsHistorialAccesosOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 lg:p-8">
        {solapaActual === "onboarding" && <OnboardingJourneyView />}

        {solapaActual === "sleepers" && (
          <SleepersView
            onOpenMessageModal={(socio) => setSelectedSocioForMessage(socio)}
          />
        )}

        {solapaActual === "contratos" && <ContratosView />}

        {solapaActual === "admin_clientes" && <AdminClientesView />}

        {solapaActual === "panorama" && (
          <PanoramaDashboard
            onOpenAiInsights={() => setIsAiInsightsOpen(true)}
            onNavigateToTab={(tab) => setSolapaActual(tab)}
          />
        )}

        {solapaActual === "estudio" && <CreativeStudio />}

        {solapaActual === "admin_mensajes" && <AdminMensajesView />}

        {solapaActual === "auditor" && <AuditorView />}
      </main>

      {/* Persistent Footer */}
      <footer className="border-t border-white/5 bg-[#0c0c0f] py-4 text-center text-xs text-[#8e8e93]">
        <div className="max-w-[1720px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-['Outfit']">MEGATLON RED DE CLUBES</span>
            <span>•</span>
            <span>Panel de Retención, Sleepers & Customer Journey 30D</span>
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-2">
            <span>
              Sesión activa: <strong className="text-white">{usuarioAutenticado.nombre} {usuarioAutenticado.apellido}</strong> (Megatlon {usuarioAutenticado.sede} • {usuarioAutenticado.cargoEspecifico})
            </span>
            <span>•</span>
            <button
              onClick={() => setIsHistorialAccesosOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline flex items-center gap-1"
            >
              Log de Accesos
            </button>
            <span>•</span>
            <button
              onClick={() => setIsCloudModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Firebase Firestore
            </button>
          </div>
        </div>
      </footer>

      {/* Manager Session Modal */}
      <ManagerProfileModal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
      />

      {/* File Ingestion & Triple Cross-Referencing Modal */}
      <FileIngestionModal
        isOpen={isFileIngestionOpen}
        onClose={() => setIsFileIngestionOpen(false)}
      />

      {/* Executive Churn AI Diagnostic Modal */}
      <AiInsightsModal
        isOpen={isAiInsightsOpen}
        onClose={() => setIsAiInsightsOpen(false)}
        onNavigateToTab={(tab) => setSolapaActual(tab)}
      />

      {/* Cloud Database & Deployment URLs Modal */}
      <CloudDatabaseModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
      />

      {/* WhatsApp Message Drafter Modal */}
      <MessageGeneratorModal
        isOpen={Boolean(selectedSocioForMessage)}
        onClose={() => setSelectedSocioForMessage(null)}
        socio={selectedSocioForMessage}
      />

      {/* Crear Nuevo Gerente / Coordinador Modal */}
      <CrearGerenteModal
        isOpen={isCrearGerenteOpen}
        onClose={() => setIsCrearGerenteOpen(false)}
      />

      {/* Historial & Log de Accesos Corporativo */}
      <HistorialAccesosModal
        isOpen={isHistorialAccesosOpen}
        onClose={() => setIsHistorialAccesosOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <MegatlonProvider>
      <MainContent />
    </MegatlonProvider>
  );
}
