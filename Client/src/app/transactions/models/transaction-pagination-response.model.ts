import { Transaction } from './transaction.model';

export interface TransactionPaginationResponse {
    transactions: Transaction[];
    totalTransactionsCount: number;
    totalPages: number;
}