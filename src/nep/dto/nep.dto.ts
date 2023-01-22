import { IsNotEmpty, IsHexadecimal } from 'class-validator'

export class NepDto {
  @IsHexadecimal()
  @IsNotEmpty()
  message: string
}
