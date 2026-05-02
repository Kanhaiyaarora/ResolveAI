import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import Chat from "../features/auth/pages/Chat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Home of ResolveAI</h1>
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
    path: "/chat",
    element:<Chat/>
  },
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: (
          <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Admin Dashboard</h1>
          </div>
        )
      }
    ]
  },
  {
    element: <ProtectedRoute allowedRoles={["agent"]} />,
    children: [
      {
        path: "/agent",
        element: (
          <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">Agent Dashboard</h1>
          </div>
        )
      }
    ]
  }
])
