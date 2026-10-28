import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { TopUp } from './pages/TopUp';
import { Payment } from './pages/Payment';
import { Transaction } from './pages/Transaction';
import { Account } from './pages/Account';

const MainContent: React.FC = () => {
  const { token, activeTab, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <img src="/assets/Logo.png" alt="Loading" className="w-10 h-10 object-contain animate-bounce" />
          <span className="text-xs text-gray-500 font-medium">Memuat SIMS PPOB...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated: Login or Register
  if (!token) {
    return authView === 'login' ? (
      <Login onNavigateRegister={() => setAuthView('register')} />
    ) : (
      <Register onNavigateLogin={() => setAuthView('login')} />
    );
  }

  // Authenticated Dashboard Layout
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="flex-1 pb-24 sm:pb-16">
        {activeTab === 'home' && <Home />}
        {activeTab === 'topup' && <TopUp />}
        {activeTab === 'payment' && <Payment />}
        {activeTab === 'transaction' && <Transaction />}
        {activeTab === 'account' && <Account />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
