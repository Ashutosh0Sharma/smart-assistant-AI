export type FaqStatus = 'draft' | 'published' | 'archived';

export interface Faq {
    id: string;
    question: string;
    answer: string;
    category?: string;
    tags?: string[];
    status: FaqStatus;
    createdAt: string; // ISO
    updatedAt: string; // ISO
}