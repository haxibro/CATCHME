// 회원 탈퇴 함수
export const memberDelete = async () => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/memberdelete`);
    if (response.status === 200) {
      Alert.alert('회원탈퇴 성공', response.data);
      navigation.navigate('Logout');
    } else {
      Alert.alert('회원탈퇴 실패', '회원탈퇴 중 실패했습니다.');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    Alert.alert('회원탈퇴 실패', '회원탈퇴 중 오류가 발생했습니다');
  }
};