import {Colors} from '@src/styles/colors';
import {ms, s} from '@src/styles/scalingUtils';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inputWrap: {
    width: ms(187),
    alignSelf: 'flex-end',
  },
  dateContainer: {
    flex: 1,
    marginBottom: ms(20),
  },
  pickerContainer: {
    borderColor: Colors.backgroundImg,
    borderWidth: ms(1),
    borderRadius: s(4),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    height: s(30),
    paddingHorizontal: s(12),
    width: ms(230),
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    flex: 1
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    position: 'absolute',
    backgroundColor: Colors.white,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: ms(10),
    borderTopRightRadius: ms(10),
  },
  modalHeder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(15),
    paddingTop: ms(15),
  },
  btnCancel: {
    fontFamily: 'Roboto-Bold',
    color: Colors.black,
  },
  btnSelect: {
    fontFamily: 'Roboto-Bold',
    color: Colors.black,
  },
});

export default styles;
