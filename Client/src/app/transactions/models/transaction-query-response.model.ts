import { Transaction } from './transaction.model';

export interface TransactionQueryResponse {
    transactions: Transaction[];
    totalTransactionsCount: number;
    totalPages: number;
}