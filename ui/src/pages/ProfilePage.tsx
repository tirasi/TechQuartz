import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import NeonButton from "@/components/NeonButton";
import GlowInput from "@/components/GlowInput";
import { User, MapPin, GraduationCap } from "lucide-react";

const studentTypes = ["Undergraduate", "Postgraduate", "Diploma", "PhD"];
const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];
const states = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Goa", "Gujarat", "Haryana",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
  "West Bengal", "Other",
];

const ProfilePage = () => {
  const [studentType, setStudentType] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [semester, setSemester] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentType || !gender || !location || !semester) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          student_type: studentType,
          gender: gender,
          location: location,
          semester: parseInt(semester)
        })
      });

      if (res.ok) {
        navigate("/onboarding");
      } else {
        alert("Failed to update profile");
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
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold gradient-text mb-2">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">
            Help us personalize your experience
          </p>
        </motion.div>

        <GlassCard glow className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Student Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {studentTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setStudentType(type)}
                    className={`py-2.5 px-3 rounded-xl text-sm border transition-all ${
                      studentType === type
                        ? "border-primary/50 bg-primary/10 neon-glow"
                        : "border-glass-border bg-secondary/30 hover:border-primary/20"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-2">
                {genders.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2.5 px-3 rounded-xl text-sm border transition-all ${
                      gender === g
                        ? "border-primary/50 bg-primary/10"
                        : "border-glass-border bg-secondary/30 hover:border-primary/20"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                State
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input border border-glass-border text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="">Select your state</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <GlowInput
              label="Current Semester"
              type="number"
              placeholder="e.g., 3"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              min="1"
              max="12"
              required
            />

            <NeonButton type="submit" className="w-full mt-4">
              Continue
            </NeonButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProfilePage;
