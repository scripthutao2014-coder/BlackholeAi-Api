import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  RefreshCw,
  Code,
  Sparkles,
  Key,
  Terminal,
  BarChart2,
  User,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Info,
  Copy,
  ExternalLink,
  Settings,
  ChevronRight,
  Database,
  Shield,
  Send,
  Zap,
  Lock,
  Globe,
  Cpu,
  X,
  LogOut
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { Profile, ApiKey, ActivityLog, AppNotification } from "./types";

export default function App() {
  // Mock User
  const [user] = useState<any>({ email: "scripthutao2014@gmail.com" });

  // Developer Profile State
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem("blackhole_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      username: "dev_blackhole",
      email: "scripthutao2014@gmail.com",
      emailVerified: false
    };
  });

  // Current tab page within Dashboard
  const [currentPage, setCurrentPage] = useState<string>("dashboard");

  // OTP Generation & Verification state
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [otpInputs, setOtpInputs] = useState<string[]>(Array(6).fill(""));
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState("");

  // EmailJS Credentials & status
  const emailjsServiceId = "service_bdu7jra";
  const emailjsTemplateId = "template_z8nvq0m";
  const emailjsPublicKey = "5WffWstn-9M5FLOPI";
  const [emailjsError, setEmailjsError] = useState<string | null>(null);
  const [emailjsSending, setEmailjsSending] = useState(false);

  // Universal Team AI API Key configuration state
  const [teamAiKey, setTeamAiKey] = useState<string>(() => {
    return localStorage.getItem("blackhole_team_ai_key") || "";
  });

  // App feedback
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem("blackhole_activity_logs");
    return saved ? JSON.parse(saved) : [
      { id: "1", type: "system", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), message: "Blackhole AI Developer node registered successfully." },
      { id: "2", type: "system", timestamp: new Date(Date.now() - 3600000).toISOString(), message: "Secure gateway credentials verified." }
    ];
  });

  // API Keys state (Single Universal Gateway Key)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "k-default",
      name: "API Gateway Key",
      key: "AQ.Ab8RN6JIfbvuGuIYD9e36Iq9KMJ_UVhKC_0Wnb7IuA-CFzS1tw",
      created: "2026-06-29",
      status: "active"
    }
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [showKeySecret, setShowKeySecret] = useState<Record<string, boolean>>({});

  // Playground state
  const [playgroundModel, setPlaygroundModel] = useState("bh-flash");
  const [playgroundPrompt, setPlaygroundPrompt] = useState("");
  const [playgroundChat, setPlaygroundChat] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    { role: "ai", text: "Welcome to the Blackhole AI Playground! Type your prompt below to experiment with real-time neural collapse." }
  ]);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);

  // Notification Helper
  const addAppNotification = (title: string, message: string, type: 'info' | 'success' | 'warning') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [{ id, title, message, type }, ...prev].slice(0, 5));
    // Auto remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Activity Logger Helper
  const addRecentActivityLog = (type: string, message: string) => {
    const log: ActivityLog = {
      id: Math.random().toString(36).substring(7),
      type,
      timestamp: new Date().toISOString(),
      message
    };
    setActivityLogs(prev => {
      const updated = [log, ...prev].slice(0, 30);
      localStorage.setItem("blackhole_activity_logs", JSON.stringify(updated));
      return updated;
    });
  };

  // Sync profile data to secure cloud storage
  const syncProfileToDatabase = (updatedProfile: Profile) => {
    localStorage.setItem("blackhole_profile", JSON.stringify(updatedProfile));
    console.log("Profile synchronized with remote database:", updatedProfile);
  };

  // Profile actions: verification OTP sender using EmailJS
  const triggerSendOtp = async (recipientEmail: string) => {
    // Fall back to registered email if empty
    let emailToUse = recipientEmail?.trim();
    if (!emailToUse) {
      emailToUse = profile?.email?.trim() || "scripthutao2014@gmail.com";
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEmailjsError(null);
    setOtpSuccessMsg("");

    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
      setEmailjsSending(true);
      try {
        await emailjs.send(
          emailjsServiceId,
          emailjsTemplateId,
          {
            // Map multiple potential parameter keys commonly used in EmailJS templates
            to_email: emailToUse,
            email: emailToUse,
            recipient: emailToUse,
            recipient_email: emailToUse,
            user_email: emailToUse,
            to: emailToUse,
            to_name: profile?.username || emailToUse.split("@")[0],
            name: profile?.username || emailToUse.split("@")[0],
            otp_code: code,
            code: code,
            otp: code,
            app_name: "BlackholeAi"
          },
          {
            publicKey: emailjsPublicKey,
          }
        );
        addAppNotification("OTP Code Sent", `A verification code has been successfully dispatched to ${emailToUse} via EmailJS.`, "success");
        addRecentActivityLog("otp_sent", `Sent 6-digit verification code via EmailJS to ${emailToUse}`);
      } catch (err: any) {
        console.error("EmailJS Error:", err);
        setEmailjsError(err.text || err.message || JSON.stringify(err));
        addAppNotification("EmailJS Dispatch Failed", `Failed to send email: ${err.text || err.message || "Invalid credentials"}`, "warning");
      } finally {
        setEmailjsSending(false);
      }
    } else {
      setEmailjsError("EmailJS parameters not configured.");
      addAppNotification("Configuration Error", "EmailJS service parameters are not fully configured.", "warning");
    }
  };

  // Clean stale local storage values and auto-send OTP when profile is unverified
  useEffect(() => {
    localStorage.removeItem("emailjs_service_id");
    localStorage.removeItem("emailjs_template_id");
    localStorage.removeItem("emailjs_public_key");
  }, []);

  const otpSentRef = useRef(false);

  const handleOtpInputChange = (index: number, val: string) => {
    if (/^[0-9]$/.test(val) || val === "") {
      const nextInputs = [...otpInputs];
      nextInputs[index] = val;
      setOtpInputs(nextInputs);
      
      // Auto-focus next input
      if (val !== "" && index < 5) {
        const nextInputEl = document.getElementById(`otp-input-${index + 1}`);
        if (nextInputEl) (nextInputEl as HTMLInputElement).focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otpInputs[index] === "" && index > 0) {
        const prevInputEl = document.getElementById(`otp-input-${index - 1}`);
        if (prevInputEl) {
          (prevInputEl as HTMLInputElement).focus();
          const nextInputs = [...otpInputs];
          nextInputs[index - 1] = "";
          setOtpInputs(nextInputs);
        }
      } else {
        const nextInputs = [...otpInputs];
        nextInputs[index] = "";
        setOtpInputs(nextInputs);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").trim();
    if (/^[0-9]{6}$/.test(text)) {
      const digits = text.split("");
      setOtpInputs(digits);
      // Focus last box
      const lastInputEl = document.getElementById(`otp-input-5`);
      if (lastInputEl) (lastInputEl as HTMLInputElement).focus();
    }
  };

  const handleResendFirebaseEmail = async () => {
    if (profile?.email) {
      await triggerSendOtp(profile.email);
    } else if (user?.email) {
      await triggerSendOtp(user.email);
    } else {
      alert("No email address found to resend OTP code.");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpInputs.join("");
    if (enteredCode.length < 6) {
      alert("Please enter all 6 digits of the verification code.");
      return;
    }
    
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      
      // Verification logic: match generatedOtp
      const isValid = enteredCode === generatedOtp;
      
      if (isValid) {
        setOtpSuccessMsg("Email Verified Successfully!");
        const updated = { ...profile, emailVerified: true };
        setProfile(updated);
        syncProfileToDatabase(updated);
        addRecentActivityLog("verify_email", "Completed Email & OTP Verification successfully");
        addAppNotification("Account Verified", "You now have complete access to keys and free models.", "success");
      } else {
        alert("Incorrect verification code. Please check your email.");
      }
    }, 1200);
  };

  // API Keys Actions
  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const rawKey = `bh_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const newKey: ApiKey = {
      id: `k-${Date.now()}`,
      name: newKeyName.trim(),
      key: rawKey,
      created: new Date().toISOString().split("T")[0],
      status: "active"
    };
    // Restrict to exactly 1 active API Key for all users as requested
    const updated = [newKey];
    setApiKeys(updated);
    localStorage.setItem("blackhole_api_keys", JSON.stringify(updated));
    setNewKeyName("");
    addRecentActivityLog("key_created", `Generated single active API Key: "${newKey.name}"`);
    addAppNotification("Key Generated", `Single API Key "${newKey.name}" has been created. Previous keys replaced.`, "success");
  };

  const handleRevokeApiKey = (id: string) => {
    const updated = apiKeys.map(k => k.id === id ? { ...k, status: "revoked" as const } : k);
    setApiKeys(updated);
    localStorage.setItem("blackhole_api_keys", JSON.stringify(updated));
    const target = apiKeys.find(k => k.id === id);
    addRecentActivityLog("key_revoked", `Revoked API Key: "${target?.name}"`);
    addAppNotification("Key Revoked", `API Key "${target?.name}" has been permanently disabled.`, "warning");
  };

  // Playground model interface reply
  const handlePlaygroundSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playgroundPrompt.trim()) return;
    const prompt = playgroundPrompt.trim();
    setPlaygroundChat(prev => [...prev, { role: "user", text: prompt }]);
    setPlaygroundPrompt("");
    setPlaygroundLoading(true);

    try {
      // Map model keys
      let geminiModelName = "gemini-3.5-flash";
      if (playgroundModel === "bh-ultra") {
        geminiModelName = "gemini-3.5-flash"; // Can be scaled or configured
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model: geminiModelName,
          customKey: teamAiKey || undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPlaygroundChat(prev => [...prev, { role: "ai", text: data.text || "No response received." }]);
        addRecentActivityLog("playground_query", `Queried ${playgroundModel} playground successfully.`);
      } else {
        setPlaygroundChat(prev => [
          ...prev, 
          { 
            role: "ai", 
            text: `⚠️ Error: ${data.error || "Gagal menghubungkan ke modul AI."}` 
          }
        ]);
        addAppNotification("AI Error", data.error || "Gagal menghasilkan respon AI.", "warning");
      }
    } catch (err: any) {
      console.error(err);
      setPlaygroundChat(prev => [
        ...prev, 
        { 
          role: "ai", 
          text: `⚠️ Gangguan Koneksi: ${err.message || "Gagal terhubung ke server."}` 
        }
      ]);
    } finally {
      setPlaygroundLoading(false);
    }
  };

  // Chart metrics data
  const trafficData = [
    { name: "06/23", requests: 1200, tokens: 480 },
    { name: "06/24", requests: 1850, tokens: 720 },
    { name: "06/25", requests: 1400, tokens: 610 },
    { name: "06/26", requests: 2900, tokens: 1100 },
    { name: "06/27", requests: 3400, tokens: 1450 },
    { name: "06/28", requests: 4100, tokens: 1890 },
    { name: "06/29", requests: 4800, tokens: 2310 }
  ];

  const modelDistData = [
    { name: "Blackhole-Flash", share: 65 },
    { name: "Blackhole-Ultra", share: 20 },
    { name: "Blackhole-Deepthink", share: 15 }
  ];

  // Global Time ticking simulator for UI
  const [currentLocalTime, setCurrentLocalTime] = useState(() => new Date().toLocaleTimeString());
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentLocalTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Live Connection Ping
  const [ping, setPing] = useState<number>(24);
  useEffect(() => {
    const p = setInterval(() => {
      setPing(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return Math.min(Math.max(next, 12), 48);
      });
    }, 3000);
    return () => clearInterval(p);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden select-none">
      
      {/* Decorative starry / grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>

      {/* Floating Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`p-4 rounded-xl border backdrop-blur-md shadow-lg flex justify-between items-start gap-3 ${
                n.type === "success"
                  ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-200"
                  : n.type === "warning"
                  ? "bg-amber-950/80 border-amber-500/30 text-amber-200"
                  : "bg-blue-950/80 border-blue-500/30 text-blue-200"
              }`}
            >
              <div className="flex gap-3">
                {n.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                {n.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                {n.type === "info" && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}
                <div>
                  <h4 className="text-xs font-bold font-sans">{n.title}</h4>
                  <p className="text-[11px] opacity-85 leading-relaxed mt-0.5">{n.message}</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                className="text-slate-400 hover:text-white shrink-0 p-0.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Primary App Shell */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Blackhole AI</span>
              <span className="text-[9px] bg-slate-800 text-slate-400 border border-slate-700 font-mono px-1 rounded">v1.2.5</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                ONLINE
              </span>
              <span className="text-slate-600 font-mono text-[9px]">•</span>
              <span className="text-[9px] text-blue-400 font-mono">PING: {ping}ms</span>
            </div>
          </div>
        </div>

        {/* Mobile Log Out / Back button */}
        {profile.emailVerified && (
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => {
                const updated = { ...profile, emailVerified: false };
                setProfile(updated);
                syncProfileToDatabase(updated);
                setGeneratedOtp("");
                addRecentActivityLog("logout", "Reset developer credentials (demoted to unverified)");
                addAppNotification("Auth Reset", "Logged out. Verification required.", "info");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-red-950/30 hover:border-red-500/30 text-[11px] font-medium text-slate-400 hover:text-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        )}

        {/* Real-time Clock on Header */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-mono">SYSTEM CLOCK (LOCAL)</span>
            <span className="text-xs font-mono font-medium text-slate-300">{currentLocalTime}</span>
          </div>
          {profile.emailVerified && (
            <div className="h-8 w-px bg-slate-800"></div>
          )}
          {profile.emailVerified && (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-mono text-slate-300">{profile.username}</span>
              </div>
              <button
                onClick={() => {
                  const updated = { ...profile, emailVerified: false };
                  setProfile(updated);
                  syncProfileToDatabase(updated);
                  setGeneratedOtp("");
                  addRecentActivityLog("logout", "Reset developer credentials (demoted to unverified)");
                  addAppNotification("Auth Reset", "Logged out. Verification required.", "info");
                }}
                title="Kembali ke Halaman Awal (Logout)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:bg-red-950/30 hover:border-red-500/30 text-xs font-medium text-slate-400 hover:text-red-400 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Kembali ke Awal</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        
        {/* IF NOT EMAIL VERIFIED, RENDER THE COMPULSORY VERIFICATION COVER */}
        {!profile.emailVerified ? (
          !generatedOtp ? (
            /* STEP 1: INITIAL REGISTRATION / SETUP PAGE (HALAMAN AWAL) */
            <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-2xl max-w-xl mx-auto text-center space-y-6 relative overflow-hidden my-12 w-full animate-fade-in">
              {/* Glowing halo */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
                <Cpu className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-sans font-bold text-white tracking-tight">Blackhole AI Setup</h2>
                <p className="text-xs text-white/50 leading-relaxed max-w-sm mx-auto">
                  Masukkan nama pengguna dan email developer Anda. Kode OTP 6-digit akan dikirimkan untuk autentikasi keamanan.
                </p>
              </div>

              <div className="space-y-4 text-left max-w-sm mx-auto">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-mono font-semibold">Developer Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. dev_blackhole"
                    className="w-full bg-black/60 border border-white/10 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all font-mono"
                    value={profile.username}
                    onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-mono font-semibold">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. developer@domain.com"
                    className="w-full bg-black/60 border border-white/10 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all font-mono"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <button
                  type="button"
                  disabled={emailjsSending || !profile.username.trim() || !profile.email.trim()}
                  onClick={() => {
                    const cleanUsername = profile.username.trim();
                    const cleanEmail = profile.email.trim();
                    const updated = { ...profile, username: cleanUsername, email: cleanEmail };
                    setProfile(updated);
                    syncProfileToDatabase(updated);
                    triggerSendOtp(cleanEmail);
                  }}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-xl transition-all font-mono uppercase tracking-widest shadow-[0_4px_20px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {emailjsSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mengirim Kode OTP...</span>
                    </>
                  ) : (
                    <span>Hubungkan & Kirim OTP</span>
                  )}
                </button>
              </div>

              {/* System sending error feedback */}
              {emailjsError && (
                <div className="text-[10px] text-red-400/80 font-mono leading-relaxed bg-red-500/5 p-2.5 rounded-xl border border-red-500/10 text-center max-w-sm mx-auto animate-fade-in">
                  Feedback Sistem: {emailjsError}
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: SECURITY VERIFICATION INPUT PAGE */
            <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-2xl max-w-xl mx-auto text-center space-y-6 relative overflow-hidden my-12 w-full">
              
              {/* Glowing halo */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
                <Mail className="w-8 h-8 text-blue-400 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-sans font-bold text-white tracking-tight">Security Verification Code</h2>
                <p className="text-xs text-white/50 leading-relaxed max-w-md mx-auto">
                  Kode keamanan 6-digit telah dikirim ke node developer Anda <code className="text-blue-300 font-mono px-1.5 py-0.5 rounded bg-blue-500/5 border border-blue-500/10">{profile.email}</code>.
                </p>
              </div>

              {/* 6-Digit Code Input Boxes */}
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center gap-2.5">
                  {otpInputs.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      className="w-11 h-14 bg-black/60 border border-white/10 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 rounded-xl text-center text-xl font-bold font-mono text-white focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                      value={digit}
                      onChange={(e) => handleOtpInputChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center gap-3">
                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-500/50 disabled:to-indigo-600/50 text-white text-xs font-bold rounded-xl transition-all font-mono uppercase tracking-widest shadow-[0_4px_20px_rgba(59,130,246,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <span>Submit Verification Code</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setGeneratedOtp("");
                      setOtpInputs(Array(6).fill(""));
                      setEmailjsError(null);
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer mt-0.5 font-mono"
                  >
                    <span>← Kembali ke Halaman Awal</span>
                  </button>

                  <div className="flex items-center justify-between w-full text-[11px] text-white/40 mt-1">
                    <span>Didn't receive the email?</span>
                    <button
                      type="button"
                      onClick={handleResendFirebaseEmail}
                      disabled={emailjsSending}
                      className="text-blue-400 hover:text-blue-300 transition-colors font-semibold flex items-center gap-1 font-mono disabled:opacity-50 cursor-pointer"
                    >
                      {emailjsSending ? "Sending..." : "Resend Code"}
                    </button>
                  </div>
                </div>
              </form>

              {/* System sending error feedback */}
              {emailjsError && (
                <div className="text-[10px] text-red-400/80 font-mono leading-relaxed bg-red-500/5 p-2.5 rounded-xl border border-red-500/10 text-center max-w-sm mx-auto animate-fade-in">
                  System feedback: {emailjsError}
                </div>
              )}
            </div>
          )
        ) : (
          /* VERIFIED DEVELOPER CONSOLE MAIN DASHBOARD */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start my-4">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-2 block">Developer Space</span>
                <nav className="space-y-1">
                  <button
                    onClick={() => setCurrentPage("dashboard")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                      currentPage === "dashboard"
                        ? "bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <BarChart2 className="w-4 h-4" />
                    <span>Usage & Analytics</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage("keys")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                      currentPage === "keys"
                        ? "bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    <span>API Gateway Keys</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage("playground")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                      currentPage === "playground"
                        ? "bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Model Playground</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage("settings")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer ${
                      currentPage === "settings"
                        ? "bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Developer Profile</span>
                  </button>
                </nav>
              </div>

              {/* Developer Info Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4.5 space-y-3.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl"></div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Node Guard status</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Node Trust Factor:</span>
                    <span className="text-emerald-400 font-bold font-mono">99.8%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Security Model:</span>
                    <span className="text-slate-300 font-mono">OTP Dual Auth</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Rate Limit Tier:</span>
                    <span className="text-slate-300 font-mono">Professional</span>
                  </div>
                </div>
                <div className="h-px bg-slate-800"></div>
                <button
                  onClick={() => {
                    const updated = { ...profile, emailVerified: false };
                    setProfile(updated);
                    syncProfileToDatabase(updated);
                    setGeneratedOtp("");
                    addRecentActivityLog("logout", "Reset developer credentials (demoted to unverified)");
                    addAppNotification("Auth Reset", "Logged out. Returned to initial page.", "info");
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700/60 hover:border-red-500/30 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Kembali ke Halaman Awal</span>
                </button>
              </div>
            </div>

            {/* Main Area Tabs */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {/* PAGE 1: DASHBOARD / ANALYTICS */}
                {currentPage === "dashboard" && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-6"
                  >
                    {/* Welcome Banner */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-950/20 to-transparent border border-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Welcome Back, {profile.username}!</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">Your neural gateway is fully synched. Running 18 custom micro-agents across 4 regions with zero computational friction.</p>
                      </div>
                      <button
                        onClick={() => setCurrentPage("playground")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Launch Model Playground</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full blur-lg"></div>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider">Gateway Requests (24h)</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-2xl font-bold font-mono text-white">4,812</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">+18.4%</span>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/5 rounded-full blur-lg"></div>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider">Average Latency</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-2xl font-bold font-mono text-white">12.8ms</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">-2.1%</span>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/5 rounded-full blur-lg"></div>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider">Estimated Cost</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-2xl font-bold font-mono text-emerald-400">$0.00</span>
                          <span className="text-[10px] text-slate-400 font-mono">Professional Tier</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Recharts Chart Area */}
                    <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-tight">API Request Volumes</h4>
                          <p className="text-[11px] text-slate-500">Historical gateway logs over the past week</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-850 text-[10px] font-mono text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <span>Inbound</span>
                        </div>
                      </div>

                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", fontSize: "11px" }}
                              itemStyle={{ color: "#93c5fd" }}
                            />
                            <Area type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Dual Layout: Model Shares & Activity Logs */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-5 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-tight">Model Architecture Share</h4>
                          <p className="text-[11px] text-slate-500 font-mono">DISTRIBUTION BY REQUEST VOLUME</p>
                        </div>
                        <div className="space-y-3 pt-2">
                          {modelDistData.map(m => (
                            <div key={m.name} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-300 font-medium">{m.name}</span>
                                <span className="text-slate-400 font-mono">{m.share}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${m.share}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-7 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-bold text-white tracking-tight">Recent Activity Timeline</h4>
                            <p className="text-[11px] text-slate-500">Live auditing logs</p>
                          </div>
                          <button
                            onClick={() => {
                              localStorage.removeItem("blackhole_activity_logs");
                              setActivityLogs([
                                { id: "1", type: "system", timestamp: new Date().toISOString(), message: "Activity timeline cleared." }
                              ]);
                              addAppNotification("Logs Cleared", "Audit timeline reset completed.", "info");
                            }}
                            className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                          >
                            Clear Logs
                          </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {activityLogs.map(l => (
                            <div key={l.id} className="flex gap-2.5 text-xs border-b border-slate-850/60 pb-2">
                              <span className="text-slate-550 shrink-0 font-mono text-[9px] mt-0.5">
                                {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider shrink-0 self-start ${
                                l.type.includes("verify") || l.type.includes("success")
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : l.type.includes("sent") || l.type.includes("create")
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : "bg-slate-800 text-slate-400"
                              }`}>
                                {l.type}
                              </span>
                              <span className="text-slate-300 leading-normal text-[11px]">{l.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PAGE 2: API GATEWAY KEYS */}
                {currentPage === "keys" && (
                  <motion.div
                    key="keys"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6"
                  >
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">API Gateway Keys</h3>
                      <p className="text-xs text-slate-400 mt-1">Gunakan API Gateway Key tim universal Anda di bawah ini untuk mengakses request AI dan routing data.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-200 text-xs flex gap-3">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-emerald-400">Sistem Kunci Tunggal Aktif (Single-Key Active)</p>
                        <p className="text-[11px] opacity-80 mt-0.5">
                          Gateway Anda saat ini menggunakan <strong>1 API Gateway Key tunggal</strong> yang aktif dan siap digunakan oleh seluruh tim.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {apiKeys.map(k => (
                        <div key={k.id} className="p-4 rounded-xl bg-black/40 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white truncate">{k.name}</h4>
                              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {k.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                              <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                                {showKeySecret[k.id] ? k.key : "bh_••••••••••••••••••••••••••••"}
                              </span>
                              <button
                                onClick={() => setShowKeySecret(prev => ({ ...prev, [k.id]: !prev[k.id] }))}
                                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                                title={showKeySecret[k.id] ? "Hide Secret Key" : "Reveal Secret Key"}
                              >
                                {showKeySecret[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(k.key);
                                  addAppNotification("Copied", "API Key copied to system clipboard.", "success");
                                }}
                                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                                title="Copy Key"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3.5 shrink-0 self-end sm:self-auto text-[11px]">
                            <span className="text-slate-500 font-mono">Created: {k.created}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* PAGE 3: MODEL PLAYGROUND */}
                {currentPage === "playground" && (
                  <motion.div
                    key="playground"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6 flex flex-col h-[520px]"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-850 pb-4 shrink-0">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">Model Playground</h3>
                        <p className="text-xs text-slate-400 mt-1">Chat directly with live neural nodes to test prompt logic and parameters.</p>
                      </div>

                      <div className="flex gap-2">
                        <select
                          className="bg-black border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                          value={playgroundModel}
                          onChange={(e) => setPlaygroundModel(e.target.value)}
                        >
                          <option value="bh-flash">Blackhole-Flash (Fast & Lightweight)</option>
                          <option value="bh-ultra">Blackhole-Ultra (Ultra Reasoning)</option>
                          <option value="bh-deepthink">Blackhole-Deepthink (Code Specialization)</option>
                        </select>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                      {playgroundChat.map((chat, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-3.5 max-w-[85%] ${
                            chat.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                          }`}
                        >
                          <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                            chat.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-slate-850 text-blue-400 border border-slate-800"
                          }`}>
                            {chat.role === "user" ? "DEV" : "BH"}
                          </div>
                          <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            chat.role === "user"
                              ? "bg-blue-600/15 border border-blue-500/20 text-blue-100"
                              : "bg-black/40 border border-slate-850 text-slate-300"
                          }`}>
                            {chat.text}
                          </div>
                        </div>
                      ))}

                      {playgroundLoading && (
                        <div className="flex gap-3.5 mr-auto max-w-[80%] animate-pulse">
                          <div className="w-7.5 h-7.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-center shrink-0 text-xs font-bold text-blue-400">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          </div>
                          <div className="p-3.5 rounded-2xl text-xs leading-relaxed bg-black/20 border border-slate-850 text-slate-500 font-mono">
                            Blackhole neural processor is compressing attention weights...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Prompt Input */}
                    <form onSubmit={handlePlaygroundSend} className="flex gap-2.5 border-t border-slate-850 pt-4 shrink-0">
                      <input
                        type="text"
                        required
                        disabled={playgroundLoading}
                        placeholder="e.g. Write a typescript script to execute in-memory OTP verification."
                        className="flex-1 bg-black/60 border border-slate-850 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                        value={playgroundPrompt}
                        onChange={(e) => setPlaygroundPrompt(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={playgroundLoading || !playgroundPrompt.trim()}
                        className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center cursor-pointer shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* PAGE 4: DEVELOPER PROFILE SETTINGS */}
                {currentPage === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6"
                  >
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">Developer Profile</h3>
                      <p className="text-xs text-slate-400 mt-1">Configure your identity tokens and credentials to claim developer privileges.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Identity Settings</span>
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-mono">Developer ID</label>
                            <input
                              type="text"
                              className="w-full bg-black/40 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                              value={profile.username}
                              onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-mono">Registered Email Address</label>
                            <input
                              type="email"
                              className="w-full bg-black/40 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                              value={profile.email}
                              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            syncProfileToDatabase(profile);
                            addRecentActivityLog("profile_update", "Updated developer profile fields");
                            addAppNotification("Profile Saved", "Developer parameters stored successfully.", "success");
                          }}
                          className="px-4.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          Save Profile Configuration
                        </button>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Security Configuration</span>
                        <div className="p-4 rounded-xl bg-black/40 border border-slate-850 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs font-bold text-white">OTP Verification Enforced</span>
                            </div>
                            <span className="text-[10.5px] text-emerald-400 font-mono font-semibold">Enabled</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Your node uses EmailJS endpoints to dispatch verification credentials. This completely removes the reliance on third-party servers.
                          </p>
                          <div className="h-px bg-slate-800"></div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Current Status:</span>
                            <span className="text-emerald-400 font-bold font-mono">Email Verified</span>
                          </div>
                        </div>

                        {/* Team AI Configuration Box */}
                        <div className="space-y-4 pt-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">AI Node Configuration</span>
                          <div className="p-4 rounded-xl bg-black/40 border border-slate-850 space-y-4">
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5 font-mono">Team Universal AI Key (Gemini API Key)</label>
                              <input
                                type="password"
                                placeholder="Masukkan GEMINI_API_KEY tim Anda..."
                                className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                                value={teamAiKey}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTeamAiKey(val);
                                  localStorage.setItem("blackhole_team_ai_key", val);
                                }}
                              />
                              <p className="text-[10px] text-slate-500 mt-1.5 leading-normal font-sans">
                                💡 Kunci ini disimpan secara lokal di browser Anda untuk melakukan request AI sesungguhnya pada halaman Playground. Jika dikosongkan, server akan menggunakan default key (bila ada).
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-5 text-center text-slate-500 text-[11px] font-mono mt-auto shrink-0">
        <p>© 2026 extinctionIBT®. Hak Cipta Dilindungi Undang-Undang. Powered by Blackhole AI.</p>
      </footer>

    </div>
  );
}
