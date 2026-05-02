import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Shield, Headset } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useAuth } from "../hook/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { handleLoginUser } = useAuth();
  const { error: reduxError, loading: reduxLoading, isAuthenticated, user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [role, setRole] = useState("admin"); // Default to admin

  const [localError, setLocalError] = useState("");
  const error = localError || reduxError;
  const isLoading = reduxLoading;

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (localError) setLocalError("");
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    const user = await handleLoginUser({
      email: formData.email,
      password: formData.password,
      role,
    });

    if (user) {
      // Redirect based on selected role
      navigate(`/${role}`);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to manage your infrastructure."
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Role Selection Toggle */}
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl shadow-inner">
            {["admin", "agent"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setLocalError("");
                }}
                className={`relative flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                  role === r ? "text-white shadow-sm" : "text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {role === r && (
                  <motion.div
                    layoutId="role-indicator"
                    className="absolute inset-0 bg-emerald-500 border border-emerald-400 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2 capitalize">
                  {r === "admin" ? <Shield size={16} /> : <Headset size={16} />}
                  {r}
                </span>
              </button>
            ))}
          </div>

          {/* Inputs with Staggered Animation */}
          <motion.div 
            variants={{
              show: { transition: { staggerChildren: 0.05 } }
            }}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-3"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
              <InputField
                label="Email Address"
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
              />
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm font-medium flex items-center gap-3 overflow-hidden"
              >
                <Shield size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            <span className="flex items-center justify-center gap-2">
              Sign In as {role === "admin" ? "Admin" : "Agent"}
              {!isLoading && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </span>
          </Button>

          {/* Register Link */}
          <p className="text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;