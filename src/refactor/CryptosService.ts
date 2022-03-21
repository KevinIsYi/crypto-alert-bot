import axios from 'axios';
import { sleep } from '../helpers/sleep';
import {
	BinanceSymbols,
	CoinGeckoCryptoInfo,
	CoingeckoSymbols,
	CryptoAlertInterface,
	CryptoInfo,
} from '../interfaces/interfaces';
import {
	BinanceSymbolsResponse,
	CoingeckoSymbolsResponse,
	CryptoInfoResponse,
} from '../types/types';

export class CryptosService {
	private coinGeckoAPIURL = 'https://api.coingecko.com/api/v3/coins';
	private binanceAPIURL = 'https://api.binance.com/api/v3/exchangeInfo';
	private availableCryptos: CoingeckoSymbols[] = [];
	private cryptosInformation: CryptoInfo[] = [];
	private isProcessRunning = false;
	private sendAlert: (alertData: CryptoAlertInterface) => void;

	constructor(sendAlert: (alertData: CryptoAlertInterface) => void) {
		this.sendAlert = sendAlert;
	}

	private generateCompleteCoinGeckoURL(type: 'list' | 'coins'): string {
		return `${this.coinGeckoAPIURL}/${type}`;
	}

	public async run() {
		this.isProcessRunning = true;
		await this.mergeAvailableCryptos();

		let index = 0;
		while (this.isProcessRunning) {
			if (this.cryptosInformation.length < this.availableCryptos.length) {
				const cryptoData = await this.getCryptoData(
					this.availableCryptos[index],
					index
				);

				if (cryptoData.ok) {
					this.cryptosInformation.push(cryptoData.data);
				}
			} else {
				await this.checkCryptoChanges(this.cryptosInformation[index]);
			}

			index++;
			index %= this.availableCryptos.length;
			await sleep(1000);
		}
	}

	private async checkCryptoChanges(crypto: CryptoInfo) {
		const { index, lastPrice: prevPrice, checkTime: lastChecktime } = crypto;

		const cryptoData = await this.getCryptoData(
			this.availableCryptos[index],
			index
		);

		if (cryptoData.ok) {
			const { data } = cryptoData;
			const { lastPrice: currentPrice, checkTime, symbol } = data;

			const pricePercDiff = (currentPrice * 100) / prevPrice - 100;
			const diffMs = checkTime - lastChecktime;
			const diffMins = Math.round(diffMs / 60000);

			this.cryptosInformation[index] = data;

			if (pricePercDiff >= 1) {
				console.log('SEND ALERT');

				this.sendAlert({
					symbol,
					prevPrice,
					currentPrice,
					diffMins,
					pricePercDiff,
				});
			}
		}
	}

	private async getCryptoData(
		crypto: CoingeckoSymbols,
		index: number
	): Promise<CryptoInfoResponse> {
		try {
			const { data } = await axios.get<CoinGeckoCryptoInfo>(
				`${this.coinGeckoAPIURL}/${crypto.id}`
			);
			const {
				market_data: { current_price },
			} = data;

			if (isNaN(current_price['usd'])) {
				return {
					ok: false,
				};
			}

			return {
				ok: true,
				data: {
					...crypto,
					alert: false,
					index,
					checkTime: Date.now(),
					lastPrice: Number(current_price['usd']),
				},
			};
		} catch (error) {
			console.log('Process has ended with error', error);
			this.stop();
			return {
				ok: false,
			};
		}
	}

	private stop() {
		this.isProcessRunning = false;
	}

	private async getBinanceSymbols(): Promise<BinanceSymbolsResponse> {
		try {
			const { data } = await axios.get<BinanceSymbols>(this.binanceAPIURL);
			return {
				ok: true,
				data,
			};
		} catch (error) {
			return {
				ok: false,
			};
		}
	}

	private async getCoingeckoSymbols(): Promise<CoingeckoSymbolsResponse> {
		try {
			const coinsURL = this.generateCompleteCoinGeckoURL('list');
			const { data } = await axios.get<CoingeckoSymbols[]>(coinsURL);
			return {
				ok: true,
				data,
			};
		} catch (error) {
			return {
				ok: false,
			};
		}
	}

	private async joinSymbols() {
		const binanceSymbolsResponse = await this.getBinanceSymbols();
		const coingeckoSymbolsResponse = await this.getCoingeckoSymbols();

		if (binanceSymbolsResponse.ok && coingeckoSymbolsResponse.ok) {
			const symbols = new Set<string>();
			const currentCryptos = new Set<string>();
			const {
				data: { symbols: binanceSymbols },
			} = binanceSymbolsResponse;
			const { data: coingeckoData } = coingeckoSymbolsResponse;

			for (const { baseAsset, quoteAsset, status } of binanceSymbols) {
				if (
					(quoteAsset === 'USDT' || quoteAsset === 'BUSD') &&
					status === 'TRADING'
				) {
					symbols.add(baseAsset);
				}
			}

			for (const crypto of coingeckoData) {
				const { symbol } = crypto;
				const upperCaseSymbol = symbol.toUpperCase();
				if (symbols.has(upperCaseSymbol) && !currentCryptos.has(symbol)) {
					this.availableCryptos.push(crypto);
					currentCryptos.add(symbol);
				}
			}
		}
	}

	public async mergeAvailableCryptos() {
		await this.joinSymbols();
	}
}
