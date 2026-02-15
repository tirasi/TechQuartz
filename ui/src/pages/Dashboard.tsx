import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp, Opportunity } from "@/contexts/AppContext";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import LilyChatbot from "@/components/LilyChatbot";
import {
  Sparkles, GraduationCap, Briefcase, Building2, Clock, TrendingUp,
  Bell, BellRing, ChevronDown, ChevronUp, LogOut, Filter, Search, Settings, Globe, Mic, MicOff, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { t } from "@/lib/translations";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

const typeIcons = {
  scholarship: GraduationCap,
  internship: Briefcase,
  scheme: Building2,
};

const typeColors = {
  scholarship: "text-primary",
  internship: "text-accent",
  scheme: "text-neon-glow",
};

const typeBadgeStyles = {
  scholarship: "bg-primary/10 text-primary border-primary/20",
  internship: "bg-accent/10 text-accent border-accent/20",
  scheme: "bg-neon-glow/10 text-neon-glow border-neon-glow/20",
};

const OpportunityCard = ({ opp, index, lang }: { opp: Opportunity; index: number; lang: string }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = typeIcons[opp.type];
  const daysLeft = Math.max(0, Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / 86400000));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard glow className="p-5 cursor-pointer hover:border-primary/30 transition-all" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-secondary ${typeColors[opp.type]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${typeBadgeStyles[opp.type]}`}>
                  {t(opp.type, lang)}
                </span>
                {daysLeft <= 30 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {daysLeft}{t("daysLeft", lang)}
                  </span>
                )}
              </div>
              <h3 className="font-display font-semibold text-foreground">{opp.title}</h3>
              <p className="text-sm text-muted-foreground">{opp.provider}</p>
            </div>
          </div>

          {/* Match score */}
          <div className="flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
              opp.matchScore >= 90 ? "border-primary neon-glow" : opp.matchScore >= 80 ? "border-primary/60" : "border-muted-foreground/30"
            }`}>
              <span className="text-lg font-display font-bold text-primary">{opp.matchScore}%</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{t("match", lang)}</span>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-glass-border space-y-3">
                <p className="text-sm text-foreground/80">{opp.description}</p>
                {opp.amount && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{opp.amount}</span>
                  </div>
                )}
                <div className="p-3 rounded-xl gradient-bg-subtle border border-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">{t("whyMatch", lang)}</p>
                  <p className="text-sm text-foreground">{opp.whyMatch}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>{t("eligibility", lang)}:</strong> {opp.eligibility}
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>{t("deadline", lang)}:</strong> {new Date(opp.deadline).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <NeonButton className="w-full mt-2">{t("applyNow", lang)}</NeonButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center mt-2">
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </GlassCard>
    </motion.div>
  );
};

