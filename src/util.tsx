import {Platform} from 'react-native';
export const rem = (number,getValue = false ) => {
  if (Platform.OS === 'web') {
    return getValue ? number*0.02 : `${(number * 0.02).toFixed(5)}rem`;
  }
  return number;
};


export const getDprHeight= (number)=>{
  let isMobile = false;
  if (Platform.OS === 'web'&& 
    ((/android/i).test(navigator.userAgent) || (/iphone|ipad/i).test(navigator.userAgent))) {
    const meta = document.querySelector('meta[name="viewport"]');
    const content = meta.content;
    if (!(/initial-scale=1,/g.test(content))) {
      isMobile = true;
    }
  }
  const DPR = isMobile ? (window.devicePixelRatio || 1) : 1;
  return number * DPR;
};