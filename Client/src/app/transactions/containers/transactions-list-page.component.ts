import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { tap, map, switchMap, shareReplay } from 'rxjs/operators';

import { Id } from '@aug/common/id';
import { PaginationSettings, PaginationSummary } from '@aug/common/pagination';

import { TransactionService } from '../services';
import { TransactionTableRow } from '../components';
import { Transaction, TransactionCategorisation, TransactionCategory } from '../models';


@Component({
    templateUrl: './transactions-list-page.component.html',
    styleUrls: ['./transactions-list-page.component.scss']
})
export class TransactionsListPageComponent implements OnInit {
    transactionRows$: Observable<TransactionTableRow[]>;
    transactionCategories$: Observable<TransactionCategory[]>;
    refreshTransactions$ = new Subject<void>();

    pagination$: Observable<PaginationSummary>;
    paginationChange$ = new BehaviorSubject<PaginationSettings>({ pageSize: 5, pageNumber: 1 });

    transactions: Transaction[];
    selectedTransactions: Transaction[] = [];

    transactionsFirstLoad = true;
    transactionsLoading = true;
    transactionCategoriesLoading = true;
    categorising = false;

    get isLoading () {
        return this.transactionsLoading || this.transactionCategoriesLoading || this.categorising;
    }

    get selectedTransactionIds(): number[] {
        return this.selectedTransactions?.map(x => x.id) || [];
    }

    constructor(private transactionService: TransactionService) {}

    ngOnInit() {
        const getTransactions = () => {
            this.transactionsLoading = true;
            const { pageSize, pageNumber } = this.paginationChange$.value;
            return this.transactionService.getPaged(pageSize, pageNumber);
        };

        const transactionsResponse$ = merge(
            this.refreshTransactions$.pipe(switchMap(() => getTransactions())),
            this.paginationChange$.pipe(switchMap(() => getTransactions()))
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
                pageSize: this.paginationChange$.value.pageSize,
                pageNumber: this.paginationChange$.value.pageNumber
            }))
        );

        this.transactionCategories$ = this.transactionService.getCategories().pipe(
            tap(() => this.transactionCategoriesLoading = false)
        );
    }

    onTransactionSelectionChange(ids: Id<Transaction>[]) {
        this.selectedTransactions = ids.map(id => this.transactions.find(x => x.id === id));
    }

    onPaginationChange(settings: PaginationSettings) {
        this.paginationChange$.next(settings);
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
            category: t.category ? (t.subCategory ? `${t.category.name} - ${t.subCategory.name}` : t.category.name) : '-'
        }))
    }
}