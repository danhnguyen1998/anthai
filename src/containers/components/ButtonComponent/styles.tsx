import {Colors} from '@src/styles/colors';
import {ms} from '@src/styles/scalingUtils';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: ms(15),
    height: ms(31),
    borderWidth: ms(1),
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
    borderRadius: ms(5),
    flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: ms(2),
      height: ms(4),
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: ms(115),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  btnContainer: {
    justifyContent: 'center',
    height: ms(38),
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
});

export default styles;
