/**
 * Hook xử lý format và tính toán tiền tệ
 */
export const useCurrency = () => {
  /**
   * Format số tiền sang định dạng VND
   * @param amount - Số tiền cần format
   * @returns Chuỗi đã format (ví dụ: "1.000.000 ₫")
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  /**
   * Format số tiền rút gọn (K, M, B)
   * @param amount - Số tiền cần format
   * @returns Chuỗi rút gọn (ví dụ: "1.5M", "500K")
   */
  const formatShortCurrency = (amount: number): string => {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(0)}K`;
    }
    return `${amount}đ`;
  };

  /**
   * Parse chuỗi tiền về số
   * @param value - Chuỗi cần parse (ví dụ: "1,000,000")
   * @returns Số đã parse
   */
  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[^\d]/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  /**
   * Tính phần trăm so với tổng
   * @param amount - Số tiền
   * @param total - Tổng số tiền
   * @returns Phần trăm (0-100)
   */
  const calculatePercentage = (amount: number, total: number): number => {
    if (total <= 0) return 0;
    return Math.round((amount / total) * 100);
  };

  /**
   * Tính số tiền trung bình mỗi người
   * @param total - Tổng chi tiêu
   * @param numberOfPeople - Số người
   * @returns Số tiền trung bình
   */
  const calculateAverage = (total: number, numberOfPeople: number): number => {
    if (numberOfPeople <= 0) return 0;
    return Math.round(total / numberOfPeople);
  };

  /**
   * Tính số tiền cần trả/nhận của mỗi người
   * @param spent - Số tiền đã chi
   * @param average - Số tiền trung bình
   * @returns Số tiền (dương = được nhận, âm = cần trả)
   */
  const calculateBalance = (spent: number, average: number): number => {
    return spent - average;
  };

  return {
    formatCurrency,
    formatShortCurrency,
    parseCurrency,
    calculatePercentage,
    calculateAverage,
    calculateBalance,
  };
};
