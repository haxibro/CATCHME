//More 첫 페이지 리스트 쫘라락 나오는 페이지

import React, { useState, useEffect } from 'react';
import { View, Text, Alert, SectionList, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../config/config';

const DATA = [
  {
    title: '기본 설정',
    data: [
      { key: 'AutoLogin', title: '자동로그인', type: 'toggle' },
      { key: 'NotificationSettings', title: '알림 설정', type: 'toggle' },
    ]
  },
  {
    title: '보호자 관리',
    data: [{ key: 'UserGuardianUpdate', title: '보호자 관리' }]
  },
  {
    title: '정보 수정',
    data: [
      { key: 'UserinfoUpdate', title: '사용자 정보 수정' },
      { key: 'UserPasswordUpdate', title: '비밀번호 변경' }
    ]
  },
  {
    title: '로그아웃',
    data: [
      { key: 'Logout', title: '로그아웃' },
    ]
  },
  {
    title: '회원탈퇴',
    data: [
      { key: 'MemberDelete', title: '회원탈퇴' }
    ]
  }
];

function MoreFirstScreen({ navigation }) {
  const [isAutoLogin, setIsAutoLogin] = useState(false);

  useEffect(() => {
    const loadAutoLoginState = async () => {
      try {
        const savedValue = await AsyncStorage.getItem('isAutoLogin');
        if (savedValue !== null) {
          setIsAutoLogin(JSON.parse(savedValue));
        }
      } catch (error) {
        console.error('Failed to load the auto-login state: ', error);
      }
    };

    loadAutoLoginState();
  }, []);

  const saveAutoLoginState = async (value) => {
    try {
      await AsyncStorage.setItem('isAutoLogin', JSON.stringify(value));
      // 서버에 자동 로그인 상태를 저장 (선택 사항)
      /* await axios.post(`${API_BASE_URL}/updateAutoLogin`, { isAutoLogin: value }); */
    } catch (error) {
      console.error('Failed to save the auto-login state: ', error);
    }
  };

  const logoutButton = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/logout`);
      if (response.status === 200) {
        Alert.alert('로그아웃 성공', response.data);
        await AsyncStorage.removeItem('userId');

        navigation.navigate('Logout');
      } else {
        Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
    }
  };

  const memberDelete = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/memberdelete`);
      if (response.status === 200) {
        Alert.alert('회원탈퇴 성공', response.data);
        await AsyncStorage.removeItem('userId');
        navigation.navigate('Logout');
      } else {
        Alert.alert('회원탈퇴 실패', '회원탈퇴 중 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('회원탈퇴 실패', '회원탈퇴 중 오류가 발생했습니다.');
    }
  };

  const handleItemPress = async (key) => {
    if (key === 'Logout') {
      await logoutButton();
    } else if (key === 'MemberDelete') {
      await memberDelete();
    } else if (key === 'AutoLogin') {
      // 자동 로그인 토글 처리
      const newValue = !isAutoLogin;
      setIsAutoLogin(newValue);
      saveAutoLoginState(newValue);
    } else {
      navigation.navigate(key);
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item.key)}>
        <Text style={styles.itemText}>{item.title}</Text>
        {item.type === 'toggle' && (
          <Switch
            value={item.key === 'AutoLogin' ? isAutoLogin : false}
            onValueChange={() => handleItemPress(item.key)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isAutoLogin ? '#f5dd4b' : '#f4f3f4'}
          />
        )}
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item.key + index}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  sectionHeader: {
    backgroundColor: '#f4f4f4',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
  },
  sectionHeaderText: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  item: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: wp(4),
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: wp(5),
  },
});

export default MoreFirstScreen;
