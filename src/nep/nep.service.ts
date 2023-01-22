import { Injectable } from '@nestjs/common'

@Injectable()
export class NepService {
  processCode(message: string, index: number) {
    if (message.length == index) {
      return null
    }
    const { isTemperature, ind } = this.getOID(message, index)
    index = ind

    const { type, length, inde } = this.getTypeAndLength(message, index)
    index = inde

    if (!isTemperature) {
      index += length * 2
    } else {
      return this.getValue(message, index, type, length)
    }

    return this.processCode(message, index)
  }

  getOID(code: string, ind: number) {
    ind += 2
    const firstByte = this.hex2bin(code.slice(ind - 2, ind))
    let secondByte = ''
    if (firstByte.charAt(0) === '1') {
      ind += 2
      secondByte = this.hex2bin(code.slice(ind - 2, ind))
    }
    const oid = parseInt(firstByte.slice(2) + secondByte, 2)

    if (firstByte.charAt(1) === '1') {
      ind = this.getIndex(code, ind)
    }
    const isTemperature = oid === 105
    return { isTemperature, ind }
  }

  getIndex(code, index) {
    index += 2
    const firstByte = this.hex2bin(code.slice(index - 2, index))
    if (firstByte.charAt(0) === '1') {
      index += 2
    }
    return index
  }

  getTypeAndLength(code: string, inde: number) {
    inde += 2
    const firstByte = this.hex2bin(code.slice(inde - 2, inde))
    let type, length
    if (firstByte.charAt(0) === '0') {
      type = parseInt(firstByte.slice(1, 4), 2)

      length = parseInt(firstByte.slice(4, 8), 2)
    } else {
      inde += 2
      const secondByte = this.hex2bin(code.slice(inde - 2, inde))

      type = parseInt(firstByte.slice(1), 2)

      if (secondByte.charAt(0) === '0') {
        length = parseInt(secondByte.slice(1), 2)
      } else {
        inde += 2
        const thirdByte = this.hex2bin(code.slice(inde - 2, inde))
        length = parseInt(secondByte.slice(1) + thirdByte, 2)
      }
    }
    return { type, length, inde }
  }

  getValue(code: string, index: number, type: number, length: number) {
    index += length * 2
    const value = this.hex2bin(code.slice(index - length * 2, index))

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

  parseInt2complement(bitstring) {
    let value = parseInt(bitstring, 2)
    const length = bitstring.length

    if ((value & (1 << (length - 1))) > 0) {
      value -= 1 << length
    }
    return value
  }

  hex2bin(hex: string): string {
    return parseInt(hex, 16).toString(2).padStart(8, '0')
  }
}
