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
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AugustusCommonModule } from '@aug/common/common.module';

import { TransactionService } from '@aug/transactions/services/transaction.service';
import { TransactionsPageComponent, TransactionsCategoriesPageComponent, TransactionsListPageComponent } from '@aug/transactions/containers';
import { TransactionsTableComponent } from '@aug/transactions/components/transactions-table.component';
import { TransactionDetailFormComponent } from '@aug/transactions/components/transaction-detail-form.component';
import { TransactionsCategorisationFormComponent } from '@aug/transactions/components/transactions-categorisation-form.component';

const routes: Routes = [
    { path: 'transactions', component: TransactionsPageComponent, children: [
        { path: 'list', component: TransactionsListPageComponent },
        { path: 'categories', component: TransactionsCategoriesPageComponent },
        { path: '**', redirectTo: 'list' }
    ]},
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
        MatCheckboxModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatProgressSpinnerModule,

        AugustusCommonModule
    ],

    declarations: [
        // Containers
        TransactionsPageComponent,
        TransactionsListPageComponent,
        TransactionsCategoriesPageComponent,

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