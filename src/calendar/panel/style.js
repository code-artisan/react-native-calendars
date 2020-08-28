import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';

const STYLESHEET_ID = 'stylesheet.calendar.main';

export default function getStyle(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    control: {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 22,
      paddingBottom: 22
    },
    center: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center'
    },
    item: {
      display: 'flex',
      flexBasis: '33.33333333333333333%',
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 9
    },
    inner: {
      width: 52,
      textAlign: 'center',
      paddingVertical: 8,
      borderRadius: 4
    },
    active: {
      backgroundColor: '#3267F0',
      color: '#fff'
    },
    monthView: {
      backgroundColor: appStyle.calendarBackground
    },
    week: {
      marginTop: 7,
      marginBottom: 7,
      flexDirection: 'row'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    dayHeader: {
      marginTop: 2,
      marginBottom: 7,
      flex: 1,
      textAlign: 'center',
      fontSize: appStyle.textDayHeaderFontSize,
      fontFamily: appStyle.textDayHeaderFontFamily,
      color: appStyle.textSectionTitleColor
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
