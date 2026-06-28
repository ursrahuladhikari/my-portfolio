import React, { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Lock, 
  LogOut,
  Calendar,
  User,
  Mail,
  ChevronDown,
  Briefcase,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  service: string;
  budgetAmount: string;
  budgetCurrency: string;
  budgetINR?: string;
  description: string;
  createdAt: any;
  status: 'new' | 'in-progress' | 'responded' | 'completed';
}

interface AdminDashboardProps {
  isDark: boolean;
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isDark, onBackToHome }) => {
  const [email] = useState('admin@rahuladhikari.com');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'budget'>('newest');

  // Sync auth state reactively with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'admin@rahuladhikari.com') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    const q = query(collection(db, 'freelance-inquiries'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Inquiry[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Inquiry);
      });
      setInquiries(list);
      setError(null);
      setLoading(false);
    }, (err) => {
      console.error("Firestore read error:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    
    setIsLoggingIn(true);
    setLoginError(false);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginError(false);
      setPassword('');
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError(true);
      setPassword('');
      setTimeout(() => setLoginError(false), 800);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const ref = doc(db, 'freelance-inquiries', id);
      await updateDoc(ref, { status: newStatus });
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this inquiry?")) return;
    try {
      await deleteDoc(doc(db, 'freelance-inquiries', id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    const base = "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1 shadow-sm";
    switch (status) {
      case 'new':
        return (
          <span className={`${base} bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-[#ff1493] border border-pink-200 dark:border-pink-800/30 animate-pulse`}>
            New
          </span>
        );
      case 'in-progress':
        return (
          <span className={`${base} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30`}>
            In Progress
          </span>
        );
      case 'responded':
        return (
          <span className={`${base} bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border border-sky-200 dark:border-sky-800/30`}>
            Responded
          </span>
        );
      case 'completed':
        return (
          <span className={`${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30`}>
            Completed
          </span>
        );
      default:
        return (
          <span className={`${base} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400`}>
            {status}
          </span>
        );
    }
  };

  // Process data (Search & Filters)
  const filteredInquiries = inquiries
    .filter(item => {
      const matchSearch = 
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchService = serviceFilter === 'all' || item.service === serviceFilter;
      
      return matchSearch && matchStatus && matchService;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      }
      if (sortBy === 'oldest') {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeA - timeB;
      }
      if (sortBy === 'budget') {
        const amtA = parseFloat(a.budgetAmount) || 0;
        const amtB = parseFloat(b.budgetAmount) || 0;
        return amtB - amtA;
      }
      return 0;
    });

  // Calculate Metrics
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const activeInquiries = inquiries.filter(i => i.status === 'in-progress').length;
  const completedInquiries = inquiries.filter(i => i.status === 'completed').length;
  
  // Format budget currency for details card
  const getFormattedBudget = (item: Inquiry) => {
    const amt = parseFloat(item.budgetAmount);
    if (isNaN(amt)) return `${item.budgetCurrency} ${item.budgetAmount}`;
    try {
      return amt.toLocaleString('en-US', {
        style: 'currency',
        currency: item.budgetCurrency,
        maximumFractionDigits: 0
      });
    } catch {
      return `${item.budgetCurrency} ${item.budgetAmount}`;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No Date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      isDark ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Background grids and glowing design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-25 ${
          isDark ? 'bg-[#ff1493]' : 'bg-[#ff1493]/40'
        }`} />
        <div className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 ${
          isDark ? 'bg-cyan-500' : 'bg-cyan-500/30'
        }`} />
        
        {/* Fine background grid */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] ${
          isDark ? 'opacity-30' : 'opacity-70'
        }`} />
      </div>

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          // PASSCODE GATE SCREEN
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
          >
            <div className={`glass-card max-w-sm w-full p-8 rounded-2xl border text-center shadow-2xl ${
              isDark ? 'bg-slate-900/80 border-slate-700/60' : 'bg-white/90 border-slate-200'
            }`}>
              <div className="mx-auto w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-[#ff1493] mb-4">
                <Lock size={22} className="animate-pulse" />
              </div>
              
              <h1 className="text-2xl font-black tracking-tight mb-2">
                Authorized Access
              </h1>
              <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Enter password to view client inquiries.
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email field (pre-filled) */}
                <div className="text-left">
                  <label className="text-[10px] font-bold font-mono tracking-wider uppercase mb-1 block text-slate-400">
                    ADMIN EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className={`w-full py-2.5 px-4 rounded-xl text-sm outline-none border cursor-not-allowed ${
                      isDark
                        ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  />
                </div>

                {/* Password field */}
                <div className="text-left relative">
                  <label className="text-[10px] font-bold font-mono tracking-wider uppercase mb-1 block text-slate-400">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className={`w-full py-3 px-4 rounded-xl text-sm outline-none border transition-all ${
                      loginError 
                        ? 'border-red-500 bg-red-500/5 dark:bg-red-500/10' 
                        : isDark
                          ? 'bg-slate-950/60 border-slate-800 focus:border-[#ff1493]/70 focus:bg-slate-950'
                          : 'bg-slate-100 border-slate-200 focus:border-[#ff1493]/70 focus:bg-white'
                    }`}
                    autoFocus
                  />
                  {loginError && (
                    <motion.div 
                      initial={{ x: -6 }}
                      animate={{ x: [0, -6, 6, -6, 6, 0] }}
                      transition={{ duration: 0.4 }}
                      className="absolute right-3 bottom-3 text-red-500"
                    >
                      <AlertTriangle size={18} />
                    </motion.div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-xl bg-pink-gradient text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingIn ? 'Verifying...' : 'Verify Access'}
                </button>
              </form>

              <button
                onClick={onBackToHome}
                className={`mt-6 text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors ${
                  isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ArrowLeft size={14} /> Back to Portfolio
              </button>
            </div>
          </motion.div>
        ) : (
          // MAIN DASHBOARD SCREEN
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 md:py-12"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#ff1493]">
                  <Briefcase size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest font-mono">Freelance Management</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                  Client Inquiries
                </h1>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all hover:scale-102 ${
                    isDark 
                      ? 'border-slate-800 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogOut size={14} /> Log Out
                </button>
                <button
                  onClick={onBackToHome}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-gradient text-white text-xs font-bold hover:scale-102 transition-transform shadow-md"
                >
                  <ArrowLeft size={14} /> Portfolio Site
                </button>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { title: 'Total Submissions', val: totalInquiries, icon: <DollarSign size={20} />, col: 'from-[#06b6d4] to-cyan-600' },
                { title: 'New Inquiries', val: newInquiries, icon: <Clock size={20} className="animate-pulse" />, col: 'from-pink-500 to-rose-600' },
                { title: 'Active Projects', val: activeInquiries, icon: <RefreshCw size={20} />, col: 'from-amber-500 to-orange-600' },
                { title: 'Completed Tasks', val: completedInquiries, icon: <CheckCircle size={20} />, col: 'from-emerald-500 to-teal-600' },
              ].map((m, i) => (
                <div key={i} className={`glass-card p-6 rounded-2xl border relative overflow-hidden flex flex-col justify-between ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold font-mono uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {m.title}
                    </span>
                    <div className={`p-2 rounded-xl bg-gradient-to-tr ${m.col} text-white shadow-sm`}>
                      {m.icon}
                    </div>
                  </div>
                  <span className="text-3xl font-black tracking-tight">{m.val}</span>
                </div>
              ))}
            </div>

            {/* Filter and Search Panel */}
            <div className={`glass-card p-5 rounded-2xl border mb-6 flex flex-col gap-4 ${
              isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                
                {/* Search input */}
                <div className="relative w-full lg:max-w-md">
                  <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by client name, email, details..."
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                      isDark 
                        ? 'bg-slate-950/60 border-slate-800/80 focus:border-[#ff1493]/60 focus:bg-slate-950'
                        : 'bg-slate-100 border-slate-200 focus:border-[#ff1493]/60 focus:bg-white'
                    }`}
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  
                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
                    <Filter size={14} className="text-slate-400 hidden sm:block" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`py-2.5 pl-3 pr-8 rounded-xl border text-xs font-semibold outline-none appearance-none cursor-pointer w-full bg-[image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:16px_16px] bg-[position:right_10px_center] bg-no-repeat ${
                        isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-100 border-slate-200'
                      }`}
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">🆕 New</option>
                      <option value="in-progress">⚙️ In Progress</option>
                      <option value="responded">✉️ Responded</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>

                  {/* Service Filter */}
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className={`py-2.5 pl-3 pr-8 rounded-xl border text-xs font-semibold outline-none appearance-none cursor-pointer flex-1 sm:flex-none bg-[image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:16px_16px] bg-[position:right_10px_center] bg-no-repeat ${
                      isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <option value="all">All Services</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Generative AI / ML">Generative AI / ML</option>
                    <option value="ETL Automation">ETL Automation</option>
                    <option value="Power BI / SQL Design">Power BI / SQL Design</option>
                  </select>

                  {/* Sorting */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`py-2.5 pl-3 pr-8 rounded-xl border text-xs font-semibold outline-none appearance-none cursor-pointer flex-1 sm:flex-none bg-[image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:16px_16px] bg-[position:right_10px_center] bg-no-repeat ${
                      isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                    <option value="budget">Sort: Highest Budget</option>
                  </select>

                </div>
              </div>
            </div>

            {/* Content Layout: Table and Details Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* List / Table Section */}
              <div className="lg:col-span-8 space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-8 h-8 rounded-full border-3 border-pink-500/20 border-t-pink-500 animate-spin" />
                    <span className="text-xs font-mono text-slate-400">LOADING INQUIRIES...</span>
                  </div>
                ) : error ? (
                  <div className={`glass-card p-12 rounded-2xl border text-center border-red-500/30 ${
                    isDark ? 'bg-red-950/10' : 'bg-red-50'
                  }`}>
                    <AlertTriangle size={24} className="mx-auto text-red-500 mb-3" />
                    <h3 className="font-bold text-red-500 mb-1">Database Read Error</h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-md mx-auto mb-2`}>
                      {error}
                    </p>
                    <p className="text-[10px] text-slate-500 max-w-sm mx-auto">
                      Please check your Firestore rules in Firebase Console. Make sure they allow read access for authenticated users or admin@rahuladhikari.com.
                    </p>
                  </div>
                ) : filteredInquiries.length === 0 ? (
                  <div className={`glass-card p-12 rounded-2xl border text-center ${
                    isDark ? 'bg-slate-900/20 border-slate-800/60' : 'bg-white border-slate-200'
                  }`}>
                    <AlertTriangle size={24} className="mx-auto text-slate-400 mb-3" />
                    <h3 className="font-bold mb-1">No Inquiries Found</h3>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Try updating your search term or filtering criteria.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {filteredInquiries.map((item) => (
                        <motion.div
                          key={item.id}
                          layoutId={`card-${item.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          onClick={() => setSelectedInquiry(item)}
                          className={`glass-card p-5 rounded-2xl border cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                            selectedInquiry?.id === item.id
                              ? isDark 
                                ? 'bg-slate-800/70 border-pink-500/50 shadow-md shadow-pink-500/5 scale-[1.01]'
                                : 'bg-white border-pink-500/50 shadow-md scale-[1.01]'
                              : isDark
                                ? 'bg-slate-900/40 border-slate-850 hover:bg-slate-900/70 hover:border-slate-700/80 hover:scale-[1.005]'
                                : 'bg-white border-slate-200 hover:border-slate-350 hover:shadow-sm hover:scale-[1.005]'
                          }`}
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-base tracking-tight">{item.fullName}</h3>
                              {getStatusBadge(item.status)}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                              <span className="flex items-center gap-1"><Mail size={12} /> {item.email}</span>
                              <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(item.createdAt)}</span>
                            </div>
                            
                            <p className={`text-sm line-clamp-1 pr-6 ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 border-slate-200/50 dark:border-slate-800/50 pt-3 md:pt-0">
                            <div className="text-left md:text-right">
                              <span className={`text-[10px] font-bold font-mono block uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                BUDGET
                              </span>
                              <span className="font-black text-sm text-[#06b6d4] tracking-tight">
                                {item.budgetINR || getFormattedBudget(item)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.id);
                                }}
                                className={`p-2.5 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors ${
                                  isDark ? 'hover:bg-red-950/20' : 'hover:bg-red-50'
                                }`}
                                title="Delete Inquiry"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Sidebar: Selected Details Area */}
              <div className="lg:col-span-4 lg:sticky lg:top-8">
                <AnimatePresence mode="wait">
                  {selectedInquiry ? (
                    <motion.div
                      key={selectedInquiry.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className={`glass-card p-6 rounded-2xl border shadow-xl relative ${
                        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Action options */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Inquiry Details</span>
                        <button 
                          onClick={() => setSelectedInquiry(null)}
                          className={`p-1.5 rounded-lg border text-xs font-semibold ${
                            isDark ? 'border-slate-850 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                          }`}
                        >
                          Deselect
                        </button>
                      </div>

                      {/* Client Header Info */}
                      <div className="space-y-4 mb-6">
                        <div>
                          <span className={`text-[10px] font-bold font-mono block uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>CLIENT</span>
                          <h2 className="text-xl font-black tracking-tight">{selectedInquiry.fullName}</h2>
                        </div>

                        <div>
                          <span className={`text-[10px] font-bold font-mono block uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>EMAIL</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-semibold truncate max-w-[200px]">{selectedInquiry.email}</span>
                            <button
                              onClick={() => copyToClipboard(selectedInquiry.email, 'email')}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-400"
                            >
                              {copiedId === 'email' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className={`text-[10px] font-bold font-mono block uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>BUDGET</span>
                            <span className="text-base font-bold text-[#06b6d4] tracking-tight block">
                              {selectedInquiry.budgetINR || getFormattedBudget(selectedInquiry)}
                            </span>
                            {selectedInquiry.budgetINR && (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
                                Original: {getFormattedBudget(selectedInquiry)}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className={`text-[10px] font-bold font-mono block uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>SERVICE</span>
                            <span className="text-sm font-bold block">{selectedInquiry.service}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status select update dropdown */}
                      <div className="mb-6">
                        <span className={`text-[10px] font-bold font-mono block uppercase mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>STATUS</span>
                        <div className="relative">
                          <select
                            value={selectedInquiry.status}
                            onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                            className={`w-full py-2.5 pl-3 pr-8 rounded-xl border text-xs font-semibold outline-none appearance-none cursor-pointer bg-[image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:16px_16px] bg-[position:right_10px_center] bg-no-repeat ${
                              isDark 
                                ? 'bg-slate-950 border-slate-800 focus:border-pink-500/60' 
                                : 'bg-slate-100 border-slate-200 focus:border-pink-500/60'
                            }`}
                          >
                            <option value="new">🆕 New</option>
                            <option value="in-progress">⚙️ In Progress</option>
                            <option value="responded">✉️ Responded</option>
                            <option value="completed">✅ Completed</option>
                          </select>
                        </div>
                      </div>

                      {/* Description / Message body */}
                      <div className="mb-6">
                        <span className={`text-[10px] font-bold font-mono block uppercase mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>PROJECT DETAILS</span>
                        <div className={`p-4 rounded-xl text-sm leading-relaxed border max-h-[220px] overflow-y-auto custom-scrollbar whitespace-pre-wrap ${
                          isDark 
                            ? 'bg-slate-950/70 border-slate-850 text-slate-300' 
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                          {selectedInquiry.description}
                        </div>
                      </div>

                      {/* Details Footer CTA */}
                      <div className="flex gap-2">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedInquiry.email}&su=Regarding your Freelance Inquiry: ${selectedInquiry.service}&body=Hi ${selectedInquiry.fullName},%0D%0A%0D%0AThank you for reaching out for the "${selectedInquiry.service}" project!`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            // Automatically update status to 'responded' when clicking email
                            if (selectedInquiry.status === 'new') {
                              handleStatusChange(selectedInquiry.id, 'responded');
                            }
                          }}
                          className="flex-1 py-3 px-4 rounded-xl bg-pink-gradient text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/10 hover:scale-[1.02] transition-transform cursor-pointer"
                        >
                          <ExternalLink size={14} /> Send Reply Email
                        </a>
                        <button
                          onClick={() => handleDelete(selectedInquiry.id)}
                          className={`p-3 rounded-xl border hover:text-red-500 transition-colors ${
                            isDark 
                              ? 'border-slate-800 hover:bg-red-950/20 text-slate-500' 
                              : 'border-slate-200 hover:bg-red-50 text-slate-400'
                          }`}
                          title="Delete Document"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`glass-card p-8 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center min-h-[300px] ${
                        isDark ? 'bg-slate-900/20 border-slate-800' : 'bg-slate-50/50 border-slate-200'
                      }`}
                    >
                      <User size={30} className="text-slate-400/60 mb-3" />
                      <h4 className="font-bold text-sm mb-1">Select an Inquiry</h4>
                      <p className={`text-xs max-w-[200px] mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Click on any submission in the list to view full details and take actions.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
