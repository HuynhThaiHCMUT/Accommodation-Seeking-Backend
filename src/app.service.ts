import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProvinceDto, DistrictDto, CommuneDto } from './app.dto';

interface Data {
  province: ProvinceDto[];
  district: DistrictDto[];
  commune: CommuneDto[];
}

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);
    private data: Data;

    constructor() {
        const filePath = path.join(__dirname, '..', 'location.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        this.data = JSON.parse(rawData);
    }

    getProvinces(): ProvinceDto[] {
        return this.data.province;
    }
    
    getDistrictsByProvince(idProvince: string): DistrictDto[] {
        return this.data.district.filter(d => d.idProvince === idProvince);
    }
    
    getCommunesByDistrict(idDistrict: string): CommuneDto[] {
        return this.data.commune.filter(c => c.idDistrict === idDistrict);
    }
    
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
