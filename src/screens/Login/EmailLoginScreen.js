//이메일로 시작하기.

import React, { useState, useRef } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert, Switch } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { API_BASE_URL } from '../../config/config';
import { Keyboard } from 'react-native';

function EmailLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordInputRef = useRef(null);
  const [errortext, setErrortext] = useState('');
  const [loading, setLoading] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAutoLogin, setIsAutoLogin] = useState(false);

  const saveAutoLoginState = async (value) => {
    try {
      await AsyncStorage.setItem('isAutoLogin', JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save the auto-login-state: ', error);
    }
  };

  // 로그인
  const handleLogin = async () => {
    if (!email) {
      Alert.alert('이메일을 입력해주세요');
      return;
    }
    if (!password) {
      Alert.alert('비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const { message, userId } = response.data;
        
        Alert.alert(message);

        await AsyncStorage.setItem('userId', userId);

        saveAutoLoginState(isAutoLogin);
        navigation.navigate('LoginSuccess');
      } else {
        Alert.alert('로그인 실패', '아이디 혹은 비밀번호가 잘못되었습니다.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('로그인 실패', '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 자동 로그인 스위치 상태 변경 함수
  const toggleAutoLogin = () => {
    const newValue = !isAutoLogin;
    setIsAutoLogin(newValue);
    saveAutoLoginState(newValue);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
    <KeyboardAvoidingView behavior={'height'} style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.titleArea}>
          <Image
            source={require('../../assets/login.png')}
            style={{ width: wp(30), resizeMode: 'contain' }}
          />
        </View>
        <View style={styles.TextArea}>
          <Text style={styles.Text}>환영합니다!</Text>
        </View>
      </View>

      <View style={styles.formArea}>
        <TextInput
          style={styles.textFormTop}
          placeholder={'이메일'}
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
          returnKeyType="next"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          style={styles.textFormBottom}
          ref={passwordInputRef}
          placeholder={'비밀번호'}
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          secureTextEntry={true}
          returnKeyType="done"
          underlineColorAndroid="transparent"
          blurOnSubmit={true}
        />
        {errortext !== '' ? <Text style={styles.TextValidation}>{errortext}</Text> : null}

        <View style={styles.autoLoginContainer}>
          <TouchableOpacity onPress={toggleAutoLogin} style={styles.autoLoginTextContainer}>
            <Text style={styles.autoLoginText}>자동 로그인</Text>
          </TouchableOpacity>
          <Switch
            value={isAutoLogin}
            onValueChange={toggleAutoLogin}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isAutoLogin ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={{ color: 'blue', marginBottom: 20 }}>비밀번호를 잊으셨나요?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 0.5 }}>
        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 2 }} />
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(7),
    paddingRight: wp(7),
  },
  topArea: {
    flex: 1,
    paddingTop: wp(15),
  },
  titleArea: {
    flex: 0.7,
    justifyContent: 'center',
    paddingTop: wp(3),
  },
  TextArea: {
    flex: 0.3,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: hp(4), // "환영합니다"와 입력 칸 사이에 여백 추가
  },
  Text: {
    fontSize: wp('4%'),
  },
  TextValidation: {
    fontSize: wp('4%'),
    color: 'red',
    paddingTop: wp(2),
  },
  formArea: {
    justifyContent: 'center',
    flex: 1.5,
  },
  textFormTop: {
    borderWidth: 2,
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },
  textFormBottom: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderColor: 'black',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },
  btnArea: {
    height: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(1.5),
  },
  btn: {
    flex: 1,
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  btnText: {
    color: 'white',
    fontSize: wp('4%'),
  },
  autoLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  autoLoginTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(2), // 텍스트와 스위치 사이에 간격을 추가
  },
  autoLoginText: {
    fontSize: wp('4%'),
    marginRight: wp(2), // 스위치와 텍스트 사이의 간격 조정
  },
});

export default EmailLoginScreen;
