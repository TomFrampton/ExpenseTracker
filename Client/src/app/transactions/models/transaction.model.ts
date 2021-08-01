import { TransactionCategory } from './transaction-category.model';

export interface Transaction {
    id: number;
    date: Date;
    description: string;
    amount: number;

    category: TransactionCategory;
    subCategory: TransactionCategory;
}