import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';

import { combineLatest, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { Id } from '@app/common/id';
import { PaginationSettings, PaginationSummary } from '@app/common/pagination';

import { Transaction } from '../models';


export interface TransactionTableRow {
    id: Id<Transaction>;
    description: string;
    creditAmount: number;
    debitAmount: number;
    date: Date;
    category: string;
    userSuppliedDescription: string;
    isCategorised: boolean;
}

@Component({
    selector: 'app-transactions-table',
    templateUrl: './transactions-table.component.html',
    styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnChanges, OnDestroy {
    private readonly destroy$ = new Subject();

    columns = ['selected', 'date', 'description', 'category', 'creditAmount', 'debitAmount'];

    form: FormGroup;

    @Input() transactions: TransactionTableRow[];
    @Input() pagination: PaginationSummary;

    @Output() transactionSelectionChange = new EventEmitter<Id<Transaction>[]>();
    @Output() paginationChange = new EventEmitter<PaginationSettings>();
    @Output() dateSortChange = new EventEmitter<SortDirection>();

    get transactionsControl(): FormArray {
        return this.form && this.form.controls.transactions as FormArray;
    }

    get selectionControls(): FormControl[] {
        return this.transactionsControl && this.transactionsControl.controls.map((x: FormGroup) => x.controls.selected as FormControl);
    }

    /**
     * Whether or not to display the indeterminate selection on the 'select all' checkbox.
     */
    get showIndeterminateSelection(): boolean {
        const allSelectedControl = this.form && this.form.controls.allSelected as FormControl;
        const allSelected = allSelectedControl && allSelectedControl.value || false;

        return !allSelected && this.selectionControls.some(x => x.value);
    }

    constructor(private formBuilder: FormBuilder) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.transactions) {
            this.buildForm();
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onPaginatorChange(event: PageEvent) {
        this.paginationChange.emit({ pageNumber: event.pageIndex + 1, pageSize: event.pageSize });
    }

    onSortChange(sort: Sort) {
        if (sort.active === 'date') {
            this.dateSortChange.emit(sort.direction);
        }
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            allSelected: [false],
            transactions: this.formBuilder.array(
                this.transactions.map(t => this.formBuilder.group({
                    id: [{ value: t.id, disabled: true }],
                    selected: [false]
                }))
            )
        });

        // Set 'select all' based on individual rows being selected
        combineLatest(this.selectionControls.map(x => x.valueChanges.pipe(startWith(x.value)))).pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.calculateAllSelected();
            this.emitUpdatedTransactionSelection();
        });

        // Set individual rows based on 'select all' being selected
        this.form.controls.allSelected.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(selectAll => {
            this.selectionControls.forEach(x => x.setValue(selectAll, { emitEvent: false }));
            this.emitUpdatedTransactionSelection();
        });
    }

    private calculateAllSelected() {
        const allSelected = this.selectionControls.every(x => x.value);

        this.form.controls.allSelected.setValue(allSelected, { emitEvent: false });
    }

    private emitUpdatedTransactionSelection() {
        const selectedIds = this.transactionsControl.getRawValue()
            .filter(x => x.selected)
            .map(x => x.id);

        this.transactionSelectionChange.emit(selectedIds);
    }
}
