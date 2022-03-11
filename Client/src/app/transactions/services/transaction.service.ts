import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

import { Transaction } from '../models/transaction.model';
import { TransactionCategory } from '../models/transaction-category.model';
import { TransactionCategorisationRequest } from '../models/transaction-categorisation.model';
import { distinctUntilChanged } from 'rxjs/operators';


@Injectable()
export class TransactionService {
    constructor(private httpClient: HttpClient) {}

    getAll(): Observable<Transaction[]> {
        return this.httpClient.get<Transaction[]>('./transactions');
    }

    getById(transactionId: number): Observable<Transaction> {
        return this.httpClient.get<Transaction>(`./transactions/${transactionId}`);
    }

    getCategories(): Observable<TransactionCategory[]> {
        return this.httpClient.get<TransactionCategory[]>(`./transactions/categories`);
    }

    categorise(request: TransactionCategorisationRequest): Observable<any> {
        return this.httpClient.post(`./transactions/categorise`, request);
    }
}