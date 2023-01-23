import { Body, Controller, Get } from '@nestjs/common'
import { NepDto } from './dto'
import { NepService } from './nep.service'

@Controller('nep')
export class NepController {
  constructor(private nepService: NepService) {}

  @Get('getTemperature')
  getTemperature(@Body() nepDto: NepDto) {
    return this.nepService.getTemperature({
      message: nepDto.message,
      pointer: 0
    })
  }
}
