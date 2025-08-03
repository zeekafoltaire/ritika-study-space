import React from 'react';
import type { Deck } from '../types';

const PlusIcon: React.FC<{className?:string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>);
const BookOpenIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>);
const EditIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>);
const TrashIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>);

interface RevisionHubProps {
    decks: Deck[];
    onAddDeck: (name: string, subject: string) => Promise<void>;
    onDeleteDeck: (id: number) => Promise<void>;
    onSelectDeck: (deck: Deck) => void;
    onStudyDeck: (deck: Deck) => void;
}

const RevisionHub: React.FC<RevisionHubProps> = ({ decks, onAddDeck, onDeleteDeck, onSelectDeck, onStudyDeck }) => {
    
    const handleAdd = () => {
        const name = prompt("Enter new deck name (e.g., 'Physics - Chapter 4'):");
        if (name && name.trim()) {
            const subject = prompt("Enter subject for this deck:", "General");
            if (subject && subject.trim()) {
                onAddDeck(name.trim(), subject.trim());
            }
        }
    };

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this deck and all its cards? This is irreversible.")) {
            onDeleteDeck(id);
        }
    };

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-card">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-brand-text-primary">Revision Hub</h2>
                <button onClick={handleAdd} className="flex items-center gap-2 text-sm text-white bg-brand-primary font-semibold hover:bg-brand-primary-hover py-2 px-4 rounded-lg transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    New Deck
                </button>
            </div>

            {decks.length === 0 ? (
                <div className="text-center py-16">
                    <BookOpenIcon className="w-16 h-16 mx-auto text-brand-text-secondary opacity-50" />
                    <h3 className="mt-4 text-xl font-semibold text-brand-text-primary">Your Revision Hub is Empty</h3>
                    <p className="mt-2 text-brand-text-secondary">Create your first flashcard deck to start memorizing key concepts.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decks.map(deck => (
                        <div key={deck.id} className="bg-brand-bg border border-brand-border rounded-lg p-5 flex flex-col justify-between group">
                            <div>
                                <h3 className="font-bold text-lg text-brand-text-primary truncate">{deck.name}</h3>
                                <p className="text-sm text-brand-text-secondary">{deck.subject}</p>
                            </div>
                            <div className="mt-6 flex justify-between items-center">
                                <button onClick={() => onStudyDeck(deck)} className="flex-1 text-center bg-brand-primary text-black font-bold py-2 px-4 rounded-md hover:bg-brand-primary-hover transition-colors">
                                    Study
                                </button>
                                <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onSelectDeck(deck)} className="p-2 text-brand-text-secondary hover:text-brand-primary hover:bg-brand-surface-light rounded-md"><EditIcon className="w-5 h-5" /></button>
                                    <button onClick={(e) => handleDelete(e, deck.id)} className="p-2 text-brand-text-secondary hover:text-brand-urgent hover:bg-brand-surface-light rounded-md"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RevisionHub;
