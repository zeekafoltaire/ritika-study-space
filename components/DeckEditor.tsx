import React, { useState, useEffect, useCallback } from 'react';
import type { Deck, Card } from '../types';
import { getCardsForDeck, addDocument, updateDocument, deleteDocument } from '../services/supabaseService';

const PlusIcon: React.FC<{className?:string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>);
const TrashIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>);
const EditIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>);


interface DeckEditorProps {
    deck: Deck;
    onBack: () => void;
}

const DeckEditor: React.FC<DeckEditorProps> = ({ deck, onBack }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newFront, setNewFront] = useState('');
    const [newBack, setNewBack] = useState('');

    const fetchCards = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedCards = await getCardsForDeck(deck.id);
            setCards(fetchedCards);
        } catch(error) {
            alert(`Failed to fetch cards: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    }, [deck.id]);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFront.trim() || !newBack.trim()) return;
        
        try {
            const newCardData = {
                deck_id: deck.id,
                front: newFront,
                back: newBack,
                due_date: new Date().toISOString(),
                interval: 0,
                ease_factor: 2.5,
            };
            const newCard = await addDocument('cards', newCardData);
            setCards(prev => [...prev, newCard]);
            setNewFront('');
            setNewBack('');
        } catch (error) {
            alert(`Failed to add card: ${(error as Error).message}`);
        }
    };
    
    const handleDeleteCard = async (id: number) => {
        if(window.confirm("Delete this card?")) {
            try {
                await deleteDocument('cards', id);
                setCards(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                alert(`Failed to delete card: ${(error as Error).message}`);
            }
        }
    }

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-card animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="flex items-center gap-2 text-brand-primary font-semibold hover:text-brand-primary-hover transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Back to Decks
                </button>
                <h2 className="text-xl font-bold text-brand-text-primary">Edit Deck: {deck.name}</h2>
            </div>
            
            {/* Add Card Form */}
            <form onSubmit={handleAddCard} className="mb-6 p-4 bg-brand-bg rounded-lg space-y-3 border border-brand-border">
                <h3 className="font-semibold text-lg">Add New Card</h3>
                <textarea value={newFront} onChange={e => setNewFront(e.target.value)} placeholder="Card Front (Question/Term)" rows={2} className="w-full bg-brand-surface-light border border-brand-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"></textarea>
                <textarea value={newBack} onChange={e => setNewBack(e.target.value)} placeholder="Card Back (Answer/Definition)" rows={3} className="w-full bg-brand-surface-light border border-brand-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"></textarea>
                <button type="submit" className="w-full flex justify-center items-center gap-2 bg-brand-primary text-black font-semibold rounded-md py-2 hover:bg-brand-primary-hover transition-colors"><PlusIcon className="w-5 h-5"/>Add Card</button>
            </form>

            {/* Card List */}
            <div className="space-y-2">
                <h3 className="font-semibold text-lg mb-2">Cards in this Deck ({cards.length})</h3>
                {isLoading ? (
                    <p className="text-brand-text-secondary">Loading cards...</p>
                ) : cards.length > 0 ? (
                    cards.map(card => (
                        <div key={card.id} className="bg-brand-bg p-3 rounded-lg flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <p className="font-semibold text-brand-text-primary break-words whitespace-pre-wrap">{card.front}</p>
                                <p className="text-brand-text-secondary break-words whitespace-pre-wrap mt-1 pt-1 border-t border-brand-border">{card.back}</p>
                            </div>
                            <button onClick={() => handleDeleteCard(card.id)} className="text-brand-text-secondary hover:text-brand-urgent p-1 rounded-md"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    ))
                ) : (
                    <p className="text-brand-text-secondary text-center py-4">No cards in this deck yet. Add one above!</p>
                )}
            </div>
        </div>
    );
};

export default DeckEditor;
