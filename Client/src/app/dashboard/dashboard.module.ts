import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ExpensesCommonModule } from '@app/common/common.module';
import { DemoInitialisedGuard } from '@app/core/guards';

import { DashboardPageComponent } from './containers';
import { DashboardExpenditureLineChartComponent } from './components';

const routes: Routes = [
    { path: 'dashboard', component: DashboardPageComponent, canActivate: [DemoInitialisedGuard], children: [] },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,

        ExpensesCommonModule
    ],
    declarations: [
        // Containers
        DashboardPageComponent,

        // Components
        DashboardExpenditureLineChartComponent
    ]
})
export class DashboardModule {}