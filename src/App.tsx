import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { AIAssistant } from './components/AIAssistant';
import { SocialGenerator } from './components/SocialGenerator';
import { ImageGenerator } from './components/ImageGenerator';
import { VideoGenerator } from './components/VideoGenerator';
import { ProductCatalog } from './components/ProductCatalog';
import { CustomerResponses } from './components/CustomerResponses';
import { SalesTools } from './components/SalesTools';
import { InvoiceGenerator } from './components/InvoiceGenerator';
import { AICallingAgent } from './components/AICallingAgent';
import { HistoryView } from './components/HistoryView';
import { CompanyProfileView } from './components/CompanyProfileView';
import { PricingView } from './components/PricingView';
import { PricingModal } from './components/PricingModal';
import { PaymentInstructionModal } from './components/PaymentInstructionModal';
import { PurchaseReceiptModal } from './components/PurchaseReceiptModal';
import { BusinessAICodeHubModal } from './components/BusinessAICodeHubModal';
import { AuthModal } from './components/AuthModal';
import { WhatsAppTutorialModal } from './components/WhatsAppTutorialModal';
import { ShareModal } from './components/ShareModal';
import { ViralPostModal } from './components/ViralPostModal';
import { EarnCreditsModal } from './components/EarnCreditsModal';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ReferralView } from './components/ReferralView';
import { EarnCreditsView } from './components/EarnCreditsView';
import { PaymentPaywallView } from './components/PaymentPaywallView';

const AppContent: React.FC = () => {
  const {
    currentTab,
    user,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentPlan,
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    isCodeHubModalOpen,
    setIsCodeHubModalOpen,
  } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPaidUser = user.isPurchased && user.serverVerified && user.plan !== 'free';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onToggleMobileMenu={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Content Area */}
      {currentTab === 'home' ? (
        <main className="flex-1">
          <LandingPage />
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile Drawer Overlay */}
          {isMobileMenuOpen && (
            <div
              onClick={closeMobileMenu}
              className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
              aria-hidden="true"
            />
          )}

          {/* Sidebar Navigation */}
          <div
            className={`fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Sidebar onCloseMobile={closeMobileMenu} />
          </div>

          {/* Dynamic Content View */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/60">
            {currentTab === 'dashboard' && <Dashboard />}
            {currentTab === 'assistant' && (isPaidUser ? <AIAssistant /> : <PaymentPaywallView />)}
            {currentTab === 'social' && (isPaidUser ? <SocialGenerator /> : <PaymentPaywallView />)}
            {currentTab === 'images' && (isPaidUser ? <ImageGenerator /> : <PaymentPaywallView />)}
            {currentTab === 'video' && (isPaidUser ? <VideoGenerator /> : <PaymentPaywallView />)}
            {currentTab === 'products' && <ProductCatalog />}
            {currentTab === 'clients' && (isPaidUser ? <CustomerResponses /> : <PaymentPaywallView />)}
            {currentTab === 'sales' && <SalesTools />}
            {currentTab === 'invoices' && <InvoiceGenerator />}
            {currentTab === 'ai_calls' && (isPaidUser ? <AICallingAgent /> : <PaymentPaywallView />)}
            {currentTab === 'referrals' && <ReferralView />}
            {currentTab === 'earn_credits' && <EarnCreditsView />}
            {currentTab === 'history' && <HistoryView />}
            {currentTab === 'profile' && <CompanyProfileView />}
            {currentTab === 'pricing' && <PricingView />}
          </main>
        </div>
      )}

      {/* Global Modals & Notifications */}
      <WhatsAppTutorialModal />
      <ShareModal />
      <ViralPostModal />
      <EarnCreditsModal />
      <OnboardingWizard />
      <PricingModal />
      <PaymentInstructionModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        preselectedPlan={paymentPlan}
      />
      <PurchaseReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
      <BusinessAICodeHubModal
        isOpen={isCodeHubModalOpen}
        onClose={() => setIsCodeHubModalOpen(false)}
      />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
