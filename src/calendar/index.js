import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

import XDate from 'xdate';
import dateutils from '../dateutils';
import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
import Day from './day/basic';
import UnitDay from './day/period';
import MultiDotDay from './day/multi-dot';
import MultiPeriodDay from './day/multi-period';
import SingleDay from './day/custom';
import CalendarHeader from './header';
import shouldComponentUpdate from './updater';

const getSelectedDateState = (current, isMultiSelect) => {
  let [start, end] = [];

  if (!current) {
    return {
      start: new XDate()
    };
  }

  if (isMultiSelect) {
    start = parseDate(current.start, false);
    end = parseDate(current.end, false);
  } else {
    start = parseDate(current, false);
    end = parseDate(current, false);
  }

  if (start > end) {
    [start, end] = [end, start];
  }

  return {start, end};
};

//Fallback when RN version is < 0.44
// const viewPropTypes = ViewPropTypes || View.propTypes;

const EmptyArray = [];

class Calendar extends Component {
  static propTypes = {
    isMultiSelect: PropTypes.bool,

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    // Collection of dates that have to be marked. Default = {}
    markedDates: PropTypes.object,

    // Specify style for calendar container element. Default = {}
    style: PropTypes.any,
    // Initially visible month. Default = Date()
    current: PropTypes.any,
    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
    minDate: PropTypes.any,
    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
    maxDate: PropTypes.any,

    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
    firstDay: PropTypes.number,

    // Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple'
    markingType: PropTypes.string,

    // Hide month navigation arrows. Default = false
    hideArrows: PropTypes.bool,
    // Display loading indicador. Default = false
    displayLoadingIndicator: PropTypes.bool,
    // Do not show days of other months in month page. Default = false
    hideExtraDays: PropTypes.bool,

    // Handler which gets executed on day press. Default = undefined
    onDayPress: PropTypes.func,
    // Handler which gets executed on day long press. Default = undefined
    onDayLongPress: PropTypes.func,
    // Handler which gets executed when visible month changes in calendar. Default = undefined
    onMonthChange: PropTypes.func,
    onVisibleMonthsChange: PropTypes.func,
    // Replace default arrows with custom ones (direction can be 'left' or 'right')
    renderArrow: PropTypes.func,
    // Provide custom day rendering component
    dayComponent: PropTypes.any,
    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
    monthFormat: PropTypes.string,
    // Disables changing month when click on days of other months (when hideExtraDays is false). Default = false
    disableMonthChange: PropTypes.bool,
    //  Hide day names. Default = false
    hideDayNames: PropTypes.bool,
    // Disable days by default. Default = false
    disabledByDefault: PropTypes.bool,
    // Show week numbers. Default = false
    showWeekNumbers: PropTypes.bool,
    // Handler which gets executed when press arrow icon left. It receive a callback can go back month
    onPressArrowLeft: PropTypes.func,
    // Handler which gets executed when press arrow icon left. It receive a callback can go next month
    onPressArrowRight: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(this.props.theme);
    let currentMonth;

    if (props.isMultiSelect) {
      currentMonth = parseDate(props.current.start);
    } else if (props.current) {
      currentMonth = parseDate(props.current);
    } else {
      currentMonth = XDate();
    }

    this.state = {
      currentMonth,
      selectedDate: getSelectedDateState(props.current, props.isMultiSelect)
    };
  }

  shouldComponentUpdate = shouldComponentUpdate

  static getDerivedStateFromProps(props) {
    return {
      selectedDate: getSelectedDateState(props.current, props.isMultiSelect)
    };
  }

  updateMonth = (day, doNotTriggerListeners) => {
    if (day.toString('yyyy MM') === this.state.currentMonth.toString('yyyy MM')) {
      return;
    }

    this.setState({
      currentMonth: day.clone()
    }, () => {
      if (!doNotTriggerListeners) {
        const currMont = this.state.currentMonth.clone();
        if (this.props.onMonthChange) {
          this.props.onMonthChange(currMont.toString('YYYY-MM'));
        }

        if (this.props.onVisibleMonthsChange) {
          this.props.onVisibleMonthsChange([currMont.toString('YYYY-MM')]);
        }
      }
    });
  }

  getSelectedDate(start, end) {
    const stateValue = {
      start,
      end: start
    };

    if (typeof end !== 'undefined') {
      stateValue.end = end;
    }

    return stateValue;
  }

