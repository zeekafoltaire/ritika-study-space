import React, { useState, useEffect, useCallback } from 'react';
import type { Deck, Card } from '../types';
import { getDueCardsForDeck } from '../services/supabaseService';

interface StudySessionProps {
    deck: Deck;
    onEndSession: () => void;
    onCardReview: (card: Card, quality: 'hard' | 'good' | 'easy') => Promise<void>;
}

const StudySession: React.FC<StudySessionProps> = ({ deck, onEndSession, onCardReview }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionFinished, setSessionFinished] = useState(false);
    
    useEffect(() => {
        const fetchDueCards = async () => {
            setIsLoading(true);
            try {
                const dueCards = await getDueCardsForDeck(deck.id);
                // Shuffle the cards for a random review order
                setCards(dueCards.sort(() => Math.random() - 0.5));
                if (dueCards.length === 0) {
                    setSessionFinished(true);
                }
            } catch (error) {
                alert(`Failed to load cards: ${(error as Error).message}`);
                onEndSession();
            } finally {
                setIsLoading(false);
            }
        };
        fetchDueCards();
    }, [deck.id, onEndSession]);

    const handleReview = async (quality: 'hard' | 'good' | 'easy') => {
        const card = cards[currentIndex];
        if (!card) return;

        await onCardReview(card, quality);
        
        // Move to the next card
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            setSessionFinished(true);
        }
    };
    
    if (isLoading) {
        return <div className="p-8 text-center text-brand-text-secondary">Loading study session...</div>
    }
    
    if (sessionFinished) {
        return (
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-8 text-center shadow-card animate-fade-in-up flex flex-col items-center justify-center min-h-[50vh]">
                 <h2 className="text-2xl font-bold text-brand-primary">Session Complete!</h2>
                 <p className="mt-2 text-brand-text-secondary">You've reviewed all due cards for this deck. Great work!</p>
                 <button onClick={onEndSession} className="mt-6 bg-brand-primary text-black font-semibold py-2 px-6 rounded-lg hover:bg-brand-primary-hover transition-colors">
                     Back to Decks
                 </button>
            </div>
        )
    }

    const currentCard = cards[currentIndex];

    return (
         <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-card animate-fade-in-up flex flex-col">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-brand-text-primary">{deck.name}</h2>
                 <span className="font-mono text-sm text-brand-text-secondary">Card {currentIndex + 1} of {cards.length}</span>
            </div>

            {/* Card */}
            <div className="relative w-full h-80 perspective-1000 my-4">
                <div 
                    className={`w-full h-full absolute transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden bg-brand-bg border border-brand-border rounded-lg flex items-center justify-center p-6">
                        <p className="text-2xl font-semibold text-center text-brand-text-primary whitespace-pre-wrap">{currentCard.front}</p>
                    </div>
                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-brand-bg border border-brand-border rounded-lg flex items-center justify-center p-6">
                        <p className="text-xl text-center text-brand-text-primary whitespace-pre-wrap">{currentCard.back}</p>
                    </div>
                </div>
            </div>

            {isFlipped ? (
                <div className="mt-4 grid grid-cols-3 gap-4 animate-fade-in-up">
                    <button onClick={() => handleReview('hard')} className="py-3 px-4 bg-red-500/20 text-red-400 font-bold rounded-lg border-2 border-red-500/40 hover:bg-red-500/40 transition-colors">Hard</button>
                    <button onClick={() => handleReview('good')} className="py-3 px-4 bg-blue-500/20 text-blue-400 font-bold rounded-lg border-2 border-blue-500/40 hover:bg-blue-500/40 transition-colors">Good</button>
                    <button onClick={() => handleReview('easy')} className="py-3 px-4 bg-green-500/20 text-green-400 font-bold rounded-lg border-2 border-green-500/40 hover:bg-green-500/40 transition-colors">Easy</button>
                </div>
            ) : (
                <button onClick={() => setIsFlipped(true)} className="mt-4 py-3 px-4 bg-brand-primary text-black font-bold rounded-lg hover:bg-brand-primary-hover transition-colors">
                    Flip Card
                </button>
            )}

             <button onClick={onEndSession} className="mt-8 text-sm text-brand-text-secondary hover:text-brand-primary transition-colors">End Session</button>
        </div>
    )
};

export default StudySession;
