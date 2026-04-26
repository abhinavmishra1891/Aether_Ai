import React, { useEffect, useState } from "react";
import { db, auth, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { GenerationRecord } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Clock, ChevronRight, Trash2, Calendar, FileText, Zap } from "lucide-react";
import { GenerationCard } from "./GenerationCard";

export function History() {
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!auth.currentUser) return;

    const path = "generations";
    try {
      const q = query(
        collection(db, path),
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GenerationRecord));
      setGenerations(docs);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const path = `generations/${id}`;
    try {
      await deleteDoc(doc(db, "generations", id));
      setGenerations(prev => prev.filter(g => g.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const selectedGen = generations.find(g => g.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto py-xxl px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* List Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
              <Clock className="text-primary w-8 h-8" />
              Chronicle
            </h2>
            <p className="text-on-surface-variant mt-2">Access your past architectural deployments.</p>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : generations.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-xl bg-white/2">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No records found in the archive.</p>
              </div>
            ) : (
              generations.map((gen) => (
                <motion.div
                  key={gen.id}
                  onClick={() => setSelectedId(gen.id)}
                  className={`glass-card p-5 rounded-xl cursor-pointer transition-all group border-l-4 ${
                    selectedId === gen.id 
                      ? "bg-white/10 border-primary translate-x-1" 
                      : "bg-white/5 border-transparent hover:bg-white/8 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 pr-4">
                      <h4 className="text-white font-medium line-clamp-1">{gen.inputIdea}</h4>
                      <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {gen.createdAt?.toDate ? gen.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </span>
                        <span className="text-primary">{gen.output.hashtags.length} Tags</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={(e) => handleDelete(gen.id, e)}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className={`w-5 h-5 transition-transform ${selectedId === gen.id ? "text-primary" : "text-slate-700"}`} />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Detail Column */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedGen ? (
              <motion.div
                key={selectedGen.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6 p-6 bg-surface-container-low rounded-xl border border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block">Archive Context</span>
                  <p className="text-white text-lg font-medium italic">"{selectedGen.inputIdea}"</p>
                </div>
                <GenerationCard output={selectedGen.output} title="Historical Deployment" />
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 glass-card rounded-xl border-dashed border-white/10 opacity-50">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Zap className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl text-white font-display font-medium">Select a record</h3>
                <p className="text-slate-500 text-sm mt-2 text-center max-w-xs">Details of past deployments will materialize here upon selection.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
