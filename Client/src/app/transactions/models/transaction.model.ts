import { TransactionCategory } from './transaction-category.model';

export interface Transaction {
    id: number;
    date: Date;
    description: string;
    creditAmount: number;
    debitAmount: number;

    category: TransactionCategory;
    subCategory: TransactionCategory;
}