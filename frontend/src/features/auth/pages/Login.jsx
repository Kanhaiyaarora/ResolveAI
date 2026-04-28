import React, { useState } from "react";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import SocialAuth from "../components/SocialAuth";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      // Fake API delay (replace later with real API)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Redirect after success
      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to manage your infrastructure."
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">



          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 flex items-center gap-3 text-red-400 text-[11px] font-medium overflow-hidden"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inputs */}
          <div className="space-y-3.5">
            <InputField
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />

            <div className="space-y-1.5">
              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />

              {/* Forgot Password */}
              <div className="flex justify-end px-1">
                <Link
                  to="/forgot-password"
                  className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors font-semibold uppercase tracking-wider"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <SocialAuth />

          {/* Submit Button */}
          <div className="pt-0.5">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="group w-full h-11"
            >
              <span className="flex items-center justify-center gap-2 text-sm">
                Sign In
                {!isLoading && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                )}
              </span>
            </Button>
          </div>

          {/* Register Link */}
          <p className="text-center text-[11px] text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:underline font-semibold"
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