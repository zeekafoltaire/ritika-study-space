

import React, { useState } from 'react';
import { balanceChemicalEquation } from '../services/aiService';

const SparklesIcon: React.FC<{className?:string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l.645 1.558a.75.75 0 00.704.518l1.703.247c.82.119 1.171 1.077.536 1.651l-1.23 1.193a.75.75 0 00-.215.828l.292 1.697c.145.839-.715 1.488-1.453 1.075l-1.52-.798a.75.75 0 00-.832 0l-1.52.798c-.738.413-1.6.264-1.453-1.075l.292-1.697a.75.75 0 00-.215-.828l-1.23-1.193c-.635-.574-.284-1.532.536-1.651l1.703-.247a.75.75 0 00.704-.518l.645-1.558z" clipRule="evenodd" /></svg>);

const EquationBalancer: React.FC = () => {
    const [unbalancedEq, setUnbalancedEq] = useState('Fe + H2O -> Fe3O4 + H2');
    const [balancedEq, setBalancedEq] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleBalance = async () => {
        if (!unbalancedEq.trim()) return;
        setIsLoading(true);
        setError('');
        setBalancedEq('');
        try {
            const result = await balanceChemicalEquation(unbalancedEq);
            setBalancedEq(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-card max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-brand-text-primary mb-4">Chemical Equation Balancer</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="unbalanced-eq" className="block text-sm font-medium text-brand-text-secondary mb-1">Unbalanced Equation</label>
                    <input
                        id="unbalanced-eq"
                        type="text"
                        value={unbalancedEq}
                        onChange={(e) => setUnbalancedEq(e.target.value)}
                        placeholder="e.g., H2 + O2 -> H2O"
                        className="w-full bg-brand-surface-light border border-brand-border rounded-md p-3 text-lg font-mono focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                </div>
                
                <button
                    onClick={handleBalance}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-black font-bold rounded-lg hover:bg-brand-primary-hover transition-colors disabled:opacity-50"
                >
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? 'Balancing...' : 'Balance with AI'}
                </button>
                
                {balancedEq && (
                    <div className="animate-fade-in-up">
                        <label className="block text-sm font-medium text-brand-text-secondary mb-1">Balanced Equation</label>
                        <div className="w-full bg-brand-bg border border-brand-border rounded-md p-3 text-lg font-mono text-green-400">
                            {balancedEq}
                        </div>
                    </div>
                )}
                {error && (
                     <div className="text-center p-2 bg-red-500/10 text-red-400 rounded-md text-sm">
                        <strong>Error:</strong> {error}
                     </div>
                )}
            </div>
        </div>
    );
};

export default EquationBalancer;