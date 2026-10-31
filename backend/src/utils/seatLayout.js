export function generateSeatLayout() {
  const seats = []

  for (let rowCode = 'A'.charCodeAt(0); rowCode <= 'M'.charCodeAt(0); rowCode += 1) {
    const row = String.fromCharCode(rowCode)

    for (let column = 1; column <= 12; column += 1) {
      seats.push({
        row,
        column,
        seatNumber: `${row}${column}`,
        status: 'available',
      })
    }
  }

  return seats
}
