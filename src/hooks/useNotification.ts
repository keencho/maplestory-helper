import {App} from "antd";
import {NotificationPlacement} from "antd/es/notification/interface";

type NotificationType =
    | 'success'
    | 'error'
    | 'info'
    | 'warning'

const useNotification = () => {
    const { notification } = App.useApp();
    
    const messageMap = new Map<NotificationType, string>();
    messageMap.set('success', '성공');
    messageMap.set('error', '에러');
    messageMap.set('info', '정보');
    messageMap.set('warning', '경고');

    return (
        type: NotificationType,
        message: string,
        options?: { title?: string, duration?: number, placement?: NotificationPlacement }
    ) => {
        notification[type]({
            message: options?.title ?? messageMap.get(type),
            description: message,
            duration: options?.duration ?? 2,
            placement: options?.placement ?? 'topRight'
        })
    };
}

export default useNotification
