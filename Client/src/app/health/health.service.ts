import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HealthModule } from './health.module';
import { Observable } from 'rxjs';
import { SystemHealth } from './models/system-health';


@Injectable()
export class HealthService {

    constructor(private httpClient: HttpClient) {}

    getSystemHealth(): Observable<SystemHealth> {
        return this.httpClient.get<SystemHealth>('https://localhost:44358/api/system/health');
    }

}