import { rem } from '../util';
export default function platformStyles(appStyle) {
  return {
    knob: {
      width: rem(38),
      height: rem(7),
      marginTop: rem(10),
      borderRadius: rem(3),
      backgroundColor: '#4ac4f7'
    },
    weekdays: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: rem(24),
      paddingRight: rem(24),
      paddingTop: rem(15),
      paddingBottom: rem(7),
      backgroundColor: appStyle.calendarBackground
    },
  };
}
