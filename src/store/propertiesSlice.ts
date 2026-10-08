import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property, PropertyType } from '../types/index.ts';

interface PropertiesState {
  items: Property[];
  favorites: string[];
  selectedPropertyId: string | null;
  filterType: string;
  filterPrice: string;
  searchLocation: string;
  viewTrendsPeriod: 'Last 30 Days' | 'Last 6 Months';
  aiSearchQuery: string;
  isLoading: boolean;
}

const initialProperties: Property[] = [
  {
    id: 'prop-1',
    title: 'Kigali View Heights',
    price: 450000,
    location: 'Rebero District, Kigali',
    district: 'Rebero',
    bedrooms: 4,
    bathrooms: 4,
    areaSqM: 420,
    type: 'House',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP',
    description: 'A masterpiece in tropical modernism featuring integrated solar power, rain harvesting, and panoramic views of the Kigali cityscape.',
    aiPropertyScore: 94,
    growthPotential: '+12.4% /yr',
    riskLevel: 'Very Low',
    views: 192,
    leads: 14,
    distanceKm: '1.2 km away',
    badge: 'Verified',
    featured: true,
    matchScore: 94,
    ownerId: 'usr_default_1',
    createdAt: '2024-03-15',
  },
  {
    id: 'prop-2',
    title: 'The Nyarutarama Heights',
    price: 1250000,
    location: 'Nyarutarama, Kigali',
    district: 'Nyarutarama',
    bedrooms: 5,
    bathrooms: 5,
    areaSqM: 350,
    type: 'Villa',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDArpMK0M8zoN6xXRuQnCGc_NM-2Sp6KPFox1RnYnpReMWK9Z6x6euEcDhHu48e_fzgcu7KGyabP6-op-f9KHpxGgKUYWpZP_ivXsLyXPlsnBadCK-piODpVRK2nI-5ovBffMXVmHT5q4U7Z6fN1ZLsGi-9a4GORRfFjuWe1owQGsKIOcbd9B5svRC_TcVxfPnOYI0qz3-v-7OSe2MHH5PUHw1ZbtPIJZHQEB_oTERbAKiSUA-quQrpo_AzqaBr4MIdRTivwCNUiWlr',
    description: 'Masterpiece of light and space overlooking the rolling hills of Nyarutarama with floor-to-ceiling glass and private grounds.',
    aiPropertyScore: 96,
    growthPotential: '+14.1% /yr',
    riskLevel: 'Very Low',
    views: 240,
    leads: 22,
    distanceKm: '0.8 km away',
    badge: 'Limited Edition',
    featured: true,
    matchScore: 96,
    ownerId: 'usr_default_1',
    createdAt: '2024-04-01',
  },
  {
    id: 'prop-3',
    title: 'Nyari Estate Villa',
    price: 850000,
    location: 'Nyarutarama, Kigali',
    district: 'Nyarutarama',
    bedrooms: 5,
    bathrooms: 4,
    areaSqM: 380,
    type: 'Villa',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzvPU1-Ed_M2uKmAa9x4uM7LzO6igk02vMNRDewXTxCAS0dXtUlRNakil6ULEQqJnINQhS-ErTBJyEjrWNmGr2i_BgzW6vP4akV-rv3ffMUNW--Yz8HG3My-s5ClkhIgYGhDUgL3urjAcU5L4Q63Y58KEXbJ_embPta9hc53y1lTG6jW-aQATnMq1FcAWmND5rbFOLaE561GevNlkvrgVQpEbyGExVJZtCLRzEL1YWSJ7-4zkyfGQuliqpZSKrugVye-ulPXesY9KW',
    description: 'Minimalist luxury mansion with white facade and infinity pool overlooking a valley during twilight.',
    aiPropertyScore: 93,
    growthPotential: '+11.8% /yr',
    riskLevel: 'Low',
    views: 180,
    leads: 18,
    distanceKm: '1.2 km away',
    badge: 'Verified',
    featured: true,
    matchScore: 93,
    ownerId: 'usr_default_1',
    createdAt: '2024-02-20',
  },
  {
    id: 'prop-4',
    title: 'The Gishushu Manor',
    price: 1200000,
    location: 'Gishushu, Kigali',
    district: 'Gishushu',
    bedrooms: 6,
    bathrooms: 7,
    areaSqM: 520,
    type: 'House',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAP8FumKAHmSQmZcqdW8vc6meGKqBVqlB1_EFWzgnp1Ia5fmUHjIO9AQQiyCrDhAt9zQM1sC1iW8u1VKh897Fwu6CbD0CTa3-OWQgnzLGWGGCtN5UE_213PhUaS_2dLIT1mmQ87u7Ys-nHlsp5b_-PfxFGVVTiij1osHUUFc31rf7K63TdCICYbitZBon2uSxwRz167_kQP3Tm4oFqR5LyxRNoM-ZEtn9dTx5ngIlmrG36EpHOGagwQr5coiel483GQFMnMFgnVvfB',
    description: 'Elegant contemporary estate with dark wood accents and wrap-around terrace surrounded by palm trees.',
    aiPropertyScore: 95,
    growthPotential: '+13.5% /yr',
    riskLevel: 'Very Low',
    views: 165,
    leads: 12,
    distanceKm: '2.4 km away',
    badge: 'Investor Choice',
    featured: true,
    matchScore: 91,
    ownerId: 'usr_default_1',
    createdAt: '2024-01-10',
  },
  {
    id: 'prop-5',
    title: 'Vision City Duplex',
    price: 285000,
    location: 'Gacuriro, Kigali',
    district: 'Gacuriro',
    bedrooms: 3,
    bathrooms: 3,
    areaSqM: 210,
    type: 'Penthouse',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBka65aK2VQGbhhaIyduMNTiCwQdT7u9neUzPuYibWKo80NpSvegJN9Uz9NWlUuX2rCh9GryjZnOeiasO6OU0mVeCVlbCX5M-VXFud0EU3OHTe7BBWveulABaXGZkaXn8P7kCG46M0un92zdfni6Vc2beP2xKMbECOY-zN1osCc30WKUOtQ6vqwOPbMLcD2P0ItMCSAey_SgKg4LXO_qqzulEjy5EpKORuHZisRQym43n88lful6A0Jt_NM63phTrV8UOpuGo1g9dGb',
    description: 'Interior of a luxury penthouse with floor-to-ceiling windows overlooking a city skyline at dusk, minimal high-end furniture.',
    aiPropertyScore: 91,
    growthPotential: '+10.2% /yr',
    riskLevel: 'Low',
    views: 145,
    leads: 9,
    distanceKm: '3.5 km away',
    badge: 'Investor Choice',
    featured: false,
    matchScore: 90,
    ownerId: 'usr_default_1',
    createdAt: '2024-03-01',
  },
  {
    id: 'prop-6',
    title: 'The Kibagabaga Sanctuary',
    price: 320000,
    location: 'Kibagabaga, Kigali',
    district: 'Kibagabaga',
    bedrooms: 5,
    bathrooms: 4,
    areaSqM: 420,
    type: 'House',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0KTY8D6AESNf-aZSwUviTD2lGJB-CYOJvbymjU5ONIkKwrmTlY_IN1GWMiM0WjovZcEaF04ekMmJ6lqhzVSDQjsBEHqmM5Mc5h_iRrTSoDqkSRCYqzbP30LPwExohwzBGbxWaAse5mwWGnnBlCq0bCMSWfQXnw3ZU1mh7frPmCb8neM-hQX351raaP2fXK49LXI0SvFYXyn0gdC9-ztOw5yGIWRoy9EYk42JGAZIZIIuj6K2I5JpV69aww7zshMwBfZ5c8I5KCGhn',
    description: 'Spacious modern architectural home with white walls, black accents, and large terrace, surrounded by tropical greenery in a quiet neighborhood with private pool.',
    aiPropertyScore: 92,
    growthPotential: '+11.5% /yr',
    riskLevel: 'Very Low',
    views: 130,
    leads: 11,
    distanceKm: '0.8 km away',
    badge: 'Verified',
    featured: false,
    matchScore: 88,
    ownerId: 'usr_default_1',
    createdAt: '2024-02-15',
  },
  {
    id: 'prop-7',
    title: 'Bugesera Industrial Plot',
    price: 120000,
    location: 'Bugesera Special Economic Zone',
    district: 'Bugesera',
    bedrooms: 0,
    bathrooms: 0,
    areaSqM: 12000,
    type: 'Land',
    status: 'Pending Approval',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxzX8KJ39U9HLMpeIoVllGed8qJ1WR-uqDyJxjsSVCEQ2TaEqOuzVbM92tynbPesQlFg8jpxkT0c2kfHFfHccOvvVzQ-X3dxZOZoalo6_1TxRiyvQDJCJcvcZEfM0Ghns-1qdMHjBkKlU9Of8lDCcQ_L-ibZjsw4b9LEkaIO_QmzXxlzY-ps5rlVMFIuJZ6stolQNU6fibjYs8eG7tVHlhC5bt4MM-AW0_Gu83p9vSOEkAKbG-1KtW81fISQanEbSMSoHIX4nMg6Vg',
    description: 'Prime 1.2 Hectare industrial zoning plot in the rapidly expanding Bugesera SEZ with airport corridor road access and water connection.',
    aiPropertyScore: 88,
    growthPotential: '+18.2% /yr',
    riskLevel: 'Moderate',
    views: 84,
    leads: 5,
    badge: 'Investor Choice',
    featured: false,
    ownerId: 'usr_default_1',
    createdAt: '2024-04-02',
  },
  {
    id: 'prop-8',
    title: 'The Horizon Plaza',
    price: 2400000,
    location: 'City Center, Kigali',
    district: 'Nyarugenge',
    bedrooms: 0,
    bathrooms: 12,
    areaSqM: 2200,
    type: 'Commercial',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7naNZ_oasi-90oPB6UL1QXQniwd0xxcTsefTzEz3AJXdb1Clzi6I_5O0pFX6APuUh9cld57-qBGzChnHG4war9Okas08IVa1Vxr2vlQjhIVGP6bIRuz08z966eXeS5kyioqCNAo3b07MaDdp6bSRZVY7bCw9Uku_KSLoGmMmB4kTspjOColMzW8kW65FbdFTHieOiPqlpMwRbjzTBV0HEaxZxdmjHxBMcQ7euF-4cz3P9WhHerMO0a5pMnxaEQ1DX30Xnm5z8RyXe',
    description: 'Prime grade-A commercial development with high rental yields, executive suites, underground parking, and fiber optic connectivity.',
    aiPropertyScore: 97,
    growthPotential: '+15.0% /yr',
    riskLevel: 'Very Low',
    views: 310,
    leads: 28,
    badge: 'Premium Listing',
    featured: false,
    ownerId: 'usr_default_1',
    createdAt: '2024-01-20',
  },
  {
    id: 'prop-9',
    title: 'Slope House II',
    price: 840000,
    location: 'Kigali Heights, District 4',
    district: 'Kigali Heights',
    bedrooms: 4,
    bathrooms: 3,
    areaSqM: 360,
    type: 'House',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbLk0AYJjnlR-SSNMhaHaN9TbdEgGBK89HpcX1f4H9bu1UgO-Lv4KYzoelEfQVAM0HxpcXW4X4mGZnvFohAUoBOhEJXqK0ryvTKc3OTCnYLB1McFD-ocTTDTWgLaPSswE_oG6FbwOUNd8KoQBWvfs8yQLTXPbZEe0087PUy4gRZsgbVTS48QvMzgjxyrDdtjL4r5IRXiep5GKnsACtvRvZRippURtJfDLhAsvscooTRdBLMRNU7RaW0VGe_2AynFuyI-hzF3cAXzBP',
    description: 'Modern hillside mansion at dusk with warm exterior lighting and minimalist stone facade in Rwanda.',
    aiPropertyScore: 92,
    growthPotential: '+12.0% /yr',
    riskLevel: 'Low',
    views: 110,
    leads: 7,
    featured: false,
    ownerId: 'usr_default_1',
    createdAt: '2024-03-18',
  },
  {
    id: 'prop-10',
    title: 'Kacyiru Executive Suite',
    price: 185000,
    location: 'Kacyiru, Kigali',
    district: 'Kacyiru',
    bedrooms: 2,
    bathrooms: 2,
    areaSqM: 140,
    type: 'Penthouse',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGrcidzvTgo_gcP-KrX6cnaCfqwOEh1aheTKp4fW7VwWN-IoiUU2UD8mRInqzZgWnmDaS6DBrSqDri6HH-M_f2wWNCZgRlxAq0youWzSntTIv7zm1UL44INCCQg8J5r33NiLuDqeHiQAdMIxDHXl8tf4RTjMk6TK920iYo1DVJpZckMT2HRhyD7aMvT6SOTYeOLajSQvP4e0Q7BddtdNBbzDGxJaWwQpXiuAbL9G6F1aa2kk4D9Pu40ZnSiaGtWnIMCrMyjqnM18oo',
    description: 'Ready-to-move apartment near international embassies and ministries. 98% match with your lifestyle criteria.',
    aiPropertyScore: 98,
    growthPotential: '+13.2% /yr',
    riskLevel: 'Very Low',
    views: 295,
    leads: 31,
    matchScore: 98,
    badge: 'Verified',
    featured: false,
    ownerId: 'usr_default_1',
    createdAt: '2024-04-05',
  },
  {
    id: 'prop-11',
    title: 'The Palms Garden View',
    price: 260000,
    location: 'Kibagabaga, Kigali',
    district: 'Kibagabaga',
    bedrooms: 3,
    bathrooms: 2,
    areaSqM: 190,
    type: 'House',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSD7V4z658ybT40JVikCcQFm8B4dJifDCWEHjAld1nlvdbo7Lw__qwcIs3mztho_F8ixdF5T9cUNKPB1SAd4YxSx1-0OTNUXYtLaZ-oRByxhn5mPZTVBM7U1Fm-YNcgdVmeb2ISMehA7ryiz4V2Or_1H9g6GAxFKnHmhz3TmHpAfGGeNUqpGmQMPShx6ojZQQNSFlL3NSv1ktYWLQ1Scd9CNXWpDZVl4_rrc9bciGDQTqVIOkuSdBSn8o1vGipaSg1v4BCbls3f7SP',
    description: 'Price drop alert! Saved from your favorites. Lush garden terrace and light-filled open-plan reception room.',
    aiPropertyScore: 92,
    growthPotential: '+11.0% /yr',
    riskLevel: 'Low',
    views: 142,
    leads: 16,
    matchScore: 93,
    featured: false,
    ownerId: 'usr_default_1',
    createdAt: '2024-03-29',
  },
  {
    id: 'prop-12',
    title: 'Rebero Hillside Plot',
    price: 120000,
    location: 'Rebero, Kigali',
    district: 'Rebero',
    bedrooms: 0,
    bathrooms: 0,
    areaSqM: 1500,
    type: 'Land',
    status: 'Active',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIf5tTOLn8O1XrlDygEMGefVPeT2mIIRt3EUeJ45YIOBNj-Khak322iQNV_kDYlvcSxsEmXH3gA8CH4SwQxdDFHxekxTTSXxy_yCkRxNJ12A75U2w-K2F4oZbIGRMxRxcoIJdS80crBIwqpPxejfupOIyOZ5t5qAD7gKqX2QQx1iIpDd1mOS48TTllqqmSZ0x2_jaHpx_EGQzJzvfTnKm-2vBijMVGKpdQsLEJ6euEEvaK7M2siGu_NnenjqsK6Kb71QG9yAupZZJc',
    description: 'Perfect for architectural development. 98% match for quiet neighborhoods and scenic mountain sunsets.',
    aiPropertyScore: 98,
    growthPotential: '+16.5% /yr',
    riskLevel: 'Very Low',
    views: 188,
    leads: 21,
    matchScore: 98,
    badge: 'Investor Choice',
    featured: false,
    ownerId: 'usr_default_1',
    createdAt: '2024-04-03',
  }
];

