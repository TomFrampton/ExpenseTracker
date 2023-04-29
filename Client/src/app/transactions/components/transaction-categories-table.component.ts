import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Id } from '@app/common/id';
import { TransactionCategory } from '../models';


export interface TransactionCategoriesTableRow {
    id: Id<TransactionCategory>;
    parentId?: Id<TransactionCategory>;
    name: string;
    hasSubCategories: boolean;
    count?: number;
    isExpanded?: boolean;
}

@Component({
    selector: 'app-transaction-categories-table',
    templateUrl: './transaction-categories-table.component.html',
    styleUrls: ['./transaction-categories-table.component.scss']
})
export class TransactionCategoriesTableComponent {
    columns = ['expander', 'name', 'count', 'actions'];

    // categories = [
    //     { id: 1, name: 'Rent', count: 10, isExpanded: true },
    //     { id: 2, name: 'Home', count: 10, isChild: true, parentId: 1 },
    //     { id: 3, name: 'Office', count: 10, isChild: true, parentId: 1 },
    // ];

    @Input() categories: TransactionCategoriesTableRow[];

    @Output() edit = new EventEmitter<TransactionCategoriesTableRow>();
    @Output() delete = new EventEmitter<TransactionCategoriesTableRow>();
    @Output() addSubCategory = new EventEmitter<TransactionCategoriesTableRow>();

    isRowVisible(row) {
        if(row.parentId) {
            const parent = this.categories.find(x => x.id === row.parentId);
            return parent.isExpanded;
        }

        return true;
    }

    onRowClick(row) {
        if (row.hasSubCategories) {
            row.isExpanded = !row.isExpanded;
        }
    }

    onEditClick(row: TransactionCategoriesTableRow, event: PointerEvent) {
        event.stopPropagation();
        this.edit.emit(row);
    }

    onDeleteClick(row: TransactionCategoriesTableRow, event: PointerEvent) {
        event.stopPropagation();
        this.delete.emit(row);
    }

    onAddSubCategoryClick(row: TransactionCategoriesTableRow, event: PointerEvent) {
        event.stopPropagation();
        this.addSubCategory.emit(row);
    }
}