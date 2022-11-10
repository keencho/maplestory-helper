import moment from 'moment';

export default class DateTimeUtils {
	static getTodayDate = (): string => {
		return moment().format('YYYY-MM-DD');
	}
}
