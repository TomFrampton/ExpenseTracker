import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Transaction } from '../models/transaction.model';

@Component({
    selector: 'aug-transaction-detail-form',
    templateUrl: './transaction-detail-form.component.html'
})
export class TransactionDetailFormComponent implements OnChanges {
    @Input() transaction: Transaction;

    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.createForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.transaction) {
            this.patchForm();
        }
    }

    onSubmit() {

    }

    private createForm() {
        this.form = this.formBuilder.group({
            comment: [null]
        });
    }

    private patchForm() {
        const transactionValues = {
            comment: this.transaction.description // TODO Add comment field
        };

        this.form.patchValue(transactionValues);
    }
}