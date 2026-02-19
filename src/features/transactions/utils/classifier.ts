export function classifyTransaction(description: string): string {
    const desc = description.toLowerCase();

    // Priority Rules: Check these first
    const priorityRules: Record<string, string[]> = {
        'Income': ['deposit', 'transfer from', 'zelle from', 'payroll', 'salary', 'invoice', 'credit'],
        'Bank Fees': ['service fee', 'maintenance fee', 'bank fee', 'overdraft', 'nsf', 'wire fee'],
        'Transfers': ['transfer to', 'zelle to', 'payment to loan', 'credit card payment', 'online transfer']
    };

    for (const [category, keywords] of Object.entries(priorityRules)) {
        if (keywords.some(k => desc.includes(k))) {
            return category;
        }
    }

    // Standard Expense Categories
    const rules: Record<string, string[]> = {
        'Auto & Gas': ['shell', 'chevron', 'exxon', 'mobil', 'bp', 'texaco', 'sunoco', '7-eleven', 'circle k', 'wawa', 'gas', 'fuel', 'auto', 'parking', 'toll', 'uber', 'lyft'],
        'Software & Tech': ['adobe', 'google', 'aws', 'amazon web', 'digitalocean', 'godaddy', 'namecheap', 'vercel', 'supabase', 'github', 'gitlab', 'jetbrains', 'apple', 'microsoft', 'zoom', 'slack', 'intuit', 'quickbooks', 'xero'],
        'Marketing': ['facebook', 'meta', 'instagram', 'linkedin', 'google ads', 'ads', 'marketing', 'mailchimp', 'hostinger'],
        'Contractors': ['upwork', 'fiverr', 'toptal', 'consultant', 'contractor'],
        'Meals & Entertainment': ['restaurant', 'cafe', 'coffee', 'starbucks', 'dunkin', 'mcdonalds', 'burger', 'pizza', 'food', 'grill', 'bar', 'sushi', 'taco', 'chipotle', 'uber eats', 'doordash'],
        'Travel': ['hotel', 'airbnb', 'flight', 'airline', 'delta', 'american air', 'united', 'spirit', 'expedia', 'booking.com', 'marriott', 'hilton'],
        'Office Supplies': ['walmart', 'target', 'publix', 'office depot', 'staples', 'amazon', 'amzn', 'best buy', 'home depot', 'lowes', 'costco', 'sams club'],
        'Utilities': ['fpl', 'water', 'electric', 'power', 'utility', 'comcast', 'att', 'verizon', 'frontier', 't-mobile', 'spectrum', 'garbage', 'waste'],
        'Professional Fees': ['attorney', 'legal', 'cpa', 'accounting', 'notary'],
        'Rent & HOA': ['rent', 'lease', 'storage', 'public storage', 'hampton', 'community', 'cvp', 'vendor pay', 'investments'],
        'Insurance': ['insurance', 'state farm', 'geico', 'progressive', 'allstate', 'liberty mutual'],
        'Taxes': ['irs', 'us treasury', 'tax', 'department of revenue']
    };

    for (const [category, keywords] of Object.entries(rules)) {
        if (keywords.some(k => desc.includes(k))) return category;
    }

    // Default Fallback checks
    if (desc.includes('check')) return 'Checks';

    return 'Uncategorized';
}
