import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DemoService } from 'src/app/core/services/demo.service';
import { DemoDialogComponent } from '../components/demo-dialog.component';

@Component({
    selector: 'aug-demo-page',
    templateUrl: './demo-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPageComponent {
    isLoading = false;

    dialogRef: MatDialogRef<DemoDialogComponent>;

    constructor(
        private demoService: DemoService,
        private router: Router,
        private snackBar: MatSnackBar,
        public dialog: MatDialog) {
            this.dialogRef = this.dialog.open(DemoDialogComponent, { disableClose : true, width: '800px' });
            this.dialogRef.afterClosed().subscribe(() => {
                this.router.navigate(['./transactions']);
            });
        }
}