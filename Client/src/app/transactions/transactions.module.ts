import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransactionService } from './services/transaction.service';
import { TransactionsPageComponent } from './containers/transactions-page.component';
import { TransactionsTableComponent } from './components/transactions-table.component';
import { CommonModule } from '@angular/common';
import { TransactionDetailComponent } from './containers/transaction-detail.component';
import { TransactionDetailFormComponent } from './components/transaction-detail-form.component';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes: Routes = [
    { path: 'transactions', component: TransactionsPageComponent, children: [
        { path: ':id', component: TransactionDetailComponent }
    ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ReactiveFormsModule,

        MatCardModule,
        MatDividerModule,
        MatTableModule,
        MatButtonModule,
        MatCheckboxModule
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