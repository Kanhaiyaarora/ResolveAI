import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, CheckCircle2, Shield, } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import SocialAuth from "../components/SocialAuth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // Validation
  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      return "Please enter a valid email address";
    if (formData.password.length < 8)
      return "Password must be at least 8 characters";
    return null;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      navigate("/onboarding");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          {/* Name */}
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

          {/* Email */}
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

          {/* Password */}
          <div className="space-y-1">
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
            <div className="flex gap-1 px-1 mt-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${formData.password.length >= step * 2
                      ? "bg-indigo-500"
                      : "bg-white/10"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 text-red-400 text-[10px] font-medium flex items-center gap-2 overflow-hidden"
              >
                <Shield size={14} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social */}
          <SocialAuth />

          {/* Submit */}
          <div className="pt-0.5">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="group h-11"
            >
              <span className="flex items-center justify-center gap-2 text-sm">
                Get Started
                {!isLoading && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                )}
              </span>
            </Button>
          </div>

          {/* Login link */}
          <p className="text-center text-[11px] text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:underline font-semibold"
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