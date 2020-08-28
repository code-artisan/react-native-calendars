import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

import XDate from 'xdate';
import dateutils from '../dateutils';
import {xdateToData, parseDate} from '../interface';
import getStyle from './style';
import CalendarHeader from './header';
import shouldComponentUpdate from './updater';
import WeekPanel from './panel/week-panel';
import YearPanel from './panel/year-panel';
import MonthPanel from './panel/month-panel';

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
    // Year format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
    yearFormat: PropTypes.string,
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

  static defaultProps = {
    current: new Date()
  }

  constructor(props) {
    super(props);

    this.style = getStyle(this.props.theme);
    let current;

    if (props.isMultiSelect) {
      current = parseDate(props.current.start);
    } else if (props.current) {
      current = parseDate(props.current);
    } else {
      current = XDate();
    }

    const [year, month] = [current.toString('yyyy'), `${current.toString('MM') - 1}`];
    this.state = {
      mode: 'week',
      year,
      month,
      min: parseInt(year, 10) - 4,
      max: parseInt(year, 10) + 8,
      selectedDate: getSelectedDateState(props.current, props.isMultiSelect)
    };
  }

  shouldComponentUpdate = shouldComponentUpdate

  static getDerivedStateFromProps(props) {
    return {
      selectedDate: getSelectedDateState(props.current, props.isMultiSelect)
    };
  }

  getYearAndMonthByState = () => {
    return XDate(this.state.year, this.state.month);
  }

  updateMonth = (day, doNotTriggerListeners) => {
    if (day.toString('yyyy MM') === this.getYearAndMonthByState().toString('yyyy MM')) {
      return;
    }

    const newState = {
      year: day.toString('yyyy'),
      month: `${day.toString('MM') - 1}`
    };

    newState.min = parseInt(newState.year, 10) - 4;
    newState.max = parseInt(newState.year, 10) + 8;

    this.setState(newState, () => {
      if (!doNotTriggerListeners) {
        const currMont = this.getYearAndMonthByState().clone();
        if (this.props.onMonthChange) {
          this.props.onMonthChange(xdateToData(currMont));
        }

        if (this.props.onVisibleMonthsChange) {
          this.props.onVisibleMonthsChange([xdateToData(currMont)]);
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
        interaction(xdateToData(day));
      }
    }
  }

  handlePressDay = (date) => {
    this._handleDayInteraction(date, this.props.onDayPress);
  }

  handleLongPressDay = (date) => {
    this._handleDayInteraction(date, this.props.onDayLongPress);
  }

  addMonth = (count) => {
    this.updateMonth(this.getYearAndMonthByState().clone().addMonths(count, true));
  }

  handleSelectYear = (year) => {
    this.setState({year: year.toString(), mode: 'month'});
  }

  handleSelectMonth = (month) => {
    this.setState({month: month.toString(), mode: 'week'});
  }

  getPanelByMode = (year, month) => {
    const {mode, min, max} = this.state;
    if (mode === 'year') {
      return (
        <YearPanel min={min} max={max} onSelect={this.handleSelectYear} current={year}/>
      );
    }

    if (mode === 'month') {
      return (
        <MonthPanel onSelect={this.handleSelectMonth} current={month}/>
      );
    }

    return (
      <WeekPanel theme={this.props.theme}
        year={year}
        month={month}
        current={this.props.current}
        onPress={this.handlePressDay}
        firstDay={this.props.firstDay}
        onLongPress={this.handleLongPressDay}
        hideDayNames={this.props.hideDayNames}
        weekNumbers={this.props.showWeekNumbers}
        hideExtraDays={this.props.hideExtraDays}
      />
    );
  }

  handleYearPress = () => {
    this.setState({mode: 'year'});
  }

  handleMonthPress = () => {
    this.setState({mode: 'month'});
  }

  handlePrevYearPage = () => {
    this.setState((state) => {
      return {
        min: state.min - 12,
        max: state.max - 12
      };
    });
  }

  handleNextYearPage = () => {
    this.setState((state) => {
      return {
        min: state.min + 12,
        max: state.max + 12
      };
    });
  }

  render() {
    let indicator;
    const current = parseDate(this.props.current);
    if (current) {
      const lastMonthOfDay = current.clone().addMonths(1, true).setDate(1).addDays(-1).toString('yyyy-MM-dd');

      const {displayLoadingIndicator, markedDates} = this.props;
      if (displayLoadingIndicator && !(markedDates && markedDates[lastMonthOfDay])) {
        indicator = true;
      }
    }

    const year = parseInt(this.state.year, 10);
    const month = parseInt(this.state.month, 10);

    console.log(this.state.min, this.state.max, 'min && max');

    return (
      <View style={[this.style.container, this.props.style]}>
        <CalendarHeader
          theme={this.props.theme}
          hideArrows={this.props.hideArrows}
          year={this.state.year}
          month={this.state.month}
          addMonth={this.addMonth}
          showIndicator={indicator}
          mode={this.state.mode}
          min={this.state.min}
          max={this.state.max}
          firstDay={this.props.firstDay}
          renderArrow={this.props.renderArrow}
          monthFormat={this.props.monthFormat}
          yearFormat={this.props.yearFormat}
          hideDayNames={this.props.hideDayNames}
          weekNumbers={this.props.showWeekNumbers}
          onYearPress={this.handleYearPress}
          onMonthPress={this.handleMonthPress}
          onPrevYearPage={this.handlePrevYearPage}
          onNextYearPage={this.handleNextYearPage}
          onPressArrowLeft={this.props.onPressArrowLeft}
          onPressArrowRight={this.props.onPressArrowRight}
        />
        { this.getPanelByMode(year, month) }
      </View>
    );
  }
}

export default Calendar;
