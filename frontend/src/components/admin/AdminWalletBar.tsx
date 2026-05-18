"use client";

import { useState, useEffect } from "react";
import { Wallet, Plus, Loader2, X, History, Clock, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { API_URL } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminWalletBar() {
  const [balance, setBalance] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wallet/balance`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setBalance(json.data !== null ? json.data : 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wallet/history`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (showHistoryModal) {
      fetchHistory();
    }
  }, [showHistoryModal]);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wallet/top-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          amount: parseFloat(amount),
          note: "Self top up via dashboard"
        })
      });
      const json = await res.json();
      if (json.success) {
        if (json.data && json.data.requiresRedirect) {
          window.location.href = json.data.paymentUrl;
          return;
        }
        setBalance(json.data.balance);
        setShowModal(false);
        setAmount("");
      } else {
        alert(json.message || "Failed to add balance");
      }
    } catch (e) {
      console.error(e);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm overflow-hidden relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
               <Wallet size={24} />
             </div>
             <div>
               <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Global Wallet</h3>
               <p className="text-xs text-gray-500 font-medium tracking-tight mt-0.5">Automated SMS & Operations Fund</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center justify-center gap-2 shrink-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-sm"
            >
              <History size={18} /> History
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 shrink-0 bg-gray-900 dark:bg-emerald-600 hover:bg-gray-800 dark:hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-sm"
            >
              <Plus size={18} /> Top Up Wallet
            </button>
          </div>
        </div>

        <div className="flex items-end gap-3 mb-2">
           <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic">
             ৳{balance !== null ? balance.toLocaleString() : "..."}
           </span>
           <span className="text-sm font-bold text-gray-400 mb-1.5 tracking-tight uppercase">Available Balance</span>
        </div>

        {balance !== null && balance < 100 && (
          <div className="mt-5 p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded-r-xl animate-in fade-in slide-in-from-left-2 duration-300">
             <p className="text-sm text-red-600 dark:text-red-400 font-bold tracking-tight uppercase">
                ⚠️ Warning: Critical low balance!
             </p>
             <p className="text-xs text-red-500/80 dark:text-red-400/80 mt-1 font-medium">
                Please top up immediately. If the balance reaches 0, critical actions like OTP verification and SMS notifications will fail to deliver.
             </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Top Up Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowModal(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-950 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-2xl overflow-hidden"
            >
              {/* Decoration */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-2.5 rounded-xl text-emerald-500">
                       <Wallet size={24} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Top Up Wallet</h3>
                 </div>
                 <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleTopUp} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Amount (৳)</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-6 py-4 text-2xl font-black bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700"
                    />
                 </div>

                 <div className="grid grid-cols-3 gap-3">
                    {[500, 1000, 5000].map(val => (
                      <button 
                        key={val}
                        type="button"
                        onClick={() => setAmount(val.toString())}
                        className="py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent hover:border-emerald-500 text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-all"
                      >
                        +৳{val}
                      </button>
                    ))}
                 </div>

                 <button 
                   type="submit"
                   disabled={loading || !amount}
                   className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 mt-4"
                 >
                   {loading ? <Loader2 className="animate-spin" size={20} /> : "Process Add Balance"}
                 </button>
              </form>
              
              <p className="text-[10px] text-center text-gray-400 mt-6 font-bold uppercase tracking-widest">
                Safe & Secure Encrypted Transaction
              </p>
            </motion.div>
          </div>
        )}

        {/* History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowHistoryModal(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2.5 rounded-xl text-gray-500">
                       <History size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Wallet History</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Last 100 Transactions</p>
                    </div>
                 </div>
                 <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                {historyLoading ? (
                  <div className="py-12 flex items-center justify-center">
                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="py-12 text-center">
                    <Clock className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No transactions found</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead className="sticky top-0 bg-white dark:bg-gray-950 z-10">
                      <tr>
                        <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 px-4 whitespace-nowrap">Date & Time</th>
                        <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 px-4">Type</th>
                        <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 px-4">Amount</th>
                        <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-2 px-4">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="group transition-all">
                          <td className="py-4 px-4 bg-gray-50 dark:bg-gray-900/50 rounded-l-2xl border-y border-l border-transparent group-hover:border-emerald-500/30 transition-all">
                             <div className="flex flex-col">
                               <span className="text-xs font-bold text-gray-900 dark:text-white">{new Date(tx.createdAt).toLocaleDateString()}</span>
                               <span className="text-[10px] text-gray-400 font-medium">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                             </div>
                          </td>
                          <td className="py-4 px-4 bg-gray-50 dark:bg-gray-900/50 border-y border-transparent group-hover:border-y-emerald-500/30 transition-all">
                            <div className="flex items-center gap-2">
                              {tx.type === 'DEDUCTION' ? (
                                <ArrowDownCircle size={14} className="text-red-500" />
                              ) : (
                                <ArrowUpCircle size={14} className="text-emerald-500" />
                              )}
                              <span className={`text-[10px] font-black uppercase tracking-widest ${
                                tx.type === 'DEDUCTION' ? 'text-red-500' : 'text-emerald-500'
                              }`}>
                                {tx.type}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 bg-gray-50 dark:bg-gray-900/50 border-y border-transparent group-hover:border-emerald-500/30 transition-all">
                            <span className="text-sm font-black text-gray-900 dark:text-white">
                              {tx.type === 'DEDUCTION' ? '-' : '+'}৳{tx.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-4 bg-gray-50 dark:bg-gray-900/50 rounded-r-2xl border-y border-r border-transparent group-hover:border-emerald-500/30 transition-all">
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-relaxed line-clamp-2">
                              {tx.note || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl flex items-center gap-3">
                 <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                    <Clock size={16} />
                 </div>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                   Showing only recent 100 transactions to save system resources. Older records are automatically purged.
                 </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
}
