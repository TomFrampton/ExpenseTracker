import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface TransactionCategoryEditDialogData {
    action: 'add' | 'edit';
    name?: string;
}

@Component({
    templateUrl: './transaction-category-edit-dialog.component.html',
    styleUrls: ['./transaction-category-edit-dialog.component.scss']
})
export class TransactionCategoryEditDialogComponent {
    form: FormGroup;

    get dialogTitle() {
        return this.data.action === 'add'
            ? 'Add New Category'
            : 'Edit Category Name';
    }

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<TransactionCategoryEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: TransactionCategoryEditDialogData) {
        this.buildForm();
    }

    onSubmit() {
        this.dialogRef.close(this.form.value.name);
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            name: [this.data?.name, Validators.required]
        });
    }
}