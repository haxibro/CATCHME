import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HistoryScreen from '../screens/History/History';
import StartScreen from '../screens/Start/Start';
import More from '../screens/More/More';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const Tabs = createBottomTabNavigator();

const LoginSuccess = () => {
  const insets = useSafeAreaInsets(); // Safe Area Insets

  const handleBellPress = () => {
    console.log('Bell icon pressed');
    // 알림 버튼을 눌렀을 때의 동작을 추가할 수 있습니다.
  };

  // 커스터마이즈된 헤더 컴포넌트
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>CATCHME</Text>
      
    </View>
  );

  return (
    <Tabs.Navigator
      initialRouteName="Start"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 57 + insets.bottom, // 탭 바 높이에 안전 영역 추가
          shadowColor: 'black',
          shadowOffset: {
            width: 2,
            height: 4,
          },
          shadowOpacity: 0.6,
          shadowRadius: 4,
          elevation: 4,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
        tabBarLabelStyle: {
          marginTop: -8, // 텍스트와 아이콘 사이의 간격을 줄입니다.
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'History') {
            iconName = 'list';
          } else if (route.name === 'Start') {
            iconName = 'search';
          } else if (route.name === 'More') {
            iconName = 'user-cog';
          }

          // 아이콘 컴포넌트에 색상과 크기 적용
          return <FontAwesome5Icon name={iconName} size={18} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF', // 활성화된 아이콘 색상
        tabBarInactiveTintColor: '#8E8E93', // 비활성화된 아이콘 색상
        headerTitle: renderHeader, // 커스터마이즈된 헤더 설정
        headerStyle: {
          backgroundColor: '#f8f8f8', // 헤더 배경색
          height: 80, // 헤더 높이 설정
          shadowOpacity: 0, // 그림자 제거
        },
        headerTitleAlign: 'right', // 헤더 타이틀 중앙 정렬 (전체 컨테이너에 맞게 조정)
        headerLeft: null, // 왼쪽 헤더를 비워둡니다.
        headerRight: () => (
          <TouchableOpacity onPress={handleBellPress} style={styles.bellButton}>
            <FontAwesome5Icon name="bell" size={20} color="#000" />
          </TouchableOpacity>
        ), // 오른쪽 끝에 알림 버튼 배치
      })}
    >
      <Tabs.Screen name="History" component={HistoryScreen} />
      <Tabs.Screen name="Start" component={StartScreen} />
      <Tabs.Screen name="More" component={More} />
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
    marginLeft:-14
  },
  bellButton: {
    padding: 20,
  },
});

export default LoginSuccess;
