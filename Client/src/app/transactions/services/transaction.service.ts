import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Transaction, TransactionCategorisationRequest, TransactionCategory, TransactionQueryResponse } from '../models';
import { delay } from 'rxjs/operators';

import { TransactionQueryParams } from '../containers';


@Injectable()
export class TransactionService {
    constructor(private httpClient: HttpClient) {}

    getList(queryParams: TransactionQueryParams = {}) {
        const params = {
            pageSize: queryParams.pageSize.toString(),
            pageNumber: queryParams.pageNumber.toString(),
            searchTerm: queryParams.searchTerm || '',
            dateSortDirection: queryParams.dateSortDirection || ''
        };

        return this.httpClient.get<TransactionQueryResponse>('./transactions', { params }).pipe(delay(1000));
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