const initialState: PropertiesState = {
  items: initialProperties,
  favorites: ['prop-1', 'prop-3', 'prop-11'],
  selectedPropertyId: 'prop-1',
  filterType: 'All',
  filterPrice: 'All',
  searchLocation: '',
  viewTrendsPeriod: 'Last 30 Days',
  aiSearchQuery: 'Find me a 4-bedroom villa in Rebero with a mountain view and high ROI potential.',
  isLoading: false,
};

export const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setFilterType: (state, action: PayloadAction<string>) => {
      state.filterType = action.payload;
    },
    setFilterPrice: (state, action: PayloadAction<string>) => {
      state.filterPrice = action.payload;
    },
    setSearchLocation: (state, action: PayloadAction<string>) => {
      state.searchLocation = action.payload;
    },
    setSelectedProperty: (state, action: PayloadAction<string>) => {
      state.selectedPropertyId = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((favId) => favId !== id);
      } else {
        state.favorites.push(id);
      }
    },
    addProperty: (state, action: PayloadAction<Property>) => {
      state.items.unshift(action.payload);
    },
    updateProperty: (state, action: PayloadAction<Property>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    incrementViews: (state, action: PayloadAction<string>) => {
      const prop = state.items.find((p) => p.id === action.payload);
      if (prop) {
        prop.views += 1;
      }
    },
    incrementLeads: (state, action: PayloadAction<string>) => {
      const prop = state.items.find((p) => p.id === action.payload);
      if (prop) {
        prop.leads += 1;
      }
    },
    setSelectedPropertyId: (state, action: PayloadAction<string | null>) => {
      state.selectedPropertyId = action.payload;
    },
    deleteProperty: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    updatePropertyStatus: (
      state,
      action: PayloadAction<{ id: string; status: Property['status'] }>
    ) => {
      const prop = state.items.find((p) => p.id === action.payload.id);
      if (prop) {
        prop.status = action.payload.status;
      }
    },
    setViewTrendsPeriod: (state, action: PayloadAction<'Last 30 Days' | 'Last 6 Months'>) => {
      state.viewTrendsPeriod = action.payload;
    },
    setAiSearchQuery: (state, action: PayloadAction<string>) => {
      state.aiSearchQuery = action.payload;
    },
  },
});

export const {
  setFilterType,
  setFilterPrice,
  setSearchLocation,
  setSelectedProperty,
  setSelectedPropertyId,
  toggleFavorite,
  addProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  incrementViews,
  incrementLeads,
  setViewTrendsPeriod,
  setAiSearchQuery,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;
