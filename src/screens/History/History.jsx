import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Changes from "./Changes";
import PastResultScreen from "./PastResult";
import QuestionScreen from "./Question";

const Tabs= createMaterialTopTabNavigator();



function HistoryScreen(){

  return(
  <Tabs.Navigator initialRouteName="Logout">

    <Tabs.Screen name="과거 검사" component={PastResultScreen} options={{headershown:false}} />
    <Tabs.Screen name="Changes" component={Changes} options={{headershown: false}}/>
    <Tabs.Screen name="Question" component={QuestionScreen} options={{headershown: false}}/>
    
  
</Tabs.Navigator>
)

}

export default HistoryScreen;