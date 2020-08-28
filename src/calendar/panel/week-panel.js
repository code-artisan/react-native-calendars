import React from 'react';
import {View, Text} from 'react-native';
import XDate from 'xdate';
import {xdateToData, parseDate} from '../../interface';
import Day from '../day/basic';
import UnitDay from '../day/period';
import MultiDotDay from '../day/multi-dot';
import MultiPeriodDay from '../day/multi-period';
import SingleDay from '../day/custom';
import dateutils from '../../dateutils';
import getStyle from './style';

const EmptyArray = [];

class WeekPanel extends React.PureComponent {
  style = getStyle(this.props.theme);

  getDateMarking(day) {
    if (!this.props.markedDates) {
      return false;
    }

    const dates = this.props.markedDates[day.toString('yyyy-MM-dd')] || EmptyArray;
    if (dates.length || dates) {
      return dates;
    }

    return false;
  }

  renderWeek(days, id) {
    const week = [];
    days.forEach((day, id2) => {
      week.push(this.renderDay(day, id2));
    });

    if (this.props.showWeekNumbers) {
      week.unshift(this.renderWeekNumber(days[days.length - 1].getWeek()));
    }

    return (
      <View style={this.style.week} key={id}>{week}</View>
    );
  }

  renderWeekNumber (weekNumber) {
    return (
      <Day key={`week-${weekNumber}`} theme={this.props.theme} marking={{disableTouchEvent: true}} state='disabled'>{weekNumber}</Day>
    );
  }

  renderDay(day, id) {
    const yearAndMonth = XDate(this.props.year, this.props.month);

    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    let state = '';

    if (this.props.disabledByDefault) {
      state = 'disabled';
    } else if ((minDate && !dateutils.isGTE(day, minDate)) || (maxDate && !dateutils.isLTE(day, maxDate))) {
      state = 'disabled';
    } else if (!dateutils.sameMonth(day, yearAndMonth)) {
      state = 'disabled';
    } else if (this.props.isMultiSelect) {
      const {selectedDate} = this.state;
      const isSameDateOfStartAndEnd = dateutils.sameDate(selectedDate.start, selectedDate.end);

      if (isSameDateOfStartAndEnd && dateutils.sameDate(day, selectedDate.start)) {
        state = 'selected-circle';
      } else if (dateutils.sameDate(day, selectedDate.start)) {
        state = 'selected-head';
      } else if (dateutils.sameDate(day, selectedDate.end)) {
        state = 'selected-tail';
      } else if (dateutils.sameDate(day, XDate())) {
        state = dateutils.between(selectedDate.start, selectedDate.end, day) ? 'selected' : 'today';
      } else if (dateutils.between(selectedDate.start, selectedDate.end, day)) {
        state = 'selected';
      }
    } else if (dateutils.sameDate(day, new XDate(this.props.current))) {
      state = 'today';
    }

    if (!dateutils.sameMonth(day, yearAndMonth) && this.props.hideExtraDays) {
      return (
        <View key={id} style={{flex: 1}}/>
      );
    }

    const DayComp = this.getDayComponent();
    const date = day.getDate();

    return (
      <View style={{flex: 1, alignItems: 'center'}} key={id}>
        <DayComp
          state={state}
          theme={this.props.theme}
          onPress={this.props.onPress}
          dayRenderer={this.props.dayRenderer}
          onLongPress={this.props.onLongPress}
          date={xdateToData(day)}
          marking={this.getDateMarking(day)}
        >
          {date}
        </DayComp>
      </View>
    );
  }

  getDayComponent() {
    if (this.props.dayComponent) {
      return this.props.dayComponent;
    }

    switch (this.props.markingType) {
    case 'period':
      return UnitDay;
    case 'multi-dot':
      return MultiDotDay;
    case 'multi-period':
      return MultiPeriodDay;
    case 'custom':
      return SingleDay;
    default:
      return Day;
    }
  }

  render() {
    const days = dateutils.page(XDate(this.props.year, this.props.month), this.props.firstDay);

    const weeks = [];
    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }

    return (
      <React.Fragment>
        <View style={this.style.header}>
          {
            this.props.hideDayNames ? null : (
              <View style={this.style.week}>
                {
                  this.props.weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader}/>
                }
                {
                  dateutils.weekDayNames(this.props.firstDay).map((day, index) => (
                    <Text allowFontScaling={false} key={index} accessible={false} style={this.style.dayHeader} numberOfLines={1} importantForAccessibility='no'>{day}</Text>
                  ))
                }
              </View>
            )
          }
        </View>
        <View style={this.style.monthView}>{weeks}</View>
      </React.Fragment>
    );
  }
}

export default WeekPanel;
