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
import { AdminMensajesView } from "./components/AdminMensajesView";
import { AuditorView } from "./components/AuditorView";
import { CasoSleeper } from "./types";

function MainContent() {
  const [solapaActual, setSolapaActual] = useState<string>("onboarding");
  const [isAiInsightsOpen, setIsAiInsightsOpen] = useState<boolean>(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState<boolean>(false);
  const [isFileIngestionOpen, setIsFileIngestionOpen] = useState<boolean>(false);
  const [selectedSocioForMessage, setSelectedSocioForMessage] = useState<CasoSleeper | null>(null);

  const { gerente } = useMegatlon();

  return (
    <div className="min-h-screen bg-[#09090c] text-[#e1e1e6] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-[#ff6b00] selection:text-white">
      {/* Navigation Header */}
      <Navbar
        solapaActual={solapaActual}
        setSolapaActual={setSolapaActual}
        onOpenManagerModal={() => setIsManagerModalOpen(true)}
        onOpenFileIngestion={() => setIsFileIngestionOpen(true)}
        onOpenAiInsights={() => setIsAiInsightsOpen(true)}
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
          <div className="text-[11px] text-zinc-400">
            Sucursal Activa: <strong className="text-white">Megatlon {gerente.sede}</strong> • Gerente: {gerente.nombre} {gerente.apellido} • Firebase Firestore
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

      {/* WhatsApp Message Drafter Modal */}
      <MessageGeneratorModal
        isOpen={Boolean(selectedSocioForMessage)}
        onClose={() => setSelectedSocioForMessage(null)}
        socio={selectedSocioForMessage}
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
