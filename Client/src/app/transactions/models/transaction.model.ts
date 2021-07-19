export interface Transaction {
    id: number;
    date: Date;
    description: string;
    amount: number;

    // To refactor
    category: string;
    subCategory: string;
}