import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import kakaoLogo from '../.././assets/kakao_login_medium_narrow.png';

function LogoutScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={{flex: 1.5}} />
      <View style={{flex: 2}}>
        <View style={styles.logoArea}>
          <Image
            source={require('../../assets/catchmee.png')}
            style={styles.catchmeeLogo}
          />
        </View>
        <View style={styles.btnArea}>
          <TouchableOpacity 
            /* style={styles.btnoutline2} */
            onPress={()=> navigation.navigate('KakaoLogin')}>
            <Image source={kakaoLogo} style={styles.buttonImage}/>
          </TouchableOpacity>
        </View>
        <View style={styles.btnArea}>
          <TouchableOpacity 
            style={styles.btnoutline}
            onPress={()=> navigation.navigate('EmailLogin')}>
            <Text>이메일로 시작하기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnArea}>
          <TouchableOpacity 
            style={styles.btn}
            onPress={()=> navigation.navigate('Register')}>
            <Text style={styles.buttonText}>회원가입하기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnArea}>
          <TouchableOpacity 
            style={styles.btn}
            onPress={()=> navigation.navigate('Test')}>
            <Text style={styles.buttonText}>실험실1(gps)</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnArea}>
          <TouchableOpacity 
            style={styles.btn}
            onPress={()=> navigation.navigate('Testtwo')}>
            <Text style={styles.buttonText}>실험실2(ble)</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  logoArea: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: wp(20),
  },
  catchmeeLogo: {
    width: wp(100),
    resizeMode: 'contain',
    marginLeft: wp(8),
  },
  btnArea: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(1.5),
  },
  btn: {
    width: 183, // 버튼 너비 설정
    height: 45, // 버튼 높이 설정
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
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
  btnoutline2: {
    width: 183, // 버튼 너비 설정
    height: 45, // 버튼 높이 설정
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
    borderWidth: 1,
  },
  buttonImage: {
    width: 183, // 이미지 너비 설정
    height: 45, // 이미지 높이 설정
    /* resizeMode: 'contain' */
  },
  buttonText: {
    color: 'white',
  },
});

export default LogoutScreen;
