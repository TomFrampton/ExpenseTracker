import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';


export interface TransactionTableRow {
    id: number;
    description: string;
    amount: number;
    date: Date;
}

@Component({
    selector: 'aug-transactions-table',
    templateUrl: './transactions-table.component.html'
})
export class TransactionsTableComponent implements OnChanges, OnDestroy {
    private destroy$ = new Subject();

    form: FormGroup;

    @Input() transactions: TransactionTableRow[];

    get transactionsControl(): FormArray {
        return this.form && this.form.controls.transactions as FormArray;
    }

    get selectedControls(): FormControl[] {
        return this.transactionsControl && this.transactionsControl.controls.map((x: FormGroup) => x.controls.selected as FormControl);
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

    private buildForm() {
        this.form = this.formBuilder.group({
            allSelected: [false],
            transactions: this.formBuilder.array(
                this.transactions.map(t => this.formBuilder.group({
                    selected: [false]
                }))
            )
        });

        // Set 'select all' based on individual rows being selected
        this.selectedControls.forEach(x => {
            x.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.calculateAllSelected());
        });

        // Set individual rows based on 'select all' being selected
        this.form.controls.allSelected.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(selectAll =>
            this.selectedControls.forEach(x => x.setValue(selectAll, { emitEvent: false }))
        );
    }

    private calculateAllSelected() {
        const allSelected = this.selectedControls.every(x => x.value);

        this.form.controls.allSelected.setValue(allSelected, { emitEvent: false });
    }
}
