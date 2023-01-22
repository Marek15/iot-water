import { Module } from '@nestjs/common'
import { NepController } from './nep.controller'
import { NepService } from './nep.service'

@Module({
  providers: [NepService],
  controllers: [NepController],
})
export class NepModule {}
