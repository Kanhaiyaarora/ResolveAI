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
import WidgetSettings from "../features/widget/pages/WidgetSettings";
import CreateTicket from "../features/tickets/pages/CreateTicket";
import ChatPage from "../features/chat/pages/ChatPage";
import NotFoundPage from "../features/notFound/NotFoundPage";
import Settings from "../features/settings/pages/Settings";
import MyAgents from "../features/agents/pages/MyAgents";
import Home from "../features/home/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />
  },
  {
    path: "/Home",
    element: <Home />
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
              { path: "/tickets/create", element: <CreateTicket /> },
              { path: "/admin/knowledge-base", element: <KnowledgeBaseAdmin /> },
              { path: "/admin/widget", element: <WidgetSettings /> },
              { path: "/admin/agents", element: <MyAgents /> },
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
          { path: "/chat/:ticketId", element: <ChatPage /> },
          { 
            path: "/settings", 
            element: <Settings /> 
          },
          { 
            path: "/help", 
            element: <div className="text-white p-8">Help center coming soon...</div> 
          },
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);
