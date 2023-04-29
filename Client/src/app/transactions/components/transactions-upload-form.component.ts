import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-transactions-upload-form',
    templateUrl: './transactions-upload-form.component.html'
})
export class TransactionsUploadFormComponent implements OnInit {

    @Output() upload = new EventEmitter<File>();

    form: FormGroup;
    file: File;


    get fileName() {
        return this.file?.name;
    }

    constructor(private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({});
    }

    ngOnInit() {
    }

    reset() {
        this.file = null;
    }

    onFileSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files && target.files.length && target.files[0] || null;

        this.file = file;
    }

    onSubmit() {
        if (this.file) {
            this.upload.emit(this.file);
        }
    }
}