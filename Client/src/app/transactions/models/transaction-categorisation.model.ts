export interface TransactionCategorisation {
    categoryId: number;
    subCategoryId?: number;
}

export interface TransactionCategorisationRequest extends TransactionCategorisation {
    transactionIds: number[];
}