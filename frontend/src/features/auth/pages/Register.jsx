import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Shield, Headset, Building, Hash } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useAuth } from "../hook/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegisterUser } = useAuth();
  const { error: reduxError, loading: reduxLoading, isAuthenticated, user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    inviteCode: "",
  });

  const [role, setRole] = useState("admin"); // Default to admin

  const [localError, setLocalError] = useState("");
  const error = localError || reduxError;
  const isLoading = reduxLoading;

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localError) setLocalError("");
  };

  // Validation
  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your full name";
    if (role === "admin" && !formData.companyName.trim()) return "Please enter your company name";
    if (role === "agent" && !formData.inviteCode.trim()) return "Please enter your invite code";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      return "Please enter a valid email address";
    if (formData.password.length < 8)
      return "Password must be at least 8 characters";
    return null;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    const user = await handleRegisterUser({
      ...formData,
      role,
    });

    if (user) {
      navigate(`/${role}`);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
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
                    layoutId="register-role-indicator"
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
            className="flex flex-col gap-2"
          >
            {/* Name */}
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
              <InputField
                label="Full Name"
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                icon={User}
              />
            </motion.div>

            {/* Email */}
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

            {/* Company Name - Only for Admin */}
            {role === "admin" && (
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <InputField
                  label="Company Name"
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Acme Corp"
                  value={formData.companyName}
                  onChange={handleChange}
                  icon={Building}
                />
              </motion.div>
            )}

            {/* Invite Code - Only for Agent */}
            {role === "agent" && (
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <InputField
                  label="Invite Code"
                  id="inviteCode"
                  name="inviteCode"
                  type="text"
                  placeholder="RESOLVE-XXXX"
                  value={formData.inviteCode}
                  onChange={handleChange}
                  icon={Hash}
                />
              </motion.div>
            )}

            {/* Password */}
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
              <div className="flex flex-col gap-1">
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

                {/* Strength bar */}
                <div className="flex gap-1 px-1 mt-0.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-colors duration-500 ${formData.password.length >= step * 2
                          ? "bg-emerald-500"
                          : "bg-slate-700"
                        }`}
                    />
                  ))}
                </div>
              </div>
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


          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            <span className="flex items-center justify-center gap-2">
              Get Started as {role === "admin" ? "Admin" : "Agent"}
              {!isLoading && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </span>
          </Button>

          {/* Login link */}
          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </AuthLayout>
  );
};

export default Register;