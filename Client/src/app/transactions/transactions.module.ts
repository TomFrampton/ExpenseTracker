import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransactionService } from './services/transaction.service';
import { TransactionsPageComponent } from './containers/transactions-page.component';
import { TransactionsTableComponent } from './components/transactions-table.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    { path: 'transactions', component: TransactionsPageComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule
    ],

    declarations: [
        TransactionsPageComponent,

        TransactionsTableComponent
    ],

    providers: [
        TransactionService
    ]
})
export class TransactionsModule { }