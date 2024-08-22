import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import MeasurementScreen from "./Measurement";


const Tabs= createMaterialTopTabNavigator();


function StartScreen(){

  return(
  <Tabs.Navigator initialRouteName="Logout">

    <Tabs.Screen name="Measurement" component={MeasurementScreen} options={{headershown: true}}/>
  
  </Tabs.Navigator>
)

}

export default StartScreen;