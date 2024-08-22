export const logoutButton = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/logout`);
    if (response.status === 200) {
      Alert.alert('로그아웃 성공', response.data);
      navigation.navigate('Logout');
    } else {
      Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
    }
  } catch (error) {
    console.error('Error during logout: ', error);
    Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다');
  }
};

