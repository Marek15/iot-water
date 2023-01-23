import { Injectable, NotAcceptableException } from '@nestjs/common'
import { Nep } from './interfaces/nep.interface'

@Injectable()
export class NepService {
  getTemperature(nep: Nep) {
    if (nep.message.length <= nep.pointer)
      throw new NotAcceptableException('Message not contains temperature')

    const isTemperature = this.getOID(nep) === 105
    const { type, len } = this.getTypeAndLength(nep)

    // increase pointer to end of value
    nep.pointer += len * 2
    if (nep.message.length < nep.pointer)
      throw new NotAcceptableException('Message have not correct data')
    if (isTemperature) 
      return this.getValue(nep, type, len) / 10

    return this.getTemperature(nep)
  }

  getOID(nep: Nep): number {
    const secondBit = this.hex2bin(nep.message.slice(nep.pointer, nep.pointer + 2)).charAt(1)

    const oid = this.getOidAndIndexBytes(nep, 2)

    if (secondBit === '1') 
      this.getIndex(nep)
    return oid
  }

  getIndex(nep: Nep): number {
    return this.getOidAndIndexBytes(nep, 1)
  }

  getOidAndIndexBytes(nep: Nep, startSlice: number): number {
    const firstByte = this.getBinaryByte(nep)
    const secondByte =
      firstByte.charAt(0) === '1' ? this.getBinaryByte(nep) : ''

    return parseInt(firstByte.slice(startSlice) + secondByte, 2)
  }

  getTypeAndLength(nep: Nep) {
    const firstByte = this.getBinaryByte(nep)
    let type: number, len: number
    if (firstByte.charAt(0) === '0') {
      type = parseInt(firstByte.slice(1, 4), 2)
      len = parseInt(firstByte.slice(4, 8), 2)
    } else {
      const secondByte = this.getBinaryByte(nep)
      type = parseInt(firstByte.slice(1), 2)

      if (secondByte.charAt(0) === '0') {
        len = parseInt(secondByte.slice(1), 2)
      } else {
        const thirdByte = this.getBinaryByte(nep)
        len = parseInt(secondByte.slice(1) + thirdByte, 2)
      }
    }
    return { type, len }
  }

  getValue(nep: Nep, type: number, len: number) {
    const value = this.hex2bin(
      nep.message.slice(nep.pointer - len * 2, nep.pointer)
    )

    return this.getValueByType(value, type)
  }

  getValueByType(value: string, type: number) {
    switch (type) {
      case 2:
        return parseInt(value, 2)
      case 3:
        return this.parseInt2complement(value)
      default:
        return null
    }
  }

  getBinaryByte(nep: Nep): string {
    nep.pointer += 2
    return this.hex2bin(nep.message.slice(nep.pointer - 2, nep.pointer))
  }

  parseInt2complement(bitstring: string): number {
    let value = parseInt(bitstring, 2)
    const bitlength = bitstring.length

    if ((value & (1 << (bitlength - 1))) > 0) {
      value -= 1 << bitlength
    }
    return value
  }

  hex2bin(hex: string): string {
    return parseInt(hex, 16).toString(2).padStart(8, '0')
  }
}
