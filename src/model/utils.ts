import { ModelResult } from '../types';

export function convertToArray<T>(document: T | T[]): T[] {
    const docs = Array.isArray(document) ? document : [document];
    return docs;
}

export function formatOutput<T>(items: T[], numAfftected?: number, ok?: boolean): ModelResult<T> {
    return {
        ok: ok !== false ? true : false,
        n: numAfftected ? numAfftected : items.length,
        items: items,
    };
}

export function convertToResult<T>(document: T | T[], ok?: boolean): ModelResult<T> {
    return formatOutput(convertToArray<T>(document), undefined, ok);
}

export function createDeleteResult(numAffected: number, ok?: boolean): ModelResult<never> {
    return formatOutput([], numAffected, ok);
}