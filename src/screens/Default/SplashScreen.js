import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Image } from 'react-native';
import {
  widthPercentageToDP as wp,heightPercentageToDP} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';



const SplashScreen = ({ navigation }) => {

  //userId 가 있으면 LoginSuccess 로, 없으면 Auth 로
  useEffect(() => {
    
    const autoLoginCheck = async()=> {
      try{
        const userId = await AsyncStorage.getItem('userId');
        const isAutoLogin = await AsyncStorage.getItem('isAutoLogin');

        if(isAutoLogin ==='true'&& userId !==null){
          navigation.replace('LoginSuccess')

        }else{
          navigation.replace('Auth');
        }
      }
      catch(error){
        console.error("failed to check Auth state",error);
        navigation.replace('Auth');
      }
      
    }

    setTimeout(autoLoginCheck,2300);
    
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* <Image
        source={require('./src/catchmee.png')}
        style={{ width: wp(120), resizeMode: 'contain', margin: 30, marginLeft: 70 }}
      /> */}
    
      
      <LottieView
        source={require('../../assets/foot.json')}
        autoPlay
        loop={false}
        speed={2.5}
        style={styles.lottie} // 스타일 조정
      />
      {/* <ActivityIndicator
        color="#6990F7"
        size="large"
        style={styles.activityIndicator}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  lottie: {
    width: wp(60),
    height: wp(60),
    marginTop: -50, // 위로 위치 조정 (예: -50)
    // 또는 position: 'absolute', top: 100 (예시 값)
  },
  /* activityIndicator: {
    position: 'absolute',
    bottom: 50,
  }, */
});

export default SplashScreen;