  getSingleSelectedState = (value) => {
    return {
      selectedDate: getSelectedDateState(value.valueOf())
    };
  }

  getMultipleSelectedState = (value) => {
    const {selectedDate} = this.state;
    const {start, end} = selectedDate;

    const valueUnix = value.valueOf();
    const state = {
      selectedDate
    };

    if (end) {
      state.selectedDate = this.getSelectedDate(valueUnix, 0);
    } else {
      state.selectedDate.end = Math.max(valueUnix, +start);
      state.selectedDate.start = Math.min(valueUnix, +start);
    }

    return state;
  }

  _handleDayInteraction(date, interaction) {
    const {minDate, maxDate, isMultiSelect, disableMonthChange} = this.props;
    const day = parseDate(date);
    const _minDate = parseDate(minDate);
    const _maxDate = parseDate(maxDate);

    this.setState(isMultiSelect ? this.getMultipleSelectedState(day) : this.getSingleSelectedState(day));

    if (!(_minDate && !dateutils.isGTE(day, _minDate)) && !(_maxDate && !dateutils.isLTE(day, _maxDate))) {
      const shouldUpdateMonth = disableMonthChange === undefined || !disableMonthChange;
      if (shouldUpdateMonth) {
        this.updateMonth(day);
      }

      if (interaction) {
        interaction(date.dateString);
      }
    }
  }

  pressDay = (date) => {
    this._handleDayInteraction(date, this.props.onDayPress);
  }

  longPressDay = (date) => {
    this._handleDayInteraction(date, this.props.onDayLongPress);
  }

  addMonth = (count) => {
    this.updateMonth(this.state.currentMonth.clone().addMonths(count, true));
  }

  renderDay(day, id) {
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    let state = '';

    if (this.props.disabledByDefault) {
      state = 'disabled';
    } else if ((minDate && !dateutils.isGTE(day, minDate)) || (maxDate && !dateutils.isLTE(day, maxDate))) {
      state = 'disabled';
    } else if (!dateutils.sameMonth(day, this.state.currentMonth)) {
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

    if (!dateutils.sameMonth(day, this.state.currentMonth) && this.props.hideExtraDays) {
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
          onPress={this.pressDay}
          dayRenderer={this.props.dayRenderer}
          onLongPress={this.longPressDay}
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

  getDateMarking(day) {
    if (!this.props.markedDates) {
      return false;
    }
    const dates = this.props.markedDates[day.toString('yyyy-MM-dd')] || EmptyArray;
    if (dates.length || dates) {
      return dates;
    } else {
      return false;
    }
  }

  renderWeekNumber (weekNumber) {
    return <Day key={`week-${weekNumber}`} theme={this.props.theme} marking={{disableTouchEvent: true}} state='disabled'>{weekNumber}</Day>;
  }

  renderWeek(days, id) {
    const week = [];
    days.forEach((day, id2) => {
      week.push(this.renderDay(day, id2));
    }, this);

    if (this.props.showWeekNumbers) {
      week.unshift(this.renderWeekNumber(days[days.length - 1].getWeek()));
    }

    return (
      <View style={this.style.week} key={id}>{week}</View>
    );
  }

  render() {
    const days = dateutils.page(this.state.currentMonth, this.props.firstDay);

    const weeks = [];
    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }

    let indicator;
    const current = parseDate(this.props.current);
    if (current) {
      const lastMonthOfDay = current.clone().addMonths(1, true).setDate(1).addDays(-1).toString('yyyy-MM-dd');
      if (this.props.displayLoadingIndicator &&
          !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])) {
        indicator = true;
      }
    }

    return (
      <View style={[this.style.container, this.props.style]}>
        <CalendarHeader
          theme={this.props.theme}
          hideArrows={this.props.hideArrows}
          month={this.state.currentMonth}
          addMonth={this.addMonth}
          showIndicator={indicator}
          firstDay={this.props.firstDay}
          renderArrow={this.props.renderArrow}
          monthFormat={this.props.monthFormat}
          hideDayNames={this.props.hideDayNames}
          weekNumbers={this.props.showWeekNumbers}
          onPressArrowLeft={this.props.onPressArrowLeft}
          onPressArrowRight={this.props.onPressArrowRight}
        />
        <View style={this.style.monthView}>{weeks}</View>
      </View>
    );
  }
}

export default Calendar;
