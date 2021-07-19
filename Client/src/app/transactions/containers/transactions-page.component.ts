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
    templateUrl: './transactions-page.component.html',
    styleUrls: ['./transactions-page.component.scss']
})
export class TransactionsPageComponent implements OnInit {
    loading = true;

    transactions: Transaction[];
    transactionRows$: Observable<TransactionTableRow[]>;
    transactionCategories$: Observable<TransactionCategory[]>;

    refreshTransactions$ = new Subject<void>();

    selectedTransactions: Transaction[] = [];

    get selectedTransactionIds(): number[] {
        return this.selectedTransactions?.map(x => x.id) || [];
    }

    constructor(private transactionService: TransactionService) {}

    ngOnInit() {
        const getTransactions = () => this.transactionService.getAll();

        this.transactionRows$ = merge(
            getTransactions(),
            this.refreshTransactions$.pipe(switchMap(() => getTransactions()))
        ).pipe(
            delay(3000),
            tap(() => this.loading = false),
            tap(trans => console.log(trans)),
            tap(trans => this.transactions = trans),
            map(trans => this.mapTransactions(trans))
        );

        this.transactionCategories$ = this.transactionService.getCategories().pipe(
            delay(1000)
        );
    }

    onTransactionSelectionChange(ids: Id<Transaction>[]) {
        this.selectedTransactions = ids.map(id => this.transactions.find(x => x.id === id));
    }

    onCategorise(categorisation: TransactionCategorisation) {
        const request = {
            ...categorisation,
            transactionIds: this.selectedTransactionIds
        };

        this.transactionService.categorise(request).subscribe(result => {
            this.loading = true;
            this.refreshTransactions$.next();
        });
    }

    private mapTransactions(transations: Transaction[]): TransactionTableRow[] {
        return transations.map(t => ({
            id: t.id,
            description: t.description,
            date: t.date,
            amount: t.amount,
            category: t.category ? (t.subCategory ? `${t.category} - ${t.subCategory}` : t.category) : '-'
        }))
    }
}