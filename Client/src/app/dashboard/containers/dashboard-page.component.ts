import { Component, OnInit } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { TransactionService } from '@app/transactions/services';
import { TransactionCategorisationSummaryResponse } from '@app/transactions/models';

import { DashboardExpenditureLineChartData } from '../components';

@Component({
    selector: 'app-dashboard-page',
    templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {

    categorisationSummary$: Observable<TransactionCategorisationSummaryResponse>;
    monthlyExpenditureData$: Observable<DashboardExpenditureLineChartData>;

    monthlyExpenditureDataLoading = true;

    constructor(private transactionService: TransactionService) {}

    ngOnInit() {
        this.categorisationSummary$ = this.transactionService.getCategorisationSummary();

        const categories$ = this.transactionService.getCategories();
        const monthlyCategoryTotals$ = this.transactionService.getMonthlyCategoryTotals();

        this.monthlyExpenditureData$ = combineLatest([categories$, monthlyCategoryTotals$]).pipe(
            map(([categories, totals]) => {
                const months = totals.map(total => +total.periodStart);
                const firstMonth = new Date(Math.min(...months));
                const lastMonth = new Date(Math.max(...months));

                // Reduce 2D array to array of category IDs then get the distinct ones
                const categoryIds = [...new Set(
                    totals.reduce((result, currentMonth) =>
                        result.concat(currentMonth.categoryTotals.map(x => x.categoryId)), [])
                    )];

                const monthSerie = [];

                const categorySeries = {};
                categoryIds.forEach(id => categorySeries[id] = []);

                let currentMonth = new Date(firstMonth);

                while (currentMonth <= lastMonth) {
                    monthSerie.push(currentMonth);

                    const currentMonthTotals = totals.find(x => x.periodStartMonth === currentMonth.getMonth() + 1 && x.periodStartYear === currentMonth.getFullYear());

                    for (var id of categoryIds) {
                        const currentMonthCategoryTotal = currentMonthTotals?.categoryTotals.find(x => x.categoryId === id);

                        categorySeries[id].push(currentMonthCategoryTotal?.totalAmount || 0);
                    }

                    currentMonth.setMonth(currentMonth.getMonth() + 1);
                }

                const data = {
                    firstMonth: {
                        month: firstMonth.getMonth(),
                        year: firstMonth.getFullYear()
                    },
                    series: categoryIds.map(id => ({
                        name: categories.find(x => x.id === id).name,
                        data: categorySeries[id]
                    }))
                };

                return data;
            }),
            tap(() => this.monthlyExpenditureDataLoading = false)
        );
    }
}