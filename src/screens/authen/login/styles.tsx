import {Colors} from '@src/styles/colors';
import {ms, s} from '@src/styles/scalingUtils';
import {Dimensions, StyleSheet} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';

const styles = StyleSheet.create({
  logoContainer: {
    marginHorizontal: s(-33),
    backgroundColor: '#DCDCDC',
    padding: ms(17),
    alignItems: 'center',
    ...ifIphoneX({
      paddingTop: ms(45),
    }),
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inputWrap: {
    width: ms(230),
    alignSelf: 'flex-end',
  },
});

export default styles;
