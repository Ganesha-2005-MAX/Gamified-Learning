import React from 'react';
import { DashboardNavbar } from './DashboardNavbar';
import { motion } from 'motion/react';
import { useGame } from '../../context/GameContext';
import { Navigate } from 'react-router';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { state } = useGame();

  if (!state.user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFF]">
      {/* Top Navbar */}
      <DashboardNavbar />

      {/* Main Content Area */}
      <main className="px-4 py-6 md:px-8 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{ 
            backgroundImage: 'radial-gradient(#4F46E5 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>
    </div>
  );
};
