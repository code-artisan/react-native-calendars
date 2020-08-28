import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity} from 'react-native';
import XDate from 'xdate';
import range from 'lodash/range';
import getStyle from './style';

class MonthPanel extends React.PureComponent {
  style = getStyle(this.props.theme)

  static propsTypes = {
    current: PropTypes.number,
    onSelect: PropTypes.func
  }

  onChange (month) {
    this.props.onSelect(month);
  }

  render() {
    const locales = XDate.locales[XDate.defaultLocale];

    return (
      <View style={this.style.container}>
        {
          range(0, 12).map((index) => {
            return (
              <View key={index} style={this.style.item}>
                <TouchableOpacity onPress={this.onChange.bind(this, index)}>
                  <Text style={[this.style.inner, index === this.props.current ? this.style.active : null]}>{ locales.monthNames[index] }</Text>
                </TouchableOpacity>
              </View>
            );
          })
        }
      </View>
    );
  }
}

export default MonthPanel;
