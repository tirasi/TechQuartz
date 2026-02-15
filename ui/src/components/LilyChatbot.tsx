import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import GlassCard from "./GlassCard";
import { t } from "@/lib/translations";

interface Message {
  role: "user" | "lily";
  content: string;
}

const LilyChatbot = ({ language }: { language: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const greetings: Record<string, string> = {
      en: "Hi! I'm Lily, your AI assistant. How can I help you today?",
      hi: "नमस्ते! मैं लिली हूं, आपकी AI सहायक। मैं आज आपकी कैसे मदद कर सकती हूं?",
      od: "ନମସ୍କାର! ମୁଁ ଲିଲି, ଆପଣଙ୍କର AI ସହାୟକ। ମୁଁ ଆଜି ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
      bn: "হ্যালো! আমি লিলি, আপনার AI সহায়ক। আমি আজ আপনাকে কীভাবে সাহায্য করতে পারি?",
      mr: "नमस्कार! मी लिली आहे, तुमची AI सहाय्यक। मी आज तुम्हाला कशी मदत करू शकते?"
    };
    setMessages([{ role: "lily", content: greetings[language] || greetings.en }]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const cmd = input.toLowerCase();
      let response = "";

      if (cmd.includes("scholarship") || cmd.includes("छात्रवृत्ति") || cmd.includes("ଛାତ୍ରବୃତ୍ତି") || cmd.includes("বৃত্তি") || cmd.includes("शिष्यवृत्ती")) {
        const responses: Record<string, string> = {
          en: "I can help you find scholarships! Check the dashboard for scholarship opportunities matching your profile.",
          hi: "मैं आपको छात्रवृत्ति खोजने में मदद कर सकती हूं! अपनी प्रोफ़ाइल से मेल खाने वाले छात्रवृत्ति अवसरों के लिए डैशबोर्ड देखें।",
          od: "ମୁଁ ଆପଣଙ୍କୁ ଛାତ୍ରବୃତ୍ତି ଖୋଜିବାରେ ସାହାଯ୍ୟ କରିପାରିବି! ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ସହିତ ମେଳ ଖାଉଥିବା ଛାତ୍ରବୃତ୍ତି ସୁଯୋଗ ପାଇଁ ଡ୍ୟାସବୋର୍ଡ ଦେଖନ୍ତୁ।",
          bn: "আমি আপনাকে বৃত্তি খুঁজতে সাহায্য করতে পারি! আপনার প্রোফাইলের সাথে মিলে এমন বৃত্তি সুযোগের জন্য ড্যাশবোর্ড দেখুন।",
          mr: "मी तुम्हाला शिष्यवृत्ती शोधण्यात मदत करू शकते! तुमच्या प्रोफाइलशी जुळणाऱ्या शिष्यवृत्ती संधींसाठी डॅशबोर्ड पहा।"
        };
        response = responses[language] || responses.en;
      } else if (cmd.includes("internship") || cmd.includes("इंटर्नशिप") || cmd.includes("ଇଣ୍ଟର୍ନସିପ୍") || cmd.includes("ইন্টার্নশিপ") || cmd.includes("इंटर्नशिप")) {
        const responses: Record<string, string> = {
          en: "Looking for internships? I can show you relevant opportunities on the dashboard!",
          hi: "इंटर्नशिप की तलाश है? मैं आपको डैशबोर्ड पर प्रासंगिक अवसर दिखा सकती हूं!",
          od: "ଇଣ୍ଟର୍ନସିପ୍ ଖୋଜୁଛନ୍ତି? ମୁଁ ଆପଣଙ୍କୁ ଡ୍ୟାସବୋର୍ଡରେ ପ୍ରାସଙ୍ଗିକ ସୁଯୋଗ ଦେଖାଇପାରିବି!",
          bn: "ইন্টার্নশিপ খুঁজছেন? আমি আপনাকে ড্যাশবোর্ডে প্রাসঙ্গিক সুযোগ দেখাতে পারি!",
          mr: "इंटर्नशिप शोधत आहात? मी तुम्हाला डॅशबोर्डवर संबंधित संधी दाखवू शकते!"
        };
        response = responses[language] || responses.en;
      } else if (cmd.includes("help") || cmd.includes("मदद") || cmd.includes("ସାହାଯ୍ୟ") || cmd.includes("সাহায্য") || cmd.includes("मदत")) {
        const responses: Record<string, string> = {
          en: "I can help you with scholarships, internships, schemes, and answer questions about opportunities. Just ask!",
          hi: "मैं छात्रवृत्ति, इंटर्नशिप, योजनाओं में आपकी मदद कर सकती हूं और अवसरों के बारे में सवालों के जवाब दे सकती हूं। बस पूछें!",
          od: "ମୁଁ ଛାତ୍ରବୃତ୍ତି, ଇଣ୍ଟର୍ନସିପ୍, ଯୋଜନା ସହିତ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିପାରିବି ଏବଂ ସୁଯୋଗ ବିଷୟରେ ପ୍ରଶ୍ନର ଉତ୍ତର ଦେଇପାରିବି। କେବଳ ପଚାରନ୍ତୁ!",
          bn: "আমি বৃত্তি, ইন্টার্নশিপ, প্রকল্পে আপনাকে সাহায্য করতে পারি এবং সুযোগ সম্পর্কে প্রশ্নের উত্তর দিতে পারি। শুধু জিজ্ঞাসা করুন!",
          mr: "मी शिष्यवृत्ती, इंटर्नशिप, योजनांमध्ये तुम्हाला मदत करू शकते आणि संधींबद्दल प्रश्नांची उत्तरे देऊ शकते. फक्त विचारा!"
        };
        response = responses[language] || responses.en;
      } else {
        const responses: Record<string, string> = {
          en: "I'm here to help! You can ask me about scholarships, internships, schemes, or any opportunities.",
          hi: "मैं यहाँ मदद के लिए हूँ! आप मुझसे छात्रवृत्ति, इंटर्नशिप, योजनाओं या किसी भी अवसर के बारे में पूछ सकते हैं।",
          od: "ମୁଁ ସାହାଯ୍ୟ କରିବାକୁ ଏଠାରେ ଅଛି! ଆପଣ ମୋତେ ଛାତ୍ରବୃତ୍ତି, ଇଣ୍ଟର୍ନସିପ୍, ଯୋଜନା କିମ୍ବା କୌଣସି ସୁଯୋଗ ବିଷୟରେ ପଚାରିପାରିବେ।",
          bn: "আমি সাহায্য করতে এখানে আছি! আপনি আমাকে বৃত্তি, ইন্টার্নশিপ, প্রকল্প বা যেকোনো সুযোগ সম্পর্কে জিজ্ঞাসা করতে পারেন।",
          mr: "मी मदत करण्यासाठी येथे आहे! तुम्ही मला शिष्यवृत्ती, इंटर्नशिप, योजना किंवा कोणत्याही संधीबद्दल विचारू शकता।"
        };
        response = responses[language] || responses.en;
      }

      const lilyMsg: Message = { role: "lily", content: response };
      setMessages(prev => [...prev, lilyMsg]);
    }, 500);

    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-50"
          >
            <GlassCard glow className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-glass-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Lily</h3>
                    <p className="text-xs text-muted-foreground">AI Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-glass-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-xl bg-input border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                  <button
                    onClick={handleSend}
                    className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg neon-glow z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
};

export default LilyChatbot;
