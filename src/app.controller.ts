import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { ProvinceDto, DistrictDto, CommuneDto } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('provinces')
  getProvinces(): ProvinceDto[] {
    return this.appService.getProvinces();
  }

  @Get('districts')
  getDistricts(@Query('provinceId') idProvince: string): DistrictDto[] {
    const districts = this.appService.getDistrictsByProvince(idProvince);
    if (districts.length === 0) {
      throw new NotFoundException(`No districts found for provinceId ${idProvince}`);
    }
    return districts;
  }

  @Get('communes')
  getCommunes(@Query('districtId') idDistrict: string): CommuneDto[] {
    const communes = this.appService.getCommunesByDistrict(idDistrict);
    if (communes.length === 0) {
      throw new NotFoundException(`No communes found for districtId ${idDistrict}`);
    }
    return communes;
  }

  @Get('scheduler')
  getScheduler() {
    return { success: true };
  }
}
