import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared-imports';
import { AnalyticsService } from '../../Services/analytics.service';
import  {ConversationRow, Channel, Summary} from '../../models/analytical.models'

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent {
 // service reference (assigned in ctor)
  private svc: AnalyticsService;
    Math = Math;

  // table cols
  readonly displayedColumns = ['id', 'createdAt', 'user', 'channel', 'intent', 'durationSec', 'resolution'] as const;

  // filters (writable because template uses .set(...))
  dateFrom!: WritableSignal<Date | null>;
  dateTo!: WritableSignal<Date | null>;
  channel!: WritableSignal<Channel | 'All'>;

  // data & paging
  rows!: Signal<ConversationRow[]>;
  pageIndex = signal(0);
  pageSize = signal(10);
  pagedRows!: Signal<ConversationRow[]>;

  // KPIs & trend (read-only in this component)
  summary!: Signal<Summary>;
  trend!: Signal<{ label: string; value: number }[]>;
  trendPolyline!: Signal<string>;

  constructor(svc: AnalyticsService) {
    this.svc = svc;

    // wire filters
    this.dateFrom = this.svc.dateFrom;
    this.dateTo   = this.svc.dateTo;
    this.channel  = this.svc.channel;

    // rows & paging
    this.rows = computed(() => this.svc.filterData());
    this.pagedRows = computed(() => {
      const start = this.pageIndex() * this.pageSize();
      return this.rows().slice(start, start + this.pageSize());
    });

    // KPIs & trend
    this.summary = this.svc.summary;
    this.trend   = this.svc.trendBuckets;

    // simple SVG polyline
    this.trendPolyline = computed(() => {
      const points = this.trend();
      if (!points.length) return '';
      const w = 600, h = 200, pad = 24;
      const max = Math.max(...points.map(p => p.value));
      const min = Math.min(...points.map(p => p.value));
      const range = Math.max(1, max - min);
      const stepX = (w - pad * 2) / Math.max(1, points.length - 1);
      return points.map((p, i) => {
        const x = pad + i * stepX;
        const y = pad + (1 - (p.value - min) / range) * (h - pad * 2);
        return `${x},${y}`;
      }).join(' ');
    });
  }

  onPage(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  fmtSec(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  }

}
