serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    QUEUE.push(serial.readUntil(serial.delimiters(Delimiters.NewLine)))
})
let rDATA: number[] = []
let DAT = ""
let REG = ""
let CMD = ""
let COMMAND = ""
let QUEUE: string[] = []
serial.redirectToUSB()
serial.writeLine("Ready!")
let i2cAddr = bit.hexToNumber("10")
i2cio.setI2cAddress(i2cAddr)
QUEUE = []
basic.forever(function () {
    if (QUEUE.length > 0) {
        COMMAND = QUEUE.shift()
        CMD = COMMAND.split(",")[0]
        if (COMMAND.includes(",")) {
            REG = bit.numberToHex(bit.hexToNumber(COMMAND.split(",")[1])).substr(6, 2)
        } else {
            REG = bit.numberToHex(bit.hexToNumber(REG) + 1).substr(6, 2)
        }
        if (COMMAND.split(",").length > 2) {
            DAT = COMMAND.split(",")[2]
        } else {
            DAT = "1"
        }
        if (CMD == "a" || CMD == "A") {
            i2cAddr = bit.hexToNumber(REG)
            i2cio.setI2cAddress(i2cAddr)
            serial.writeLine("addr=" + REG)
        } else if (CMD == "r" || CMD == "R") {
            if (DAT == "1") {
                serial.writeLine("" + REG + ":" + bit.numberToHex(i2cio.readReg(bit.hexToNumber(REG))).substr(6, 2))
            } else {
                serial.writeString("" + REG + ":")
                rDATA = i2cio.readBuf(bit.hexToNumber(REG), bit.hexToNumber(DAT))
                for (let カウンター = 0; カウンター <= rDATA.length - 1; カウンター++) {
                    serial.writeString("" + bit.numberToHex(rDATA[カウンター]).substr(6, 2) + " ")
                }
                serial.writeLine("")
            }
        } else if (CMD == "r2" || CMD == "R2") {
            serial.writeLine("" + REG + ":" + bit.numberToHex(i2cio.readReg16(bit.hexToNumber(REG))).substr(4, 4))
        } else if (CMD == "r4" || CMD == "R4") {
            serial.writeLine("" + REG + ":" + bit.numberToHex(i2cio.readReg32(bit.hexToNumber(REG))))
        } else if (CMD == "w" || CMD == "W") {
            DAT = COMMAND.split(",")[2]
            i2cio.writeReg(bit.hexToNumber(REG), bit.hexToNumber(DAT))
            serial.writeLine("" + REG + "=" + DAT)
        } else if (CMD == "w2" || CMD == "W2") {
            DAT = COMMAND.split(",")[2]
            i2cio.writeReg16(bit.hexToNumber(REG), bit.hexToNumber(DAT))
            serial.writeLine("" + REG + "w=" + DAT)
        } else if (CMD == "w4" || CMD == "W4") {
            DAT = COMMAND.split(",")[2]
            i2cio.writeReg32(bit.hexToNumber(REG), bit.hexToNumber(DAT))
            serial.writeLine("" + REG + "d=" + DAT)
        } else {
        	
        }
    }
})
