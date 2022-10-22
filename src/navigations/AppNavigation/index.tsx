import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import {StackHeaderOptions} from '@react-navigation/stack/lib/typescript/src/types';
import {useAppSelector} from '@src/boot/configureStore';
import {ASYNC_STORE} from '@src/contants/asyncStorage';
import {APP_NAVIGATION} from '@src/navigations/routes';
import DetailOrderScreen from '@src/screens/detailOrder';
import LocationOrderScreen from '@src/screens/locationOrder';
import HomeScreen from '@src/screens/home';
import MenuScreen from '@src/screens/menu';
import SearchScreen from '@src/screens/search';
import {Colors} from '@src/styles/colors';
import {s} from '@src/styles/scalingUtils';
import React, {useEffect, useRef} from 'react';
import {AppState, AppStateStatus, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {signOut} from '../redux/slice';

export type AppStackParam = {
  MENU: undefined;
  HOME: undefined;
  SEARCH: undefined;
  DETAIL_ORDER: {
    stt_rec: string;
    so_ct: string;
    ngay_ct: string;
    ten_kh: string;
    dia_chi: string;
    trang_thai: string;
    refreshList: () => void;
  };
  LOCATION_ORDER: {
    item: any;
  };
};

const Stack = createStackNavigator<AppStackParam>();

const GuestNavigationComponent = () => {
  const authState = useAppSelector((state) => state.authState);
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    if (authState.userToken)
      AsyncStorage.setItem(ASYNC_STORE.TOKEN, authState.userToken || '')
        .then(() => checkAuthenToken())
        .catch(() => dispatch(signOut()));
    else dispatch(signOut());

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') checkAuthenToken();
    appState.current = nextAppState;
  };

  const checkAuthenToken = async () => {
    // try {
    //   const res = await fetchUserInfor(authState.accountInfor.username);
    //   if (res.status.code === RESPONSE_STATUS.SUCESS) {
    //     const accountInfor: AccountInfor = {...res.data[0], username: authState.accountInfor.username};
    //     // dispatch(restoreToken(accountInfor));
    //   } else dispatch(signOut());
    // } catch (error) {
    //   dispatch(signOut());
    // }
  };

  const configHeader: StackHeaderOptions = {
    headerStyle: {backgroundColor: Colors.backgroundImg},
    headerTitleStyle: {color: Colors.black},
    headerBackTitle: 'Quay lại',
    headerBackTitleStyle: {fontSize: s(14), color: Colors.black},
    headerTintColor: Colors.black,
    headerTitle: (props) => <LogoTitle {...props} />,
  };

  function LogoTitle() {
    return <Image source={require('@src/assets/images/LogoAsiaSoft.png')} />;
  }

  return (
    <Stack.Navigator initialRouteName={APP_NAVIGATION.MENU}>
      <Stack.Screen name={APP_NAVIGATION.MENU} component={MenuScreen} options={{...configHeader, title: 'Menu'}} />
      <Stack.Screen
        name={APP_NAVIGATION.HOME}
        component={HomeScreen}
        options={{...configHeader, title: 'Danh sách đơn hàng'}}
      />
      <Stack.Screen
        name={APP_NAVIGATION.SEARCH}
        component={SearchScreen}
        options={{...configHeader, title: 'Tìm kiếm đơn hàng'}}
      />
      <Stack.Screen
        name={APP_NAVIGATION.DETAIL_ORDER}
        component={DetailOrderScreen}
        options={{...configHeader, title: 'Chi tiết đơn hàng'}}
      />
      <Stack.Screen
        name={APP_NAVIGATION.LOCATION_ORDER}
        component={LocationOrderScreen}
        options={{...configHeader, title: 'Chi tiết đơn hàng'}}
      />
    </Stack.Navigator>
  );
};

export default React.memo(GuestNavigationComponent);
