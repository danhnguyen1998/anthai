import {Colors} from '@src/styles/colors';
import {ms} from '@src/styles/scalingUtils';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  btnContainer: {
    borderWidth: ms(1),
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
    borderRadius: ms(8),
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    marginBottom: ms(20)
  },
  btnText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: ms(16),
  },
});

export default styles;
