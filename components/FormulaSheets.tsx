import React, { useState, useMemo } from 'react';
import type { Formula, Subject } from '../types';
import { getAiGeneratedFormulas } from '../services/aiService';

// --- Icons ---
const PlusIcon: React.FC<{className?:string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>);
const SparklesIcon: React.FC<{className?:string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l.645 1.558a.75.75 0 00.704.518l1.703.247c.82.119 1.171 1.077.536 1.651l-1.23 1.193a.75.75 0 00-.215.828l.292 1.697c.145.839-.715 1.488-1.453 1.075l-1.52-.798a.75.75 0 00-.832 0l-1.52.798c-.738.413-1.6.264-1.453-1.075l.292-1.697a.75.75 0 00-.215-.828l-1.23-1.193c-.635-.574-.284-1.532.536-1.651l1.703-.247a.75.75 0 00.704-.518l.645-1.558z" clipRule="evenodd" /></svg>);
const TrashIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.5 3a.5.5 0 00-1 0v1H4a.5.5 0 000 1h1v9a2 2 0 002 2h6a2 2 0 002-2V5h1a.5.5 0 000-1h-1.5V3a.5.5 0 00-1 0v1H7V3zM8 5h4v9H8V5z" /></svg>);

interface FormulaSheetsProps {
    formulas: Formula[];
    subjects: Subject[];
    onAddFormula: (subject: string, topic: string, formula_text: string, description: string) => Promise<void>;
    onDeleteFormula: (id: number) => Promise<void>;
}

const FormulaSheets: React.FC<FormulaSheetsProps> = ({ formulas, subjects, onAddFormula, onDeleteFormula }) => {
    const [selectedSubject, setSelectedSubject] = useState<string | null>(subjects[0]?.name || null);
    const [isGenerating, setIsGenerating] = useState(false);

    const subjectList = useMemo(() => {
        const formulaSubjects = new Set(formulas.map(f => f.subject));
        subjects.forEach(s => formulaSubjects.add(s.name));
        return Array.from(formulaSubjects).sort();
    }, [formulas, subjects]);
    
    const displayedFormulas = useMemo(() => {
        return formulas.filter(f => f.subject === selectedSubject);
    }, [formulas, selectedSubject]);

    const handleGenerateWithAI = async () => {
        if (!selectedSubject) {
            alert("Please select a subject first.");
            return;
        }
        const topic = prompt(`Enter the topic within ${selectedSubject} to generate formulas for:`);
        if (!topic || !topic.trim()) return;

        setIsGenerating(true);
        try {
            const generated = await getAiGeneratedFormulas(topic.trim());
            const addPromises = generated.map(f => 
                onAddFormula(selectedSubject, topic.trim(), f.formula_text, f.description)
            );
            await Promise.all(addPromises);
        } catch (error) {
            alert(`AI generation failed: ${(error as Error).message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = (id: number) => {
        if(window.confirm("Delete this formula?")) {
            onDeleteFormula(id);
        }
    }

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-card h-full flex flex-col md:flex-row gap-6">
            {/* Left Panel: Subjects */}
            <div className="w-full md:w-1/4 flex-shrink-0 md:border-r border-b md:border-b-0 border-brand-border md:pr-6 pb-4 md:pb-0">
                <h3 className="text-lg font-bold mb-4">Subjects</h3>
                <ul className="space-y-1">
                    {subjectList.map(subject => (
                        <li key={subject}>
                            <button
                                onClick={() => setSelectedSubject(subject)}
                                className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                                    selectedSubject === subject ? 'bg-brand-primary text-black' : 'text-brand-text-secondary hover:bg-brand-surface-light'
                                }`}
                            >
                                {subject}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Panel: Formulas */}
            <div className="flex-1 min-w-0">
                {!selectedSubject ? (
                    <div className="flex items-center justify-center h-full text-brand-text-secondary">
                        <p>Select a subject to view its formulas.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold text-brand-text-primary">{selectedSubject} Formulas</h2>
                             <button
                                onClick={handleGenerateWithAI}
                                disabled={isGenerating}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-brand-accent-light text-brand-accent font-semibold rounded-lg hover:bg-brand-primary/30 transition-colors disabled:opacity-50"
                            >
                                <SparklesIcon className="w-4 h-4" />
                                {isGenerating ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                        
                        <div className="space-y-3 overflow-y-auto custom-scrollbar h-[calc(100%-4rem)] pr-2">
                            {displayedFormulas.length > 0 ? (
                                displayedFormulas.map(formula => (
                                    <div key={formula.id} className="bg-brand-bg p-4 rounded-lg border border-brand-border group">
                                        <div className="flex justify-between items-start">
                                            <code className="text-lg font-bold text-brand-primary">{formula.formula_text}</code>
                                            <button onClick={() => handleDelete(formula.id)} className="p-1 text-brand-text-secondary hover:text-brand-urgent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                        <p className="text-sm text-brand-text-secondary mt-1">{formula.description}</p>
                                        <p className="text-xs font-mono text-brand-text-secondary/50 mt-2">{formula.topic}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-brand-text-secondary">No formulas for {selectedSubject} yet.</p>
                                    <p className="text-sm text-brand-text-secondary/70">Use the "Generate with AI" button to get started!</p>
                                </div>
                            )}
                            {isGenerating && (
                                <div className="flex items-center justify-center gap-2 text-brand-text-secondary p-4">
                                    <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span>AI is thinking...</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FormulaSheets;