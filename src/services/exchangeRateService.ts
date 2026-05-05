const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

export interface ExchangeRates {
  [currencyCode: string]: number;
}

export interface ExchangeRateResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: ExchangeRates;
}

export interface ConversionResult {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  convertedCurrency: string;
  exchangeRate: number;
}

export const exchangeRateService = {
  /**
   * Lấy tỷ giá mới nhất cho một loại tiền tệ (mặc định là USD)
   * @param baseCode Mã tiền tệ gốc (VD: 'USD', 'VND', 'EUR')
   * @returns Dữ liệu tỷ giá
   */
  async getLatestRates(
    baseCode: string = "USD",
  ): Promise<ExchangeRateResponse> {
    if (!API_KEY) {
      throw new Error("Thiếu VITE_EXCHANGE_RATE_API_KEY trong file .env");
    }

    try {
      const response = await fetch(`${BASE_URL}/latest/${baseCode}`);
      if (!response.ok) {
        throw new Error(
          `Lỗi gọi API: ${response.status} ${response.statusText}`,
        );
      }

      const data: ExchangeRateResponse = await response.json();

      if (data.result !== "success") {
        throw new Error("API trả về lỗi hoặc không thành công");
      }

      return data;
    } catch (error) {
      console.error("Lỗi khi lấy tỷ giá:", error);
      throw error;
    }
  },

  /**
   * Tính toán quy đổi từ tiền tệ này sang tiền tệ khác và giữ lại thông tin cả hai đơn vị
   * @param amount Số tiền cần quy đổi
   * @param fromCurrency Mã tiền tệ gốc
   * @param toCurrency Mã tiền tệ đích
   * @returns Đối tượng chứa thông tin số tiền gốc và số tiền sau khi quy đổi
   */
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<ConversionResult> {
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: amount,
        convertedCurrency: toCurrency,
        exchangeRate: 1,
      };
    }

    try {
      const ratesData = await this.getLatestRates(fromCurrency);
      const rate = ratesData.conversion_rates[toCurrency];

      if (!rate) {
        throw new Error(`Không tìm thấy tỷ giá cho ${toCurrency}`);
      }

      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: amount * rate,
        convertedCurrency: toCurrency,
        exchangeRate: rate,
      };
    } catch (error) {
      console.error("Lỗi khi quy đổi tiền tệ:", error);
      throw error;
    }
  },
};
