import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DemoService {
    constructor(private httpClient: HttpClient) {
    }

    isStarted() {
        return this.httpClient.get<boolean>('./demo')
    }

    start() {
        return this.httpClient.post('./demo', {});
    }
}