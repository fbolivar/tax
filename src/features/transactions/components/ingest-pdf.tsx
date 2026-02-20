'use client';

import { useState } from 'react';
import { UploadCloud, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { importStatementAction } from '../actions/import-action';

export function IngestPdf() {
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus('uploading');
        setMessage('Procesando PDF...');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await importStatementAction(formData);
            if (result.success) {
                setStatus('success');
                setMessage(`Importación exitosa de ${result.count} transacciones.`);

                setTimeout(() => {
                    router.push(`/transactions?month=${result.month}&year=${result.year}`);
                    router.refresh();
                    setStatus('idle');
                }, 1500);
            } else if (result.isDuplicate) {
                setStatus('error');
                setMessage(`DUPLICADO: El extracto de ${result.month}/${result.year} ya existe.`);
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'Error al cargar el extracto');
        }
    };

    return (
        <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-2 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-lg shadow-brand-primary/20 transition-all active:scale-95 disabled:opacity-50">
                {status === 'uploading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                <span>{status === 'uploading' ? 'Analizando...' : 'Cargar Extracto'}</span>
                <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} disabled={status === 'uploading'} />
            </label>

            {status !== 'idle' && (
                <div className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all animate-in slide-in-from-bottom-5 duration-300 z-50
                    ${status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : ''}
                    ${status === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' : ''}
                    ${status === 'uploading' ? 'bg-white border-gray-100 text-gray-800' : ''}
                `}>
                    {status === 'success' && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                    {status === 'error' && <AlertCircle className="w-6 h-6 text-rose-500" />}
                    {status === 'uploading' && <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />}
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight">
                            {status === 'success' ? 'Importación Completa' : status === 'error' ? 'Error de Importación' : 'Procesando Extracto'}
                        </span>
                        <span className="text-xs opacity-80">{message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
