import { Component, Input } from "@angular/core";


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
export class TransactionsTableComponent {
    @Input() transactions: TransactionTableRow[];
}
