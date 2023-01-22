import { Body, Controller, Get } from '@nestjs/common';
import { NepDto } from './dto';
import { NepService } from './nep.service';

@Controller('nep')
export class NepController {
    constructor(private nepService: NepService) { }

    @Get('processCode')
    processCode(@Body() nepDto: NepDto) {
        const code = nepDto.code
        return this.nepService.processCode(code, 0)
    }

}
