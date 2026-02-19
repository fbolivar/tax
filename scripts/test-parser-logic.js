
// Mock logic of parser V6 for verification
const text = `
Transaction history
Check
Date Number Description Deposits/ Credits Withdrawals/ Debits Ending daily balance
1/2 NEW Hampton II A Web Pmts 010225 Rvtf31 Carlos Bolivar 514.00 6,926.75
1/6 Ha Ft Lauderdale Vendor Pay 250103 Business Investments G 1,751.00
1/6 Deposit Made In A Branch/Store 149.00
1/6 Cvp Community ACH Paymnt Jan 6 004Pmnh2H0112 271.76
Bolivar-Ortiz
1/6 Cvp Community ACH Paymnt Jan 6 004Pmnh2J0417 Bolivar 271.76
Carlos & Ortiz
1/6 NEW Hampton II A Web Pmts 010625 01F741 Carlos Bolivar 474.00
1/6 NEW Hampton II A Web Pmts 010625 Z0F741 Carlos Bolivar 514.00 7,023.47
1/8 Online Transfer Ref #Ib0Qvspbf4 to Signify Business Essential 730.17 6,293.30
Card Xxxxxxxxxxxx7817 on 01/08/25
Totals $5,350.00 $5,174.40
`;

function cleanAmount(raw) {
    if (!raw) return 0;
    let cleaned = raw.replace(/[$\s,]/g, '');
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
}

function summarizeDescription(desc) {
    return desc.replace(/\s+/g, ' ').trim().toUpperCase();
}

const lines = text.split('\n');
const transactions = [];
let currentTx = null;
const dateRegex = /^(\d{1,2}\/\d{1,2})\s+/;
const amountRegex = /[\d\.,]+\.\d{2}/g;
const year = 2025;

for (let line of lines) {
    line = line.trim();
    if (!line || line.includes('Transaction history') || line.includes('Totals')) continue;

    const dateMatch = line.match(dateRegex);
    const amounts = line.match(amountRegex);

    if (amounts) {
        if (dateMatch) {
            const dateStr = dateMatch[1];
            let description = line.replace(dateStr, '').trim();

            let rawAmount = 0;
            let rawBalance = undefined;

            if (amounts.length >= 2) {
                rawAmount = cleanAmount(amounts[amounts.length - 2]);
                rawBalance = cleanAmount(amounts[amounts.length - 1]);
                amounts.forEach(a => description = description.replace(a, ''));
            } else {
                rawAmount = cleanAmount(amounts[0]);
                description = description.replace(amounts[0], '');
            }

            currentTx = {
                date: `${year}-${dateStr.replace('/', '-')}`,
                description: summarizeDescription(description),
                amount: rawAmount,
                type: 'WITHDRAWAL', // Simple default for mock
                balance: rawBalance
            };
            transactions.push(currentTx);
        }
    } else if (currentTx && line.length > 3 && !line.match(/\d\/\d/)) {
        currentTx.description = summarizeDescription(currentTx.description + ' ' + line);
    }
}

console.log('--- Transactions Parsed ---');
console.log(JSON.stringify(transactions, null, 2));

const totalIn = transactions.filter(t => t.type === 'DEPOSIT').reduce((s, t) => s + t.amount, 0);
const totalOut = transactions.reduce((s, t) => s + t.amount, 0); // In mock all are withdrawals for simplicity
console.log(`\nAudit: Out=${totalOut.toFixed(2)}`);
