import axios from "axios";
import { CoinGeckoCryptoInfo, CoingeckoSymbols, CryptoInfo } from "../interfaces/interfaces";
import { CryptoInfoResponse } from "../types/types";

export class CryptoPrices {
    private cryptosInformation: CryptoInfo[] = [];
    private isProcessRunning = false;
    private availableCryptos: CoingeckoSymbols[];
    private coingeckoBaseURL = "https://api.coingecko.com/api/v3/coins";

    constructor(availableCryptos: CoingeckoSymbols[]) {
        this.availableCryptos = [...availableCryptos];
    }

    private async checkCryptoChanges(crypto: CryptoInfo) {
        const { index, lastPrice: prevPrice, checkTime: lastChecktime } = crypto;

        const cryptoData = await this.getCryptoData(this.availableCryptos[index], index);

        if (cryptoData.ok) {
            const { data } = cryptoData;
            const { lastPrice: currentPrice, checkTime, symbol } = data;

            const pricePercDiff = (currentPrice * 100 / prevPrice) - 100;
            const diffMs = (checkTime - lastChecktime);
            const diffMins = Math.round(diffMs / 60000);

            this.cryptosInformation[index] = data;

            console.log(`Price of: ${symbol.toUpperCase()} has changed from: ${prevPrice} to ${currentPrice} in ${diffMins} minutes`);
            console.log(`Difference: ${pricePercDiff} %`);
        }
    }

    private sleep(time: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    private async getCryptoData(crypto: CoingeckoSymbols, index: number): Promise<CryptoInfoResponse> {
        try {
            const { data } = await axios.get<CoinGeckoCryptoInfo>(`${this.coingeckoBaseURL}/${crypto.id}`);
            const { market_data: { current_price } } = data;

            return {
                ok: true,
                data: {
                    ...crypto,
                    alert: false,
                    index,
                    checkTime: Date.now(),
                    lastPrice: Number(current_price["usd"])
                }
            }
        } catch (error) {
            this.stop();
            console.log("Process has ended with error", error);

            return {
                ok: false
            }
        }
    }

    private stop() {
        this.isProcessRunning = false;
    }

    public async start() {
        this.isProcessRunning = true;

        for (let index = 0; this.isProcessRunning;) {
            if (this.cryptosInformation.length < this.availableCryptos.length) {
                const cryptoData = await this.getCryptoData(this.availableCryptos[index], index);

                if (cryptoData.ok) {
                    this.cryptosInformation.push(cryptoData.data);
                }
            }
            else {
                this.checkCryptoChanges(this.cryptosInformation[index]);
            }

            index++;

            index %= this.availableCryptos.length;

            await this.sleep(1000);

        }

    }
}