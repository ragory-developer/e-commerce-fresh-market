"use client";

import { Wallet, CreditCard, Smartphone } from "lucide-react";

interface PaymentSelectorProps {
  selected: string;
  onSelect: (method: string) => void;
}

export default function PaymentSelector({ selected, onSelect }: PaymentSelectorProps) {
  const methods = [
    { id: 'COD', name: 'Cash on Delivery', desc: 'Pay when you receive', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-500' },
    { id: 'BKASH', name: 'bKash', desc: 'Pay via bKash gateway', icon: Smartphone, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-500' },
    { id: 'CARD', name: 'SSL Commerz / Card', desc: 'Pay securely via card', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-500' },
    { id: 'NAGAD', name: 'Nagad', desc: 'Pay via Nagad', icon: Smartphone, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-500' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
          Payment Method
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Choose how you'd like to pay for your order.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((m) => {
          const Icon = m.icon;
          const isSelected = selected === m.id;
          return (
            <div 
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`p-5 rounded-2xl cursor-pointer transition-all border-2 flex items-center gap-4 ${
                isSelected 
                ? `${m.border} ${m.bg}` 
                : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white dark:bg-gray-800 shadow-sm' : m.bg}`}>
                <Icon size={24} className={m.color} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{m.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{m.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
