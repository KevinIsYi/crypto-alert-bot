import axios from "axios";
import { BinanceSymbols, CoingeckoSymbols } from "../interfaces/interfaces";
import { BinanceSymbolsResponse, CoingeckoSymbolsResponse } from "../types/types";

export class CryptoSymbols {
    private coinGeckoAPIUrl = "https://api.coingecko.com/api/v3/coins/list";
    private binanceAPIUrl = "https://api.binance.com/api/v3/exchangeInfo";
    private binanceAvailableSymbols: CoingeckoSymbols[] = [];

    constructor() {
        this.joinSymbols();
    }

    private async getBinanceSymbols(): Promise<BinanceSymbolsResponse> {
        try {
            const { data } = await axios.get<BinanceSymbols>(this.binanceAPIUrl);
            return {
                ok: true,
                data
            }
        } catch (error) {
            return {
                ok: false
            }
        }
    }

    private async getCoingeckoSymbols(): Promise<CoingeckoSymbolsResponse> {
        try {
            const { data } = await axios.get<CoingeckoSymbols[]>(this.coinGeckoAPIUrl);
            return {
                ok: true,
                data
            }
        } catch (error) {
            return {
                ok: false
            }
        }
    }

    private async joinSymbols() {
        const binanceSymbolsResponse = await this.getBinanceSymbols();
        const coingeckoSymbolsResponse = await this.getCoingeckoSymbols();

        if (binanceSymbolsResponse.ok && coingeckoSymbolsResponse.ok) {
            const symbols = new Set<string>();
            const { data: { symbols: binanceSymbols } } = binanceSymbolsResponse;
            const { data: coingeckoData } = coingeckoSymbolsResponse;

            for (const { baseAsset } of binanceSymbols) {
                symbols.add(baseAsset);
            }

            for (const crypto of coingeckoData) {
                const { symbol } = crypto;
                const upperCaseSymbol = symbol.toUpperCase();
                if (symbols.has(upperCaseSymbol)) {
                    this.binanceAvailableSymbols.push(crypto);
                }
            }
        }
    }

    public getSymbols() {
        return [...this.binanceAvailableSymbols];
    }
}