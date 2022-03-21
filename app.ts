process.env.NTBA_FIX_319 = "1";

import dotenv from 'dotenv';
import { MainService } from './src/refactor/MainService';

dotenv.config();

const cryptoPumpAlertBot = new MainService();
cryptoPumpAlertBot.start();