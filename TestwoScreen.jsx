import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { Buffer } from "buffer";
import Realm from "realm";
import axios from "axios";
import { API_BASE_URL } from "./src/config/config";
import { Platform, PermissionsAndroid } from "react-native";

const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }

    const apiLevel = parseInt(Platform.Version.toString(), 10);

    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ]);

      return (
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
};

// 서버로 데이터 전송하기
const sendDataToServer = async (receivedData, id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/data`, { data: receivedData, id: id });
    console.log("Data sent to server:", response.data);
  } catch (error) {
    console.error("Error sending data to server:", error);
  }
};

// 블루투스 매니저
const manager = new BleManager();

function TestwoScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [receivedData, setReceivedData] = useState([]);
  const [device, setDevice] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [monitoringSubscription, setMonitoringSubscription] = useState(null);
  const [isAnalysisEnabled, setIsAnalysisEnabled] = useState(false);
  
  const scanId = 1; // scanId를 고정값으로 설정

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        console.log('Bluetooth is powered on');
      }
    }, true);

    return () => {
      manager.stopDeviceScan();
      if (monitoringSubscription) {
        monitoringSubscription.remove();
      }
      subscription.remove();
    };
  }, [monitoringSubscription]);

  // 스캔 시작
  const startScan = async () => {
    const permissionGranted = await requestPermissions();
    
    if (!permissionGranted) return;
    if (isScanning) return;

    setIsScanning(true);

    // 서버로 전송 시도 (스캔 시작 시)
    if (receivedData.length > 0) {
      try {
        await sendDataToServer(receivedData, scanId);
        console.log("서버로 데이터 전송 성공 (스캔 시작 시)");
      } catch (error) {
        console.error("에러..서버 전송 실패 (스캔 시작 시)");
      }
    }

    setReceivedData([]);

    manager.startDeviceScan(null, { scanMode: 'LowLatency' }, (error, scannedDevice) => {
      if (error) {
        console.error(error);
        setIsScanning(false);
        return;
      }

      if (scannedDevice && scannedDevice.name === '압력 인식') {
        manager.stopDeviceScan();
        setDevice(scannedDevice);
        connectToDevice(scannedDevice);
      }
    });
  };

  // 스캔 중지
  const stopScan = async () => {
    if (!isScanning) return;

    setIsScanning(false);
    manager.stopDeviceScan();
    console.log('Scanning stopped');

    // 서버로 전송 시도 (스캔 종료 시)
    if (receivedData.length > 0) {
      try {
        await sendDataToServer(receivedData, scanId);
        console.log("서버로 데이터 전송 성공 (스캔 종료 시)");
      } catch (error) {
        console.error("에러..서버 전송 실패 (스캔 종료 시)");
      }
    }

    setReceivedData([]);

    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        console.log('Disconnected from device');
      } catch (error) {
        console.error('Error disconnecting from device:', error);
      }
    }

    if (monitoringSubscription) {
      monitoringSubscription.remove();
      setMonitoringSubscription(null);
      console.log('Monitoring stopped');
    }

    setIsAnalysisEnabled(true);
  };

  const toggleScan = () => {
    if (isScanning) {
      stopScan();
    } else {
      startScan();
    }
  };

  const startAnalysis = async () => {
    if (!isAnalysisEnabled) {
      Alert.alert("스캔이 필요합니다", "스캔을 먼저 시작해야 분석을 시작할 수 있습니다.", [{ text: "확인" }]);
      return;
    }

    setIsAnalysisEnabled(false);
    
    if (receivedData.length > 0) {
      try {
        await sendDataToServer(receivedData, scanId);
        console.log("서버에 데이터 전송 성공");
      } catch (error) {
        console.error("에러..서버 전송 실패!");
      }
    } else {
      Alert.alert("전송할 데이터가 없습니다", "스캔을 먼저 시작하여 데이터를 수집해야 합니다.", [{ text: "확인" }]);
    }
  };

  const loadAndSendMostRecentData = async () => {
    try {
      const recentData = await getMostRecentData();
      if (recentData.length > 0) {
        await sendDataToServer(recentData, scanId);
        console.log("최근 데이터 서버로 전송 성공");
      } else {
        Alert.alert("저장된 데이터가 없습니다", "최근에 저장된 데이터가 없습니다.", [{ text: "확인" }]);
      }
    } catch (error) {
      console.error("에러..최근 데이터 전송 실패!");
    }
  };

  const connectToDevice = async (device) => {
    try {
      const connected = await device.connect();
      setConnectedDevice(connected);
      console.log('Connected to device:', connected.id);

      await connected.discoverAllServicesAndCharacteristics();

      const services = await connected.services();
      const service = services.find(s => s.uuid === '19b10000-e8f2-537e-4f6c-d104768a1214');

      if (service) {
        const characteristics = await service.characteristics();
        const characteristic = characteristics.find(c => c.uuid === '19b10000-e8f2-537e-4f6c-d104768a1214');

        if (characteristic) {
          const subscription = characteristic.monitor((error, characteristic) => {
            if (error) {
              console.error('Error monitoring characteristic:', error);
              return;
            }

            if (characteristic.value) {
              const base64Value = characteristic.value;
              const decodedData = Buffer.from(base64Value, 'base64').toString('utf-8');
              console.log('Received data:', decodedData);

             /*  const sensorValues = decodedData.split("\t");
              const decodedData2 = sensorValues.map(val => `"${val}"`).join(','); // "4095","4095","4095","4095"
              console.log('what you got:', decodedData2); */
              setReceivedData(prevData => [...prevData, decodedData]);
            }
          });

          setMonitoringSubscription(subscription);
        } else {
          console.error('Characteristic not found');
        }
      } else {
        console.error('Service not found');
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{flex:0.2}}>catchme 를 시작해보세요!!</Text>
      <TouchableOpacity
        onPress={toggleScan}
        style={{
          backgroundColor: isScanning ? 'red' : 'black',
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white" }}>
          {isScanning ? "종료하기" : "시작하기"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={startAnalysis}
        disabled={!isAnalysisEnabled}
        style={{
          backgroundColor: isAnalysisEnabled ? 'green' : 'gray',
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white" }}>
          분석하기(미확정)
         </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={loadAndSendMostRecentData}
        style={{
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white" }}>
          최근 데이터 전송
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default TestwoScreen;

