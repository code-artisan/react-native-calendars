import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {shouldUpdate} from '../../../component-updater';

import styleConstructor from './style';

const isNativeOrWeb = Platform.OS === 'ios' || Platform.OS === 'android' || Platform.OS === 'web'

class Day extends React.Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'selected-circle', 'selected-head', 'selected-tail', 'selected', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }
  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['state', 'children', 'marking', 'onPress', 'onLongPress']);
  }

  getDayView = (dot, marking, textStyle) => {
    return (
      <>
        {
          this.props.dayRenderer ? (
            this.props.dayRenderer({
              textStyle,
              text: String(marking.dayText || this.props.children),
              ...marking,
            })
          ) : (
            <Text allowFontScaling={false} style={textStyle}>
              {String(marking.dayText || this.props.children)}
            </Text>
          )
        }
        {dot}
      </>
    )
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    const dotStyle = [this.style.dot];

    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true
      };
    }
    const isDisabled = typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled';
    let dot;
    if (marking.marked) {
      dotStyle.push(this.style.visibleDot);
      if (marking.dotColor) {
        dotStyle.push({backgroundColor: marking.dotColor});
      }
      dot = (<View style={dotStyle}/>);
    }

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      if (marking.selectedColor) {
        containerStyle.push({ backgroundColor: marking.selectedColor });
      }
      dotStyle.push(this.style.selectedDot);
      textStyle.push(this.style.selectedText);
    } else if (isDisabled) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    } else if (this.props.state === 'selected') {
      containerStyle.push(this.style.selected);
      containerStyle.push(this.style.block);
      textStyle.push(this.style.selectedText);
    } else if (this.props.state === 'selected-head') {
      containerStyle.push(this.style.selectedHead);
      textStyle.push(this.style.selectedText);
    } else if (this.props.state === 'selected-tail') {
      containerStyle.push(this.style.selectedTail);
      textStyle.push(this.style.selectedText);
    } else if (this.props.state === 'selected-circle') {
      containerStyle.push(this.style.selectedCircle);
      textStyle.push(this.style.selectedText);
    }

    return (
      <View style={{ width: '100%', display: 'flex' }}>
        {
          isNativeOrWeb ? (
            <TouchableOpacity
              style={containerStyle}
              onPress={this.onDayPress}
              onLongPress={this.onDayLongPress}
              activeOpacity={marking.activeOpacity}
              disabled={marking.disableTouchEvent}
            >
              {
                this.getDayView(dot, marking, textStyle)
              }
            </TouchableOpacity>
          ) : (
            <TouchableWithoutFeedback
              style={containerStyle}
              onPress={this.onDayPress}
              onLongPress={this.onDayLongPress}
              disabled={marking.disableTouchEvent}
            >
              {
                this.getDayView(dot, marking, textStyle)
              }
            </TouchableWithoutFeedback>
          )
        }
      </View>
    );
  }
}

export default Day;
