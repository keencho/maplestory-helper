import {notification} from 'antd';
import {NotificationPlacement} from 'antd/lib/notification';

export default class NotificationUtil {
	static fire(type: 'success' | 'error' | 'info' | 'warning' | 'open', message: string, options?: { description?: string, duration?: number, placement?: NotificationPlacement }) {
		notification[type]({
			top: 75,
			message: message,
			description: options?.description,
			duration: options?.duration ?? 2,
			placement: options?.placement ?? 'topRight'
		});
	}
}
