export type Channel = 'Web' | 'WhatsApp' | 'Slack';
export interface ConversationRow {
    id: string;
    user: string;
    channel: Channel;
    intent: string;
    durationSec: number;
    createdAt: string; // ISO
    resolution: 'Resolved' | 'Escalated' | 'Unresolved';
}
export interface Summary {
    totalConversations: number;
    avgHandleTimeSec: number;
    csat: number; // 0..100
    automationRate: number; // 0..100
}