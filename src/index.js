export { default as Calendar } from './calendar';
export { default as CalendarList } from './calendar-list';
export { default as Agenda } from './agenda';
import { default as LocaleConfig } from 'xdate';

LocaleConfig.locales['zh-cn'] = {
  monthNames: [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
};

LocaleConfig.defaultLocale = 'zh-cn';

export { LocaleConfig }