import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { ProvinceDto, DistrictDto, CommuneDto } from './app.dto';
import { AppService } from './app.service';
import { Public } from './modules/auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('provinces')
  getProvinces(): ProvinceDto[] {
    return this.appService.getProvinces();
  }

  @Public()
  @Get('districts')
  getDistricts(@Query('provinceId') idProvince: string): DistrictDto[] {
    const districts = this.appService.getDistrictsByProvince(idProvince);
    if (districts.length === 0) {
      throw new NotFoundException(`No districts found for provinceId ${idProvince}`);
    }
    return districts;
  }

  @Public()
  @Get('communes')
  getCommunes(@Query('districtId') idDistrict: string): CommuneDto[] {
    const communes = this.appService.getCommunesByDistrict(idDistrict);
    if (communes.length === 0) {
      throw new NotFoundException(`No communes found for districtId ${idDistrict}`);
    }
    return communes;
  }

  @Public()
  @Get('scheduler')
  getScheduler() {
    return { success: true };
  }
}
