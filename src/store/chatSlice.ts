import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message } from '../types/index.ts';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string;
  messages: Record<string, Message[]>;
  isAgentTyping: boolean;
  searchFilter: string;
}

const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['usr_default_1', 'agent_dany'],
    agentName: 'Agent Dany',
    agentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsxJf63wBNFLzunIniZ6gsts8iZTtMZMBoTk6qcnYAsJn3XfyZ39rQLLVMn7WvAju7ewdihcb_H1Wkh7WVLUMKL0vww1Mor9MDAArbRrP4W7a5Q13kl3aUWZIxQFVAmBbKTCBJEam6dRGoywvcU9BXvmA1IFEMV3wVhI1iR88iDQjMU3bWtxAEMkLoWxUmGSr7xXk_cQ5fbsyvVPvGj9HTPQDCXFXPngftFQfhxljNt_O7YxC4iFx-4BLXxMTtFsi4YQ3Cf0e1ohQ',
    agentRole: 'Expert Consultant • Kigali District',
    agentStatus: 'ONLINE',
    propertyTitle: 'Kigali View Heights',
    propertyPrice: '$450,000',
    propertyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxdX46FADZNvfN53jAT9mevWSpRMZrLPEF0tw5oSrVwbkAfc1NmQwNjHHVTMEFM9sR_bUDIRyW3tDzVprj4WrDKGMJXdvXoUKZeohXzseya_6F4c75NaE_ImWJJdXy0y7Rs7g7oMU0jIh-7KSff1bHJp2WEFxq8L-fgwndmacNMbrNZj4K6ULy2K1L424ekZbJRwg8sjBjjuyBpDSHuB1DH8iOOKmLZ3nruDwHtHTzOMltNKzygnyK4jiCWU3OqGMZCmNGDfDWABfV',
    lastMessage: 'Your AI Score for this plot is 94/100...',
    lastMessageTime: '2m ago',
    unreadCount: 0,
  },
  {
    id: 'conv-2',
    participants: ['usr_default_1', 'agent_emma'],
    agentName: 'Emma M.',
    agentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUA_RscGCKX5F4hHXcrmkUt3c8V4VaYM-q-xTTLjElBzvxZQh-OppXDgl1AvAIsdoPSbqqL3yMYfGjsPb5vHZbfTXOXPgJcz07pfGKNRTYI2TYcbLBd4qQ2QFwv2lmwPREoeAuCFTaIlhl73dXvk3XBXEnC3oDDLGMuyM2io0YjZo26j6KB-m6dJEykOM5cIANypqo-Lsx_l61mawn6M72UbVUPsAsqjwNOXv_6ImpTyJtDfrUKpGkUR-1Mr5bi8t1PHPn5CqeVgQa',
    agentRole: 'Senior Partner • Diaspora Advisory',
    agentStatus: 'ONLINE',
    propertyTitle: 'The Nyarutarama Heights',
    propertyPrice: '$1,250,000',
    propertyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDArpMK0M8zoN6xXRuQnCGc_NM-2Sp6KPFox1RnYnpReMWK9Z6x6euEcDhHu48e_fzgcu7KGyabP6-op-f9KHpxGgKUYWpZP_ivXsLyXPlsnBadCK-piODpVRK2nI-5ovBffMXVmHT5q4U7Z6fN1ZLsGi-9a4GORRfFjuWe1owQGsKIOcbd9B5svRC_TcVxfPnOYI0qz3-v-7OSe2MHH5PUHw1ZbtPIJZHQEB_oTERbAKiSUA-quQrpo_AzqaBr4MIdRTivwCNUiWlr',
    lastMessage: 'Meeting confirmed for tomorrow at 10 AM.',
    lastMessageTime: '1h ago',
    unreadCount: 1,
    scheduledViewingBadge: 'Scheduled Viewing',
  },
];

const initialMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'usr_default_1',
      senderName: 'You',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOCQQgrjyJcdDUlSDqisvb4q_jWQyrYx1NtAWRP8HYyLppVH6Qo6A5wNUPOWvD_ljinpLoYx9mZgzOFfKvYTNwoUCvmhRrKWG60FZbJ30qyXyNIxsd8QDwmpKtecoZhJqeg676QoqJCZrLsj25TntRP8DmufbHNkbLeNRePQ6GMRbIyh5I9eaSAxXsh-_sJV4wopfxf5lXW5rAqXl1yuSkrq8_6668sfGPWBAgElurOHj_GqlEoeez-zuU_dq-7r_lhYZaoNFQlfP',
      senderRole: 'user',
      text: "Hello Dany! I've been looking at the property in Nyarutarama. Can you give me more insights on the investment potential there?",
      time: '14:22',
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'agent_dany',
      senderName: 'Agent Dany',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrBg5gx1Jr0PwAaV40w2xcRzaBYu0Vj3B6BrQEybyVv9kmDAGWfO2OGHidTEf-G2-3Ke02r8kA2gp_i5ibW97MemsnbsXWLVhmQYrz5kQuDuM_KFLdtyp_ych4Lyc8oBtMGIImB2zhCDr6i08dkprYOUvidXfq_MkhzIvdk5M_gLdCr-OXncCV_k1rzUA5oZNJmXAxsNCdRf-UGF0eUmzV7MUxUbVJUhj9Jyy1VsWmjNBojG4bd2Rzr8vNHy-6E-NbMtpUZ1Edd-zI',
      senderRole: 'agent',
      text: 'Absolutely. This plot specifically is in a prime development zone. Here is our proprietary AI Market Insight for this location:',
      time: '14:25',
      aiInsightCard: {
        propertyName: 'Kigali View Heights',
        score: 94,
        growthPotential: '+12.4% /yr',
        riskLevel: 'Very Low',
        quote: '"Kigali View Heights benefits from its proximity to the new diplomatic hub, ensuring sustained valuation premium."',
        price: '$450,000',
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJaYDt8mxRswv_toZBfRDA3pegEDPIEfjGNt8eHYccB0a6-FZhc6OM1Wz5nrvgw8pWCRA_qpr94LigI5gSMcU4K2sibpI90Uahr2AXBAsBzGvyK_Mq4QfL4vTD8XK9VhEXf1xmvf9f3L7j8WCyIMHyz9i3J1Rw6pQK4BkMNwjtbwPMTqZc3b3v-LJbgMLxt1r52jq0RL5FNCu7XVZVVwSQ48Fbo3ckAnvT2XtDvLasZgUtHU3iWn2oa_5l8u0tw6UTmZX_n_IqhT46',
      },
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      senderId: 'usr_default_1',
      senderName: 'You',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOCQQgrjyJcdDUlSDqisvb4q_jWQyrYx1NtAWRP8HYyLppVH6Qo6A5wNUPOWvD_ljinpLoYx9mZgzOFfKvYTNwoUCvmhRrKWG60FZbJ30qyXyNIxsd8QDwmpKtecoZhJqeg676QoqJCZrLsj25TntRP8DmufbHNkbLeNRePQ6GMRbIyh5I9eaSAxXsh-_sJV4wopfxf5lXW5rAqXl1yuSkrq8_6668sfGPWBAgElurOHj_GqlEoeez-zuU_dq-7r_lhYZaoNFQlfP',
      senderRole: 'user',
      text: 'That score is impressive. When can we visit the site?',
      time: '14:28',
    },
  ],
  'conv-2': [
    {
      id: 'msg-201',
      conversationId: 'conv-2',
      senderId: 'usr_default_1',
      senderName: 'You',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOCQQgrjyJcdDUlSDqisvb4q_jWQyrYx1NtAWRP8HYyLppVH6Qo6A5wNUPOWvD_ljinpLoYx9mZgzOFfKvYTNwoUCvmhRrKWG60FZbJ30qyXyNIxsd8QDwmpKtecoZhJqeg676QoqJCZrLsj25TntRP8DmufbHNkbLeNRePQ6GMRbIyh5I9eaSAxXsh-_sJV4wopfxf5lXW5rAqXl1yuSkrq8_6668sfGPWBAgElurOHj_GqlEoeez-zuU_dq-7r_lhYZaoNFQlfP',
      senderRole: 'user',
      text: 'Hi Emma, I would like to schedule a private walkthrough of The Nyarutarama Heights estate.',
      time: '09:30',
    },
    {
      id: 'msg-202',
      conversationId: 'conv-2',
      senderId: 'agent_emma',
      senderName: 'Emma M.',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUA_RscGCKX5F4hHXcrmkUt3c8V4VaYM-q-xTTLjElBzvxZQh-OppXDgl1AvAIsdoPSbqqL3yMYfGjsPb5vHZbfTXOXPgJcz07pfGKNRTYI2TYcbLBd4qQ2QFwv2lmwPREoeAuCFTaIlhl73dXvk3XBXEnC3oDDLGMuyM2io0YjZo26j6KB-m6dJEykOM5cIANypqo-Lsx_l61mawn6M72UbVUPsAsqjwNOXv_6ImpTyJtDfrUKpGkUR-1Mr5bi8t1PHPn5CqeVgQa',
      senderRole: 'agent',
      text: 'Meeting confirmed for tomorrow at 10 AM. Our team driver can pick you up from Kigali Heights or your hotel.',
      time: '10:00',
    },
  ],
};

const initialState: ChatState = {
  conversations: initialConversations,
  activeConversationId: 'conv-1',
  messages: initialMessages,
  isAgentTyping: false,
  searchFilter: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
      const conv = state.conversations.find((c) => c.id === action.payload);
      if (conv) {
        conv.unreadCount = 0;
      }
    },
    setActiveConversationId: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
      const conv = state.conversations.find((c) => c.id === action.payload);
      if (conv) {
        conv.unreadCount = 0;
      }
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.searchFilter = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<
        Omit<Message, 'id' | 'time'> & {
          id?: string;
          time?: string;
        }
      >
    ) => {
      const { conversationId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      const fullMsg: Message = {
        ...action.payload,
        id: action.payload.id || `msg-${Date.now()}`,
        time:
          action.payload.time ||
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      state.messages[conversationId].push(fullMsg);

      // update conversation lastMessage
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
        conv.lastMessage = action.payload.text;
        conv.lastMessageTime = 'Just now';
      }
    },
    setAgentTyping: (state, action: PayloadAction<boolean>) => {
      state.isAgentTyping = action.payload;
    },
    createConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload);
      state.activeConversationId = action.payload.id;
      state.messages[action.payload.id] = [];
    },
  },
});

export const {
  setActiveConversation,
  setActiveConversationId,
  setSearchFilter,
  addMessage,
  setAgentTyping,
  createConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
