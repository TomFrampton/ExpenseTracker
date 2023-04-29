import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { TransactionsUploadFormComponent } from '../components';
import { TransactionImportResponse } from '../models';
import { TransactionService } from '../services';

@Component({
    selector: 'app-transactions-upload-page',
    templateUrl: './transactions-upload-page.component.html',
    styleUrls: ['./transactions-upload-page.component.scss']
})
export class TransactionsUploadPageComponent {
    isLoading: boolean;

    @ViewChild('formComponent') formComponent: TransactionsUploadFormComponent;

    constructor(private transactionsService: TransactionService, private snackBar: MatSnackBar, private router: Router, private activatedRoute: ActivatedRoute) {}

    onUpload(file: File) {
        this.transactionsService.upload(file)
            .subscribe(
                (result: TransactionImportResponse) => {
                    // TODO - Implement proper snackbar styles
                    this.snackBar.open(`${result.importedTransactionsCount} transactions imported. ${result.ignoredTransactionsCount} transactions ignored`, 'Go to transactions', { duration: 3000 }).onAction().subscribe(() => {
                        this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
                    });

                    this.formComponent.reset();
                },
                error => {
                    this.snackBar.open('Error', null, { duration: 3000 });
                })
            .add(() => {
                this.isLoading = false;
            });
    }
}