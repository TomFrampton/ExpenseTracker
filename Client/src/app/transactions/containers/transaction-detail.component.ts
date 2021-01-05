import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';
import { TransactionService } from '../services/transaction.service';

@Component({
    selector: 'aug-transaction-detail',
    templateUrl: './transaction-detail.component.html'
})
export class TransactionDetailComponent implements OnInit {
    transaction$: Observable<Transaction>;

    constructor(private transactionService: TransactionService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.transaction$ = this.route.paramMap.pipe(
            switchMap(paramMap =>
                this.transactionService.getById(+paramMap.get('id')).pipe(
                    catchError(err => of(null))
                )
            )
        );
    }
}