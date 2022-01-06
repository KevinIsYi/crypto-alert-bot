process.env.NTBA_FIX_319 = "1";

import dotenv from 'dotenv';
import { ApiServer } from './models/ApiServer';
import { CryptoPumpBot } from "./models/CryptoPumpBot";

dotenv.config();

const apiServer = new ApiServer();
apiServer.start();
new CryptoPumpBot();