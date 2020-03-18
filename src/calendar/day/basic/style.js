import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../../../style';

const STYLESHEET_ID = 'stylesheet.day.basic';

const SIZE = 32

export default function styleConstructor(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    base: {
      display: 'flex',
      alignSelf: 'center',
      height: SIZE,
      alignItems: 'center',
      borderRadius: SIZE / 2,
    },
    text: {
      marginTop: Platform.OS === 'android' ? 4 : 6,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: '300',
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)'
    },
    alignedText: {
      marginTop: Platform.OS === 'android' ? 4 : 6
    },
    block: {
      width: '100%',
      borderRadius: 0
    },
    selected: {
      backgroundColor: appStyle.selectedDayBackgroundColor,
    },
    today: {
      width: SIZE,
      backgroundColor: appStyle.todayBackgroundColor,
    },
    todayText: {
      color: appStyle.todayTextColor,
      alignItems: 'center',
    },
    selectedHead: {
      width: '100%',
      backgroundColor: appStyle.selectedDayBackgroundColor,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    selectedTail: {
      width: '100%',
      backgroundColor: appStyle.selectedDayBackgroundColor,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    selectedText: {
      color: appStyle.selectedDayTextColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
    },
    dot: {
      width: 4,
      height: 4,
      marginTop: 1,
      borderRadius: 2,
      opacity: 0
    },
    visibleDot: {
      opacity: 1,
      backgroundColor: appStyle.dotColor
    },
    selectedDot: {
      backgroundColor: appStyle.selectedDotColor
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
