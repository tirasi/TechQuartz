import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp, Opportunity } from "@/contexts/AppContext";
import { Sparkles, Brain, Search, Zap } from "lucide-react";

const steps = [
  { icon: Search, text: "Scanning 10,000+ opportunities..." },
  { icon: Brain, text: "AI analyzing your profile..." },
  { icon: Zap, text: "Matching eligibility criteria..." },
  { icon: Sparkles, text: "Generating personalized recommendations..." },
];

const sampleOpportunities: Opportunity[] = [
  {
    id: "1", title: "National Merit Scholarship", type: "scholarship", matchScore: 95,
    deadline: "2026-04-15", amount: "₹50,000/year", provider: "Ministry of Education",
    description: "Merit-based scholarship for undergraduate students from economically weaker sections.",
    eligibility: "12th Pass with 80%+ marks, family income < ₹8 LPA",
    whyMatch: "Your academic level and income bracket make you highly eligible.",
  },
  {
    id: "2", title: "PM Internship Scheme", type: "internship", matchScore: 88,
    deadline: "2026-05-01", provider: "Government of India",
    description: "6-month paid internship across top government departments and PSUs.",
    eligibility: "Age 21-25, Graduate or final year student",
    whyMatch: "Your education level and age align with eligibility requirements.",
  },
  {
    id: "3", title: "State SC/ST Scholarship", type: "scheme", matchScore: 82,
    deadline: "2026-03-31", amount: "₹25,000", provider: "State Government",
    description: "Financial support for students belonging to SC/ST categories pursuing higher education.",
    eligibility: "SC/ST category, family income < ₹2.5 LPA",
    whyMatch: "Based on your category and state of residence.",
  },
  {
    id: "4", title: "Tech for India Fellowship", type: "internship", matchScore: 78,
    deadline: "2026-06-15", provider: "NASSCOM Foundation",
    description: "12-week immersive tech fellowship with stipend and mentorship.",
    eligibility: "Engineering/IT students, any year",
    whyMatch: "Your interest in technology matches this opportunity.",
  },
  {
    id: "5", title: "Startup India Innovation Grant", type: "scheme", matchScore: 72,
    deadline: "2026-07-01", amount: "₹10,00,000", provider: "DPIIT",
    description: "Seed funding for student-led startups with innovative solutions.",
    eligibility: "Age 18-30, enrolled in any educational institution",
    whyMatch: "Your profile indicates entrepreneurial interests.",
  },
];

const ProcessingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { setOpportunities } = useApp();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) setCurrentStep(0);
    else if (progress < 50) setCurrentStep(1);
    else if (progress < 75) setCurrentStep(2);
    else setCurrentStep(3);

    if (progress >= 100) {
      setTimeout(() => {
        setOpportunities(sampleOpportunities);
        navigate("/dashboard");
      }, 500);
    }
  }, [progress, navigate, setOpportunities]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center relative z-10 w-full max-w-md"
      >
        {/* Animated brain icon */}
        <motion.div
          className="w-24 h-24 mx-auto mb-8 rounded-full gradient-bg flex items-center justify-center neon-glow-strong"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Brain className="w-12 h-12 text-primary-foreground" />
        </motion.div>

        <h2 className="text-2xl font-display font-bold mb-2 gradient-text">
          AI Analyzing Your Profile
        </h2>
        <p className="text-muted-foreground mb-8">Finding the best opportunities for you</p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-secondary rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full gradient-bg rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: i <= currentStep ? 1 : 0.3,
                x: 0,
              }}
              transition={{ delay: i * 0.2 }}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                i === currentStep ? "glass neon-border" : ""
              }`}
            >
              <s.icon className={`w-5 h-5 ${i <= currentStep ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-sm ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                {s.text}
              </span>
              {i < currentStep && <Check className="w-4 h-4 text-primary ml-auto" />}
              {i === currentStep && (
                <div className="ml-auto w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Check = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default ProcessingPage;
