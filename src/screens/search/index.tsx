import {useAppSelector} from '@src/boot/configureStore';
import ButtonComponent from '@src/containers/components/ButtonComponent';
import {InputComponent} from '@src/containers/components/InputComponent';
import common from '@src/styles/common';
import {ms, s} from '@src/styles/scalingUtils';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, View, Text, TouchableOpacity, Modal, Platform, Linking} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch} from 'react-redux';
import {Props} from './propState';
import {setSearchOrder} from './redux/slice';
import styles from './styles';
import DateTimePicker, {Event} from '@react-native-community/datetimepicker';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import moment from 'moment';
import {Colors} from '@src/styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {CameraScreen, CameraType} from 'react-native-camera-kit';
import {RNCamera, RNCameraProps} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import usePdaScan, {triggerEnum} from 'react-native-pda-scan';

interface IFormInputs {
  ngay_ct: string;
  so_ct: string;
}

const schema = yup.object().shape({
  // so_ct: yup.string().required('Số không được để trống!'),
});

const SearchComponent = (props: Props) => {
  const dispatch = useDispatch();

  const searchState = useAppSelector((state) => state.searchState);

  const [state, setState] = useState({
    showModalDateTime: false,
    currentDate: searchState.ngay_ct !== '' ? new Date(searchState.ngay_ct) : new Date(),
    txtDate: searchState.ngay_ct,
    showCamera: false,
  });

  usePdaScan({
    onEvent: (code) => {
      setValue("so_ct", code.trim());
    },
    onError: (error) => {
      console.log('usePdaScan err', error);
    },
    trigger: triggerEnum.always,
  });

  const _toggleModalDateTime = () =>
    setState((state) => ({
      ...state,
      showModalDateTime: !state.showModalDateTime,
      txtDate: '',
    }));

  const _chooseDate = () => {
    setState((state) => ({
      ...state,
      showModalDateTime: !state.showModalDateTime,
    }));
  };

  const {control, handleSubmit, setValue, errors} = useForm<IFormInputs>({
    defaultValues: {
      ngay_ct: '',
      so_ct: '',
    },
    // resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue('ngay_ct', searchState.ngay_ct);
    setValue('so_ct', searchState.so_ct);
  }, []);

  const _onChange = (_event: Event, selectedDate?: Date) => {
    if (selectedDate) {
      setState((state) => ({
        ...state,
        currentDate: selectedDate,
        showModalDateTime: Platform.OS === 'android' ? false : true,
        txtDate: selectedDate.toISOString(),
      }));
      setValue('ngay_ct', selectedDate.toISOString());
    }
  };

  const onSubmit = async (data: IFormInputs) => {
    try {
      await dispatch(
        setSearchOrder({
          ngay_ct:
            state.txtDate !== '' ? moment(state.txtDate).utc().startOf('day').add(1).toISOString() : state.txtDate,
          so_ct: data.so_ct,
        }),
      );

      props.navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  const clearSearchDate = () => {
    try {
      setState((state) => ({
        ...state,
        txtDate: '',
      }));
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  const clearSearchSCT = () => {
    try {
      setValue('so_ct', '');
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  const checkPermission = async () => {
    const fnGoSetting = () => {
      Alert.alert('Camera access', 'App needs permission to access your camera', [
        {text: 'Go to Setting', onPress: () => Linking.openSettings()},
        {text: 'Cancel', style: 'cancel'},
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

  const _scan = async () => {
    if (await checkPermission()) {
      setState((state) => ({
        ...state,
        showCamera: true,
      }));
    }
  };

  const _offCamera = async () => {
    setState((state) => ({
      ...state,
      showCamera: false,
    }));
  };

  const onBarCodeRead = (scanResult: any) => {
    setState((state) => ({
      ...state,
      showCamera: false,
    }));
    setValue('so_ct', scanResult);
  };
  const RNCameraProps: RNCameraProps = {};

  if (Platform.OS === 'ios') {
    RNCameraProps.onBarCodeRead = ({ data }) => {
      console.log(data);
    };
  } else {
    RNCameraProps.onGoogleVisionBarcodesDetected = ({ barcodes }) => {
      const response = barcodes[0];
      if(response.type !== 'UNKNOWN_FORMAT') onBarCodeRead(response.data);
    };
  }


  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
      <Text
        style={[
          common.title,
          {
            marginTop: ms(74),
            marginBottom: ms(64),
          },
        ]}>
        Tìm đơn hàng
      </Text>
      <View style={{paddingHorizontal: s(43)}}>
        <View style={common.flexRow}>
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <>
                <InputComponent
                  label="Số"
                  maxLength={100}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  inputWrapStyle={styles.inputWrap}
                  invisibleRight={value !== '' ? true : false}
                  rightIcon="close-circle-outline"
                  rightIconOnPress={clearSearchSCT}
                />
                {/* <TouchableOpacity style={{marginLeft: ms(8), marginBottom: ms(20)}} onPress={_scan}>
                  <Icon name="barcode-outline" color={Colors.primaryColor} size={35} />
                </TouchableOpacity> */}
              </>
            )}
            name="so_ct"
          />
        </View>
        <View style={[common.flexRow, {justifyContent: 'space-between', marginBottom: ms(25)}]}>
          <Text
            style={[
              common.commonTxt,
              {
                marginBottom: ms(0),
              },
            ]}>
            Ngày
          </Text>
          <View>
            <View style={styles.pickerContainer}>
              <TouchableOpacity style={{width: '90%'}} onPress={_chooseDate}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    fontSize: s(13),
                    color: Colors.textColor,
                  }}>
                  {state.txtDate !== '' ? moment(state.currentDate).format('DD/MM/YYYY') : state.txtDate}
                </Text>
              </TouchableOpacity>
              {state.txtDate !== '' && (
                <TouchableOpacity style={{width: '10%'}} onPress={clearSearchDate}>
                  <Icon name="close-circle-outline" color={Colors.primaryColor} size={20} />
                </TouchableOpacity>
              )}
            </View>

            {Platform.OS === 'ios' ? (
              <Modal animationType="fade" transparent={true} visible={state.showModalDateTime}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeder}>
                      <TouchableOpacity onPress={_toggleModalDateTime}>
                        <Text style={styles.btnCancel}>Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={_chooseDate}>
                        <Text style={styles.btnSelect}>Lựa chọn</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker display="spinner" value={state.currentDate} onChange={_onChange} />
                  </View>
                </View>
              </Modal>
            ) : null}
            {Platform.OS === 'android'
              ? state.showModalDateTime && <DateTimePicker value={state.currentDate} onChange={_onChange} />
              : null}
          </View>
        </View>
        <ButtonComponent styleContainer={{marginRight: s(5)}} onPress={handleSubmit(onSubmit)} text="Tìm" />
        <Modal animationType="fade" visible={state.showCamera}>
          {/* <CameraScreen
            actions={{leftButtonText: 'Xong'}}
            cameraType={CameraType.Back}
            scanBarcode={true}
            onReadCode={(event) => onBarCodeRead(event.nativeEvent.codeStringValue)}
            hideControls={true}
            showFrame={true}
            onBottomButtonPressed={_offCamera}
            forcusMode="off"
          /> */}
          <RNCamera
            style={{
              flex: 1,
              width: '100%',
            }}
            type={RNCamera.Constants.Type.back}
            autoFocus="on"
            captureAudio={false}
            {...RNCameraProps}
          >
            <BarcodeMask width={300} height={100} lineAnimationDuration={1000} />
            <View style={{flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 0 }}>
              <TouchableOpacity onPress={_offCamera} style={{
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
          </RNCamera>
        </Modal>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default React.memo(SearchComponent);
