import React, { useState } from "react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "motion/react";
import { Zap, Mail, Lock, User, ArrowRight } from "lucide-react";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        
        // Create user profile in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-mesh">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card pro-glow w-full max-w-md p-8 md:p-12 rounded-xl scale-105"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-4 shadow-2xl shadow-primary/20">
            <Zap className="text-white fill-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm">
            {isLogin ? "Access your high-performance workspace" : "Join the elite creator network"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="operator@aether.ai"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full liquid-gradient py-4 rounded-lg text-white font-bold uppercase tracking-[0.2em] text-sm mt-6 shadow-2xl shadow-primary/40 flex items-center justify-center gap-2 group active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Enter Workspace" : "Register Credentials"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-on-surface-variant hover:text-white text-sm transition-colors"
          >
            {isLogin ? "Need access? Request credentials" : "Already registered? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
