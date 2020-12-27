import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HealthService } from './health.service';
import { ItemHealth, SystemHealth } from './models/system-health';

@Component({
    templateUrl: './health-page.component.html'
})
export class HealthPageComponent implements OnInit {
    systemHealth$: Observable<SystemHealth>;

    constructor(private healthService: HealthService) {}

    ngOnInit(): void {
        this.systemHealth$ = this.healthService.getSystemHealth();
    }

    getItemHealthMessage(itemHealth: ItemHealth) {
        if (!itemHealth) {
            return 'No health information available';
        }

        if (itemHealth.isHealthy) {
            return 'Healthy';
        }

        return `Unhealthy. Error: ${itemHealth && itemHealth.error || 'Unknown'}`;
    }
}