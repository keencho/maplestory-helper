import dayjs from 'dayjs';
import 'dayjs/locale/ko';

export const getTodayDate = (): string => dayjs().format('YYYY-MM-DD')

export const getNow = (): string => dayjs().format('YYYY-MM-DD HH:mm:ss')

export const isSameOrAfter = (date: dayjs.ConfigType, compareDate: dayjs.ConfigType): boolean => {
    const dj = dayjs(date);
    
    return dj.isSame(compareDate) || dj.isAfter(compareDate);
}
