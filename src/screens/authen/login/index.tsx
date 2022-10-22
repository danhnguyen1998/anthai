import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonComponent from '@src/containers/components/ButtonComponent';
import {InputComponent} from '@src/containers/components/InputComponent';
import {isLoading} from '@src/containers/redux/slice';
import {fetchLogin} from '@src/navigations/redux/thunks';
import common from '@src/styles/common';
import {s, ms} from '@src/styles/scalingUtils';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Image, View, Text, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
import styles from './styles';
import {ASYNC_STORE} from '@src/contants/asyncStorage';
interface IFormInputs {
  username: string;
  password: string;
  tang: string;
}

const schema = yup.object().shape({
  username: yup.string().required('Tài khoản không được để trống!'),
  password: yup.string().required('Mật khẩu không được để trống!'),
  tang: yup.string().required('Tầng không được để trống!'),
});

const LogInComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const {control, handleSubmit, errors} = useForm<IFormInputs>({
    defaultValues: {
      username: '',
      password: '',
      tang: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: IFormInputs) => {
    dispatch(isLoading(true));
    try {
      AsyncStorage.setItem(ASYNC_STORE.TANG, data.tang);
      await dispatch(fetchLogin({username: data.username, password: data.password}));
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      dispatch(isLoading(false));
    }
  };

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
      <View style={{paddingHorizontal: s(33)}}>
        <View style={styles.logoContainer}>
          <Image source={require('@src/assets/images/LogoAsiaSoft.png')} />
        </View>
        <Text
          style={[
            common.title,
            {
              marginTop: ms(74),
              marginBottom: ms(104),
            },
          ]}>
          Quản lý đơn hàng
        </Text>
        <View style={common.flexRow}>
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <InputComponent
                label="Tên"
                autoCapitalize="none"
                maxLength={100}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.username?.message}
                inputWrapStyle={styles.inputWrap}
              />
            )}
            name="username"
          />
        </View>
        <View style={common.flexRow}>
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <InputComponent
                label="Mật khẩu"
                autoCapitalize="none"
                secureTextEntry={true}
                maxLength={100}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                inputWrapStyle={styles.inputWrap}
              />
            )}
            name="password"
          />
        </View>
        <View style={[common.flexRow, {marginBottom: ms(20)}]}>
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <InputComponent
                label="Tầng"
                maxLength={100}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.tang?.message}
                inputWrapStyle={styles.inputWrap}
                keyboardType="number-pad"
              />
            )}
            name="tang"
          />
        </View>
        <ButtonComponent onPress={handleSubmit(onSubmit)} text="Đăng nhập" />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default React.memo(LogInComponent);
