import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';


@Injectable()
export class TransactionService {
    constructor(private httpClient: HttpClient) {}

    getAll(): Observable<Transaction[]> {
        return this.httpClient.get<Transaction[]>('./transactions');
    }
}