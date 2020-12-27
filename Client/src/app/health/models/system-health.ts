export interface SystemHealth {
    api: ItemHealth;
}

export interface ItemHealth {
    isHealthy: boolean,
    error: string
}