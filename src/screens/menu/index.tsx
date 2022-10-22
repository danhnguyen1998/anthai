import {useAppSelector} from '@src/boot/configureStore';
import ButtonComponent from '@src/containers/components/ButtonComponent';
import {InputComponent} from '@src/containers/components/InputComponent';
import {APP_NAVIGATION} from '@src/navigations/routes';
import common from '@src/styles/common';
import {ms, s} from '@src/styles/scalingUtils';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, View, Text, TouchableOpacity, Modal, Platform, Linking} from 'react-native';
import {useDispatch} from 'react-redux';
import {Props} from './propState';
import styles from './styles';

const MenuComponent = (props: Props) => {
  const dispatch = useDispatch();

  const searchState = useAppSelector((state) => state.searchState);

  const [state, setState] = useState({
    showModalDateTime: false,
    currentDate: searchState.ngay_ct !== '' ? new Date(searchState.ngay_ct) : new Date(),
    txtDate: searchState.ngay_ct,
    showCamera: false,
  });

  const _goToOrder = () => {
    props.navigation.push(APP_NAVIGATION.HOME);
  };
  const _goToImportOrder = () => {};

  const _moveLocation = () => {};

  return (
    <View style={[common.flexAlignCenter, styles.container]}>
      <View>
        <TouchableOpacity onPress={_goToOrder} style={[styles.btnContainer, common.flexAlignCenter]}>
          <Text style={styles.btnText}>Đơn hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_goToImportOrder} style={[styles.btnContainer, common.flexAlignCenter]}>
          <Text style={styles.btnText}>Nhập hàng hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_moveLocation} style={[styles.btnContainer, common.flexAlignCenter]}>
          <Text style={styles.btnText}>Chuyển vị trí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(MenuComponent);
