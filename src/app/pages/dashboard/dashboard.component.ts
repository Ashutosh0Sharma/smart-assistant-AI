import { Component, computed, signal, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared-imports';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';


type Channel = 'web' | 'whatsapp' | 'slack';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SHARED_IMPORTS, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  filters: {
    channel: 'all' | Channel;
    startDate?: Date;
    endDate?: Date;
  } = { channel: 'all' };

  applyFilters() {
    // TODO: Call API with this.filters and update charts/table
    // this.loadData();
    this.refreshCharts();
  }
  resetFilters() {
    this.filters = { channel: 'all' };
    this.refreshCharts();
  }

  // ───────────────────────── KPIs ─────────────────────────
  kpi = {
    totalConversations: 12450,
    activeUsers: 892,
    avgResponseSec: 3.2,
    csat: 92,
    csatSample: 318,
  };
  kpiDelta = { conversations: 12.4, users: 4.1 };

  get responseScore() {
    const max = 10; // seconds
    const v = Math.max(0, Math.min(100, (1 - this.kpi.avgResponseSec / max) * 100));
    return Math.round(v);
  }

  // ───────────────────────── Table ─────────────────────────
  displayedCols = ['id', 'user', 'channel', 'intent', 'status', 'updatedAt'];
  recentData: Array<{
    id: number; user: string; channel: Channel; intent: string; resolved: boolean; updatedAt: Date;
  }> = [
    { id: 8712, user: 'Riya',   channel: 'web',      intent: 'Order Status', resolved: true,  updatedAt: new Date() },
    { id: 8711, user: 'Rahul',  channel: 'whatsapp', intent: 'Refund',       resolved: false, updatedAt: new Date(Date.now() - 3600e3) },
    { id: 8709, user: 'Sonia',  channel: 'slack',    intent: 'Leave Policy', resolved: true,  updatedAt: new Date(Date.now() - 2 * 3600e3) },
  ];

  channelColor(ch: Channel) {
    switch (ch) {
      case 'web': return 'primary';
      case 'whatsapp': return 'accent';
      case 'slack': return 'warn';
    }
  }

  openConversation(row: any) {
    // TODO: this.router.navigate(['/chat'], { queryParams: { id: row.id }});
  }
  viewAll() {
    // TODO: navigate to full list / analytics
  }

  // ───────────────────────── Charts ─────────────────────────
  // Line chart (Conversations Over Time)
  convData: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Conversations',
      data: [180, 220, 195, 260, 310, 280, 340],
      tension: 0.35,
      fill: true,
      pointRadius: 3,
      borderWidth: 2,
    }],
  };

  convOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: true }, tooltip: { enabled: true } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  // Doughnut chart (Channel Mix)
  mixData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Web', 'WhatsApp', 'Slack'],
    datasets: [{ data: [55, 30, 15] }],
  };

  mixOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' }, tooltip: { enabled: true } },
  };

  // Export helpers
  @ViewChild('convChart') convChart?: BaseChartDirective;
  @ViewChild('mixChart')  mixChart?: BaseChartDirective;

  exportPNG(which: 'conv' | 'mix') {
    const ref = which === 'conv' ? this.convChart : this.mixChart;
    const url = ref?.chart?.toBase64Image();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${which}-chart.png`;
    a.click();
  }

  exportCSV(which: 'conv' | 'mix') {
    let csv = 'label,value\n';
    if (which === 'conv') {
      const labels = (this.convData.labels || []) as string[];
      const values = this.convData.datasets[0].data as number[];
      labels.forEach((l, i) => (csv += `${l},${values[i] ?? ''}\n`));
    } else {
      const labels = (this.mixData.labels || []) as string[];
      const values = this.mixData.datasets[0].data as number[];
      labels.forEach((l, i) => (csv += `${l},${values[i] ?? ''}\n`));
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${which}-data.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  refreshCharts() {
    this.convChart?.update();
    this.mixChart?.update();
  }
}