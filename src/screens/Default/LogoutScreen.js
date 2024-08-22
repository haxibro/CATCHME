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
  SafeAreaView,
  
  TouchableOpacity,
} from 'react-native';



  

function LogoutScreen({navigation}){
return (
  <View style={styles.container}>
    <View style={{flex: 1.5}} />
    <View style={{flex: 2}}>
      <View style={styles.logoArea}>
        <Image
          source={require('../../assets/catchmee.png')}
          style={{width: wp(100), resizeMode: 'contain', marginLeft: wp(8)}}
        />
      </View>
      <View style={styles.btnArea}>
        <TouchableOpacity 
        style={styles.btnoutline2}
        onPress={()=> navigation.navigate('KakaoLogin')}>
          <Text>카카오로 시작하기</Text>
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
        <TouchableOpacity style={styles.btn}
        onPress={()=> navigation.navigate('Register')}>
          <Text style={{color: 'white'}}>회원가입하기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnArea}>
        <TouchableOpacity style={styles.btn}
        onPress={()=> navigation.navigate('Test')}>
          <Text style={{color: 'white'}}>실험실</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnArea}>
        <TouchableOpacity style={styles.btn}
        onPress={()=> navigation.navigate('Testtwo')}>
          <Text style={{color: 'white'}}>실험실</Text>
        </TouchableOpacity>
      </View>


    </View>
    <View style={{flex: 1}} />
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1, //전체의 공간을 차지한다는 의미
  flexDirection: 'column',
  backgroundColor: 'white',
},
logoArea: {
  flex: 0.5,
  justifyContent: 'center',
  alignItems: 'center',
  // backgroundColor: 'red',
  paddingBottom: wp(15),
},
btnArea: {
  height: hp(8),
  // backgroundColor: 'orange',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: hp(1.5),
},
btn: {
  flex: 1,
  width: wp(75),
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'black',
},
btnoutline: {
  flex: 1,
  width: wp(75),
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  borderWidth: 1,
},
btnoutline2: {
  flex: 1,
  width: wp(75),
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'yellow',
  borderWidth: 1,
},
});
export default LogoutScreen;