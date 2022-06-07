import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AugustusCommonModule } from '@aug/common/common.module';

import { DashboardPageComponent } from './containers';
import { DashboardExpenditureLineChartComponent } from './components';

const routes: Routes = [
    { path: 'dashboard', component: DashboardPageComponent, children: [] },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,

        AugustusCommonModule
    ],
    declarations: [
        // Containers
        DashboardPageComponent,

        // Components
        DashboardExpenditureLineChartComponent
    ]
})
export class DashboardModule {}