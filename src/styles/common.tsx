import {Colors} from '@src/styles/colors';
import {Platform, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {vs, ms} from './scalingUtils';

export const ContainerStyled = styled.SafeAreaView`
  flex: 1;
  background: ${Colors.white};
  borderwidth: ${ms(1)};
  bordercolor: ${Colors.borderColor};
`;

export const ContainerScrollStyled = styled.ScrollView`
  flex: 1;
  background: ${Colors.white};
  padding-top: ${vs(Platform.OS === 'ios' ? 0 : 20)}px;
`;

export default StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexAlign: {
    alignItems: 'center',
  },
  flexAlignCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowStart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: Colors.black,
    fontSize: ms(24),
    textAlign: 'center',
    lineHeight: ms(32),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  screenTitle: {
    color: Colors.black,
    fontSize: ms(18),
    textAlign: 'center',
    lineHeight: ms(21),
    fontWeight: '500',
    textTransform: 'uppercase',
    paddingVertical: ms(12),
  },
  commonTxt: {
    fontSize: ms(16),
    textAlign: 'center',
    color: Colors.black,
    lineHeight: ms(19),
    marginBottom: ms(25),
  },
});
