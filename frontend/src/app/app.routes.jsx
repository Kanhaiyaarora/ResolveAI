import { createBrowserRouter, Navigate } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard";
import AgentDashboard from "../features/dashboard/pages/AgentDashboard";
import TicketList from "../features/tickets/pages/TicketList";
import TicketDetails from "../features/tickets/pages/TicketDetails";
import KnowledgeBaseAdmin from "../features/knowledgeBase/pages/KnowledgeBaseAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: <ProtectedRoute />, // Base protection
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Admin specific routes
          {
            element: <ProtectedRoute allowedRoles={["admin"]} />,
            children: [
              { path: "/admin", element: <AdminDashboard /> },
              { path: "/admin/knowledge-base", element: <KnowledgeBaseAdmin /> },
            ]
          },
          // Agent specific routes
          {
            element: <ProtectedRoute allowedRoles={["agent"]} />,
            children: [
              { path: "/agent", element: <AgentDashboard /> },
            ]
          },
          // Common routes
          { path: "/tickets", element: <TicketList /> },
          { path: "/tickets/:id", element: <TicketDetails /> },
          { 
            path: "/settings", 
            element: <div className="text-white p-8">Settings coming soon...</div> 
          },
          { 
            path: "/help", 
            element: <div className="text-white p-8">Help center coming soon...</div> 
          },
        ]
      }
    ]
  }
]);
