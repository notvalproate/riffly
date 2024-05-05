import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PollingService {
    private intervalId: any = null;
    private intervalTime: number = 2000;

    constructor() {}

    config(config: { intervalTime: number }) {
        this.intervalTime = config.intervalTime;
    }

    startPolling(callback: () => void) {
        this.stopPolling();
        this.intervalId = setInterval(() => {
            callback();
        }, this.intervalTime);
    }

    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
  }
