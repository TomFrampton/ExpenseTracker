import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Category } from '../models/category.model';
import { Transaction } from '../models/transaction.model';


@Component({
    selector: 'aug-transactions-categorisation-form',
    templateUrl: './transactions-categorisation-form.component.html'
})
export class TransactionsCategorisationFormComponent implements OnInit, OnChanges {
    @Input() transactions: Transaction[];
    @Input() categories: Category[];

    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.buildForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        //throw new Error('Method not implemented.');
    }

    onSubmit() {

    }

    private buildForm() {
        this.form = this.formBuilder.group({
            category: [null]
        });
    }
}