const Dashboard = () => {
  const { profile, opportunities, setOpportunities, setIsAuthenticated, voiceEnabled, setVoiceEnabled, language, setLanguage } = useApp();
  const [filter, setFilter] = useState<"all" | "scholarship" | "internship" | "scheme">("all");
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reminderDays, setReminderDays] = useState("7");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिन्दी" },
    { code: "od", name: "Odia", native: "ଓଡ଼ିଆ" },
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "mr", name: "Marathi", native: "मराठी" },
  ];

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/opportunities", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setOpportunities(data.opportunities);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [setOpportunities]);

  const filtered = filter === "all" ? opportunities : opportunities.filter((o) => o.type === filter);

  const handleVoiceCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase();

    if (cmd.includes('scholarship')) {
      setFilter('scholarship');
    } else if (cmd.includes('internship')) {
      setFilter('internship');
    } else if (cmd.includes('scheme')) {
      setFilter('scheme');
    } else if (cmd.includes('all') || cmd.includes('show all')) {
      setFilter('all');
    } else if (cmd.includes('setting') || cmd.includes('settings')) {
      setSettingsOpen(true);
    } else if (cmd.includes('logout') || cmd.includes('log out')) {
      setTimeout(handleLogout, 1000);
    }
  }, []);

  const { speak } = useVoiceAssistant(voiceEnabled, language, handleVoiceCommand);

  useEffect(() => {
    if (voiceEnabled && !loading && opportunities.length > 0) {
      const timer = setTimeout(() => {
        const responses: Record<string, string> = {
          en: `Welcome to InfoNest. You have ${opportunities.length} opportunities.`,
          hi: `इन्फोनेस्ट में आपका स्वागत है। आपके पास ${opportunities.length} अवसर हैं।`,
          od: `ଇନ୍ଫୋନେଷ୍ଟକୁ ସ୍ୱାଗତ। ଆପଣଙ୍କ ପାଖରେ ${opportunities.length} ସୁଯୋଗ ଅଛି।`,
          bn: `ইনফোনেস্টে স্বাগতম। আপনার ${opportunities.length}টি সুযোগ আছে।`,
          mr: `इन्फोनेस्टमध्ये स्वागत आहे। तुमच्याकडे ${opportunities.length} संधी आहेत।`,
        };
        speak(responses[language] || responses.en);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [voiceEnabled, loading]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleLanguageChange = async (newLang: string) => {
    setLanguage(newLang as any);
    
    try {
      const token = localStorage.getItem("token");
      await fetch("http://127.0.0.1:8000/language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          language: newLang,
          voice_enabled: voiceEnabled
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleVoiceToggle = async () => {
    const newVoiceState = !voiceEnabled;
    setVoiceEnabled(newVoiceState);
    
    if (newVoiceState && speak) {
      setTimeout(() => {
        speak('Voice assistant enabled. You can now use voice commands.');
      }, 500);
    }
    
    try {
      const token = localStorage.getItem("token");
      await fetch("http://127.0.0.1:8000/language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          language: language,
          voice_enabled: newVoiceState
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-glass-border glass-strong sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold gradient-text">InfoNest</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2 rounded-xl border border-glass-border bg-secondary/30 hover:bg-secondary transition-colors relative"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setRemindersOpen(!remindersOpen)}
              className="p-2 rounded-xl border border-glass-border bg-secondary/30 hover:bg-secondary transition-colors relative"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={handleLogout} className="p-2 rounded-xl border border-glass-border bg-secondary/30 hover:bg-secondary transition-colors">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        {/* Settings Modal */}
        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSettingsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      <h3 className="font-display font-semibold text-lg">{t("settings", language)}</h3>
                    </div>
                    <button onClick={() => setSettingsOpen(false)} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                        <Globe className="w-4 h-4" />
                        {t("language", language)}
                      </label>
                      <div className="grid gap-2">
                        {languages.map((l) => (
                          <button
                            key={l.code}
                            onClick={() => handleLanguageChange(l.code)}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                              language === l.code
                                ? "border-primary/50 bg-primary/10 neon-glow"
                                : "border-glass-border bg-secondary/30 hover:border-primary/20"
                            }`}
                          >
                            <span className="font-medium text-sm">{l.native}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-glass-border bg-secondary/30">
                      <div className="flex items-center gap-3">
                        {voiceEnabled ? <Mic className="w-5 h-5 text-primary" /> : <MicOff className="w-5 h-5 text-muted-foreground" />}
                        <div>
                          <p className="text-sm font-medium">{t("voiceAssistant", language)}</p>
                          <p className="text-xs text-muted-foreground">{t("enableVoice", language)}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleVoiceToggle}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          voiceEnabled ? "bg-primary" : "bg-secondary"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-foreground absolute top-0.5 transition-all ${
                          voiceEnabled ? "left-6" : "left-0.5"
                        }`} />
                      </button>
                    </div>
                  </div>

                  <NeonButton onClick={() => setSettingsOpen(false)} className="w-full mt-6">
                    {t("saveChanges", language)}
                  </NeonButton>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-display font-bold">
            {t("welcomeBack", language)} 👋
          </h1>
          <p className="text-muted-foreground">
            {loading ? t("loading", language) : t("foundOpportunities", language, { count: opportunities.length })}
          </p>
        </motion.div>

        {/* Reminder settings */}
        <AnimatePresence>
          {remindersOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BellRing className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold">Deadline Reminders</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Get notified before deadlines expire</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm">Remind me</span>
                  <select
                    value={reminderDays}
                    onChange={(e) => setReminderDays(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-input border border-glass-border text-foreground text-sm focus:outline-none"
                  >
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                  </select>
                  <span className="text-sm">before deadline</span>
                </div>
                <NeonButton variant="secondary" className="mt-4 text-sm" onClick={() => setRemindersOpen(false)}>
                  Save Settings
                </NeonButton>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {(["all", "scholarship", "internship", "scheme"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filter === f
                  ? "gradient-bg text-primary-foreground font-medium"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-glass-border"
              }`}
            >
              {f === "all" ? t("all", language) : t(`${f}s` as any, language)}
            </button>
          ))}
        </div>

        {/* Opportunity cards */}
        <div className="space-y-4">
          {filtered.map((opp, i) => (
            <OpportunityCard key={opp.id} opp={opp} index={i} lang={language} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No opportunities found for this filter.</p>
          </div>
        )}
      </main>

      <LilyChatbot language={language} />
    </div>
  );
};

export default Dashboard;
