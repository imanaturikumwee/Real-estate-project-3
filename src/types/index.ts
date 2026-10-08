export type UserRole = 'buyer' | 'tenant' | 'owner' | 'agent' | 'staff';

export interface User {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar: string;
  token?: string;
  provider?: 'email' | 'google' | 'github' | 'apple' | 'facebook';
}

export type PropertyType = 'House' | 'Villa' | 'Penthouse' | 'Land' | 'Commercial';
export type PropertyStatus = 'Active' | 'Pending Approval' | 'Sold';

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  areaSqM: number;
  type: PropertyType;
  status: PropertyStatus;
  imageUrl: string;
  description: string;
  aiPropertyScore: number;
  growthPotential: string;
  riskLevel: string;
  views: number;
  leads: number;
  distanceKm?: string;
  badge?: 'Verified' | 'Investor Choice' | 'Limited Edition' | 'New Listing' | 'Premium Listing';
  featured?: boolean;
  matchScore?: number;
  ownerId?: string;
  createdAt: string;
}

export interface AiInsightCard {
  propertyName: string;
  score: number;
  growthPotential: string;
  riskLevel: string;
  quote: string;
  price: string;
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: 'user' | 'agent' | 'system';
  text: string;
  time: string;
  aiInsightCard?: AiInsightCard;
}

export interface Conversation {
  id: string;
  participants: string[];
  agentName: string;
  agentAvatar: string;
  agentRole: string;
  agentStatus: 'ONLINE' | 'OFFLINE';
  propertyTitle: string;
  propertyPrice: string;
  propertyImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  scheduledViewingBadge?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'inquiry' | 'viewing' | 'price_drop' | 'system' | 'match';
  read: boolean;
  time: string;
}

export type AppScreen = 'home' | 'chat' | 'dashboard' | 'signin' | 'signup';
