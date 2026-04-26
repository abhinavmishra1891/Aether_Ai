import { useState } from "react";
import { generateContent } from "../services/geminiService";
import { GenerationOutput } from "../types";
import { db, auth, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, RotateCcw, PenTool, Radio } from "lucide-react";
import { GenerationCard } from "./GenerationCard";

export function Dashboard() {
  const [idea, setIdea] = useState("");
  const [tone, setTone] = useState("engaging");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<GenerationOutput | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    
    setLoading(true);
    setError("");
    setOutput(null);

    try {
      const result = await generateContent(idea, tone);
      setOutput(result);

      // Save to Firebase
      if (auth.currentUser) {
        const path = "generations";
        try {
          await addDoc(collection(db, path), {
            userId: auth.currentUser.uid,
            inputIdea: idea,
            output: result,
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tones = [
    { value: "engaging", label: "Engaging", icon: Sparkles },
    { value: "minimalist", label: "Minimalist", icon: Radio },
    { value: "professional", label: "Professional", icon: PenTool },
  ];

  return (
    <div className="max-w-4xl mx-auto py-xxl px-6">
      <section className="mb-12">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high border border-white/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse mr-2"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Aether Neural Core</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
          Turn your thought into <span className="text-transparent bg-clip-text liquid-gradient">Mastery.</span>
        </h2>
        <p className="text-on-surface-variant max-w-xl text-lg">
          Inject your idea and let Aether's proprietary neural engine engineer the perfect deployment structure.
        </p>
      </section>

      <div className="space-y-8">
        <div className="glass-card pro-glow rounded-xl p-8 border-primary/20">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary">Content Concept</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Ex: A viral Instagram reel about daily discipline and morning routines..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white min-h-[120px] focus:outline-none focus:border-primary transition-all text-lg placeholder:text-slate-600 resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                {tones.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                      tone === t.value 
                        ? "bg-primary/20 border-primary text-primary" 
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !idea}
                className="liquid-gradient px-8 py-3 rounded-lg text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-2xl shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Engineering..." : "Initialize Generation"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-400/10 border border-red-400/20 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </motion.div>
        )}

        {output && <GenerationCard output={output} title="Engineered Result" />}
        
        {output && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button 
              onClick={handleGenerate}
              className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]"
            >
              <RotateCcw className="w-4 h-4" />
              Regenerate Output
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
