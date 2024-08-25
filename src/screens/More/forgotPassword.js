// 비밀번호 찾기 PAGE

import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../config/config';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [isFetchingPassword, setIsFetchingPassword] = useState(false); // 추가된 상태

  // 인증번호 전송 버튼
  const sendVerificationCode = async () => {
    try {
      const response = await axios.post(
       `${ API_BASE_URL }/send-verification-code`,
        `email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('성공', '인증번호를 전송했습니다!');
      } else {
        Alert.alert('실패', '전송 실패!');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      Alert.alert('Error', 'An error occurred while sending the verification code.');
    }
  };

  // 인증번호 일치 검사
  const verifyCode = async () => {
    try {
      const response = await axios.post(
        `${ API_BASE_URL }/verify-code`,
        `email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const data = response.data;
      if (data === '인증이 완료되었습니다.') {
        setIsVerified(true); // 인증 성공 시 true로 설정
      }
      Alert.alert('알림', data); // 응답 메시지를 사용자에게 알림으로 표시
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', '인증 코드 검증 중 오류가 발생했습니다.');
    }
  };

  // 임시 비밀번호 요청
  const fetchTemporaryPassword = async () => {
    setIsFetchingPassword(true);
    try {
      const response = await axios.post(
        `${ API_BASE_URL }/forgot-password`,
        `email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.status === 200 && response.data.temporaryPassword) {
        setTemporaryPassword(response.data.temporaryPassword);
        Alert.alert('임시 비밀번호', `임시 비밀번호는 ${response.data.temporaryPassword} 입니다.`);
      } else {
        Alert.alert('실패', '임시 비밀번호를 생성하는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('오류', 'Error: ' + error.message);
    } finally {
      setIsFetchingPassword(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={{fontSize:30, fontWeight:'bold',marginBottom:50}} >비밀번호를 잊으셨나요?</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일(ID)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Button title="코드 전송" onPress={sendVerificationCode} style={styles.btn} />
        <TextInput
          style={styles.input}
          placeholder="인증 코드"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
        />
        <Button title="인증" onPress={verifyCode} style={styles.btn} />
        {isVerified && !isFetchingPassword && (
          <Button title="임시 비밀번호 요청" onPress={fetchTemporaryPassword} />
        )}
        {temporaryPassword ? (
          <View style={styles.tempPasswordContainer}>
            <Text>임시 비밀번호: {temporaryPassword}</Text>
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  tempPasswordContainer: {
    marginTop: 20,
  },
  btnArea: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(1.5),
    marginBottom:30
  },
  btn: {
    width: 183, // 버튼 너비 설정
    height: 45, // 버튼 높이 설정
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    marginTop:10,
  },
  btnoutline: {
    width: 183, // 버튼 너비 설정
    height: 45, // 버튼 높이 설정
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
  },
});

export default ForgotPassword;
