import {Colors} from '@src/styles/colors';
import {ms, s} from '@src/styles/scalingUtils';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  headerCenter: {
    fontFamily: 'Roboto-Bold',
    fontSize: s(18),
    color: Colors.white,
  },
  bottomNavigation: {
    height: s(63),
    borderStyle: 'solid',
    paddingLeft: s(5),
  },
  fullTabLabelStyle: {
    fontFamily: 'Roboto-Regular',
    fontSize: s(13),
    color: Colors.manatee,
  },
  text_right: {
    textAlign: 'right',
  },
  text_center: {
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'column',
  },
  itemTitle: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: s(5),
    paddingHorizontal: s(10),
  },
  itemTitleText: {
    fontFamily: 'Roboto-Bold',
    fontSize: s(14),
    color: Colors.primaryColor,
    flex: 1,
    flexWrap: 'wrap',
  },
  itemSubTitleText: {
    fontFamily: 'Roboto',
    fontSize: s(12),
    color: Colors.primaryColor,
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: s(5),
  },
  itemRow: {
    flexDirection: 'row',
    paddingHorizontal: ms(2),
  },
  itemRowColumnFirst: {
    flexDirection: 'column',
  },
  itemRowColumn: {
    paddingLeft: ms(9),
    paddingVertical: ms(4),
    justifyContent: 'center',
  },
  itemRowHeader: {
    fontFamily: 'Roboto',
    fontSize: s(13),
    paddingVertical: s(5),
    color: Colors.black,
    fontWeight: 'bold',
  },
  itemRowDetail: {
    fontFamily: 'Roboto-Regular',
    fontSize: s(11),
    color: Colors.black,
  },
  divider: {
    backgroundColor: Colors.borderColor,
    height: s(1),
    // marginTop: s(10),
  },
  groupButton: {
    marginBottom: ms(30),
    height: ms(31),
    borderWidth: ms(1),
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
    borderRadius: ms(5),
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: ms(2),
      height: ms(4),
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: ms(8),
    paddingVertical: ms(4),
    paddingHorizontal: ms(14),
  },
  btnTouch: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    marginTop: s(40),
  },
  emptyText: {fontSize: 15, fontFamily: 'Roboto-Medium', color: Colors.primaryColor},
  txtInput: {
    color: '#A6A6A6',
    fontSize: ms(11),
    width: ms(220),
    height: ms(33),
    backgroundColor: Colors.white,
    borderColor: Colors.backgroundImg,
    borderWidth: ms(1),
    borderRadius: ms(5),
    marginBottom: ms(12),
    paddingLeft: ms(8),
  },
  btnSL: {
    borderWidth: ms(1),
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
    borderRadius: ms(5),
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: ms(2),
      height: ms(4),
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: ms(8),
    paddingVertical: ms(4),
    paddingHorizontal: ms(16),
  },
});

export default styles;
