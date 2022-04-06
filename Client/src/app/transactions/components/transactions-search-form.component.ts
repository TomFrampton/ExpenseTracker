import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'aug-transactions-search-form',
    templateUrl: './transactions-search-form.component.html',
    styleUrls: ['./transactions-search-form.component.scss']
})
export class TransactionsSearchFormComponent implements OnChanges {

    form: FormGroup = new FormGroup({});

    @Input() resultsSummary: string

    @Output() textSearch = new EventEmitter<string>();

    constructor (private formBuilder: FormBuilder) {
        this.buildForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.resultsSummary && changes.resultsSummary.currentValue === null) {
            this.form.controls.textSearch.reset();
        }
    }

    onTextSearchSubmit(event: Event) {
        event.stopPropagation();
        this.textSearch.emit(this.form.value.textSearch);
    }

    onClearSearchResultsClick() {
        this.textSearch.emit(null);
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            textSearch: [null]
        });
    }
}