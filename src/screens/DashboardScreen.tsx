import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import {
  deleteProperty,
  updatePropertyStatus,
  setViewTrendsPeriod,
} from '../store/propertiesSlice.ts';
import {
  setAddPropertyModalOpen,
  setValuationModalOpen,
  setToastMessage,
  setActiveScreen,
} from '../store/uiSlice.ts';
import { PropertyStatus } from '../types/index.ts';

export const DashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: properties, viewTrendsPeriod } = useAppSelector((state) => state.properties);
  const { user } = useAppSelector((state) => state.auth);

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [dashboardSearch, setDashboardSearch] = useState('');

  // Stats
  const totalValue = properties.reduce((acc, p) => acc + p.price, 0);
  const totalViews = properties.reduce((acc, p) => acc + p.views, 0);
  const totalLeads = properties.reduce((acc, p) => acc + p.leads, 0);
  const avgScore =
    properties.length > 0
      ? (properties.reduce((acc, p) => acc + p.aiPropertyScore, 0) / properties.length).toFixed(1)
      : '94.0';

  const filteredProperties = properties.filter((p) => {
    if (filterStatus !== 'All' && p.status !== filterStatus) return false;
    if (dashboardSearch) {
      const q = dashboardSearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportReport = () => {
    dispatch(
      setToastMessage('Exporting Kigali Portfolio Financial Dossier (PDF)... Check notifications.')
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 transition-colors pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header / Greeting Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatar ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB'
              }
              alt="Avatar"
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-900 dark:ring-blue-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-md">
                  {user?.role?.toUpperCase() || 'OWNER'} PORTFOLIO
                </span>
                <span className="text-xs text-slate-400">• Verified Kigali RLMIS</span>
              </div>
              <h1 className="text-2xl font-black font-headline text-slate-900 dark:text-white mt-1">
                {user?.fullName || 'Emma Gasana'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Managing {properties.length} Active Estates in Kigali, Rwanda
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => dispatch(setValuationModalOpen(true))}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">calculate</span>
              AI Valuation Tool
            </button>
            <button
              onClick={handleExportReport}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Export PDF
            </button>
            <button
              onClick={() => dispatch(setAddPropertyModalOpen(true))}
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-900/20"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              List New Estate
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Portfolio Valuation
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">account_balance</span>
              </div>
            </div>
            <div className="text-2xl font-black font-headline text-slate-900 dark:text-white">
              ${(totalValue / 1000000).toFixed(2)}M
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span>+14.2% YoY Capital Appreciation</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Leads & Inquiries
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">mark_email_unread</span>
              </div>
            </div>
            <div className="text-2xl font-black font-headline text-slate-900 dark:text-white">
              {totalLeads} Active Leads
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-900 dark:text-blue-400">
              <span className="material-symbols-outlined text-xs">forum</span>
              <span>Across 4 diplomatic missions</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Average AI Quality Score
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">psychology</span>
              </div>
            </div>
            <div className="text-2xl font-black font-headline text-slate-900 dark:text-white">
              {avgScore} / 100
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span className="material-symbols-outlined text-xs">verified</span>
              <span>Prime Institutional Grade</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Portfolio Engagement
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">visibility</span>
              </div>
            </div>
            <div className="text-2xl font-black font-headline text-slate-900 dark:text-white">
              {totalViews} Impressions
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-xs">trending_flat</span>
              <span>18 In-person viewings held</span>
            </div>
          </div>
        </div>

        {/* Bento Grid: Market Trends & Inquiries Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Appreciation Trends */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-black font-headline text-slate-900 dark:text-white">
                    Rwandan District Yield & Appreciation
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Comparative capital growth rates by Kigali master plan sectors
                  </p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                  {(['Last 30 Days', 'Last 6 Months'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => dispatch(setViewTrendsPeriod(period))}
                      className={`px-3 py-1 rounded-lg transition ${
                        viewTrendsPeriod === period
                          ? 'bg-blue-900 text-white shadow'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* District Bars */}
              <div className="space-y-4">
                {[
                  { name: 'Nyarutarama (Diplomatic Core)', yieldVal: 14.2, color: 'bg-blue-900 dark:bg-blue-500' },
                  { name: 'Kiyovu (Executive Center)', yieldVal: 13.8, color: 'bg-indigo-600 dark:bg-indigo-400' },
                  { name: 'Gacuriro (Modern Residential)', yieldVal: 11.5, color: 'bg-emerald-600 dark:bg-emerald-400' },
                  { name: 'Rebero (Panoramic Ridges)', yieldVal: 10.9, color: 'bg-amber-600 dark:bg-amber-400' },
                  { name: 'Rubavu (Lake Kivu Waterfront)', yieldVal: 9.8, color: 'bg-sky-600 dark:bg-sky-400' },
                ].map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                      <span className="text-slate-900 dark:text-white font-bold">
                        +{item.yieldVal}% Net / yr
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${(item.yieldVal / 16) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span>Source: National Bank of Rwanda & RLMIS Land Registry</span>
              <button
                onClick={() => dispatch(setValuationModalOpen(true))}
                className="text-blue-900 dark:text-blue-400 font-bold hover:underline"
              >
                Model custom asset →
              </button>
            </div>
          </div>

          {/* Right: VIP Pipeline & Concierge Inquiries */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-black font-headline text-slate-900 dark:text-white">
                  VIP Inquiries & Viewings
                </h3>
                <span className="text-xs font-bold text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                  Live Queue
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: 'Amb. Henrik Van Der Berg',
                    org: 'EU Delegation to Rwanda',
                    property: 'The Nyarutarama Heights',
                    time: 'Tomorrow, 10:00 AM',
                    status: 'Confirmed',
                  },
                  {
                    name: 'Dr. Claire Uwera',
                    org: 'Kigali Health Innovations',
                    property: 'Kigali View Heights',
                    time: 'Saturday, 11:30 AM',
                    status: 'Tentative',
                  },
                  {
                    name: 'Marcus Sterling',
                    org: 'UK Diaspora Family Office',
                    property: 'The Hilltop Pavilion',
                    time: 'Sunday, 3:00 PM',
                    status: 'Confirmed',
                  },
                ].map((inq, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {inq.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            inq.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {inq.org} • {inq.property}
                      </span>
                      <span className="text-[10px] text-blue-900 dark:text-blue-400 font-semibold block mt-0.5">
                        {inq.time}
                      </span>
                    </div>

                    <button
                      onClick={() => dispatch(setActiveScreen('chat'))}
                      className="p-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-blue-900 dark:text-blue-300 transition border border-slate-200 dark:border-slate-600"
                      aria-label="Open chat"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => dispatch(setActiveScreen('chat'))}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">support_agent</span>
              Open Concierge Communications Desk
            </button>
          </div>
        </div>

        {/* Portfolio Table / Management Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black font-headline text-slate-900 dark:text-white">
                Active Estates & Portfolios
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage listing visibility, review inquiries, and monitor AI valuation scores
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter portfolio..."
                  value={dashboardSearch}
                  onChange={(e) => setDashboardSearch(e.target.value)}
                  className="px-3 py-1.5 pl-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-900"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-xs text-slate-400">
                  search
                </span>
              </div>

              {/* Status tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                {['All', 'Active', 'Pending Approval', 'Sold'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-lg transition ${
                      filterStatus === status
                        ? 'bg-blue-900 text-white shadow'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-black">
                <tr>
                  <th className="pb-3 pl-2">Estate Details</th>
                  <th className="pb-3">Quarter</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Specs</th>
                  <th className="pb-3">AI Score</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Leads</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredProperties.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white font-headline text-sm">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-slate-500">{p.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300 font-semibold">
                      {p.district}
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      ${p.price.toLocaleString()}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {p.bedrooms} Beds • {p.bathrooms} Baths • {p.areaSqM} m²
                    </td>
                    <td className="py-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 font-bold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {p.aiPropertyScore}/100
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : p.status === 'Sold'
                            ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="text-slate-900 dark:text-white font-bold">{p.leads}</div>
                      <div className="text-[10px] text-slate-400">{p.views} views</div>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <div className="inline-flex items-center gap-2">
                        {/* Toggle Sold/Active */}
                        <button
                          onClick={() => {
                            const newStatus: PropertyStatus =
                              p.status === 'Active' ? 'Sold' : 'Active';
                            dispatch(updatePropertyStatus({ id: p.id, status: newStatus }));
                            dispatch(setToastMessage(`Updated "${p.title}" status to ${newStatus}.`));
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition"
                        >
                          {p.status === 'Active' ? 'Mark Sold' : 'Activate'}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${p.title}" from your portfolio?`)) {
                              dispatch(deleteProperty(p.id));
                              dispatch(setToastMessage(`Removed "${p.title}".`));
                            }
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                          aria-label="Delete property"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
