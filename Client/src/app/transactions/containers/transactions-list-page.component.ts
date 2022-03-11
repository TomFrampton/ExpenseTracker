import { Component, OnInit } from '@angular/core';
import { Id } from '@aug/common/id';

import { merge, Observable, Subject } from 'rxjs';
import { tap, map, delay, switchMap } from 'rxjs/operators';

import { TransactionTableRow } from '../components/transactions-table.component';
import { TransactionCategorisation } from '../models/transaction-categorisation.model';
import { TransactionCategory } from '../models/transaction-category.model';
import { Transaction } from '../models/transaction.model';
import { TransactionService } from '../services/transaction.service';


@Component({
    templateUrl: './transactions-list-page.component.html',
    styleUrls: ['./transactions-list-page.component.scss']
})
export class TransactionsListPageComponent implements OnInit {
    transactionRows$: Observable<TransactionTableRow[]>;
    transactionCategories$: Observable<TransactionCategory[]>;
    refreshTransactions$ = new Subject<void>();

    transactions: Transaction[];
    selectedTransactions: Transaction[] = [];

    transactionsLoading = true;
    transactionCategoriesLoading = true;
    categorising = false;

    get isLoading () {
        return this.transactionsLoading || this.transactionCategoriesLoading || this.categorising;
    }

    get selectedTransactionIds(): number[] {
        return this.selectedTransactions?.map(x => x.id) || [];
    }

    constructor(private transactionService: TransactionService) {
        window['sut'] = this;
    }

    ngOnInit() {
        const getTransactions = () => {
            this.transactionsLoading = true;
            return this.transactionService.getAll();
        };

        this.transactionRows$ = merge(
            getTransactions(),
            this.refreshTransactions$.pipe(switchMap(() => getTransactions()))
        ).pipe(
            delay(2000),
            tap(() => this.transactionsLoading = false),
            tap(trans => this.transactions = trans),
            map(trans => this.mapTransactions(trans))
        );

        this.transactionCategories$ = this.transactionService.getCategories().pipe(
            delay(1000),
            tap(() => this.transactionCategoriesLoading = false),
        );
    }

    onTransactionSelectionChange(ids: Id<Transaction>[]) {
        this.selectedTransactions = ids.map(id => this.transactions.find(x => x.id === id));
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
            amount: t.amount,
            category: t.category ? (t.subCategory ? `${t.category.name} - ${t.subCategory.name}` : t.category.name) : '-'
        }))
    }
}