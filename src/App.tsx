import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Globe, 
  FileText, 
  Truck, 
  Info, 
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Search,
  ArrowRight,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUpload } from './components/FileUpload';
import { analyzeCompliance } from './services/gemini';
import { AnalysisResult, RiskLevel } from './types';

const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const colors = {
    [RiskLevel.LOW]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [RiskLevel.MEDIUM]: 'bg-amber-100 text-amber-700 border-amber-200',
    [RiskLevel.HIGH]: 'bg-orange-100 text-orange-700 border-orange-200',
    [RiskLevel.CRITICAL]: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[level]}`}>
      {level}
    </span>
  );
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [formData, setFormData] = useState({
    productType: '',
    origin: '',
    destination: '',
    questions: ''
  });
  const [files, setFiles] = useState<{ data: string; mimeType: string; name: string }[]>([]);

  const handleAnalyze = async () => {
    if (!formData.productType || !formData.origin || !formData.destination) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const analysis = await analyzeCompliance(
        formData.productType,
        formData.origin,
        formData.destination,
        formData.questions,
        files
      );
      setResult(analysis);
    } catch (error) {
      console.error(error);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <Scale className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">LATAM Compliance</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">FMCG Regulatory Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full border border-zinc-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-zinc-600">Expert System Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-600" />
                Product Parameters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Product Type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dietary Supplement, Cosmetics"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    value={formData.productType}
                    onChange={e => setFormData({...formData, productType: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Origin</label>
                    <input 
                      type="text" 
                      placeholder="USA, EU, China"
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      value={formData.origin}
                      onChange={e => setFormData({...formData, origin: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Destination</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                      value={formData.destination}
                      onChange={e => setFormData({...formData, destination: e.target.value})}
                    >
                      <option value="">Select Market</option>
                      <option value="Mexico">Mexico (COFEPRIS)</option>
                      <option value="Brazil">Brazil (ANVISA)</option>
                      <option value="Colombia">Colombia (INVIMA)</option>
                      <option value="Argentina">Argentina (ANMAT)</option>
                      <option value="Chile">Chile (ISP)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Compliance Documents</label>
                  <FileUpload onFilesChange={setFiles} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Specific Questions</label>
                  <textarea 
                    rows={3}
                    placeholder="What are the labeling requirements for this specific SKU?"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                    value={formData.questions}
                    onChange={e => setFormData({...formData, questions: e.target.value})}
                  />
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Run Regulatory Analysis
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </section>

            <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-300" />
                Regional Intelligence
              </h3>
              <p className="text-xs text-indigo-100/80 leading-relaxed">
                Our system integrates real-time updates from Mercosur and Andean Community trade agreements to ensure your supply chain remains compliant with the latest cross-border regulations.
              </p>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!result && !loading ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-zinc-200 border-dashed"
                >
                  <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                    <Globe className="w-10 h-10 text-zinc-300" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">Ready for Analysis</h3>
                  <p className="text-sm text-zinc-500 max-w-md mx-auto">
                    Enter your product details and upload any relevant documentation to generate a comprehensive regulatory risk report.
                  </p>
                </motion.div>
              ) : loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-zinc-200"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Scale className="w-8 h-8 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mt-8 mb-2">Analyzing Compliance Framework</h3>
                  <p className="text-sm text-zinc-500 max-w-md mx-auto">
                    Consulting COFEPRIS/ANVISA databases and mapping supply chain risks...
                  </p>
                </motion.div>
              ) : result && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8 pb-12"
                >
                  {/* Summary Header */}
                  <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Final Risk Score</p>
                        <RiskBadge level={result.finalRiskScore} />
                      </div>
                    </div>
                    
                    <div className="max-w-2xl">
                      <h2 className="text-2xl font-bold text-zinc-900 mb-4">Regulatory Overview</h2>
                      <div className="flex flex-wrap gap-3 mb-6">
                        <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {result.regulatoryOverview.authority}
                        </div>
                        <div className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-2 ${result.regulatoryOverview.registrationRequired ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                          {result.regulatoryOverview.registrationRequired ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          {result.regulatoryOverview.registrationRequired ? 'Registration Required' : 'No Registration Required'}
                        </div>
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed italic">
                        "{result.overallSummary}"
                      </p>
                    </div>
                  </div>

                  {/* Risk Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                      <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-zinc-400" />
                        Origin Risks
                      </h3>
                      <ul className="space-y-3">
                        {result.originRisks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-3 text-xs text-zinc-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                      <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-zinc-400 rotate-90" />
                        Destination Risks
                      </h3>
                      <ul className="space-y-3">
                        {result.destinationRisks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-3 text-xs text-zinc-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Supply Chain Table */}
                  <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100">
                      <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-indigo-600" />
                        Supply Chain Risk Mapping
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-zinc-50 border-b border-zinc-100">
                            <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Stage</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Risk Description</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {result.supplyChainTable.map((row, i) => (
                            <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="px-6 py-4 text-xs font-bold text-zinc-900">{row.stage}</td>
                              <td className="px-6 py-4 text-xs text-zinc-600 leading-relaxed">{row.riskDescription}</td>
                              <td className="px-6 py-4"><RiskBadge level={row.score} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mitigation Plan */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 px-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Risk Mitigation Plan
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {result.mitigationPlan.map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:border-indigo-200 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <h4 className="text-sm font-bold text-zinc-900">{item.risk}</h4>
                            <div className="flex gap-2">
                              <span className="px-2 py-1 bg-zinc-100 rounded text-[9px] font-bold text-zinc-500 uppercase">Cost: {item.costImpact}</span>
                              <span className="px-2 py-1 bg-zinc-100 rounded text-[9px] font-bold text-zinc-500 uppercase">Delay: {item.delayRisk}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Explanation</p>
                              <p className="text-xs text-zinc-600 leading-relaxed">{item.explanation}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Mitigation Action</p>
                              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-xs text-emerald-800 font-medium leading-relaxed">{item.mitigation}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regional Context & Questions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900 rounded-2xl p-8 text-white">
                      <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-400" />
                        Regional Context
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                        {result.regionalContext}
                      </p>
                      <div className="pt-6 border-t border-zinc-800">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Relevant Frameworks</p>
                        <div className="flex flex-wrap gap-2">
                          {result.regulatoryOverview.laws.map((law, i) => (
                            <span key={i} className="px-2 py-1 bg-zinc-800 rounded text-[9px] font-medium text-zinc-300">{law}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 px-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Expert Q&A
                      </h3>
                      {result.answersToQuestions.map((qa, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
                          <p className="text-xs font-bold text-zinc-900 mb-2">Q: {qa.question}</p>
                          <p className="text-xs text-zinc-600 leading-relaxed">A: {qa.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
            © 2026 LATAM FMCG Regulatory Intelligence System
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[10px] text-zinc-400 hover:text-indigo-600 font-bold uppercase tracking-widest transition-colors">Documentation</a>
            <a href="#" className="text-[10px] text-zinc-400 hover:text-indigo-600 font-bold uppercase tracking-widest transition-colors">API Access</a>
            <a href="#" className="text-[10px] text-zinc-400 hover:text-indigo-600 font-bold uppercase tracking-widest transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
