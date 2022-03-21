import { UserPoolInterface } from '../interfaces/interfaces';
import { UsersResponse } from '../types/types';

export class UserPool {
	private userPool: UserPoolInterface = {};
	private MAX_ALERTS = 3;

	public handleUserMessage(telegramID: number): UsersResponse {
		const user = this.userPool[telegramID];
		let userNumberOfAlerts: number = 0;

		if (user) {
			const { numberOfAlerts } = user;

			if (numberOfAlerts >= this.MAX_ALERTS) {
				return {
					isUserOK: false,
				};
			}

			userNumberOfAlerts = Math.min(this.MAX_ALERTS, numberOfAlerts + 1);
			this.userPool[telegramID].numberOfAlerts = userNumberOfAlerts;
		} else {
			this.userPool[telegramID] = {
				telegramChatId: telegramID,
				isBlocked: false,
				numberOfAlerts: userNumberOfAlerts,
			};
		}

		return {
			isUserOK: true,
			numberOfAlerts: userNumberOfAlerts,
		};
	}

	public getUsers(): string[] {
		return Object.keys(this.userPool);
	}
}
