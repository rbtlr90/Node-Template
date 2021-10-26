export interface ModelResult<T> {
    ok: boolean;
    n: number;
    items: T[];
}

export interface ServiceResult<T> {
    count: number;
    results: T[];
}

