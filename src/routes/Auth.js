import React from "react";
import { StyleSheet,SafeAreaView } from "react-native";
import 'react-native-gesture-handler';
import { createStackNavigator } from "@react-navigation/stack";
import LogoutScreen from "../screens/Default/LogoutScreen";
import EmailLoginScreen from "../screens/Login/EmailLoginScreen";
import KakaoLoginScreen from "../screens/Login/KakaoLoginScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import TesttScreen from "../../TestTT_Screen";
import TestwoScreen from "../../TestwoScreen";
import ForgotPassword from "../screens/More/forgotPassword";


const Stack =createStackNavigator();



function Auth(){

  return(
  
   

      <Stack.Navigator initialRouteName="Logout">

        <Stack.Screen name="Logout" component={LogoutScreen} options={{headershown:false}} />
        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} options={{headershown: false}}/>
        <Stack.Screen name="KakaoLogin" component={KakaoLoginScreen} options={{headershown: false}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{headershown: false}}/>
        <Stack.Screen name="Test" component={TesttScreen} options={{headershown: false}}/>
        <Stack.Screen name="Testtwo" component={TestwoScreen} options={{headershown: false}}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headrshown:false}}/>

      </Stack.Navigator>

  )

}

export default Auth;