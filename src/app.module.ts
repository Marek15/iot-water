import { Module } from '@nestjs/common'
import { NepModule } from './nep/nep.module'

@Module({
  imports: [NepModule],
})
export class AppModule {}
