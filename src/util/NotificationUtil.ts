import {notification} from 'antd';

export default class NotificationUtil {
	static fire(type: 'success' | 'error' | 'info' | 'warning' | 'open', message: string, description: string, duration?: number) {
		notification[type]({
			top: 75,
			message: message,
			description: description,
			duration: duration ?? 3
		});
	}
}
