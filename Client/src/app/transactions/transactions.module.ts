import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

import { AugustusCommonModule } from '@aug/common/common.module';
import { DemoInitialisedGuard } from '@aug/core/guards';

import { TransactionService } from './services';

import {
    TransactionsPageComponent,
    TransactionsCategoriesPageComponent,
    TransactionsListPageComponent,
    TransactionsUploadPageComponent
} from './containers';

import {
    TransactionCategoriesTableComponent,
    TransactionDetailFormComponent,
    TransactionsCategorisationFormComponent,
    TransactionsSearchFormComponent,
    TransactionsTableComponent,
    TransactionsUploadFormComponent
} from './components';

import { TransactionCategoryDeleteDialogComponent, TransactionCategoryEditDialogComponent } from './dialogs';


const routes: Routes = [
    { path: 'transactions', component: TransactionsPageComponent, canActivate: [DemoInitialisedGuard], children: [
        { path: 'list', component: TransactionsListPageComponent },
        { path: 'categories', component: TransactionsCategoriesPageComponent },
        { path: 'upload', component: TransactionsUploadPageComponent },
        { path: '**', redirectTo: 'list' }
    ]}
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ReactiveFormsModule,

        MatTableModule,
        MatCheckboxModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatInputModule,
        MatSortModule,
        MatButtonToggleModule,
        MatTreeModule,
        MatTooltipModule,
        MatDialogModule,
        MatChipsModule,
        MatBadgeModule,

        AugustusCommonModule
    ],

    declarations: [
        // Containers
        TransactionsPageComponent,
        TransactionsListPageComponent,
        TransactionsUploadPageComponent,
        TransactionsCategoriesPageComponent,

        // Components
        TransactionsTableComponent,
        TransactionDetailFormComponent,
        TransactionsCategorisationFormComponent,
        TransactionsSearchFormComponent,
        TransactionsUploadFormComponent,
        TransactionCategoriesTableComponent,

        // Dialogs
        TransactionCategoryDeleteDialogComponent,
        TransactionCategoryEditDialogComponent
    ],

    providers: [
        TransactionService,
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { minWidth: 400, hasBackdrop: true, autoFocus: 'input' }}
    ]
})
export class TransactionsModule { }