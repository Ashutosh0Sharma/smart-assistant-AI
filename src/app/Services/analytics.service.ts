import { Injectable, signal } from '@angular/core';
import {Channel , ConversationRow, Summary } from '../models/analytical.models';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  // filters
  readonly dateFrom = signal<Date | null>(null);
  readonly dateTo = signal<Date | null>(null);
  readonly channel = signal<Channel | 'All'>('All');

  // summary
  readonly summary = signal<Summary>({
    totalConversations: 1280,
    avgHandleTimeSec: 142,
    csat: 88,
    automationRate: 63,
  });

  // trend points (last 12 buckets)
  readonly trendBuckets = signal<{ label: string; value: number }[]>([
    { label: 'Jan', value: 70 },
    { label: 'Feb', value: 76 },
    { label: 'Mar', value: 74 },
    { label: 'Apr', value: 81 },
    { label: 'May', value: 79 },
    { label: 'Jun', value: 84 },
    { label: 'Jul', value: 83 },
    { label: 'Aug', value: 88 },
    { label: 'Sep', value: 86 },
    { label: 'Oct', value: 89 },
    { label: 'Nov', value: 91 },
    { label: 'Dec', value: 94 },
  ]);

  // table data
  readonly conversations = signal<ConversationRow[]>(
    Array.from({ length: 50 }).map((_, i) => {
      const channels: Channel[] = ['Web', 'WhatsApp', 'Slack'];
      const resolutions: ConversationRow['resolution'][] = ['Resolved', 'Escalated', 'Unresolved'];
      const intents = ['Order Status', 'Refund', 'FAQ', 'Greeting', 'Shipping', 'Pricing'];
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        id: `C-${1000 + i}`,
        user: `user${i + 1}@mail.com`,
        channel: channels[i % channels.length],
        intent: intents[i % intents.length],
        durationSec: 60 + (i * 7) % 420,
        createdAt: d.toISOString(),
        resolution: resolutions[i % resolutions.length],
      };
    })
  );

  filterData(): ConversationRow[] {
    const from = this.dateFrom();
    const to = this.dateTo();
    const ch = this.channel();
    return this.conversations().filter((r) => {
      const t = new Date(r.createdAt).getTime();
      const passFrom = !from || t >= from.getTime();
      const passTo = !to || t <= to.getTime();
      const passCh = ch === 'All' || r.channel === ch;
      return passFrom && passTo && passCh;
    });
  }
}
