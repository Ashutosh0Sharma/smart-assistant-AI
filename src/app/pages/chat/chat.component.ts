import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared-imports';


type Sender = 'user' | 'bot';
interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  time: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  @ViewChild('scrollRef') scrollRef?: ElementRef<HTMLDivElement>;
  private cdr = inject(ChangeDetectorRef);


  input = '';
  sending = false;
  typing = false;

  quickReplies = ['Order status', 'Refund policy', 'Pricing', 'Talk to human'];

  trackById(index: number, item: { id: string }) {
    return item.id;
  }



  messages: ChatMessage[] = [
    { id: crypto.randomUUID(), sender: 'bot', text: 'Hi! How can I help you today?', time: new Date() },
  ];

  sendMessage(text?: string, ev?: KeyboardEvent) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }

    const value = (text ?? this.input).trim();
    if (!value) return;

    this.push('user', value);
    this.input = '';
    this.simulateBotReply(value);
  }

  private push(sender: Sender, text: string) {
    this.messages.push({ id: crypto.randomUUID(), sender, text, time: new Date() });
    // force view update for OnPush and async flows
    this.cdr.markForCheck();
    queueMicrotask(() => this.scrollToBottom());
  }

  private simulateBotReply(userText: string) {
    this.typing = true;
    this.sending = true;

    setTimeout(async () => {
      let botReply = await this.mockNlu(userText)
      this.push('bot', botReply);
      this.typing = false;
      this.sending = false;
      this.cdr.markForCheck();
    }, 700);
  }

  private mockNlu(t: string) {
    const q = t.toLowerCase();
    if (q.includes('order')) return 'Your order is in transit 🚚. Expected delivery: 2–3 days.';
    if (q.includes('refund')) return 'You can request a refund within 7 days. Do you want me to start one?';
    if (q.includes('price') || q.includes('pricing')) return 'Starter ₹0, Pro ₹999/mo, Enterprise—talk to sales.';
    if (q.includes('human')) return 'Okay, routing a human agent. Please wait…';
    return 'Got it. I’ll pass this to the right workflow.';
  }

  scrollToBottom() {
    const el = this.scrollRef?.nativeElement;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }

  // placeholders for future features
  attachFile() { /* TODO: open file dialog */ }
  openMenu() { /* TODO */ }
}
