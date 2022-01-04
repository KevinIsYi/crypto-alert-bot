import { BinanceSymbols, CoingeckoSymbols } from "../interfaces/interfaces";

export type BinanceSymbolsResponse =
    { ok: true, data: BinanceSymbols }
    |
    { ok: false }

export type CoingeckoSymbolsResponse =
    { ok: true, data: CoingeckoSymbols[] }
    |
    { ok: false }
