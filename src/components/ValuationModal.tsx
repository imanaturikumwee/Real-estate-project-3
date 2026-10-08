import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setValuationModalOpen, setToastMessage, setActiveScreen } from '../store/uiSlice.ts';
import { addMessage } from '../store/chatSlice.ts';

export const ValuationModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isValuationModalOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [district, setDistrict] = useState('Nyarutarama');
  const [propertyType, setPropertyType] = useState('Villa');
  const [areaSqM, setAreaSqM] = useState(380);
  const [bedrooms, setBedrooms] = useState(4);
  const [hasPool, setHasPool] = useState(true);
  const [solarReady, setSolarReady] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{
    estimatedValue: string;
    lowRange: string;
    highRange: string;
    grossYield: string;
    monthlyRental: string;
    aiScore: number;
    growthProjection: string;
  } | null>(null);

  if (!isValuationModalOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      // Calculate realistic Rwandan premium valuation
      const basePerSqM =
        district === 'Nyarutarama'
          ? 1850
          : district === 'Kiyovu'
          ? 1950
          : district === 'Gacuriro'
          ? 1400
          : district === 'Rebero'
          ? 1250
          : district === 'Kimihurura'
          ? 1650
          : 1100;

      const amenityMultiplier = (hasPool ? 1.08 : 1) * (solarReady ? 1.05 : 1);
      const estimate = Math.round(areaSqM * basePerSqM * amenityMultiplier);
      const low = Math.round(estimate * 0.93);
      const high = Math.round(estimate * 1.08);
      const monthlyRental = Math.round((estimate * 0.082) / 12);
      const grossYield = ((monthlyRental * 12 * 100) / estimate).toFixed(1) + '%';
      const aiScore = Math.min(98, 88 + Math.floor(areaSqM / 60));

      setResult({
        estimatedValue: `$${estimate.toLocaleString()}`,
        lowRange: `$${low.toLocaleString()}`,
        highRange: `$${high.toLocaleString()}`,
        grossYield,
        monthlyRental: `$${monthlyRental.toLocaleString()}/mo`,
        aiScore,
        growthProjection: '+13.8% /yr',
      });
      setIsCalculating(false);
    }, 600);
  };

  const handleDiscussWithAdvisor = () => {
    if (!result) return;
    dispatch(
      addMessage({
        conversationId: 'conv-1',
        senderId: user?.id || 'usr_default_1',
        senderName: user?.fullName || 'Investor',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        senderRole: 'user',
        text: `Hi Dany, I just generated an AI valuation report for a ${areaSqM}m² ${propertyType} in ${district}. Estimated value is ${result.estimatedValue} with projected ${result.grossYield} gross yield. Can we discuss this portfolio model?`,
      })
    );
    dispatch(setValuationModalOpen(false));
    dispatch(setActiveScreen('chat'));
    dispatch(setToastMessage('Valuation dossier shared with Agent Dany. Opening Concierge Chat...'));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="valuation-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900/10 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">analytics</span>
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-blue-900 dark:text-blue-400 uppercase font-headline">
                PropTech Intelligence
              </span>
              <h2
                id="valuation-modal-title"
                className="text-xl font-black text-slate-900 dark:text-white font-headline tracking-tight"
              >
                Instant AI Estate Valuation & Yield Calculator
              </h2>
            </div>
          </div>
          <button
            onClick={() => dispatch(setValuationModalOpen(false))}
            className="w-8 h-8 rounded-full bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 flex items-center justify-center transition"
          >
            <span className="material-symbols-outlined text-sm font-bold">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kigali Zone / District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-900"
                >
                  <option value="Nyarutarama">Nyarutarama (Diplomatic Core)</option>
                  <option value="Kiyovu">Kiyovu (Executive & Embassy)</option>
                  <option value="Gacuriro">Gacuriro (Modern Residential)</option>
                  <option value="Rebero">Rebero (Hilltop Panoramic)</option>
                  <option value="Kimihurura">Kimihurura (Gastronomy & Cultural)</option>
                  <option value="Kibagabaga">Kibagabaga (High-end Valley)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Property Classification
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-900"
                >
                  <option value="Villa">Architectural Villa</option>
                  <option value="Penthouse">Sky Penthouse</option>
                  <option value="House">Detached Family Residence</option>
                  <option value="Commercial">Boutique Commercial Asset</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Built Area (m²)
                </label>
                <input
                  type="number"
                  min="80"
                  max="2000"
                  step="10"
                  value={areaSqM}
                  onChange={(e) => setAreaSqM(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={hasPool}
                  onChange={(e) => setHasPool(e.target.checked)}
                  className="rounded text-blue-900"
                />
                Private Swimming Pool
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={solarReady}
                  onChange={(e) => setSolarReady(e.target.checked)}
                  className="rounded text-blue-900"
                />
                Solar & Eco Resilience System
              </label>
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm tracking-tight transition shadow-md flex items-center justify-center gap-2"
            >
              {isCalculating ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  Analyzing Market Transactions...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">calculate</span>
                  Generate Valuation Dossier
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800/80 dark:to-blue-950/30 rounded-2xl border border-blue-100 dark:border-slate-700 space-y-4 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-bold text-blue-900 dark:text-blue-400 uppercase tracking-widest block">
                    AI Market Estimate
                  </span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white font-headline mt-0.5">
                    {result.estimatedValue}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Confidence Range: {result.lowRange} – {result.highRange}
                  </div>
                </div>
                <div className="bg-blue-900 text-white px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">
                    AI Index
                  </span>
                  <span className="text-lg font-black">{result.aiScore}/100</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-blue-200/50 dark:border-slate-700 text-center">
                <div className="bg-white/80 dark:bg-slate-800/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">
                    Est. Rental Yield
                  </span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {result.grossYield}
                  </span>
                </div>
                <div className="bg-white/80 dark:bg-slate-800/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">
                    Monthly Rent
                  </span>
                  <span className="text-base font-black text-slate-800 dark:text-slate-200">
                    {result.monthlyRental}
                  </span>
                </div>
                <div className="bg-white/80 dark:bg-slate-800/60 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">
                    Capital Growth
                  </span>
                  <span className="text-base font-black text-blue-900 dark:text-blue-400">
                    {result.growthProjection}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDiscussWithAdvisor}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                Discuss this Valuation with Agent Dany in Live Concierge
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
