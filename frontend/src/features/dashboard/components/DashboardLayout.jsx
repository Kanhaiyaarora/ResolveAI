import React from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../../auth/hook/useAuth";
import { useSelector } from "react-redux";

const DashboardLayout = () => {
  const { handleLogoutUser } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="h-screen overflow-hidden bg-slate-950 font-sans selection:bg-emerald-500/30">
      <Sidebar 
        role={user?.role} 
        onLogout={handleLogoutUser} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex flex-col h-screen">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className={`flex-1 overflow-y-auto p-4 sm:p-8 transition-all duration-300 ${isSidebarOpen ? 'blur-sm lg:blur-none' : ''} lg:ml-64`}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
