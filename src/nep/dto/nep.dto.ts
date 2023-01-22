import { IsNotEmpty, IsString } from "class-validator"

export class NepDto {
    @IsString()
    @IsNotEmpty()
    code: string
}