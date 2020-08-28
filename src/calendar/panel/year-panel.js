import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import range from 'lodash/range';
import getStyle from './style';

class YearPanel extends React.PureComponent {
  static propsTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    current: PropTypes.number,
    onSelect: PropTypes.func
  }

  style = getStyle(this.props.theme)

  onChange (year) {
    this.props.onSelect(year);
  }

  render() {
    const {min, max} = this.props;

    return (
      <View style={this.style.container}>
        {
          range(min, max).map((year) => {
            return (
              <View key={year} style={this.style.item}>
                <TouchableOpacity onPress={this.onChange.bind(this, year)}>
                  <Text style={[this.style.inner, year === this.props.current ? this.style.active : null]}>{ year }</Text>
                </TouchableOpacity>
              </View>
            );
          })
        }
      </View>
    );
  }
}

export default YearPanel;
