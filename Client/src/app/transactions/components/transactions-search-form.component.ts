import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TransactionType } from '../enums';

@Component({
    selector: 'aug-transactions-search-form',
    templateUrl: './transactions-search-form.component.html',
    styleUrls: ['./transactions-search-form.component.scss']
})
export class TransactionsSearchFormComponent implements OnChanges, OnDestroy {
    private readonly destroy$ = new Subject<void>();
    readonly transactionTypes = TransactionType.list();
    readonly allTimePeriodsCode = '*';

    form: FormGroup;
    selectedTypeValue: string;

    @Input() resultsSummary: string
    @Input() years: number[];

    @Input() set selectedType(type: TransactionType) {
        this.selectedTypeValue = type?.code;
    }

    @Input() set selectedYear(year: number) {
        this.form?.controls.year.setValue(year || this.allTimePeriodsCode, { emitEvent: false });
    }

    @Output() textSearch = new EventEmitter<string>();
    @Output() typeChange = new EventEmitter<TransactionType>();
    @Output() yearChange = new EventEmitter<number>();

    constructor (private formBuilder: FormBuilder) {
        this.buildForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.resultsSummary && changes.resultsSummary.currentValue === null) {
            this.form.controls.textSearch.reset();
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onTextSearchSubmit(event: Event) {
        event.stopPropagation();
        this.textSearch.emit(this.form.value.textSearch);
    }

    onClearSearchResultsClick() {
        this.textSearch.emit(null);
    }

    onTypeChange(event: MatButtonToggleChange) {
        this.typeChange.emit(TransactionType.fromCode(event.value));
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            textSearch: [null],
            year: [null]
        });

        this.form.controls.year.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
            const emitValue = value === this.allTimePeriodsCode ? null : value;
            this.yearChange.emit(emitValue);
        });
    }
}