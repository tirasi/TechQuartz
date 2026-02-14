import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { Target, Check, Mic } from "lucide-react";

const intentOptions = [
  "Scholarships",
  "Schemes",
  "Internships",
  "Fellowships",
  "Hackathons",
  "Competitions",
  "Education Loans",
];

const IntentPage = () => {
  const [intents, setIntents] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const toggleIntent = (intent: string) => {
    setIntents(
      intents.includes(intent)
        ? intents.filter((i) => i !== intent)
        : [...intents, intent]
    );
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice recognition not supported in this browser");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      intentOptions.forEach(option => {
        if (transcript.includes(option.toLowerCase())) {
          if (!intents.includes(option)) {
            setIntents([...intents, option]);
          }
        }
      });
      
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert("Voice recognition error");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleContinue = async () => {
    if (intents.length === 0) {
      alert("Please select at least one option");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          intents: intents
        })
      });

      if (res.ok) {
        navigate("/processing");
      } else {
        alert("Failed to update intent");
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
            <Target className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold gradient-text mb-2">
            What are you looking for?
          </h1>
          <p className="text-muted-foreground">
            Select what you're interested in
          </p>
        </motion.div>

        <GlassCard glow className="p-8">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {intentOptions.map((intent) => (
              <button
                key={intent}
                onClick={() => toggleIntent(intent)}
                className={`p-4 rounded-xl text-sm border text-left transition-all ${
                  intents.includes(intent)
                    ? "border-primary/50 bg-primary/10 neon-glow"
                    : "border-glass-border bg-secondary/30 hover:border-primary/20"
                }`}
              >
                <span className="flex items-center gap-2">
                  {intents.includes(intent) && <Check className="w-4 h-4 text-primary" />}
                  {intent}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleVoiceInput}
            disabled={isListening}
            className={`w-full mb-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
              isListening
                ? "border-primary bg-primary/20 text-primary"
                : "border-glass-border bg-secondary/30 hover:border-primary/20"
            }`}
          >
            <Mic className={`w-5 h-5 ${isListening ? "animate-pulse" : ""}`} />
            {isListening ? "Listening..." : "Use Voice Input"}
          </button>

          <NeonButton onClick={handleContinue} className="w-full">
            Continue to Dashboard
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  );
};

export default IntentPage;
