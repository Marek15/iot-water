import { Injectable } from '@nestjs/common';
import internal from 'stream';

@Injectable()
export class NepService {
    processCode(code: string, index: number) {
        if (code.length == index) {
            return null
        }
        const { isTemperature, ind } = this.getOID(code, index)
        index = ind

        // console.log(index)

        const { type, length, inde } = this.getTypeAndLength(code, index)
        index = inde

        // console.log(type)
        // console.log(length)
        if (!isTemperature) {
            index += length * 2
        } else {
            return this.getValue(code, index, type, length)
        }

        // console.log(index)
        // return 5


        return this.processCode(code, index)
    }

    getOID(code: string, ind: number) {
        ind += 2
        const firstByte = this.hex2bin(code.slice(ind - 2, ind))
        let secondByte = ""
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
            }
            else {
                inde += 2
                const thirdByte = this.hex2bin(code.slice(inde - 2, inde))
                length = parseInt(secondByte.slice(1) + thirdByte, 2)
            }
        }
        return {type, length, inde}
    }

    getValue(code: string, index: number, type: number, length: number) {
        console.log(index)
        index += length * 2
        const value = this.hex2bin(code.slice(index - length * 2, index))
        console.log(length)
        console.log(index)
        console.log(value)
        console.log(type)
        console.log(parseInt(value, 2))
        return type
        return parseInt(value, 2)
    }

    hex2bin(hex) {
        return (parseInt(hex, 16).toString(2)).padStart(8, '0');
    }

}
