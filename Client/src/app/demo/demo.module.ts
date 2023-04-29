import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MatDialogModule } from '@angular/material/dialog';

import { ExpensesCommonModule } from '@app/common/common.module';

import { DemoPageComponent } from './containers';
import { DemoDialogComponent } from './components/demo-dialog.component';

const routes: Routes = [
    { path: 'demo', component: DemoPageComponent, children: [] },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,

        // Angular Material
        MatDialogModule,

        ExpensesCommonModule
    ],
    declarations: [
        // Containers
        DemoPageComponent,

        // Components

        // Dialogs
        DemoDialogComponent
    ]
})
export class DemoModule {}