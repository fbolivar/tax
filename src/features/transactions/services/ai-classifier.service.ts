
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export interface AICategorizationResult {
    category: string;
    confidence: number;
    reasoning?: string;
}

const CATEGORIES = [
    'Income',
    'Bank Fees',
    'Auto & Gas',
    'Software & Tech',
    'Marketing',
    'Contractors',
    'Meals & Entertainment',
    'Travel',
    'Office Supplies',
    'Utilities',
    'Professional Fees',
    'Rent & HOA',
    'Insurance',
    'Taxes',
    'Checks',
    'Transfers',
    'Uncategorized'
];

/**
 * AI Classifier Service
 * Uses Vercel AI SDK to classify bank transaction descriptions.
 * It's much smarter than keyword matching for complex narratives.
 */
export async function classifyTransactionWithAI(description: string, amount: number, type: 'DEPOSIT' | 'WITHDRAWAL'): Promise<AICategorizationResult> {
    try {
        const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            prompt: `
            Act as a Senior Accountant. Classify the following bank transaction for a small business.
            
            TRANSACTION:
            - Description: "${description}"
            - Amount: $${amount}
            - Type: ${type}
            
            AVAILABLE CATEGORIES:
            ${CATEGORIES.join(', ')}
            
            RULES:
            1. Respond ONLY with a JSON object in this format: {"category": "Category Name", "confidence": 0.95, "reasoning": "Brief explanation"}
            2. Choose the most specific category.
            3. "Income" is for DEPOSITS that look like sales or revenue.
            4. "Transfers" is for internal money movement (Zelle, Transfers, Credit Card Payments).
            5. "Software & Tech" includes anything like Amazon Web Services, Google, Github, etc.
            6. "Rent & HOA" includes hampton, community, cvp, vendor pay, etc.
            `,
        });

        const result = JSON.parse(text.trim()) as AICategorizationResult;

        // Validation: Ensure the category is one of the allowed ones
        if (!CATEGORIES.includes(result.category)) {
            result.category = 'Uncategorized';
        }

        return result;
    } catch (error) {
        console.error('[AI Classifier Error]', error);
        return { category: 'Uncategorized', confidence: 0 };
    }
}

/**
 * Batch Classify
 * For processing whole statements efficiently.
 */
export async function batchClassifyTransactions(transactions: { description: string, amount: number, type: 'DEPOSIT' | 'WITHDRAWAL' }[]): Promise<string[]> {
    // In a real production scenario, we might want to batch these into a single prompt 
    // to save tokens and time. For now, we'll do it sequentially but we could optimize later.
    const results = await Promise.all(
        transactions.map(async (tx) => {
            const res = await classifyTransactionWithAI(tx.description, tx.amount, tx.type);
            return res.category;
        })
    );
    return results;
}
