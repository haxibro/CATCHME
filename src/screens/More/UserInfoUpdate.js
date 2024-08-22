import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { API_BASE_URL } from '../../config/config';


function UserinfoUpdate({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${ API_BASE_URL }/userinfo`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        setUsername(response.data.username);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phoneNumber);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('사용자 정보를 가져오는 데 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleUpdate = async () => {
    if (!username || !phoneNumber) {
      Alert.alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.patch(`${ API_BASE_URL }/userinfo`, {
        username,
        phoneNumber,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('정보가 성공적으로 업데이트되었습니다.');
      setIsEditing(false);
      navigation.navigate('MoreFirstScreen');
    } catch (err) {
      console.error('Error updating user info:', err);
      Alert.alert('정보 업데이트에 실패했습니다.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="사용자 이름"
            editable={isEditing}
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="아이디(이메일)"
            editable={false}
          />
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="전화번호"
            keyboardType="phone-pad"
            editable={isEditing}
          />
          {isEditing ? (
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>저장</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>수정</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
  },
});

export default UserinfoUpdate;
