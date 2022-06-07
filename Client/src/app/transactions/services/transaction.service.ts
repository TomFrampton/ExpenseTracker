import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Transaction, TransactionCategorisationRequest, TransactionCategorisationSummaryResponse, TransactionCategory, TransactionPeriodCategoryTotalsResponse, TransactionQueryResponse } from '../models';
import { delay } from 'rxjs/operators';

import { TransactionQueryParams } from '../containers';


@Injectable()
export class TransactionService {
    constructor(private httpClient: HttpClient) {}

    getList(queryParams: TransactionQueryParams = {}) {
        const params = this.buildQueryParams(queryParams);

        return this.httpClient.get<TransactionQueryResponse>('./transactions', { params }).pipe(delay(500));
    }

    getById(transactionId: number): Observable<Transaction> {
        return this.httpClient.get<Transaction>(`./transactions/${transactionId}`);
    }

    getCategories(): Observable<TransactionCategory[]> {
        return this.httpClient.get<TransactionCategory[]>('./transactions/categories');
    }

    getEarliestYear(): Observable<number> {
        return this.httpClient.get<number>('./transactions/earliest-year');
    }

    getCategorisationSummary() : Observable<TransactionCategorisationSummaryResponse> {
        return this.httpClient.get<TransactionCategorisationSummaryResponse>('./transactions/categorisation-summary');
    }

    getMonthlyCategoryTotals(): Observable<TransactionPeriodCategoryTotalsResponse[]> {
        return this.httpClient.get<TransactionPeriodCategoryTotalsResponse[]>('./transactions/monthly-category-totals').pipe(delay(500));
    }

    categorise(request: TransactionCategorisationRequest): Observable<any> {
        return this.httpClient.post('./transactions/categorise', request).pipe(delay(2000));
    }

    upload(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return this.httpClient.post('./transactions/upload', formData);

    }

    private buildQueryParams(params: any) {
        return Object.keys(params).reduce((result, key) => {
            const value = params[key];

            if (value !== null && value !== undefined && value !== '') {
                return { ...result, [key]: value.toString() }
            }

            return result;
        }, {});
    }
}