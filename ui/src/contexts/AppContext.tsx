import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi" | "od" | "bn" | "mr";

export interface StudentProfile {
  name: string;
  age: string;
  gender: string;
  state: string;
  education: string;
  income: string;
  category: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: "scholarship" | "internship" | "scheme";
  matchScore: number;
  deadline: string;
  amount?: string;
  provider: string;
  description: string;
  eligibility: string;
  whyMatch: string;
}

interface AppState {
  language: Language;
  setLanguage: (l: Language) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (v: boolean) => void;
  profile: StudentProfile;
  setProfile: (p: StudentProfile) => void;
  interests: string[];
  setInterests: (i: string[]) => void;
  opportunities: Opportunity[];
  setOpportunities: (o: Opportunity[]) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (a: boolean) => void;
}

const defaultProfile: StudentProfile = {
  name: "", age: "", gender: "", state: "", education: "", income: "", category: "",
};

const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>(defaultProfile);
  const [interests, setInterests] = useState<string[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AppContext.Provider value={{
      language, setLanguage, voiceEnabled, setVoiceEnabled,
      profile, setProfile, interests, setInterests,
      opportunities, setOpportunities, isAuthenticated, setIsAuthenticated,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};
