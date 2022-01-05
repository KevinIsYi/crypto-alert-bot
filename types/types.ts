import { BinanceSymbols, CoingeckoSymbols, CryptoInfo } from "../interfaces/interfaces";

export type BinanceSymbolsResponse =
    { ok: true, data: BinanceSymbols }
    |
    { ok: false }

export type CoingeckoSymbolsResponse =
    { ok: true, data: CoingeckoSymbols[] }
    |
    { ok: false }

export type CryptoInfoResponse =
    { ok: true, data: CryptoInfo }
    |
    { ok: false }