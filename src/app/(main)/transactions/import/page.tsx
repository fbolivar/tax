'use client';

import { useState } from 'react';
import { importStatementAction } from '@/features/transactions/actions/import-action';

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        const result = await importStatementAction(formData);

        if (result?.error) {
            setMessage(`Error: ${result.error}`);
        } else if (result?.success) {
            setMessage(`Success! Imported ${result.count} transactions.`);
        }

        setLoading(false);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Import Bank Statement</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select PDF File (Wells Fargo)
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!file || loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${loading ? 'cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : 'Upload & Process'}
                        </button>
                    </div>
                </form>

                {message && (
                    <div className={`mt-6 p-4 rounded-md ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {message}
                    </div>
                )}
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Instructions</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Upload your Wells Fargo bank statement PDF.</li>
                    <li>Ensure it contains the "Transaction history" section.</li>
                    <li>The system will automatically extract, clean, and categorize transactions.</li>
                </ul>
            </div>
        </div>
    );
}
