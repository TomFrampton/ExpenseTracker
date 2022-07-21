import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Transaction } from '../models/transaction.model';
import { TransactionCategory } from '../models/transaction-category.model';
import { TransactionCategorisation } from '../models/transaction-categorisation.model';


@Component({
    selector: 'aug-transactions-categorisation-form',
    templateUrl: './transactions-categorisation-form.component.html',
    styleUrls: ['./transactions-categorisation-form.component.scss']
})
export class TransactionsCategorisationFormComponent implements OnInit, OnChanges, OnDestroy {
    private readonly destroy$ = new Subject<void>();

    @Input() transactions: Transaction[];
    @Input() categories: TransactionCategory[];
    @Input() categoriseEnabled: boolean;

    @Output() categorise = new EventEmitter<TransactionCategorisation>();

    parentCategories: TransactionCategory[] = [];
    subCategories: TransactionCategory[] = [];

    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.buildForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes.categories) {
            const currentValue = changes.categories.currentValue as TransactionCategory[];
            this.parentCategories = currentValue?.filter(x => x.parentId == null);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSubmit() {
        if (this.form.valid) {
            this.categorise.emit({
                categoryId: this.form.value.category,
                subCategoryId: this.form.value.subCategory,
                description: this.form.value.description
            });
        }
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            description: [null, Validators.required],
            category: [null, Validators.required],
            subCategory: [null]
        });

        this.form.controls.category.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(categoryId => {
            this.subCategories = categoryId && this.categories.filter(x => x.parentId === categoryId) || [];

            if (this.subCategories.length === 0) {
                this.form.controls.subCategory.setValue(null);
            }
        });
    }
}