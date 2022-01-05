import { CoingeckoSymbols, CryptoInfo } from "../interfaces/interfaces";
import { CryptoInfoResponse } from "../types/types";

export class CryptoPrices {
    private cryptosInformation: CryptoInfo[] = [];
    private isProcessRunning = false;
    private availableCryptos: CoingeckoSymbols[];

    constructor(availableCryptos: CoingeckoSymbols[]) {
        this.availableCryptos = [...availableCryptos];
    }

    private async checkCryptoChanges(crypto: CryptoInfo) {
        console.log("Me llamaron con: ", crypto);

    }

    private sleep(time: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    private getCryptoData(crypto: CoingeckoSymbols, index: number): /* Promise< */CryptoInfoResponse/*> */ {
        try {
            return {
                ok: true,
                data: {
                    ...crypto,
                    index,
                    priceTenMinAgo: 0
                }
            }
        } catch (error) {
            this.stop();

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
            

            if (index === 10) {
                break;
            }
        }

        // for (const crypto of this.availableCryptos) {
        //     this.getCryptoData(crypto);        

        //     const cryptoInfo: CryptoInfo = {
        //         ...crypto,
        //         index,
        //         priceTenMinAgo: 0,
        //         interval: null
        //     }

        //     const interval = setInterval(() => {
        //         this.checkCryptoChanges(cryptoInfo, index);
        //     }, 3000);

        //     cryptoInfo.interval = interval;

        //     index++;
        //     await this.sleep(1000);
        // }
    }
}