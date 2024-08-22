import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';
import MoreFirstScreen from "./MoreFirstScreen";
import UserGuardianUpdate from "./UserGuardianUpdate";
import UserinfoUpdate from "./UserInfoUpdate";
import UserPasswordUpdate from "./UserPasswordUpdate";

const Stack =createStackNavigator();


function More(){
  return(
  <Stack.Navigator initialRouteName="MoreFirstScreen">
      <Stack.Screen name="MoreFirstScreen" component={MoreFirstScreen} options={{headershown:false, headerBackVisible :false}}/>
      <Stack.Screen name="UserGuardianUpdate" component={UserGuardianUpdate} options={{headershown:false}}/>
      <Stack.Screen name="UserinfoUpdate" component={UserinfoUpdate} options={{headershown:false}}/>
      <Stack.Screen name="UserPasswordUpdate" component={UserPasswordUpdate} options={{headershown:false}}/>

  </Stack.Navigator>
  )
}

export default More;