export function formatCurrency(amount) {
  return `₹${amount}`
}

export function formatPriceRange(min, max) {
  if (min === max) return `₹${min}`
  return `₹${min} – ₹${max}`
}

export function getSeatLabel(row, number) {
  return `${row}${number}`
}
