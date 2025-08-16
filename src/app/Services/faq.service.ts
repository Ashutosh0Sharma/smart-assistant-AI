import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Faq } from '../models/faq.models';

const STORAGE_KEY = 'app_faqs_v1';

function uid(): string {
  return globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

@Injectable({ providedIn: 'root' })
export class FaqService {
  private readonly _faqs$ = new BehaviorSubject<Faq[]>(this.load()); // safe now
  readonly faqs$ = this._faqs$.asObservable();

  private load(): Faq[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Faq[];
    } catch {}

    // Seed but DO NOT call persist() here
    const seed: Faq[] = [
      {
        id: uid(),
        question: 'How does the chatbot connect to WhatsApp?',
        answer: 'We use a WhatsApp Business API provider. Our Node.js webhook relays messages to AWS Lex and back.',
        category: 'Integration',
        tags: ['whatsapp', 'lex', 'webhook'],
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uid(),
        question: 'How do I add a new FAQ?',
        answer: 'Go to Admin → FAQ → New. Fill the form and save. The change reflects instantly.',
        category: 'Admin',
        tags: ['faq', 'admin'],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Write to storage directly; BehaviorSubject not ready yet
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch {}
    return seed;
  }

  private persist(list: Faq[]): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
    this._faqs$.next(list);
  }

  list(): Faq[] {
    return this._faqs$.getValue();
  }

  create(data: Omit<Faq, 'id' | 'createdAt' | 'updatedAt'>): Faq {
    const now = new Date().toISOString();
    const item: Faq = { id: uid(), createdAt: now, updatedAt: now, ...data };
    const list = [item, ...this.list()];
    this.persist(list);
    return item;
  }

  update(id: string, changes: Partial<Faq>): Faq | undefined {
    const list = this.list().map(f =>
      f.id === id ? { ...f, ...changes, updatedAt: new Date().toISOString() } : f
    );
    this.persist(list);
    return list.find(f => f.id === id);
  }

  delete(id: string): void {
    const list = this.list().filter(f => f.id !== id);
    this.persist(list);
  }

  clearAll(): void {
    this.persist([]);
  }
}
