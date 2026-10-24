/**
 * Format amounts in Honduran Lempiras (L) using Intl.NumberFormat("es-HN")
 */
export const formatLempiras = (amount: number): string => {
  try {
    const formatted = new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    // Normalize standard Honduran notation: L. 195.00
    return formatted.replace('HNL', 'L.').trim();
  } catch (e) {
    return `L. ${amount.toFixed(2)}`;
  }
};
