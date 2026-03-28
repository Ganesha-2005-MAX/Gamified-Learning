import React from 'react';
import { Outlet, Navigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { DashboardNavbar } from './dashboard/DashboardNavbar';
import { motion } from 'motion/react';

export const ProtectedLayout: React.FC = () => {
  const { state } = useGame();

  if (!state.user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-[#FBFCFF]">
      {/* Top Navbar - Now the primary navigation hub */}
      <DashboardNavbar />

      <div className="relative flex flex-col w-full">
        {/* Main Content Area */}
        <main className="flex-1 px-4 py-6 md:px-8 max-w-[1600px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Subtle Background Pattern */}
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.02]">
          <div className="absolute top-0 left-0 w-full h-full" 
            style={{ 
              backgroundImage: 'radial-gradient(#4F46E5 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }} 
          />
        </div>
      </div>
    </div>
  );
};
