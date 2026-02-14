import { useEffect, useRef } from 'react';

const langMap: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  od: 'or-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
};

export const useVoiceAssistant = (
  enabled: boolean,
  language: string,
  onCommand: (command: string) => void
) => {
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    synthRef.current = window.speechSynthesis;

    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = langMap[language] || 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        if (isSpeakingRef.current) return;
        const transcript = event.results[event.results.length - 1][0].transcript;
        onCommand(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.error('Speech recognition error:', event.error);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onCommand]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (enabled && !isSpeakingRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    } else {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, [enabled]);

  const speak = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    isSpeakingRef.current = true;

    if (recognitionRef.current && enabled) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[language] || 'en-US';
    utterance.pitch = 1.2;
    utterance.rate = 1.0;

    const voices = synthRef.current.getVoices();
    const langCode = langMap[language]?.split('-')[0] || 'en';
    const femaleVoice = voices.find(
      (v) => v.lang.startsWith(langCode) && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))
    ) || voices.find(
      (v) => v.lang.startsWith(langCode)
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onend = () => {
      isSpeakingRef.current = false;
      if (recognitionRef.current && enabled) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {}
        }, 500);
      }
    };

    synthRef.current.speak(utterance);
  };

  return { speak };
};
