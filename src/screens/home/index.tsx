import {useAppSelector} from '@src/boot/configureStore';
import {isLoading} from '@src/containers/redux/slice';
import {RESPONSE_STATUS} from '@src/contants/config';
import {APP_NAVIGATION} from '@src/navigations/routes';
import {Colors} from '@src/styles/colors';
import common from '@src/styles/common';
import {ms, s} from '@src/styles/scalingUtils';
import moment from 'moment';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, FlatList, StatusBar, Text, TouchableOpacity, View, TextInput} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch} from 'react-redux';
import {Props} from './propState';
import {fetchListOrder, fetchListOrderSearch} from './services';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalM from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORE} from '@src/contants/asyncStorage';

const HomeComponent = (props: Props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: new Array(),
    showTang: false,
    tang: '',
  });

  const searchState = useAppSelector((state) => state.searchState);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const _showTang = () => {
    setState((state) => ({...state, showTang: !state.showTang}));
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{paddingHorizontal: s(15)}} onPress={_showTang}>
          <Icon name="settings-outline" color={Colors.primaryColor} size={25} />
        </TouchableOpacity>
      ),
    });
  }, [props.navigation]);

  useEffect(() => {
    loadListOrder(searchState.so_ct, searchState.ngay_ct).catch((error) => {
      Alert.alert('Lỗi', error.message);
    });
  }, [searchState]);

  const loadListOrder = async (so_ct: string, ngay_ct: string) => {
    const async_tang = await AsyncStorage.getItem(ASYNC_STORE.TANG);

    try {
      await dispatch(isLoading(true));
      let data: any = null;
      if (ngay_ct == '' && so_ct == '') {
        data = await fetchListOrder(async_tang as any);
      } else {
        data = await fetchListOrderSearch({
          so_ct,
          ngay_ct,
          tang: async_tang as any,
        });
      }
      if (data.status.code === RESPONSE_STATUS.SUCESS && data.data.length > 0)
        setState((state) => ({...state, data: data?.data}));
      else setState((state) => ({...state, data: []}));
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      await dispatch(isLoading(false));
    }
  };

  const _showDetail = (item: any) => () => {
    props.navigation.push(APP_NAVIGATION.DETAIL_ORDER, {
      stt_rec: item.stt_rec,
      so_ct: item.so_ct,
      ngay_ct: item.ngay_ct,
      ten_kh: item.ten_kh,
      dia_chi: item.dia_chi,
      trang_thai: item.trang_thai,
      refreshList: _refreshList,
    });
  };

  const _onChangeText = (value: string) => (evt: any) => {
    setState((state) => ({...state, [value]: evt}));
  };

  const _updateTang = () => {
    AsyncStorage.setItem(ASYNC_STORE.TANG, state.tang);
    _showTang();
  };

  const _refreshList = () => {
    loadListOrder('', '');
  };

  const _gotoSearch = () => {
    props.navigation.push(APP_NAVIGATION.SEARCH);
  };

  const _renderItem = ({item, index}: any) => (
    <TouchableOpacity style={styles.itemContainer} key={index} onPress={_showDetail(item)}>
      <View
        style={
          index % 2 === 0
            ? [styles.itemRow, {backgroundColor: Colors.white}]
            : [styles.itemRow, {backgroundColor: Colors.lightGray}]
        }>
        <View style={[styles.itemRowColumn, {width: '20%'}]}>
          <Text style={styles.itemRowDetail}>{item.ngay_ct ? moment(item.ngay_ct).format('DD/MM/YYYY') : null}</Text>
        </View>
        <View style={[styles.itemRowColumn, {width: '20%'}]}>
          <Text style={styles.itemRowDetail}>{item.so_ct}</Text>
        </View>

        <View style={[styles.itemRowColumn, {width: '20%'}]}>
          <Text style={styles.itemRowDetail}>{item.ma_kh}</Text>
        </View>
        <View style={[styles.itemRowColumn, {width: '40%'}]}>
          <Text style={styles.itemRowDetail}>{item.ten_kh}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const _keyExtractor = (_item: any, index: number) => index.toString();

  return (
    <>
      <StatusBar translucent={true} backgroundColor={Colors.backgroundImg} barStyle="light-content" />
      <View style={common.flexRow}>
        <Text style={common.screenTitle}>Danh sách đơn hàng</Text>
        <View
          style={{
            borderTopRightRadius: ms(7),
            borderTopLeftRadius: ms(7),
            borderBottomRightRadius: ms(7),
            borderBottomLeftRadius: ms(2),
            backgroundColor: Colors.primaryColor,
            paddingVertical: ms(2),
            paddingHorizontal: ms(6),
            marginBottom: ms(20),
          }}>
          <Text
            style={{
              color: Colors.white,
              fontSize: ms(12),
              lineHeight: ms(14),
            }}>
            {state.data?.length}
          </Text>
        </View>
      </View>
      <View style={[styles.itemRow, {backgroundColor: Colors.backgroundImg, marginHorizontal: ms(6)}]}>
        <View style={[styles.itemRowColumn, {width: '20%'}]}>
          <Text style={styles.itemRowHeader}>Ngày</Text>
        </View>
        <View style={[styles.itemRowColumn, {width: '20%'}]}>
          <Text style={styles.itemRowHeader}>Số</Text>
        </View>
        <View style={[styles.itemRowColumn, {width: '20%'}]}>
          <Text style={styles.itemRowHeader}>Mã KH</Text>
        </View>
        <View style={[styles.itemRowColumn, {width: '40%'}]}>
          <Text style={styles.itemRowHeader}>Tên KH</Text>
        </View>
      </View>
      <FlatList
        style={{flex: 1, backgroundColor: Colors.white, paddingHorizontal: ms(6)}}
        keyExtractor={_keyExtractor}
        data={state.data}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>Không tồn tại đơn hàng!</Text>
          </View>
        }
      />
      <View style={[common.flexRow, {backgroundColor: Colors.white}]}>
        <View style={styles.groupButton}>
          <TouchableOpacity onPress={_gotoSearch}>
            <Text style={styles.btnText}>Tìm đơn hàng</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.groupButton}>
          <TouchableOpacity onPress={_refreshList}>
            <Text style={styles.btnText}>Cập nhật đơn mới</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ModalM isVisible={state.showTang} backdropOpacity={0.3} onBackdropPress={_showTang} hasBackdrop={true}>
        <View
          style={[
            {
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.white,
              width: ms(300),
              height: ms(150),
              borderRadius: ms(10),
            },
          ]}>
          <Text style={{fontSize: ms(18), lineHeight: ms(24), fontWeight: 'bold', paddingBottom: ms(8)}}>Tầng</Text>
          <TextInput
            style={styles.txtInput}
            placeholder="Nhập số tầng..."
            value={state.tang}
            onChangeText={_onChangeText('tang')}
            keyboardType="number-pad"
          />
          <View style={common.flexRow}>
            <TouchableOpacity style={styles.btnSL} onPress={_updateTang}>
              <Text style={styles.btnText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnSL,
                {
                  backgroundColor: Colors.black,
                  borderColor: Colors.black,
                },
              ]}
              onPress={_showTang}>
              <Text style={styles.btnText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalM>
    </>
  );
};

export default React.memo(HomeComponent);
