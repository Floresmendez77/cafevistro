import React from 'react';
import { useStore } from './context/StoreContext';
import { PublicAuthView } from './components/PublicAuthView';
import { DashboardView } from './components/DashboardView';
import { SettingsModal } from './components/SettingsModal';
import { LegalModal } from './components/LegalModal';
import { BlogPostModal } from './components/BlogPostModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';

export const App: React.FC = () => {
  const { currentUser, activeDetailProduct, setActiveDetailProduct } = useStore();

  return (
    <div className="app-root min-h-screen">
      {currentUser ? <DashboardView /> : <PublicAuthView />}

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <ProductDetailModal
        product={activeDetailProduct}
        onClose={() => setActiveDetailProduct(null)}
        onSelectProduct={(p) => setActiveDetailProduct(p)}
      />
      <SettingsModal />
      <LegalModal />
      <BlogPostModal />
      <OrderSuccessModal />

      {/* Notifications */}
      <ToastContainer />
    </div>
  );
};

export default App;
