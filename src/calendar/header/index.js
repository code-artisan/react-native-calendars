import React, {Component} from 'react';
import {ActivityIndicator, View, Text, TouchableOpacity} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import getStyle from './style';
import {
  CHANGE_MONTH_LEFT_ARROW,
  CHANGE_MONTH_RIGHT_ARROW
} from '../../testIDs';

class CalendarHeader extends Component {
  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    year: PropTypes.string,
    month: PropTypes.string,
    mode: PropTypes.string,
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onYearPress: PropTypes.func,
    onMonthPress: PropTypes.func,
    onPrevYearPage: PropTypes.func,
    onNextYearPage: PropTypes.func,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func
  };

  style = getStyle(this.props.theme);

  addMonth = () => {
    this.props.addMonth(1);
  }

  addYear = () => {
    this.props.addMonth(12);
  }

  substractMonth = () => {
    this.props.addMonth(-1);
  }

  substractYear = () => {
    this.props.addMonth(-12);
  }

  handlePrevYear = () => {
    const {onPressArrowLeft, mode, onPrevYearPage} = this.props;

    // 如果是选年的情况，点箭头要翻完整的一页
    if (mode === 'year') {
      return onPrevYearPage();
    }

    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractYear);
    }

    return this.substractYear();
  }

  handleNextYear = () => {
    const {onPressArrowRight, mode, onNextYearPage} = this.props;

    // 如果是选年的情况，点箭头要翻完整的一页
    if (mode === 'year') {
      return onNextYearPage();
    }

    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addYear);
    }

    return this.addYear();
  }

  handlePrevMonth = () => {
    const {onPressArrowLeft} = this.props;

    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth);
    }

    return this.substractMonth();
  }

  handleNextMonth = () => {
    const {onPressArrowRight} = this.props;

    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth);
    }

    return this.addMonth();
  }

  getLeftArrows = () => {
    const {hideArrows, mode, renderArrow} = this.props;

    return hideArrows ? <View/> : (
      <View style={this.style.arrows}>
        <TouchableOpacity
          onPress={this.handlePrevYear}
          style={this.style.arrow}
          testID={CHANGE_MONTH_LEFT_ARROW}
        >
          {
            renderArrow ? renderArrow('left') : (
              <Svg viewBox="0 0 1024 1024" width="24" height="24">
                <Path d="M486.4 486.4C480 492.8 480 505.6 480 512s0 19.2 6.4 25.6L710.4 761.6C723.2 768 748.8 768 761.6 761.6S768 723.2 761.6 710.4L556.8 512l198.4-198.4c12.8-12.8 12.8-32 0-44.8s-32-12.8-44.8 0L486.4 486.4z" fill="#555555"/>
                <Path d="M537.6 710.4L332.8 512l198.4-198.4c12.8-12.8 12.8-32-1e-8-44.8s-32-12.8-44.79999999 0l-224 224.00000001C256.00000001 492.8 256.00000001 505.6 256.00000001 512s0 19.2 6.39999999 25.6L486.4 761.6C499.2 767.99999999 524.8 767.99999999 537.6 761.6S544 723.2 537.6 710.4z" fill="#555555"/>
              </Svg>
            )
          }
        </TouchableOpacity>
        {
          mode === 'week' && (
            <TouchableOpacity
              onPress={this.handlePrevMonth}
              style={this.style.arrow}
              testID={CHANGE_MONTH_LEFT_ARROW}
            >
              {
                renderArrow ? renderArrow('left') : (
                  <Svg viewBox="0 0 1024 1024" width="24" height="24">
                    <Path d="M379.73333335 486.4C373.33333335 492.8 373.33333335 505.6 373.33333335 512s0 19.2 6.4 25.6L603.73333335 761.6C616.53333335 768 642.13333335 767.99999999 654.93333335 761.59999999S661.33333335 723.2 654.93333335 710.4L450.13333335 512l198.4-198.4c12.8-12.8 12.8-32 0-44.79999999s-32-12.8-44.8-1e-8L379.73333335 486.4z" fill="#555555"></Path>
                  </Svg>
                )
              }
            </TouchableOpacity>
          )
        }
      </View>
    );
  }

  getRightArrows = () => {
    const {hideArrows, mode, renderArrow} = this.props;

    return hideArrows ? <View/> : (
      <View style={this.style.arrows}>
        {
          mode === 'week' && (
            <TouchableOpacity
              onPress={this.handleNextMonth}
              style={this.style.arrow}
              testID={CHANGE_MONTH_RIGHT_ARROW}
            >
              {
                renderArrow ? renderArrow('right') : (
                  <Svg viewBox="0 0 1024 1024" width="24" height="24">
                    <Path d="M644.26666665 537.6C650.66666665 531.2 650.66666665 518.4 650.66666665 512s0-19.2-6.4-25.6L420.26666665 262.4C407.46666665 256 381.86666665 256 369.06666665 262.4S362.66666665 300.8 369.06666665 313.6L573.86666665 512l-198.4 198.4c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L644.26666665 537.6z" fill="#555555"></Path>
                  </Svg>
                )
              }
            </TouchableOpacity>
          )
        }
        <TouchableOpacity
          onPress={this.handleNextYear}
          style={this.style.arrow}
          testID={CHANGE_MONTH_RIGHT_ARROW}
        >
          {
            renderArrow ? renderArrow('right') : (
              <Svg viewBox="0 0 1024 1024" width="24" height="24">
                <Path d="M537.6 537.6C544 531.2 544 518.4 544 512s0-19.2-6.4-25.6L313.6 262.4C300.8 256 275.2 256 262.4 262.4S256 300.8 262.4 313.6L467.2 512l-198.4 198.4c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L537.6 537.6z" fill="#555555"/>
                <Path d="M486.4 313.6L691.2 512l-198.4 198.4c-12.8 12.8-12.8 32 1e-8 44.8s32 12.8 44.79999999 0l224-224.00000001C767.99999999 531.2 767.99999999 518.4 767.99999999 512s0-19.2-6.39999999-25.6L537.6 262.4C524.8 256.00000001 499.2 256.00000001 486.4 262.4S480 300.8 486.4 313.6z" fill="#555555"/>
              </Svg>
            )
          }
        </TouchableOpacity>
      </View>
    );
  }

  getCenterAreaByMode = () => {
    const {mode, min, max, year, month} = this.props;
    const date = XDate(year, month);

    if (mode === 'year') {
      return (
        <Text allowFontScaling={false} style={this.style.yearText} accessibilityTraits='header'>
          {min} ~ {max - 1}
        </Text>
      );
    }

    if (mode === 'month') {
      return (
        <TouchableOpacity onPress={this.props.onYearPress}>
          <Text allowFontScaling={false} style={this.style.monthText} accessibilityTraits='header'>
            {year}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <React.Fragment>
        <TouchableOpacity onPress={this.props.onYearPress}>
          <Text allowFontScaling={false} style={this.style.yearText} accessibilityTraits='header'>
            {date.toString('yyyy')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.onMonthPress}>
          <Text allowFontScaling={false} style={this.style.monthText} accessibilityTraits='header'>
            {date.toString('MM')}
          </Text>
        </TouchableOpacity>
      </React.Fragment>
    );
  }

  render() {
    return (
      <View style={this.style.header}>
        { this.getLeftArrows() }
        <View style={{flexDirection: 'row'}}>
          { this.getCenterAreaByMode() }
          { this.props.showIndicator && <ActivityIndicator/> }
        </View>
        { this.getRightArrows() }
      </View>
    );
  }
}

export default CalendarHeader;
