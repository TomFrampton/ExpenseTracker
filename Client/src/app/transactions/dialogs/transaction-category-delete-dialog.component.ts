import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface TransactionCategoryDeleteDialogData {
    name: string;
    categorisedCount: number;
    disabledDueToParent?: boolean;
}

@Component({
    templateUrl: './transaction-category-delete-dialog.component.html',
    styleUrls: ['./transaction-category-delete-dialog.component.scss']
})
export class TransactionCategoryDeleteDialogComponent {
    form: FormGroup;

    get pluraliseText() {
        return this.data.categorisedCount !== 1;
    }

    get deleteEnabled() {
        return this.data && this.data.disabledDueToParent === false;
    }

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TransactionCategoryDeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TransactionCategoryDeleteDialogData) {
        this.buildForm();
    }

    onSubmit() {
        if (!this.data.disabledDueToParent) {
            this.dialogRef.close(this.form.value.name);
        }
    }

    private buildForm() {
        this.form = this.formBuilder.group({});
    }
}