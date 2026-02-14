import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import { BookOpen, Check } from "lucide-react";

const interestOptions = [
  "Business",
  "Finance",
  "IT",
  "Engineering",
  "Medical",
  "Arts",
  "Government",
  "Education",
  "Sports",
];

const PreferencesPage = () => {
  const [interests, setInterests] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleInterest = (interest: string) => {
    setInterests(
      interests.includes(interest)
        ? interests.filter((i) => i !== interest)
        : [...interests, interest]
    );
  };

  const handleContinue = async () => {
    if (interests.length === 0) {
      alert("Please select at least one interest");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          interests: interests
        })
      });

      if (res.ok) {
        navigate("/intent");
      } else {
        alert("Failed to update preferences");
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
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold gradient-text mb-2">
            Your Interests
          </h1>
          <p className="text-muted-foreground">
            Select areas you're interested in
          </p>
        </motion.div>

        <GlassCard glow className="p-8">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`p-4 rounded-xl text-sm border text-left transition-all ${
                  interests.includes(interest)
                    ? "border-primary/50 bg-primary/10 neon-glow"
                    : "border-glass-border bg-secondary/30 hover:border-primary/20"
                }`}
              >
                <span className="flex items-center gap-2">
                  {interests.includes(interest) && <Check className="w-4 h-4 text-primary" />}
                  {interest}
                </span>
              </button>
            ))}
          </div>

          <NeonButton onClick={handleContinue} className="w-full">
            Continue
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  );
};

export default PreferencesPage;
