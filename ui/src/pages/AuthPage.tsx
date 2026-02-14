import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import GlowInput from "@/components/GlowInput";
import { Eye, EyeOff } from "lucide-react";
import nestIcon from "@/assets/nest-icon.png";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setIsAuthenticated } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    try {
      // ================= LOGIN =================
      if (isLogin) {

        const res = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: email,
            password: password
          })
        });

        // USER NOT FOUND → go to signup
        if (res.status === 404) {
          alert("User not found. Please sign up.");
          setIsLogin(false);
          return;
        }

        // WRONG PASSWORD → stay on login
        if (res.status === 401) {
          alert("Wrong password.");
          return;
        }

        const data = await res.json();

        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          setIsAuthenticated(true);
          
          // Check onboarding status and redirect accordingly
          if (!data.profile_completed) {
            navigate("/profile");
          } else if (!data.onboarding_completed) {
            navigate("/onboarding");
          } else {
            navigate("/dashboard");
          }
        }
      }

      // ================= SIGNUP =================
      else {

        const res = await fetch("http://127.0.0.1:8000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            phone: null,
            password: password
          })
        });

        // VALIDATION ERROR
        if (res.status === 422) {
          const error = await res.text();
          console.log("Signup Error:", error);
          alert("Signup failed. Check console.");
          return;
        }

        // USER EXISTS → go to login
        if (res.status === 400) {
          alert("User already exists. Please login.");
          setIsLogin(true);
          return;
        }

        const data = await res.json();
        
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          setIsAuthenticated(true);
          // New user always goes to profile first
          navigate("/profile");
        }
      }

    } 
    catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >

        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-primary">
              <img src={nestIcon} alt="InfoNest" className="w-10 h-10 object-cover rounded-xl" />
            </div>
            <h1 className="text-2xl font-display font-bold gradient-text">InfoNest</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            A universe of trusted informations
          </p>
        </motion.div>

        <GlassCard glow className="p-8">

          {/* Toggle */}
          <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl mb-6">
            {["Login", "Sign Up"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setIsLogin(i === 0)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  (i === 0 ? isLogin : !isLogin)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <GlowInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <GlowInput
              label="Email"
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <div className="relative input-glow rounded-xl">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="*********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-input border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <NeonButton type="submit" className="w-full mt-2">
              {isLogin ? "Sign In" : "Create Account"}
            </NeonButton>

          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default AuthPage;
