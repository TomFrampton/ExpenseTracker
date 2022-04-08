export interface TransactionCategorisation {
    categoryId: number;
    subCategoryId?: number;
    description: string;
}

export interface TransactionCategorisationRequest extends TransactionCategorisation {
    transactionIds: number[];
}