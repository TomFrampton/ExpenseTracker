export class TransactionPeriodCategoryTotalsResponse {
    periodStartMonth: number;
    periodStartYear: number;
    periodStart: Date;
    categoryTotals: CategoryTotal[];
}

interface CategoryTotal {
    categoryId: number;
    totalAmount: number;
}