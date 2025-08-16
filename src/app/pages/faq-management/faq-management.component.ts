import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  computed,
  effect,
  signal,
  inject,
  Signal
} from '@angular/core';

// START to-signal
import { toSignal } from '@angular/core/rxjs-interop';
// END to-signal

// START shared-imports
import { SHARED_IMPORTS } from '../../shared-imports';
// END shared-imports

import { Faq, FaqStatus } from '../../models/faq.models';
import { FaqService } from '../../Services/faq.service';

// Types/helpers (not NgModules)
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-faq-management',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS],
  templateUrl: './faq-management.component.html'
})
export class FaqManagementComponent implements AfterViewInit {
  displayedColumns: (keyof Faq | 'actions')[] = ['question', 'category', 'status', 'updatedAt', 'actions'];
  data = new MatTableDataSource<Faq>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Filters
  q = signal<string>('');
  category = signal<string | 'all'>('all');
  status = signal<FaqStatus | 'all'>('all');

  // Reactive sources (initialized in constructor to avoid "used before init")
  faqs!: Signal<Faq[]>;
  filtered!: Signal<Faq[]>;
  categories = signal<string[]>([]);

  private matDialog = inject(MatDialog);

  constructor(private svc: FaqService) {
    // turn the service stream into a signal
    this.faqs = toSignal(this.svc.faqs$, { initialValue: this.svc.list() });

    // derive filtered list from faqs + filters
    this.filtered = computed(() => {
      const items = this.faqs();
      const q = this.q().toLowerCase().trim();
      const cat = this.category();
      const st = this.status();
      return items.filter(f => {
        const matchQ =
          !q ||
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          (f.tags?.some(t => t.toLowerCase().includes(q)) ?? false);
        const matchC = cat === 'all' || f.category === cat;
        const matchS = st === 'all' || f.status === st;
        return matchQ && matchC && matchS;
      });
    });

    // react to changes
    effect(() => {
      const list = this.filtered();
      this.data.data = list;

      if (this.paginator) this.paginator.firstPage();

      const uniqueCats = Array.from(
        new Set((this.faqs() || []).map(x => x.category).filter(Boolean))
      ) as string[];
      this.categories.set(uniqueCats);
    });
  }

  ngAfterViewInit(): void {
    this.data.paginator = this.paginator;
    this.data.sort = this.sort;
  }

  clearFilters(): void {
    this.q.set('');
    this.category.set('all');
    this.status.set('all');
  }

  async openCreate(): Promise<void> {
    const { FaqEditDialogComponent } = await import('./faq-edit-dialog/faq-edit-dialog.component');
    const ref = this.matDialog.open(FaqEditDialogComponent, { width: '720px', data: { mode: 'create' } as const });
    ref.afterClosed().subscribe(res => { if (res) this.svc.create(res); });
  }

  async openEdit(row: Faq): Promise<void> {
    const { FaqEditDialogComponent } = await import('./faq-edit-dialog/faq-edit-dialog.component');
    const ref = this.matDialog.open(FaqEditDialogComponent, { width: '720px', data: { mode: 'edit', faq: row } as const });
    ref.afterClosed().subscribe(res => { if (res) this.svc.update(row.id, res); });
  }

  async confirmDelete(row: Faq): Promise<void> {
    const { ConfirmDialogComponent } = await import('./confirm-dialog/confirm-dialog.component');
    const ref = this.matDialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete FAQ', message: 'This action cannot be undone.' }
    });
    ref.afterClosed().subscribe(ok => { if (ok) this.svc.delete(row.id); });
  }
}
