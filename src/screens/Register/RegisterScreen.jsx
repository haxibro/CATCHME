import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,Alert
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
/* import CheckBox from '@react-native-community/checkbox'; */
import Loader from '../../../Loader';
import axios from 'axios';
import { API_BASE_URL } from '../../config/config';


function RegisterScreen(props) {
  const[isVerified,setIsVerified]=useState(false)
  const [userName, setUserName] = useState('');
  const [email,setEmail]=useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext2, setErrortext2] = useState('');
  const [errortext3, setErrortext3] = useState('');
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [code,setCode]=useState('');
  const [loading2, setLoading2] = useState(false);
  //192.168.200.101:8080
 

// 인증번호전송 버튼
const sendCode = async () => {
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
            Alert.alert('성공', '인증번호를 전송했습니다!!');
        } else {
            Alert.alert('실패', '전송실패!!');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        Alert.alert('Error', 'An error occurred while sending the verification code.');
    }
};


//인증번호 일치 검사
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


    // 회원가입버튼(전체 다 작성하고 마지막 버튼)
const handleSubmitButton = async () => {
 //setErrortext2('');

  if (!userName) {
    Alert.alert('이름을 입력해주세요');
    return;
  }
  if (!email) {
    Alert.alert('이메일을 입력해주세요');
    return;
  }
  if (!code) {
    Alert.alert('인증 코드를 입력해주세요');
    return;
  }
  if (!phoneNumber) {
    Alert.alert('전화번호를 입력해주세요');
    return;
  }
  if (!password) {
    Alert.alert('비밀번호를 입력해주세요');
    return;
  }
  if (confirmPassword !== password) {
    Alert.alert('비밀번호가 일치하지 않습니다');
    return; 
  }
  if (!isVerified) {
    Alert.alert('이메일 인증을 완료해주세요');
    return;
  }

  setLoading(true);

  const dataToSend = {
    username: userName,
    email: email,
    password: password,
    phoneNumber: phoneNumber,
  };

  try {
    const response = await axios.post(`${ API_BASE_URL }/register`, dataToSend, {
      headers: {
        'Content-Type': 'application/json', // 서버에 맞춰서 JSON 형식으로 보냅니다.
      },
    });

    if (response.status === 200) {
      Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
      setIsRegistrationSuccess(true);
    } else {
      Alert.alert('회원가입 실패', '회원가입 중 문제가 발생했습니다.');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    Alert.alert('Error', '회원가입 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }

}
{
    //가입성공했다면 나올 화면
  if (isRegistrationSuccess) {
  return (
      <View style={styles.container}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 2 }}>
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessage}>
              회원가입이 완료되었습니다!
            </Text>
          </View>
          <View style={styles.btnArea}>
            <TouchableWithoutFeedback
              onPress={() => props.navigation.navigate('EmailLogin')}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>시작하기</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
  else
    return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Loader loading={loading} />
        <View style={styles.topArea}>
          <View style={styles.titleArea}>
            {/* <Image source={require('../src/Register.png')} style={{ width: wp(40), resizeMode: 'contain' }} /> */}
          </View>
        </View>


        <View style={styles.formArea}>
          <TextInput
            style={styles.textFormTop}
            placeholder={'이름'}
            onChangeText={setUserName}
            returnKeyType="next"
            blurOnSubmit={false}
          />
        </View>
      
        <View style={styles.formArea}>
          <TextInput
            style={styles.textFormMiddle}
            placeholder={'아이디(5자 이상, 영문, 숫자)'}
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
            blurOnSubmit
            keyboardType="email-address"
            it={false}
          />
        </View>

       {/* /*<View style={{ flex: 0.2 }}/>  */}

        <View style={{ flex: 1.1}}>
          <View style={styles.btnArea}>
            <TouchableWithoutFeedback onPress={sendCode}>
              <View style={styles.btn2}>
                <Text style={styles.btnText2}>인증번호전송</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View>
          <TextInput
            style={styles.textFormMiddle}
            placeholder={'인증 코드'}
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            returnKeyType="next"
            blurOnSubmit={false}
           
          />
        </View>
        <View style={{ flex: 0.2 }}/>

        <View style={{ flex: 0.75 }}>
          <View style={styles.btnArea}>
            <TouchableWithoutFeedback onPress={verifyCode}>
              <View style={styles.btn2}>
                <Text style={styles.btnText2}>인증번호 확인</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>    


        <View style={{ flex: 0.4}}/>

        <View>
          <TextInput
            style={styles.textFormMiddle}
            secureTextEntry={true}
            placeholder={'비밀번호(8자 이상)'}
            onChangeText={setPassword}
            returnKeyType="next"
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.textFormBottom}
            placeholder={'비밀번호 확인'}
            onChangeText={setConfirmPassword}
            returnKeyType="next"
            blurOnSubmit={false}
          />
        </View>

        <View style={{ flex: 0.5, justifyContent: 'center' }}>
          {password !== confirmPassword ? (
            <Text style={styles.TextValidation}>
              비밀번호가 일치하지 않습니다.
            </Text>
          ) : null}
        </View>

        <View style={styles.formArea}>
          <TextInput
            style={styles.textFormBottom}
            placeholder={'전화번호'}
            onChangeText={setPhoneNumber}
            returnKeyType="next"
            keyboardType="phone-pad"
            blurOnSubmit={false}
          />
        </View>
        


        <View style={{ flex: 0.7, justifyContent: 'center' }}>
          {errortext2 !== '' ? (
            <Text style={styles.TextValidation}>{errortext2}</Text>
          ) : null}
        </View>

        <View style={{ flex: 0.75 }}>
          <View style={styles.btnArea}>
            <TouchableWithoutFeedback onPress={handleSubmitButton}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>회원가입</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={{ flex: 3 }} />
      </View>
    </TouchableWithoutFeedback>
  );
}};

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
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },
  textFormMiddle: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderColor: 'black',
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: wp('4%'),
  },
  btnArea: {
    height: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(3),
  },
  btn: {
    flex: 1,
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  btn2: {
    flex: 1,
    width: '30%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  btnText: {
    color: 'white',
    fontSize: wp('4%'),
  },
  btnText2:{
    color:'white',
    fontSize:wp('3%'),
  },
  successMessageContainer: {
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    color: 'black',
    fontSize: wp('4%'),
  },
  TextValidation: {
    fontSize: wp('4%'),
    color: 'red',
    paddingTop: wp(2),
  },
});

export default RegisterScreen;
