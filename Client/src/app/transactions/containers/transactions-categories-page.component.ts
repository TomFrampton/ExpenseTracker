import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { merge, Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { TransactionService } from '../services';
import { TransactionCategoriesTableRow } from '../components';
import { TransactionCategoryDeleteDialogComponent, TransactionCategoryEditDialogComponent } from '../dialogs';
import { TransactionCategory } from '../models';


@Component({
    templateUrl: './transactions-categories-page.component.html',
    styleUrls: ['transactions-categories-page.component.scss']
})
export class TransactionsCategoriesPageComponent implements OnInit {
    private readonly categoryNameUpdated$ = new Subject<TransactionCategory>();
    private readonly refreshCategories$ = new Subject<void>();

    categories$: Observable<TransactionCategoriesTableRow[]>;
    categories: TransactionCategoriesTableRow[];

    categoriesLoading = true;
    categorySaving = false;

    get isLoading() {
        return this.categoriesLoading || this.categorySaving;
    }

    constructor(
        private transactionService: TransactionService,
        private snackBar: MatSnackBar,
        private matDialog: MatDialog) {
    }

    ngOnInit() {
        this.categories$ = merge(
            // Initial load + full refresh when something is added or deleted
            merge(
                this.transactionService.getCategories(true),
                this.refreshCategories$.pipe(switchMap(() => this.transactionService.getCategories(true)))
            ).pipe(
                map(categories => this.mapCategories(categories))
            ),
            // When category name is updated don't reload any thing, just edit the existing list
            this.categoryNameUpdated$.pipe(
                map(updatedCategory => {
                    const category = this.categories.find(x => x.id === updatedCategory.id);
                    category.name = updatedCategory.name;
                    return this.categories;
                })
            )
        ).pipe(
            tap(categories => {
                this.categories = categories;
                this.categoriesLoading = false;
                this.categorySaving = false;
            })
        );
    }

    onAdd() {
        const config = { data: { action: 'add' }};

        this.matDialog.open(TransactionCategoryEditDialogComponent, config).afterClosed().subscribe(name => {
            if (name) {
                this.categorySaving = true;
                this.transactionService.addCategory(name).subscribe(result => {
                    this.snackBar.open('Category added', null, { duration: 2000 });
                    this.refreshCategories$.next();
                });
            }
        });
    }

    onAddSubCategory(parentRow: TransactionCategoriesTableRow) {
        const config = { data: { action: 'add' }};

        this.matDialog.open(TransactionCategoryEditDialogComponent, config).afterClosed().subscribe(name => {
            if (name) {
                this.categorySaving = true;
                this.transactionService.addCategory(name, parentRow.id).subscribe(result => {
                    this.snackBar.open('Category added', null, { duration: 2000 });
                    this.refreshCategories$.next();
                });
            }
        });
    }

    onEdit(row: TransactionCategoriesTableRow) {
        const config = { data: { name: row.name, action: 'edit' }};

        this.matDialog.open(TransactionCategoryEditDialogComponent, config).afterClosed().subscribe(name => {
            if (name) {
                this.categorySaving = true;
                this.transactionService.updateCategory(row.id, name).subscribe(result => {
                    this.snackBar.open('Category updated', null, { duration: 2000 });
                    this.categoryNameUpdated$.next({ id: row.id, name });
                });
            }
        });
    }

    onDelete(row: TransactionCategoriesTableRow) {
        const config = { data: {
            name: row.name,
            categorisedCount: row.count,
            disabledDueToParent: row.hasSubCategories
        }};

        this.matDialog.open(TransactionCategoryDeleteDialogComponent, config).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.categorySaving = true;
                this.transactionService.deleteCategory(row.id).subscribe(result => {
                    this.snackBar.open('Category deleted', null, { duration: 2000 });
                    this.refreshCategories$.next();
                });
            }
        });
    }

    private mapCategories(categories: TransactionCategory[]): TransactionCategoriesTableRow[] {
        const mapped = categories.map(category => ({
            ...category,
            isExpanded: true
        }));

        var sortedRows: TransactionCategoriesTableRow[] = [];

        // Order rows so children come immediately after each parent
        mapped
            .filter(x => x.parentId === null)
            .forEach(parentCategory => {
                const childCategories = mapped.filter(x => x.parentId === parentCategory.id);
                // Add the hasSubCategories property and add to the sorted array
                sortedRows.push({ ...parentCategory, hasSubCategories: !!childCategories.length });
                sortedRows.push(...childCategories.map(childCategory => ({ ...childCategory, hasSubCategories: false })))
            });

        return sortedRows;
    }
}