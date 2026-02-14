import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { Globe, Mic, MicOff } from "lucide-react";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "od", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "mr", name: "Marathi", native: "मराठी" },
];

const OnboardingPage = () => {
  const [language, setLanguage] = useState("en");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          language: language,
          voice_enabled: voiceEnabled
        })
      });

      if (res.ok) {
        navigate("/preferences");
      } else {
        alert("Failed to update language");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold gradient-text mb-2">
            Choose Your Language
          </h1>
          <p className="text-muted-foreground">
            Select your preferred language
          </p>
        </motion.div>

        <GlassCard glow className="p-8">
          <div className="grid gap-3 mb-6">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  language === l.code
                    ? "border-primary/50 bg-primary/10 neon-glow"
                    : "border-glass-border bg-secondary/30 hover:border-primary/20"
                }`}
              >
                <span className="font-medium">{l.name}</span>
                <span className="text-muted-foreground">{l.native}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-glass-border bg-secondary/30 mb-6">
            <div className="flex items-center gap-3">
              {voiceEnabled ? <Mic className="w-5 h-5 text-primary" /> : <MicOff className="w-5 h-5 text-muted-foreground" />}
              <div>
                <p className="text-sm font-medium">Voice Accessibility</p>
                <p className="text-xs text-muted-foreground">Enable voice-first navigation</p>
              </div>
            </div>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-12 h-6 rounded-full transition-all relative ${
                voiceEnabled ? "bg-primary" : "bg-secondary"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-foreground absolute top-0.5 transition-all ${
                voiceEnabled ? "left-6" : "left-0.5"
              }`} />
            </button>
          </div>

          <NeonButton onClick={handleContinue} className="w-full">
            Continue
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  );
};

export default OnboardingPage;
