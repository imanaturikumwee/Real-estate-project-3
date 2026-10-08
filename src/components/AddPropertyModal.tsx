import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setAddPropertyModalOpen, setToastMessage } from '../store/uiSlice.ts';
import { addProperty } from '../store/propertiesSlice.ts';
import { addNotification } from '../store/notificationsSlice.ts';
import { Property, PropertyType } from '../types/index.ts';
import { getSocket } from '../lib/socket.ts';

const SAMPLE_IMAGES = [
  {
    label: 'Modern Villa Glass & Stone',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxdX46FADZNvfN53jAT9mevWSpRMZrLPEF0tw5oSrVwbkAfc1NmQwNjHHVTMEFM9sR_bUDIRyW3tDzVprj4WrDKGMJXdvXoUKZeohXzseya_6F4c75NaE_ImWJJdXy0y7Rs7g7oMU0jIh-7KSff1bHJp2WEFxq8L-fgwndmacNMbrNZj4K6ULy2K1L424ekZbJRwg8sjBjjuyBpDSHuB1DH8iOOKmLZ3nruDwHtHTzOMltNKzygnyK4jiCWU3OqGMZCmNGDfDWABfV',
  },
  {
    label: 'Hilltop Terrace & Infinity Pool',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDArpMK0M8zoN6xXRuQnCGc_NM-2Sp6KPFox1RnYnpReMWK9Z6x6euEcDhHu48e_fzgcu7KGyabP6-op-f9KHpxGgKUYWpZP_ivXsLyXPlsnBadCK-piODpVRK2nI-5ovBffMXVmHT5q4U7Z6fN1ZLsGi-9a4GORRfFjuWe1owQGsKIOcbd9B5svRC_TcVxfPnOYI0qz3-v-7OSe2MHH5PUHw1ZbtPIJZHQEB_oTERbAKiSUA-quQrpo_AzqaBr4MIdRTivwCNUiWlr',
  },
  {
    label: 'Nyarutarama Diplomatic Compound',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP',
  },
  {
    label: 'Kiyovu Forest Architectural Pavilion',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOCQQgrjyJcdDUlSDqisvb4q_jWQyrYx1NtAWRP8HYyLppVH6Qo6A5wNUPOWvD_ljinpLoYx9mZgzOFfKvYTNwoUCvmhRrKWG60FZbJ30qyXyNIxsd8QDwmpKtecoZhJqeg676QoqJCZrLsj25TntRP8DmufbHNkbLeNRePQ6GMRbIyh5I9eaSAxXsh-_sJV4wopfxf5lXW5rAqXl1yuSkrq8_6668sfGPWBAgElurOHj_GqlEoeez-zuU_dq-7r_lhYZaoNFQlfP',
  },
];

export const AddPropertyModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAddPropertyModalOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    district: 'Nyarutarama',
    location: 'Nyarutarama, Kigali',
    price: 650000,
    bedrooms: 4,
    bathrooms: 4,
    areaSqM: 380,
    type: 'Villa' as PropertyType,
    imageUrl: SAMPLE_IMAGES[0].url,
    description: 'An exceptional architectural property designed to embrace Kigali’s temperate climate, featuring indigenous landscaping, high ceilings, and panoramic mountain vistas.',
    featured: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddPropertyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsSubmitting(true);

    const calculatedScore = Math.floor(Math.random() * 8) + 91; // 91 - 98
    const growthRates = ['+11.8% /yr', '+13.2% /yr', '+14.5% /yr', '+15.1% /yr'];
    const growthPotential = growthRates[Math.floor(Math.random() * growthRates.length)];

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: formData.title,
      price: Number(formData.price),
      location: formData.location || `${formData.district}, Kigali`,
      district: formData.district,
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      areaSqM: Number(formData.areaSqM),
      type: formData.type,
      status: 'Active',
      imageUrl: formData.imageUrl,
      description: formData.description,
      aiPropertyScore: calculatedScore,
      growthPotential,
      riskLevel: 'Very Low',
      views: 12,
      leads: 1,
      badge: 'New Listing',
      featured: formData.featured,
      matchScore: calculatedScore,
      ownerId: user?.id || 'usr_default_1',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      dispatch(addProperty(newProp));

      // Broadcast via socket if connected
      const socket = getSocket();
      if (socket && socket.connected) {
        socket.emit('property:new', newProp);
      }

      dispatch(
        addNotification({
          userId: user?.id || 'usr_default_1',
          title: 'Estate Listed Successfully',
          message: `"${formData.title}" is now active in your Rwandan portfolio with AI Score ${calculatedScore}/100.`,
          type: 'system',
        })
      );

      dispatch(setToastMessage(`Estate "${formData.title}" added to active portfolio.`));
      setIsSubmitting(false);
      dispatch(setAddPropertyModalOpen(false));
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-estate-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-900 dark:text-blue-400 uppercase font-headline">
              Portfolio Onboarding
            </span>
            <h2
              id="add-estate-title"
              className="text-2xl font-black text-slate-900 dark:text-white font-headline tracking-tight"
            >
              List an Exclusive Estate
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Submit architectural specifications to generate AI investment score and syndicate across the network.
            </p>
          </div>
          <button
            onClick={() => dispatch(setAddPropertyModalOpen(false))}
            className="w-9 h-9 rounded-full bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-sm font-bold">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Estate Title / Architectural Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Kiyovu Panorama Villa"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Property Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land</option>
              </select>
            </div>
          </div>

          {/* Location & District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                District / Quarter
              </label>
              <select
                value={formData.district}
                onChange={(e) => {
                  const dist = e.target.value;
                  setFormData({
                    ...formData,
                    district: dist,
                    location: `${dist}, Kigali`,
                  });
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="Nyarutarama">Nyarutarama</option>
                <option value="Kiyovu">Kiyovu</option>
                <option value="Gacuriro">Gacuriro</option>
                <option value="Rebero">Rebero</option>
                <option value="Kimihurura">Kimihurura</option>
                <option value="Kibagabaga">Kibagabaga</option>
                <option value="Rubavu">Rubavu Waterfront</option>
                <option value="Musanze">Musanze Foothills</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Address / Coordinates
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
          </div>

          {/* Price & Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Price (USD $)
              </label>
              <input
                type="number"
                min="10000"
                step="5000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Bedrooms
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Bathrooms
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Area (m²)
              </label>
              <input
                type="number"
                min="50"
                step="10"
                value={formData.areaSqM}
                onChange={(e) => setFormData({ ...formData, areaSqM: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
          </div>

          {/* Preset Architectural Photography Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Architectural Photography
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setFormData({ ...formData, imageUrl: img.url })}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition relative group ${
                    formData.imageUrl === img.url
                      ? 'border-blue-900 dark:border-blue-400 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-20 object-cover" />
                  <div className="p-1 bg-white dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-medium truncate">
                    {img.label}
                  </div>
                  {formData.imageUrl === img.url && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-900 text-white rounded-full flex items-center justify-center shadow">
                      <span className="material-symbols-outlined text-xs font-bold">check</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Architectural & Environmental Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/70 rounded-xl">
            <input
              type="checkbox"
              id="featured-toggle"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-blue-900 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="featured-toggle"
              className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              Feature prominently on Emma & Dany Hero showcase (Investor Choice)
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => dispatch(setAddPropertyModalOpen(false))}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm tracking-tight transition shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  Generating AI Analysis...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">publish</span>
                  Publish to Portfolio
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
