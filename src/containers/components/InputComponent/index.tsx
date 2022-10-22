import {Colors} from '@src/styles/colors';
import common from '@src/styles/common';
import {ms, s} from '@src/styles/scalingUtils';
import React from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {IProps} from './propState';
import styles from './styles';
import IconV from 'react-native-vector-icons/Ionicons';

export const InputComponent = React.forwardRef((props: IProps, ref: React.LegacyRef<TextInput>) => {
  return (
    <View style={{marginBottom: ms(20), flex: 1}}>
      <View style={[styles.container, props.containerStyle]}>
        {props.label && (
          <Text style={[{fontSize: ms(16), color: Colors.black, lineHeight: ms(19)}, props.labelStyle]}>
            {props.label}
          </Text>
        )}
        <View style={[styles.inputWrap, props.inputWrapStyle]}>
          {props.leftIcon && (
            <TouchableOpacity onPress={props.leftIconOnPress}>
              <Icon
                containerStyle={styles.iconLeftStyles}
                type="font-awesome-5"
                name={props.leftIcon}
                size={ms(16)}
                solid={true}
                iconStyle={{...styles.leftIconStyle, ...props.leftIconStyle}}
              />
            </TouchableOpacity>
          )}
          <TextInput
            ref={ref}
            placeholderTextColor={props.placeholderTextColor || Colors.borderColor}
            style={[styles.inputStyles, props.inputStyle]}
            {...props}
          />
          {props.invisibleRight && props.rightIcon && typeof props.rightIcon === 'string' && (
            <TouchableOpacity style={{width: '12%'}} onPress={props.rightIconOnPress}>
              <IconV name={props.rightIcon} color={Colors.primaryColor} size={20} />
            </TouchableOpacity>
          )}
          {props.rightIcon && typeof props.rightIcon !== 'string' && props.rightIcon}
        </View>
      </View>
      {props.error && (
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            fontSize: s(10),
            fontStyle: 'italic',
            marginLeft: s(20),
            marginTop: s(5),
            color: Colors.red,
            alignSelf: 'flex-end',
          }}>
          {props.error}
        </Text>
      )}
    </View>
  );
});
