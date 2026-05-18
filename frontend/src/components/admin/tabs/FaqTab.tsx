"use client";

import { Plus, X, MessageCircleQuestion } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface FaqTabProps {
  faqs: FAQ[];
  onChange: (faqs: FAQ[]) => void;
}

export default function FaqTab({ faqs, onChange }: FaqTabProps) {
  const addFaq = () => {
    onChange([...faqs || [], { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    onChange(faqs.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    const updated = faqs.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    );
    onChange(updated);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Product FAQs
          </h2>
          <p className="text-sm text-gray-500">
            Add frequently asked questions and answers for this product.
          </p>
        </div>
        <button
          onClick={addFaq}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {(!faqs || faqs.length === 0) ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <MessageCircleQuestion className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No FAQs yet</h3>
            <p className="text-sm text-gray-500">Click the button above to add your first question.</p>
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div 
              key={index} 
              className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-all hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-md"
            >
              <button 
                onClick={() => removeFaq(index)}
                className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <X size={18} />
              </button>
              
              <div className="space-y-4 pr-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Question {index + 1}
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, "question", e.target.value)}
                    placeholder="e.g. Is this product organic?"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white font-medium transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Answer
                  </label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, "answer", e.target.value)}
                    placeholder="e.g. Yes, all our products are 100% certified organic."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white font-medium transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
