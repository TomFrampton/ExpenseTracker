import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Id } from '@aug/common/id';

import { Observable, timer } from 'rxjs';
import { tap, map, delay } from 'rxjs/operators';
import { TransactionTableRow } from '../components/transactions-table.component';

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

    selectedTransactions: Transaction[] = [];

    constructor(private transactionService: TransactionService) {}

    ngOnInit() {
        this.transactionRows$ = this.transactionService.getAll().pipe(
            delay(3000),
            tap(() => this.loading = false),
            tap(trans => console.log(trans)),
            tap(trans => this.transactions = trans),
            map(trans => this.mapTransactions(trans))
        );
    }

    onTransactionSelectionChange(ids: Id<Transaction>[]) {
        this.selectedTransactions = ids.map(id => this.transactions.find(x => x.id === id));
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