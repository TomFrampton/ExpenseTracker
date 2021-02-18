import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TransactionService } from '@aug/transactions/services/transaction.service';
import { TransactionsPageComponent } from '@aug/transactions/containers/transactions-page.component';
import { TransactionsTableComponent } from '@aug/transactions/components/transactions-table.component';
import { TransactionDetailFormComponent } from '@aug/transactions/components/transaction-detail-form.component';
import { TransactionsCategorisationFormComponent } from '@aug/transactions/components/transactions-categorisation-form.component';

const routes: Routes = [
    { path: 'transactions', component: TransactionsPageComponent }
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

        // Components
        TransactionsTableComponent,
        TransactionDetailFormComponent,
        TransactionsCategorisationFormComponent
    ],

    providers: [
        TransactionService
    ]
})
export class TransactionsModule { }