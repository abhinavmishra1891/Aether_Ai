import { useState } from "react";
import { Copy, Check, Hash, MessageSquare, Video, Quote } from "lucide-react";
import { GenerationOutput } from "../types";
import { motion } from "motion/react";

interface GenerationCardProps {
  output: GenerationOutput;
  title: string;
}

export function GenerationCard({ output, title }: GenerationCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const sections = [
    { key: "hook", label: "Attention Hook", icon: Video, color: "text-blue-400" },
    { key: "script", label: "Full Script", icon: Quote, color: "text-purple-400" },
    { key: "caption", label: "Social Caption", icon: MessageSquare, color: "text-cyan-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-display font-bold text-white">{title}</h3>
        <span className="bg-primary/20 text-primary text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-primary/30">
          Neural Output
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section) => (
          <div key={section.key} className="glass-card rounded-xl overflow-hidden group">
            <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <section.icon className={`w-4 h-4 ${section.color}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {section.label}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard((output as any)[section.key], section.key)}
                className="text-on-surface-variant hover:text-white transition-colors"
              >
                {copiedField === section.key ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="p-6">
              <p className="text-on-surface leading-relaxed whitespace-pre-wrap">{(output as any)[section.key]}</p>
            </div>
          </div>
        ))}

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-4 h-4 text-secondary-container" />
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Optimized Hashtags
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {output.hashtags.map((tag, i) => (
              <span
                key={i}
                className="bg-white/5 border border-white/10 text-secondary-container px-3 py-1 rounded-full text-sm font-medium hover:bg-secondary-container/20 hover:border-secondary-container/30 transition-all cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => copyToClipboard(output.hashtags.map(t => `#${t}`).join(' '), 'hashtags')}
            className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary-container hover:text-white transition-colors"
          >
            {copiedField === 'hashtags' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            Copy All Tags
          </button>
        </div>
      </div>
    </motion.div>
  );
}
