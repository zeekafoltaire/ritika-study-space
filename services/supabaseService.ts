

import { supabase } from './supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import type { Database, Card } from '../types';

// Define a type for our table names from the database schema for better type safety.
type TableName = keyof Database['public']['Tables'];

// This function will now throw a detailed error to be caught by the calling function.
const checkError = (error: PostgrestError | null, context: string) => {
    if (error) {
        // "PGRST116" is the code for when .single() finds no rows, which is not always a true error.
        if(error.code === 'PGRST116') {
            console.log(`Supabase info in ${context}: No row found.`, error);
            return; // Don't throw for "no rows" on a .single() call
        }
        const fullMessage = `Supabase error in ${context}: ${error.message}`;
        console.error(fullMessage, error);
        // Throw the error so it can be handled by the component.
        throw new Error(fullMessage);
    }
}

export const getCollection = async <K extends TableName>(
    collectionName: K, 
    orderField?: string, 
    orderDirection: 'asc' | 'desc' = 'asc'
): Promise<Database['public']['Tables'][K]['Row'][]> => {
    // This function is designed to throw on error, to be caught by a central handler in App.tsx
    let query = supabase.from(collectionName).select('*');
    if (orderField) {
        query = query.order(orderField, { ascending: orderDirection === 'asc' });
    }
    const { data, error } = await query;
    checkError(error, `getCollection('${collectionName}')`);
    return data || [];
};

export const addDocument = async <K extends TableName>(
    collectionName: K,
    data: Database['public']['Tables'][K]['Insert']
): Promise<Database['public']['Tables'][K]['Row']> => {
    const { data: result, error } = await supabase
        .from(collectionName)
        .insert([data] as any)
        .select()
        .single();

    checkError(error, `addDocument('${collectionName}')`);
    if (!result) {
        throw new Error(`Document creation in '${collectionName}' did not return a result.`);
    }
    return result as Database['public']['Tables'][K]['Row'];
};

export const updateDocument = async <K extends TableName>(
    collectionName: K,
    id: number,
    data: Database['public']['Tables'][K]['Update']
): Promise<void> => {
    const { error, count } = await supabase
        .from(collectionName)
        .update(data as any, { count: 'exact' }) // Request the count of affected rows
        .eq('id', id as any);

    checkError(error, `updateDocument('${collectionName}')`);
    
    // If no rows were updated, it's a silent failure (e.g. RLS or item not found).
    if (count === 0) {
        console.warn(`Attempted to update a document in '${collectionName}' with id ${id}, but no rows were affected. The item may not exist or RLS policies might be preventing access.`);
    }
};


export const deleteDocument = async <K extends TableName>(collectionName: K, id: number): Promise<void> => {
    const { error, count } = await supabase
        .from(collectionName)
        .delete({ count: 'exact' }) // Request the count of affected rows
        .eq('id', id as any);
    
    checkError(error, `deleteDocument('${collectionName}')`);

    // If no rows were deleted, it's a silent failure (e.g. RLS or item not found).
    if (count === 0) {
        throw new Error(`Failed to delete document in '${collectionName}' with id ${id}. The item was not found or you don't have permission.`);
    }
};

export const getCardsForDeck = async (deckId: number): Promise<Card[]> => {
    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deckId)
        .order('created_at', { ascending: true });
    
    checkError(error, `getCardsForDeck('${deckId}')`);
    return (data as Card[]) || [];
};

export const getDueCardsForDeck = async (deckId: number): Promise<Card[]> => {
    const today = new Date().toISOString();
    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deckId)
        .lte('due_date', today); // lte = less than or equal to

    checkError(error, `getDueCardsForDeck('${deckId}')`);
    return (data as Card[]) || [];
};