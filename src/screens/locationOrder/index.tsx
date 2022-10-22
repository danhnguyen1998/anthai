import {isLoading} from '@src/containers/redux/slice';
import {RESPONSE_STATUS} from '@src/contants/config';
import {Colors} from '@src/styles/colors';
import common from '@src/styles/common';
import {ms} from '@src/styles/scalingUtils';
import React, {useEffect, useState} from 'react';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch} from 'react-redux';
import {Props} from './propState';
import {fetchGetTon, fetchGetViTri, fetchUpdateDetailOrder} from './services';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {RNCamera, RNCameraProps} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import usePdaScan, { triggerEnum } from 'react-native-pda-scan';

const Sound = require('react-native-sound');
let cameraSound = new Sound(require('@src/assets/sounds/ting.mp3'), Sound.MAIN_BUNDLE, (error: any) => {
  if (error) {
  }
});
interface IFormInputs {
  check: boolean;
}

const LocationOrderComponent = (props: Props) => {
  const dispatch = useDispatch();

  usePdaScan({
    onEvent: (code) => {
      // if(state.showCamera){
        setState((state) => ({ ...state, ma_vitri: code.trim(), }));
      // }
    },
    onError: (error) => {
      console.log('usePdaScan err', error);
    },
    trigger: triggerEnum.always,
  });

  const onBarCodeRead = (scanResult: any) => {
    setState((state) => ({
      ...state,
      ma_vitri: scanResult,
    }));
    _offCamera();
  };

  const [state, setState] = useState({
    detailOrder: new Array(),
    ma_vitri: props.route.params.item?.tang,
    so_luong: props.route.params.item?.so_luong,
    showTint: false,
    listPosition: new Array(),
    showCamera: false,
    isScan: true,
  });

  const _save = async () => {
    try {
      dispatch(isLoading(true));
      console.log(state.ma_vitri, "rstate.ma_vitries")
      const res = await fetchGetViTri(state.ma_vitri);
      console.log(res, "op90")
      if(res.status.code = RESPONSE_STATUS.SUCESS){
        let update_order = [
          {
            stt_rec: props.route.params.item?.stt_rec,
            stt_rec0: props.route.params.item?.stt_rec0,
            ma_vt: props.route.params.item?.ma_vt,
            so_luong: state.so_luong,
            ma_vitri: state.ma_vitri,
          },
        ];
  
        const updateOrder = await fetchUpdateDetailOrder(update_order);
        if (updateOrder.status.code === RESPONSE_STATUS.SUCESS) {
          Alert.alert('Thông báo', 'Lưu thành công', [
            {
              text: 'OK',
              onPress: () => props.navigation.goBack(),
            },
          ]);
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      dispatch(isLoading(false));
    }
  };

  const _cancel = () => {
    props.navigation.goBack();
  };

  const _onChangeText = (value: string) => (evt: any) => {
    setState((state) => ({...state, [value]: evt}));
  };

  const _showTint = async () => {
    if (!state.showTint) {
      const result = await fetchGetTon(props.route.params.item?.ma_vt);
      if (result.status.code === RESPONSE_STATUS.SUCESS) {
        setState((state) => ({...state, listPosition: result.data, showTint: true}));
      }
    } else {
      setState((state) => ({...state, showTint: false}));
    }
  };

  const changePosition = (item: any) => () => {
    setState((state) => ({...state, ma_vitri: item.ma_vitri}));
  };

  const _offCamera = async () => {
    setState((state) => ({
      ...state,
      showCamera: false,
    }));
  };

  // const checkPermission = async () => {
  //   const fnGoSetting = () => {
  //     Alert.alert('Camera access', 'App needs permission to access your camera', [
  //       {text: 'Go to Setting', onPress: () => Linking.openSettings()},
  //       {text: 'Cancel', style: 'cancel'},
  //     ]);
  //   };
  //   if (Platform.OS === 'ios') {
  //     const checkCamera = await check(PERMISSIONS.IOS.CAMERA);
  //     if (checkCamera === RESULTS.GRANTED) {
  //       return true;
  //     } else if (checkCamera === RESULTS.BLOCKED) {
  //       fnGoSetting();
  //       return false;
  //     } else {
  //       const checkCamera = await request(PERMISSIONS.IOS.CAMERA);
  //       if (checkCamera === RESULTS.GRANTED) {
  //         return true;
  //       } else if (checkCamera === RESULTS.BLOCKED) {
  //         fnGoSetting();
  //         return false;
  //       } else if (checkCamera === RESULTS.DENIED) {
  //         Alert.alert('Camera access', 'App needs permission to access your camera');
  //         return false;
  //       }
  //     }
  //   } else {
  //     const checkCamera = await check(PERMISSIONS.ANDROID.CAMERA);
  //     switch (checkCamera) {
  //       case RESULTS.GRANTED:
  //         return true;
  //       case RESULTS.BLOCKED:
  //         fnGoSetting();
  //         return false;
  //       case RESULTS.DENIED:
  //         Alert.alert('Location access', 'App needs permission to access your location');
  //         return false;
  //       default:
  //         const checkCamera = await request(PERMISSIONS.ANDROID.CAMERA);
  //         if (checkCamera === RESULTS.GRANTED) {
  //           return true;
  //         } else if (checkCamera === RESULTS.BLOCKED) {
  //           fnGoSetting();
  //           return false;
  //         } else if (checkCamera === RESULTS.DENIED) {
  //           Alert.alert('Location access', 'App needs permission to access your location');
  //           return false;
  //         }
  //     }
  //   }
  // };

  const _scan = async () => {
      setState((state) => ({
        ...state,
        showCamera: true,
      }));
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <ScrollView>
          <StatusBar translucent={true} backgroundColor={Colors.backgroundImg} barStyle="light-content" />
          <>
            <View style={{paddingHorizontal: ms(16)}}>
              <View style={[common.flexRowBetween, {marginBottom: ms(12), marginTop: ms(16)}]}>
                <View style={common.flexRow}>
                  <Text style={styles.txtBold}>Mã hàng: </Text>
                  <Text style={styles.txt}>{props.route.params.item?.ma_vt}</Text>
                </View>
              </View>
              <View style={[common.flexRowStart, {marginBottom: ms(12), flexWrap: 'wrap'}]}>
                <Text style={styles.txtBold}>Tên hàng: </Text>
                <Text style={styles.txt}>{props.route.params.item?.ten_vt}</Text>
              </View>
              <View style={[common.flexRowStart, {flexWrap: 'wrap'}]}>
                <Text style={styles.txtBold}>SL KD: </Text>
                <Text style={styles.txt}>{props.route.params.item?.sl_kd}</Text>
              </View>
              <View style={[common.flexRowStart]}>
                <Text style={styles.txtBold}>SL Kho: </Text>
                <TextInput
                  selectTextOnFocus
                  style={[styles.viewInputText]}
                  value={state.so_luong.toString()}
                  onChangeText={_onChangeText('so_luong')}
                  keyboardType="number-pad"
                />
              </View>
              <View style={[common.flexRowStart]}>
                <View style={common.flexRowStart}>
                  <Text style={styles.txtBold}>Vị trí: </Text>
                  <TextInput
                    style={[styles.viewInputText]}
                    value={state.ma_vitri}
                    onChangeText={_onChangeText('ma_vitri')}
                  />
                </View>
                {/* <TouchableOpacity onPress={_scan} style={{marginLeft: ms(26)}}>
                  <Icon name="barcode-outline" color={Colors.primaryColor} size={25} />
                </TouchableOpacity> */}
              </View>
            </View>
          </>
          {state.showTint ? (
            <ScrollView style={styles.tintBox}>
              {state.listPosition.map((item, index) => (
                <TouchableOpacity style={common.flexRowStart} key={index} onPress={changePosition(item)}>
                  <Text style={{width: '50%', fontWeight: '600'}}>Vị trí: {item.ma_vitri ? item.ma_vitri : ' '}</Text>
                  <Text>{item.ton}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}
        </ScrollView>
      </KeyboardAwareScrollView>
      <View style={{marginTop: ms(26)}}>
        <View style={{flex: 1, backgroundColor: Colors.white, paddingHorizontal: ms(6)}}></View>
        <View style={[common.flexRow, {backgroundColor: Colors.white}]}>
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
          <View
            style={[
              styles.groupButton,
              {
                backgroundColor: Colors.black,
                borderColor: Colors.black,
              },
            ]}>
            <TouchableOpacity onPress={_showTint}>
              <Text style={styles.btnText}>Gợi ý vị trí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(LocationOrderComponent);
