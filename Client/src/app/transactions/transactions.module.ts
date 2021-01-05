import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransactionService } from './services/transaction.service';
import { TransactionsPageComponent } from './containers/transactions-page.component';
import { TransactionsTableComponent } from './components/transactions-table.component';
import { CommonModule } from '@angular/common';
import { TransactionDetailComponent } from './containers/transaction-detail.component';
import { TransactionDetailFormComponent } from './components/transaction-detail-form.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    { path: 'transactions', component: TransactionsPageComponent, children: [
        { path: ':id', component: TransactionDetailComponent }
    ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ReactiveFormsModule
    ],

    declarations: [
        // Containers
        TransactionsPageComponent,
        TransactionDetailComponent,

        // Components
        TransactionsTableComponent,
        TransactionDetailFormComponent,
    ],

    providers: [
        TransactionService
    ]
})
export class TransactionsModule { }