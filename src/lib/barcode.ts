/*
 * EAN-13 barcodes (the barcode printed on medicine boxes).
 * Used to draw the demo barcodes; scanning is done by the ZXing library.
 */

/** Check digit of a 12-digit EAN code. */
export function ean13CheckDigit(first12: string): number {
  let sum = 0
  for (let i = 0; i < 12; i++) sum += Number(first12[i]) * (i % 2 === 0 ? 1 : 3)
  return (10 - (sum % 10)) % 10
}

export function isValidEan13(code: string): boolean {
  return /^\d{13}$/.test(code) && ean13CheckDigit(code.slice(0, 12)) === Number(code[12])
}

const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011']
const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111']
const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100']
const PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL']

/** Returns the 95 modules of an EAN-13 barcode as a string of "1" (bar) and "0" (space). */
export function ean13Modules(code: string): string {
  if (!isValidEan13(code)) throw new Error(`Invalid EAN-13: ${code}`)
  const digits = code.split('').map(Number)
  const parity = PARITY[digits[0]]
  let bits = '101'
  for (let i = 1; i <= 6; i++) bits += (parity[i - 1] === 'L' ? L : G)[digits[i]]
  bits += '01010'
  for (let i = 7; i <= 12; i++) bits += R[digits[i]]
  bits += '101'
  return bits
}
