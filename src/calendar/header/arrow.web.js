import React from 'react';
import * as defaultStyle from '../../style';
import {rem} from '../../util';

class Arrow extends React.Component {
  static defaultProps={
    arrowColor: defaultStyle.textLinkColor,
    dir: 'left',
    theme: {}
  }

  render() {
    const {arrowColor, dir, theme} = this.props;
    const style = {
      display: 'block',
      width: rem(8),
      height: rem(8),
      borderLeft: `${rem(2)} solid ${theme.arrowColor || arrowColor}`,
      transform: `rotate(${ dir === 'left' ? '45deg' : '-135deg' })`,
      borderBottom: `${rem(2)} solid ${theme.arrowColor || arrowColor}`
    };

    return (
      <span style={style}/>
    );
  }
}

export default Arrow;