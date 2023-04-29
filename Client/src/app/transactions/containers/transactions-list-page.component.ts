import { Component, OnInit } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { tap, map, switchMap, shareReplay } from 'rxjs/operators';

import { Id } from '@app/common/id';
import { PaginationSettings, PaginationSummary } from '@app/common/pagination';

import { TransactionService } from '../services';
import { TransactionTableRow } from '../components';
import { Transaction, TransactionCategorisation, TransactionCategory } from '../models';
import { TransactionType } from '../enums';

export interface TransactionQueryParams {
    pageSize?: number;
    pageNumber?: number;
    searchTerm?: string;
    dateSortDirection?: string;
    type?: string;
    year?: number;
}

@Component({
    templateUrl: './transactions-list-page.component.html',
    styleUrls: ['./transactions-list-page.component.scss']
})
export class TransactionsListPageComponent implements OnInit {
    private readonly refreshTransactions$ = new Subject<void>();
    private readonly queryChange$ = new BehaviorSubject<TransactionQueryParams>({
        pageSize: 5, pageNumber: 1, searchTerm: null, dateSortDirection: null, type: TransactionType.all.code });

    transactionRows$: Observable<TransactionTableRow[]>;
    transactionCategories$: Observable<TransactionCategory[]>;
    searchResultSummary$: Observable<string>;
    pagination$: Observable<PaginationSummary>;
    years$: Observable<number[]>;

    transactions: Transaction[];
    selectedTransactions: Transaction[] = [];

    transactionsFirstLoad = true;
    transactionsLoading = true;
    transactionCategoriesLoading = true;
    transactionYearsLoading = true;
    categorising = false;

    get isLoading() {
        return this.transactionsLoading || this.transactionCategoriesLoading || this.categorising || this.transactionYearsLoading;
    }

    get selectedTransactionIds(): number[] {
        return this.selectedTransactions?.map(x => x.id) || [];
    }

    get selectedType() {
        return TransactionType.fromCode(this.queryChange$.value.type);
    }

    get selectedYear() {
        return this.queryChange$.value.year || null;
    }

    constructor(private transactionService: TransactionService, private snackBar: MatSnackBar) {}

    ngOnInit() {
        const getTransactions = () => {
            this.transactionsLoading = true;
            return this.transactionService.getList(this.queryChange$.value);
        };

        // Refresh transactions when we trigger a manual refresh or the search parameters are changed
        const transactionsResponse$ = merge(
            this.refreshTransactions$.pipe(switchMap(() => getTransactions())),
            this.queryChange$.pipe(switchMap(() => getTransactions()))
        ).pipe(
            shareReplay(1)
        );

        this.transactionRows$ = transactionsResponse$.pipe(
            tap(() => {
                this.transactionsFirstLoad = false
                this.transactionsLoading = false;
            }),
            tap(response => this.transactions = response.transactions),
            map(response => this.mapTransactions(response.transactions))
        );

        this.pagination$ = transactionsResponse$.pipe(
            map(response => ({
                totalPages: response.totalPages,
                totalItems: response.totalTransactionsCount,
                pageSize: this.queryChange$.value.pageSize,
                pageNumber: this.queryChange$.value.pageNumber
            }))
        );

        this.searchResultSummary$ = transactionsResponse$.pipe(
            map(response => this.queryChange$.value.searchTerm
                ? `${response.totalTransactionsCount} results for "<b>${this.queryChange$.value.searchTerm}</b>"`
                : null
            )
        );

        this.transactionCategories$ = this.transactionService.getCategories().pipe(
            tap(() => this.transactionCategoriesLoading = false)
        );

        this.years$ = this.transactionService.getEarliestYear().pipe(
            map(earliestYear => {
                const years = [];
                const currentYear = new Date().getFullYear();

                if (earliestYear) {
                    for (let y = earliestYear; y <= currentYear; y++) {
                        years.push(y);
                    }
                }

                return years;
            }),
            tap(() => this.transactionYearsLoading = false)
        );
    }

    onTransactionSelectionChange(ids: Id<Transaction>[]) {
        this.selectedTransactions = ids.map(id => this.transactions.find(x => x.id === id));
    }

    onPaginationChange(settings: PaginationSettings) {
        this.queryChange$.next({
            ...this.queryChange$.value,
            ...settings
        });
    }

    onDateSortChange(dateSortDirection: SortDirection) {
        this.queryChange$.next({
            ...this.queryChange$.value,
            dateSortDirection
        });
    }

    onTextSearch(text: string) {
        this.queryChange$.next({
            ...this.queryChange$.value,
            searchTerm: text
        });
    }

    onTransactionTypeChange(type: TransactionType) {
        this.queryChange$.next({
            ...this.queryChange$.value,
            type: type?.code
        });
    }

    onYearChange(year: number) {
        this.queryChange$.next({
            ...this.queryChange$.value,
            year
        })
    }

    onCategorise(categorisation: TransactionCategorisation) {
        if (!this.isLoading) {
            const request = {
                ...categorisation,
                transactionIds: this.selectedTransactionIds
            };

            this.categorising = true;

            this.transactionService.categorise(request).subscribe(result => {
                this.categorising = false;
                const transactionsCount = request.transactionIds.length;
                this.snackBar.open(`${transactionsCount} transaction${transactionsCount !== 1 ? 's' : ''} categorised`, null, { duration: 2000 });
                this.refreshTransactions$.next();
            });
        }
    }

    private mapTransactions(transations: Transaction[]): TransactionTableRow[] {
        return transations.map(t => ({
            id: t.id,
            description: t.description,
            date: t.date,
            creditAmount: t.creditAmount,
            debitAmount: t.debitAmount,
            category: t.category ? (t.subCategory ? `${t.category.name} - ${t.subCategory.name}` : t.category.name) : '-',
            userSuppliedDescription: t.userSuppliedDescription,
            isCategorised: t.isCategorised
        }))
    }
}