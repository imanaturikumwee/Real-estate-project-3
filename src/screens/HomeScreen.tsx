import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import {
  setFilterType,
  setFilterPrice,
  setSearchLocation,
  toggleFavorite,
  setSelectedPropertyId,
} from '../store/propertiesSlice.ts';
import {
  setActiveScreen,
  setBookingModalOpen,
  setValuationModalOpen,
  setToastMessage,
} from '../store/uiSlice.ts';
import { Property } from '../types/index.ts';

export const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: properties, favorites, filterType, filterPrice, searchLocation } = useAppSelector(
    (state) => state.properties
  );

  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState<Property | null>(null);

  const districts = ['All', 'Nyarutarama', 'Kiyovu', 'Gacuriro', 'Rebero', 'Kimihurura', 'Rubavu'];

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // District filter
      if (selectedDistrict !== 'All' && !prop.district.toLowerCase().includes(selectedDistrict.toLowerCase())) {
        return false;
      }
      // Type filter
      if (filterType !== 'all' && prop.type.toLowerCase() !== filterType.toLowerCase()) {
        return false;
      }
      // Price filter
      if (filterPrice === 'under-500k' && prop.price >= 500000) return false;
      if (filterPrice === '500k-1m' && (prop.price < 500000 || prop.price > 1000000)) return false;
      if (filterPrice === 'over-1m' && prop.price <= 1000000) return false;

      // Search keyword
      if (searchLocation) {
        const query = searchLocation.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesLoc = prop.location.toLowerCase().includes(query);
        const matchesDesc = prop.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLoc && !matchesDesc) return false;
      }
      return true;
    });
  }, [properties, selectedDistrict, filterType, filterPrice, searchLocation]);

  const handleBookViewing = (prop: Property) => {
    dispatch(setBookingModalOpen({ open: true, property: prop }));
  };

  const handleContactConcierge = (prop: Property) => {
    dispatch(setSelectedPropertyId(prop.id));
    dispatch(setActiveScreen('chat'));
    dispatch(setToastMessage(`Connected to Senior Concierge Dany for "${prop.title}".`));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 md:pt-24 md:pb-32 px-6 md:px-10">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wide text-blue-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kigali Prime Architectural Portfolio • Autumn 2026</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-headline tracking-tight leading-[1.1] mb-6">
                Find your dream <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-white">
                  architectural estate
                </span>{' '}
                in Rwanda.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed mb-8">
                Curated high-yield villas, diplomatic residences, and panoramic lakeside estates. Certified land titles, sovereign tenant yield analytics, and private concierge advisory.
              </p>

              {/* District Pills */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mr-1">
                  Districts:
                </span>
                {districts.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistrict(d)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedDistrict === d
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick AI Valuation teaser card */}
            <div className="lg:col-span-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-300">auto_awesome</span>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-blue-200">
                      PropTech AI
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/30 text-blue-200">
                    Live Model
                  </span>
                </div>
                <h3 className="text-lg font-bold font-headline mb-2">
                  Instant Rwandan Estate Valuation
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  Analyze square meter comps, diplomatic yield potential, and projected appreciation across Kigali in 1 click.
                </p>
                <button
                  onClick={() => dispatch(setValuationModalOpen(true))}
                  className="w-full py-3 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs tracking-tight transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <span className="material-symbols-outlined text-sm">calculate</span>
                  Launch Valuation Dossier
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Search Bar Container */}
          <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Location Input */}
              <div className="relative">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Location / Suburb
                </label>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="material-symbols-outlined text-slate-400 text-sm">location_on</span>
                  <input
                    type="text"
                    placeholder="Search Kigali, Nyarutarama..."
                    value={searchLocation}
                    onChange={(e) => dispatch(setSearchLocation(e.target.value))}
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  />
                  {searchLocation && (
                    <button
                      onClick={() => dispatch(setSearchLocation(''))}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Property Category
                </label>
                <select
                  value={filterType}
                  onChange={(e) => dispatch(setFilterType(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="all">All Architectural Types</option>
                  <option value="villa">Luxury Villas</option>
                  <option value="house">Modern Houses</option>
                  <option value="penthouse">Sky Penthouses</option>
                  <option value="commercial">Commercial Assets</option>
                  <option value="land">Development Plots</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Price Threshold
                </label>
                <select
                  value={filterPrice}
                  onChange={(e) => dispatch(setFilterPrice(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="all">Any Investment Scale</option>
                  <option value="under-500k">Under $500,000</option>
                  <option value="500k-1m">$500,000 – $1,000,000</option>
                  <option value="over-1m">$1,000,000+ (Diplomatic)</option>
                </select>
              </div>

              {/* Explore CTA */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    const el = document.getElementById('curated-portfolio-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-extrabold text-xs tracking-tight transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">search</span>
                  Filter {filteredProperties.length} Estates
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Macro-Statistics Bar */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-6 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-black font-headline text-blue-900 dark:text-blue-400">
              $140M+
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Curated Rwandan Portfolio
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black font-headline text-blue-900 dark:text-blue-400">
              12.4%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Average Net Rental Yield
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black font-headline text-blue-900 dark:text-blue-400">
              100%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Verified Title Deeds (RDB)
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black font-headline text-blue-900 dark:text-blue-400">
              24/7
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Diplomatic Concierge Desk
            </div>
          </div>
        </div>
      </section>

      {/* Curated Estates Grid Section */}
      <section id="curated-portfolio-section" className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-black tracking-widest text-blue-900 dark:text-blue-400 uppercase font-headline">
              Rwandan Architectural Collection
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-headline tracking-tight text-slate-900 dark:text-white mt-1">
              Prime Properties & Estates
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Showing {filteredProperties.length} vetted architectural assets matching your criteria
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(setActiveScreen('dashboard'))}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              Estate Manager Mode
            </button>
            <button
              onClick={() => dispatch(setActiveScreen('chat'))}
              className="px-4 py-2 rounded-xl bg-blue-900 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined text-sm">support_agent</span>
              Talk to Dany
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-900 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">home_work</span>
            </div>
            <h3 className="text-lg font-bold font-headline mb-1">No properties found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
              No estates match your current filter settings. Try adjusting your district or price range.
            </p>
            <button
              onClick={() => {
                setSelectedDistrict('All');
                dispatch(setFilterType('all'));
                dispatch(setFilterPrice('all'));
                dispatch(setSearchLocation(''));
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => {
              const isFav = favorites.includes(prop.id);
              return (
                <div
                  key={prop.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image container */}
                  <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                    {/* Badges */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 items-center">
                      {prop.badge && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 text-blue-900 dark:text-blue-400 shadow-sm backdrop-blur-sm">
                          {prop.badge}
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-900/90 text-white shadow-sm backdrop-blur-sm">
                        {prop.type}
                      </span>
                    </div>

                    {/* Favorite button */}
                    <button
                      onClick={() => {
                        dispatch(toggleFavorite(prop.id));
                        dispatch(
                          setToastMessage(
                            isFav
                              ? `Removed "${prop.title}" from saved favorites.`
                              : `Added "${prop.title}" to saved favorites.`
                          )
                        );
                      }}
                      className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-rose-600 transition shadow-md"
                      aria-label="Save to favorites"
                    >
                      <span
                        className={`material-symbols-outlined text-lg ${
                          isFav ? 'text-rose-500 fill-current font-bold' : ''
                        }`}
                      >
                        favorite
                      </span>
                    </button>

                    {/* AI Score Capsule */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex justify-between items-end">
                      <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] font-extrabold text-white">
                          AI Score {prop.aiPropertyScore}/100
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {prop.growthPotential}
                        </span>
                      </div>
                      {prop.distanceKm && (
                        <span className="text-[10px] font-semibold text-slate-200 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg">
                          {prop.distanceKm}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-xs font-semibold text-blue-900 dark:text-blue-400">
                          {prop.district}, Kigali
                        </span>
                        <span className="text-xl font-black font-headline text-slate-900 dark:text-white">
                          ${prop.price.toLocaleString()}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold font-headline text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition">
                        {prop.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {prop.description}
                      </p>

                      {/* Specs pills */}
                      <div className="flex items-center gap-4 py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 font-medium mb-4">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-slate-400">bed</span>
                          <span>{prop.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-slate-400">bathtub</span>
                          <span>{prop.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-slate-400">square_foot</span>
                          <span>{prop.areaSqM} m²</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        onClick={() => handleBookViewing(prop)}
                        className="py-2.5 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs tracking-tight transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                        Book Viewing
                      </button>
                      <button
                        onClick={() => handleContactConcierge(prop)}
                        className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs tracking-tight transition flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-xs">chat</span>
                        Chat Concierge
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bento Showcase Section: "The Rwandan Advantage" */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 md:p-14 text-white relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-black tracking-widest text-blue-300 uppercase font-headline">
              Rwanda Vision 2050
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-headline tracking-tight mt-1 mb-3">
              Why Invest in Kigali Real Estate with Emma & Dany?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Kigali is recognized globally as one of the cleanest, safest, and fastest-growing diplomatic and tech capitals in Africa. Our agency bridges international capital with high-yield architectural developments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <h3 className="text-base font-bold font-headline mb-2">
                100% Digital Title Deeds
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct integration with Rwanda Land Management and Information System (RLMIS). Clean freehold and emphyteutic leases with zero encumbrance risk.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">trending_up</span>
              </div>
              <h3 className="text-base font-bold font-headline mb-2">
                Sovereign Tenant Demand
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Diplomatic missions, regional headquarters, and multinational leadership guarantee 10%–14% net USD-denominated rental yields.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-xl">support_agent</span>
              </div>
              <h3 className="text-base font-bold font-headline mb-2">
                Turnkey Diaspora Advisory
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Remote closing, notarized powers of attorney, architectural renovations, and luxury tenancy management managed completely for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-headline font-black text-sm">
                ED
              </div>
              <span className="text-lg font-black tracking-tight font-headline text-blue-900 dark:text-white">
                Emma & Dany
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              The premier digital agency for luxury architecture and sovereign property portfolios in Kigali and the Great Lakes region.
            </p>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>KG 9 Ave, Nyarutarama, Kigali</div>
              <div>contact@emma-dany.rw • +250 788 123 456</div>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-headline mb-4">
              Neighborhoods
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><button onClick={() => setSelectedDistrict('Nyarutarama')} className="hover:text-blue-900 dark:hover:text-blue-400">Nyarutarama Golf View</button></li>
              <li><button onClick={() => setSelectedDistrict('Kiyovu')} className="hover:text-blue-900 dark:hover:text-blue-400">Kiyovu Diplomatic Hill</button></li>
              <li><button onClick={() => setSelectedDistrict('Gacuriro')} className="hover:text-blue-900 dark:hover:text-blue-400">Gacuriro Estate Quarters</button></li>
              <li><button onClick={() => setSelectedDistrict('Rebero')} className="hover:text-blue-900 dark:hover:text-blue-400">Rebero Panoramic Ridges</button></li>
              <li><button onClick={() => setSelectedDistrict('Rubavu')} className="hover:text-blue-900 dark:hover:text-blue-400">Lake Kivu Waterfront</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-headline mb-4">
              Intelligence & Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><button onClick={() => dispatch(setValuationModalOpen(true))} className="hover:text-blue-900 dark:hover:text-blue-400">AI Valuation & Yield Calculator</button></li>
              <li><button onClick={() => dispatch(setActiveScreen('chat'))} className="hover:text-blue-900 dark:hover:text-blue-400">Private Concierge Chat</button></li>
              <li><button onClick={() => dispatch(setActiveScreen('dashboard'))} className="hover:text-blue-900 dark:hover:text-blue-400">Estate Manager Dashboard</button></li>
              <li><button onClick={() => dispatch(setActiveScreen('signup'))} className="hover:text-blue-900 dark:hover:text-blue-400">Become an Accredited Partner</button></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-headline mb-4">
              Diaspora Advisory Desk
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Receive quarterly Kigali real estate market reports and off-market architectural listings.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <button
                onClick={() => dispatch(setToastMessage('Thank you! You are subscribed to Emma & Dany Market Dossiers.'))}
                className="px-3 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shrink-0"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© 2026 Emma & Dany Real Estate Ltd. All rights reserved. RDB Registered & RLMIS Accredited.</div>
          <div className="flex gap-6">
            <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Land Title Verification</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
