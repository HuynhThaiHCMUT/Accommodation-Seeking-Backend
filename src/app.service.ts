import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);
    
    @Cron('*/5 * * * *') // Every 5 minutes
    async callDummyApi() {
        const url = 'https://accomodation-seeking-backend.onrender.com/scheduler';
        this.logger.log('Scheduler is running');
  
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.logger.log(`API Response: ${JSON.stringify(data)}`);
        } catch (error) {
            this.logger.error(`Failed to call API: ${error.message}`);
        }
    }
}
