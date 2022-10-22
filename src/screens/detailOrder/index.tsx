import { isLoading } from '@src/containers/redux/slice';
import { RESPONSE_STATUS } from '@src/contants/config';
import { Colors } from '@src/styles/colors';
import common from '@src/styles/common';
import { ms } from '@src/styles/scalingUtils';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  StatusBar,
  Text,
  View,
  Modal,
  Linking,
  Platform,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { Props } from './propState';
import { fetchDetailOrder, fetchUpdateDetailOrder, fetchUpdateLevelStatusOrder } from './services';
import styles from './styles';
import { ASYNC_STORE } from '@src/contants/asyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import ModalM from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { RNCamera, RNCameraProps } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { APP_NAVIGATION } from '@src/navigations/routes';
import usePdaScan, { triggerEnum } from 'react-native-pda-scan';

const Sound = require('react-native-sound');
let cameraSound = new Sound(require('@src/assets/sounds/ting.mp3'), Sound.MAIN_BUNDLE, (error: any) => {
  if (error) {
  }
});
interface IFormInputs {
  check: boolean;
}

const DetailOrderComponent = (props: Props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const RNCameraProps: RNCameraProps = {};

  if (Platform.OS === 'ios') {
    RNCameraProps.onBarCodeRead = ({ data }) => {
      console.log(data);
    };
  } else {
    RNCameraProps.onGoogleVisionBarcodesDetected = ({ barcodes }) => {
      const response = barcodes[0];
      console.log(response, 'err');
      if ((response.type as any) !== 'UNKNOWN_FORMAT') {
        if (state.isScan) {
          onBarCodeRead(response.data);
        }
      }
    };
  }

  const { control, setValue, getValues } = useForm<IFormInputs>({
    defaultValues: {
      check: props.route.params.trang_thai === '1' ? true : false,
    },
  });

  const [state, setState] = useState({
    detailOrder: new Array(),
    check: props.route.params.trang_thai === '1' ? true : false,
    ma_vach: '',
    showCamera: false,
    tang: 1,
    so_luong: '',
    showSoLuong: false,
    isScan: true,
    sLShow: 0,
    sLKD: 0,
    switchLocation: false,
    goal: 'update',
  });

  useEffect(() => {
    getTang();
    initdata();
    setState((state) => ({ ...state, goal: 'update'}));
  }, [state.tang, isFocused]);

  useEffect(() => {
    if (state.switchLocation) { _offCamera(); }
  }, [state.switchLocation]);

  const getTang = async () => {
    const async_tang = await AsyncStorage.getItem(ASYNC_STORE.TANG);
    if (async_tang) {
      setState((state) => ({
        ...state,
        tang: parseInt(async_tang),
      }));
    }
  };

  const initdata = async () => {
    try {
      dispatch(isLoading(true));
      const detailOrder = await fetchDetailOrder({
        stt_rec: props.route.params.stt_rec,
        tang: state.tang,
      });

      if (detailOrder.status.code === RESPONSE_STATUS.SUCESS && detailOrder.data.length > 0) {
        setState((state) => ({
          ...state,
          detailOrder: detailOrder.data,
        }));
      } else {
        setState((state) => ({ ...state, detailOrder: [] }));
      }
    } catch (error) {
      props.navigation.setOptions({ headerRight: () => null });
      Alert.alert('Lỗi', error.message);
    } finally {
      dispatch(isLoading(false));
    }
  };

  const _updateOrder = (ma_vach: string) => {
    setState((state) => ({ ...state, ma_vach: ma_vach.trim() }));

    let count = 0;
    let sl = 0;
    let sl_kd = 0;
    state.detailOrder.map((item) => {
      if (ma_vach.trim() == item.ma_vt) {
        item.so_luong = item.so_luong + 1;
        sl = item.so_luong;
        sl_kd = item.sl_kd;
        count++;
      }
    })

    if (count > 0) {
      const new_order = [...state.detailOrder];
      if (sl_kd <= sl) {
        setState((state) => ({ ...state, detailOrder: new_order, sLShow: sl, sLKD: sl_kd, switchLocation: true }));
      } else {
        setState((state) => ({ ...state, detailOrder: new_order, sLShow: sl, sLKD: sl_kd }));
      }
      cameraSound.play(() => {
        // setTimeout(function () {
        setState((state) => ({
          ...state,
          isScan: !state.isScan,
        }));
        // }, 200);
      });
    } else {
      Alert.alert('Lỗi', 'Không tồn tại vật tư');
      setState((state) => ({ ...state, showCamera: false, isScan: true }));
    }
  };

  const _updateOrderRequired = () => {
    if (state.so_luong !== '') {
      let count = 0;
      for (let i = 0; i < state.detailOrder.length; i++) {
        if (state.ma_vach == state.detailOrder[i].ma_vt) {
          state.detailOrder[i].so_luong = parseInt(state.so_luong);
          count++;
        }
      }

      if (count > 0) {
        const new_order = [...state.detailOrder];
        setState((state) => ({ ...state, detailOrder: new_order }));
      } else {
        Alert.alert('Lỗi', 'Không tồn tại vật tư');
      }
      setState((state) => ({
        ...state,
        showSoLuong: !state.showSoLuong,
        so_luong: '',
      }));
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập số lượng');
    }
  };

  const _save = async () => {
    try {
      dispatch(isLoading(true));
      let update_order = new Array();
      console.log(state.detailOrder, "do")
      state.detailOrder.map((item) => {
        if (item.so_luong > item.sl_kd) {
          Alert.alert('Lỗi', 'Số lượng kho vượt quá số lượng kinh doanh');
        } else {
          update_order.push({
            stt_rec: item.stt_rec,
            stt_rec0: item.stt_rec0,
            ma_vt: item.ma_vt,
            so_luong: item.so_luong,
            ma_vitri: item.tang,
          });
        }
      });
      if (update_order.length > 0) {
        const updateOrder = await fetchUpdateDetailOrder(update_order);
        if (updateOrder.status.code === RESPONSE_STATUS.SUCESS) {
          Alert.alert('Thông báo', 'Lưu thành công');
          initdata();
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      dispatch(isLoading(false));
    }
  };

  const _changeCheckBox = (field: keyof IFormInputs) => () => {
    const currentValue = getValues(field);

    if (!currentValue) {
      setValue(field, !currentValue);
      _updateStatus();
    }
  };

  const _updateStatus = async () => {
    try {
      dispatch(isLoading(true));
      await fetchUpdateLevelStatusOrder({
        stt_rec: props.route.params.stt_rec,
        tang: state.tang,
        trang_thai: '1',
      });
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      dispatch(isLoading(false));
    }
  };

  const _cancel = () => {
    props.navigation.goBack();
  };

  usePdaScan({
    onEvent: (code) => {
      if(state.showCamera){
        // setState((state) => ({ ...state, ma_vach: code.trim()}));
        _updateOrder(code.trim());
      } else {
        console.log("location");
      }
    },
    onError: (error) => {
      console.log('usePdaScan err', error);
    },
    trigger: triggerEnum.always,
  });

  const onBarCodeRead = (scanResult: any) => {
    setState((state) => ({
      ...state,
      isScan: false,
      ma_vach: scanResult,
    }));
    _updateOrder(scanResult);
  };

  const okPress = () => {
    // _updateOrder(state.ma_vach);
    if (state.ma_vach) {
      _goToLocation();
    }
    else Alert.alert('Lỗi', 'Vui lòng nhập mã vạch!');
  };

  const checkPermission = async () => {
    const fnGoSetting = () => {
      Alert.alert('Camera access', 'App needs permission to access your camera', [
        { text: 'Go to Setting', onPress: () => Linking.openSettings() },
        { text: 'Cancel', style: 'cancel' },
      ]);
    };
    if (Platform.OS === 'ios') {
      const checkCamera = await check(PERMISSIONS.IOS.CAMERA);
      if (checkCamera === RESULTS.GRANTED) {
        return true;
      } else if (checkCamera === RESULTS.BLOCKED) {
        fnGoSetting();
        return false;
      } else {
        const checkCamera = await request(PERMISSIONS.IOS.CAMERA);
        if (checkCamera === RESULTS.GRANTED) {
          return true;
        } else if (checkCamera === RESULTS.BLOCKED) {
          fnGoSetting();
          return false;
        } else if (checkCamera === RESULTS.DENIED) {
          Alert.alert('Camera access', 'App needs permission to access your camera');
          return false;
        }
      }
    } else {
      const checkCamera = await check(PERMISSIONS.ANDROID.CAMERA);
      switch (checkCamera) {
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          fnGoSetting();
          return false;
        case RESULTS.DENIED:
          Alert.alert('Location access', 'App needs permission to access your location');
          return false;
        default:
          const checkCamera = await request(PERMISSIONS.ANDROID.CAMERA);
          if (checkCamera === RESULTS.GRANTED) {
            return true;
          } else if (checkCamera === RESULTS.BLOCKED) {
            fnGoSetting();
            return false;
          } else if (checkCamera === RESULTS.DENIED) {
            Alert.alert('Location access', 'App needs permission to access your location');
            return false;
          }
      }
    }
  };

  const _onChangeText = (value: string) => (evt: any) => {
    setState((state) => ({ ...state, [value]: evt }));
  };

  const _scan = async () => {
      setState((state) => ({
        ...state,
        showCamera: true,
      }));
  };

  const _goToLocation = () => {
    setState((state) => ({ ...state, goal: 'location'}));
    let item;
    for (let i = 0; i < state.detailOrder.length; i++) {
      if (state.ma_vach == state.detailOrder[i].ma_vt) {
        item = state.detailOrder[i];
      }
    }
    if (!item) {
      Alert.alert('Lỗi', 'Không tồn tại vật tư');
    } else {
      props.navigation.push(APP_NAVIGATION.LOCATION_ORDER, {
        item,
      });
    }
  };

  const _offCamera = async () => {
    setState((state) => ({
      ...state,
      showCamera: false,
      switchLocation: false,
    }));
    _goToLocation();
  };

  const _showSoLuong = (ma_vach: string) => () => {
    setState((state) => ({
      ...state,
      ma_vach,
      showSoLuong: !state.showSoLuong,
    }));
  };

  const _offSoLuong = () => {
    setState((state) => ({
      ...state,
      showSoLuong: !state.showSoLuong,
      so_luong: '',
    }));
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      <ScrollView>
        <StatusBar translucent={true} backgroundColor={Colors.backgroundImg} barStyle="light-content" />
        <>
          <View style={[common.flexRow]}>
            <Text style={common.screenTitle}>Nhập số lượng đơn hàng</Text>
          </View>
          <View style={{ paddingHorizontal: ms(16) }}>
            <View style={[common.flexRowBetween, { marginBottom: ms(12), marginTop: ms(6) }]}>
              <View style={common.flexRow}>
                <Text style={styles.txtBold}>Số: </Text>
                <Text style={styles.txt}>{props.route.params.so_ct}</Text>
              </View>
              <View style={common.flexRow}>
                <Text style={styles.txtBold}>Ngày: </Text>
                <Text style={styles.txt}>{moment(props.route.params.ngay_ct).format('DD/MM/YYYY')}</Text>
              </View>
            </View>
            <View style={[common.flexRowStart, { marginBottom: ms(12), alignItems: 'flex-start', flexWrap: 'wrap' }]}>
              <Text style={styles.txtBold}>KH: </Text>
              <Text style={styles.txt}>{props.route.params.ten_kh}</Text>
            </View>

            <View style={[common.flexRowStart, { marginBottom: ms(12), alignItems: 'flex-start', flexWrap: 'wrap' }]}>
              <Text style={styles.txtBold}>ĐC: </Text>
              <Text style={styles.txt}>{props.route.params.dia_chi}</Text>
            </View>
            <View style={[common.flexRowStart, { flexWrap: 'wrap', marginBottom: ms(23) }]}>
              <TextInput
                style={styles.btnScan}
                placeholder="Mã vạch..."
                value={state.ma_vach}
                onChangeText={_onChangeText('ma_vach')}></TextInput>
              <TouchableOpacity style={{ marginLeft: ms(10) }} onPress={okPress}>
                <Text>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: ms(22) }} onPress={_scan}>
                <Icon name="barcode-outline" color={Colors.primaryColor} size={35} />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: ms(10) }} disabled>
                <Text>{state.showCamera ? 'On' : 'Off'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 / 2, position: 'relative' }}>
            <View style={[styles.itemRow, { backgroundColor: Colors.backgroundImg, marginHorizontal: ms(6) }]}>
              <View style={[styles.itemRowColumn, { width: '20%' }]}>
                <Text style={styles.itemRowHeader}>Mã hàng</Text>
              </View>
              <View style={[styles.itemRowColumn, { width: '40%' }]}>
                <Text style={[styles.itemRowHeader, { textAlign: 'center' }]}>Tên hàng</Text>
              </View>
              <View style={[styles.itemRowColumn, { width: '12%' }]}>
                <Text
                  style={[
                    styles.itemRowHeader,
                    {
                      textAlign: 'right',
                    },
                  ]}>
                  SL KD
                </Text>
              </View>
              <View style={[styles.itemRowColumn, { width: '12%' }]}>
                <Text
                  style={[
                    styles.itemRowHeader,
                    {
                      textAlign: 'right',
                    },
                  ]}>
                  SL Kho
                </Text>
              </View>
              <View style={[styles.itemRowColumn, { width: '16%' }]}>
                <Text
                  style={[
                    styles.itemRowHeader,
                    {
                      textAlign: 'right',
                    },
                  ]}>
                  Mã VT
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, backgroundColor: Colors.white, paddingHorizontal: ms(6) }}>
              {state.detailOrder.length > 0 ? (
                state.detailOrder.map((item, index) => (
                  <TouchableOpacity style={styles.itemContainer} key={index} onPress={_showSoLuong(item.ma_vt)}>
                    <View
                      style={
                        index % 2 === 0
                          ? [styles.itemRow, { backgroundColor: Colors.white }]
                          : [styles.itemRow, { backgroundColor: Colors.lightGray }]
                      }>
                      <View style={[styles.itemRowColumn, { width: '20%' }]}>
                        <Text style={styles.itemRowDetail}>{item.ma_vt}</Text>
                      </View>
                      <View style={[styles.itemRowColumn, { width: '40%' }]}>
                        <Text style={[styles.itemRowDetail, { textAlign: 'justify' }]}>{item.ten_vt}</Text>
                      </View>

                      <View style={[styles.itemRowColumn, { width: '12%' }]}>
                        <Text style={[styles.itemRowDetail, { textAlign: 'right' }]}>{item.sl_kd}</Text>
                      </View>
                      <View style={[styles.itemRowColumn, { width: '12%' }]}>
                        <Text style={[styles.itemRowDetail, { textAlign: 'right' }]}>{item.so_luong}</Text>
                      </View>
                      <View style={[styles.itemRowColumn, { width: '16%' }]}>
                        <Text style={[styles.itemRowDetail, { textAlign: 'right' }]}>{item.tang}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyView}>
                  <Text style={styles.emptyText}>Không tồn tại chi tiết đơn hàng!</Text>
                </View>
              )}
            </View>
            <Controller
              control={control}
              render={({ value }) => (
                <CheckBox
                  checked={value}
                  title={`Xong tầng ${state.tang}`}
                  containerStyle={styles.checkboxContainer}
                  onPress={_changeCheckBox('check')}
                  disabled={value}
                />
              )}
              name="check"
            />
            <View style={[common.flexRow, { backgroundColor: Colors.white }]}>
              <TouchableOpacity style={styles.groupButton} onPress={_save}>
                <TouchableOpacity>
                  <Text style={styles.btnText}>Lưu</Text>
                </TouchableOpacity>
              </TouchableOpacity>
              <View
                style={[
                  styles.groupButton,
                  {
                    backgroundColor: Colors.black,
                    borderColor: Colors.black,
                  },
                ]}>
                <TouchableOpacity onPress={_cancel}>
                  <Text style={styles.btnText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      </ScrollView>
      <Modal animationType="fade" visible={state.showCamera}>
        {/* <RNCamera
          style={{
            flex: 1,
            width: '100%',
          }}
          type={RNCamera.Constants.Type.back}
          autoFocus="on"
          captureAudio={false}
          {...RNCameraProps}>
          <BarcodeMask width={300} height={100} lineAnimationDuration={1000} /> */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0 }}>
            <TouchableOpacity
              onPress={_offCamera}
              style={{
                flex: 0,
                backgroundColor: '#fff',
                borderRadius: 5,
                padding: 15,
                paddingHorizontal: 20,
                alignSelf: 'center',
                margin: 20,
              }}>
              <Text style={{ fontSize: 14 }}>Xong</Text>
            </TouchableOpacity>
          </View>
        {/* </RNCamera> */}

        {/* {state.ma_vach && ( */}
        <View style={[common.flexRowBetween, { backgroundColor: '#fff', padding: ms(10) }]}>
          <Text>
            SL KD {state.sLKD}
          </Text>
          <Text>
            {state.ma_vach} SL {state.sLShow}
          </Text>
          <Text>Chênh lệch: {state.sLKD - state.sLShow}</Text>
        </View>
        {/* )} */}
      </Modal>
      <ModalM isVisible={state.showSoLuong} backdropOpacity={0.3} onBackdropPress={_offSoLuong} hasBackdrop={true}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: Colors.white,
            width: ms(300),
            height: ms(150),
            borderRadius: ms(10),
          }}>
          <Text style={{ fontSize: ms(18), lineHeight: ms(24), fontWeight: 'bold', paddingBottom: ms(8) }}>Số lượng</Text>
          <TextInput
            style={styles.txtInput}
            placeholder="Nhập số lượng..."
            value={state.so_luong}
            onChangeText={_onChangeText('so_luong')}
            keyboardType="number-pad"
          />
          <View style={common.flexRow}>
            <TouchableOpacity style={styles.btnSL} onPress={_updateOrderRequired}>
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
              onPress={_offSoLuong}>
              <Text style={styles.btnText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalM>
    </KeyboardAwareScrollView>
  );
};

export default React.memo(DetailOrderComponent);
