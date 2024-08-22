import React from "react";
import { StyleSheet,SafeAreaView } from "react-native";
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./src/screens/Default/SplashScreen";
import Auth from "./src/routes/Auth";
import LoginSuccess from "./src/routes/LoginSuccess";
import { enableScreens } from 'react-native-screens';

enableScreens();


const Stack =createStackNavigator();

function App(){

  return(
  
    <NavigationContainer>
        
      <Stack.Navigator initialRouteName="SplashScreen">
       
        
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        

        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        
       <Stack.Screen
          name="LoginSuccess"
          component={LoginSuccess}
          options={{headerShown: false}}
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;