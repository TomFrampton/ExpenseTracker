import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Transaction, TransactionCategorisationRequest, TransactionCategory, TransactionPaginationResponse } from '../models';
import { delay } from 'rxjs/operators';


@Injectable()
export class TransactionService {
    constructor(private httpClient: HttpClient) {}

    getPaged(pageSize: number, pageNumber = 1) {
        const params = {
            pageSize: pageSize.toString(),
            pageNumber: pageNumber.toString()
        };

        return this.httpClient.get<TransactionPaginationResponse>('./transactions', { params });
    }

    getById(transactionId: number): Observable<Transaction> {
        return this.httpClient.get<Transaction>(`./transactions/${transactionId}`);
    }

    getCategories(): Observable<TransactionCategory[]> {
        return this.httpClient.get<TransactionCategory[]>('./transactions/categories');
    }

    categorise(request: TransactionCategorisationRequest): Observable<any> {
        return this.httpClient.post('./transactions/categorise', request).pipe(delay(2000));
    }

    upload(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient.post('./transactions/upload', formData);

    }
}