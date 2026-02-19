'use client';

import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { FileSpreadsheet } from 'lucide-react';
import { Transaction } from '@/features/transactions/services/transaction.service';

interface Props {
    transactions: Transaction[];
    allStatements?: any[];
    year: number;
}

const MONTH_NAMES = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

export function ExportButton({ transactions, allStatements = [], year }: Props) {
    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Financial Report ${year}`);

        // 1. Column Definitions
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Description', key: 'desc', width: 50 },
            { header: 'Deposits/Credits', key: 'dep', width: 18 },
            { header: 'Withdrawals/Debits', key: 'wit', width: 18 },
            { header: 'Check Number', key: 'check', width: 15 },
            { header: 'detail', key: 'detail', width: 40 }
        ];

        // 2. Format Header Row
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '334155' } // Slate-700
            };
            cell.font = {
                color: { argb: 'FFFFFF' },
                bold: true,
                size: 11
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
        headerRow.height = 30;

        // 3. Group transactions by month
        const transactionsByMonth: Record<number, Transaction[]> = {};
        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const m = date.getMonth() + 1;
            if (!transactionsByMonth[m]) transactionsByMonth[m] = [];
            transactionsByMonth[m].push(tx);
        });

        let sem1Dep = 0;
        let sem1Wit = 0;

        // 4. Build Rows
        for (let m = 1; m <= 12; m++) {
            const monthTxs = transactionsByMonth[m] || [];
            if (monthTxs.length === 0) {
                if (m === 6 && (sem1Dep > 0 || sem1Wit > 0)) {
                    addSemesterSummary(worksheet, sem1Dep, sem1Wit);
                }
                continue;
            }

            monthTxs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            // Month Header Spacer (Beginning Balance Row)
            const balanceRow = worksheet.addRow({
                desc: 'BEGINNING BALANCE',
                detail: 'Monthly carryover balance'
            });
            balanceRow.font = { italic: true, color: { argb: '94a3b8' } };
            balanceRow.getCell(6).alignment = { horizontal: 'right' };

            let monthDep = 0;
            let monthWit = 0;

            monthTxs.forEach(tx => {
                const isDep = tx.type === 'DEPOSIT';
                const row = worksheet.addRow({
                    date: new Date(tx.date),
                    desc: tx.description,
                    dep: isDep ? tx.amount : null,
                    wit: !isDep ? tx.amount : null,
                    check: tx.check_number || '',
                    detail: tx.category
                });

                if (isDep) monthDep += tx.amount;
                else monthWit += tx.amount;

                // Cell Formatting for transactional rows
                row.getCell(1).numFmt = 'dd/mm/yyyy';
                row.getCell(3).numFmt = '"$"#,##0.00';
                row.getCell(4).numFmt = '"$"#,##0.00';
            });

            // Monthly Summary Row (Yellow)
            const summaryRow = worksheet.addRow({
                date: MONTH_NAMES[m - 1],
                desc: `TOTAL ${MONTH_NAMES[m - 1]}`,
                dep: monthDep,
                wit: monthWit,
                detail: monthDep - monthWit
            });

            summaryRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'fef08a' } // Yellow-200
                };
                cell.font = { bold: true, color: { argb: '854d0e' } };
                if (typeof cell.value === 'number') {
                    cell.numFmt = '"$"#,##0.00';
                }
            });
            summaryRow.height = 25;

            if (m <= 6) { sem1Dep += monthDep; sem1Wit += monthWit; }
            if (m === 6) addSemesterSummary(worksheet, sem1Dep, sem1Wit);

            worksheet.addRow([]); // Blank spacer row
        }

        // 5. Generate and Save
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Financial_Ledger_${year}.xlsx`);
    };

    const addSemesterSummary = (ws: ExcelJS.Worksheet, dep: number, wit: number) => {
        ws.addRow([]); // Spacer
        const semRow = ws.addRow({
            desc: 'PRIMER SEMESTRE - CONSOLIDADO (ENE-JUN)',
            dep: dep,
            wit: wit,
            detail: dep - wit
        });
        semRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'f59e0b' } // Amber-500
            };
            cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 };
            cell.alignment = { horizontal: 'center' };
            if (typeof cell.value === 'number') {
                cell.numFmt = '"$"#,##0.00';
            }
        });
        semRow.height = 30;
        ws.mergeCells(`B${semRow.number}:B${semRow.number}`);
        ws.addRow([]); // Spacer
    };

    return (
        <button
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-brand-primary font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-brand-bg transition-all shadow-sm active:scale-95 duration-100"
        >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Premium Financial Ledger</span>
        </button>
    );
}
