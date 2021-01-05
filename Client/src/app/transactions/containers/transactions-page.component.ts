import { Component, OnInit } from '@angular/core';

import { Observable, timer } from 'rxjs';
import { tap, map, delay } from 'rxjs/operators';
import { TransactionTableRow } from '../components/transactions-table.component';

import { Transaction } from '../models/transaction.model';
import { TransactionService } from '../services/transaction.service';


@Component({
    templateUrl: './transactions-page.component.html'
})
export class TransactionsPageComponent implements OnInit {
    loading = true;

    transactions$: Observable<TransactionTableRow[]>;

    constructor(private transactionService: TransactionService) {}

    ngOnInit() {
        this.transactions$ = this.transactionService.getAll().pipe(
            delay(3000),
            tap(() => this.loading = false),
            tap(trans => console.log(trans)),
            map(trans => this.mapTransactions(trans))
        );
    }

    private mapTransactions(transations: Transaction[]): TransactionTableRow[] {
        return transations.map(t => ({
            id: t.id,
            description: t.description,
            date: t.date,
            amount: t.amount
        }))
    }
}