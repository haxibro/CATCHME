//비밀번호 변경

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet,TouchableWithoutFeedback,Keyboard } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../config/config';

function UserPasswordUpdate({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 모든 입력값이 채워졌는지 확인
  const isFormValid = oldPassword && password && confirmPassword;

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post(
        `${ API_BASE_URL }/memberinfo/updatepassword`,
        { old_password: oldPassword, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // 세션 쿠키를 포함하여 서버와의 세션을 유지
        }
      );

      if (response.status === 200) {
        Alert.alert('비밀번호가 성공적으로 변경되었습니다.');
        // 비밀번호 변경 후 'MoreFirstScreen'으로 네비게이션
        navigation.navigate('MoreFirstScreen');
      } else {
        Alert.alert('비밀번호 변경 실패', response.data);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('비밀번호 변경 실패', '서버 오류가 발생했습니다.');
    }
  };

  return (

   <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="기존 비밀번호"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="새 비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        style={[styles.button, { opacity: isFormValid ? 1 : 0.5 }]} // 버튼의 불투명도 조절
        onPress={handleUpdatePassword}
        disabled={!isFormValid} // 폼이 유효하지 않으면 버튼 비활성화
      >
        <Text style={styles.buttonText}>비밀번호 변경</Text>
      </TouchableOpacity>
    </View>
  </TouchableWithoutFeedback> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default UserPasswordUpdate;
