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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';

import { AugustusCommonModule } from '@aug/common/common.module';

import { TransactionService } from './services';

import {
    TransactionsPageComponent,
    TransactionsCategoriesPageComponent,
    TransactionsListPageComponent,
    TransactionsUploadPageComponent
} from './containers';

import {
    TransactionDetailFormComponent,
    TransactionsCategorisationFormComponent,
    TransactionsSearchFormComponent,
    TransactionsTableComponent,
    TransactionsUploadFormComponent
} from './components';


const routes: Routes = [
    { path: 'transactions', component: TransactionsPageComponent, children: [
        { path: 'list', component: TransactionsListPageComponent },
        { path: 'categories', component: TransactionsCategoriesPageComponent },
        { path: 'upload', component: TransactionsUploadPageComponent },
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
        MatSnackBarModule,
        MatPaginatorModule,
        MatInputModule,
        MatSortModule,

        AugustusCommonModule
    ],

    declarations: [
        // Containers
        TransactionsPageComponent,
        TransactionsListPageComponent,
        TransactionsCategoriesPageComponent,
        TransactionsUploadPageComponent,

        // Components
        TransactionsTableComponent,
        TransactionDetailFormComponent,
        TransactionsCategorisationFormComponent,
        TransactionsSearchFormComponent,
        TransactionsUploadFormComponent
    ],

    providers: [
        TransactionService
    ]
})
export class TransactionsModule { }