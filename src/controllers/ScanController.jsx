import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text ,Alert} from "react-native";
import { BleManager } from "react-native-ble-plx";
import { Buffer } from "buffer";
import Realm from "realm";
import { SensorDataSchema } from "./src/realm/SensorDataSchema";

const manager = new BleManager();
let realm;

function ScanController() {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [receivedData, setReceivedData] = useState([]);
  const [device, setDevice] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [monitoringSubscription, setMonitoringSubscription] = useState(null);
  const [isAnalysisEnabled, setIsAnalysisEnabled] = useState(false);


  const startScan = async () => {
    if (isScanning) return; // 이미 스캔 중이면 아무 작업도 하지 않음

    setIsScanning(true);
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

  
  const stopScan = async () => {
    if (!isScanning) return; // 스캔 중이 아닐 때는 아무 작업도 하지 않음

    setIsScanning(false);
    manager.stopDeviceScan();
    console.log('Scanning stopped');
    
    // 수신된 데이터를 Realm에 저장
    if (receivedData.length > 0) {
      await saveDataToRealm(receivedData);
    }

    setReceivedData([]);

    // 연결된 장치가 있을 경우 연결 해제
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection(); // .cancelConnection() 메서드 사용
        setConnectedDevice(null);
        console.log('Disconnected from device');
      } catch (error) {
        console.error('Error disconnecting from device:', error);
      }
    }

    // 모니터링 중지
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

  const connectToDevice = async (device) => {
    try {
      const connected = await device.connect();
      setConnectedDevice(connected); // 연결된 장치 저장
      console.log('Connected to device:', connected.id);

      await connected.discoverAllServicesAndCharacteristics();

      const services = await connected.services();
      const service = services.find(s => s.uuid === '19b10000-e8f2-537e-4f6c-d104768a1214');

      if (service) {
        const characteristics = await service.characteristics();
        const characteristic = characteristics.find(c => c.uuid === '19b10000-e8f2-537e-4f6c-d104768a1214');

        if (characteristic) {
          // 모니터링 시작 및 반환값 저장
          const subscription = characteristic.monitor((error, characteristic) => {
            if (error) {
              console.error('Error monitoring characteristic:', error);
              return;
            }

            if (characteristic.value) {
              const base64Value = characteristic.value;
              const decodedData = Buffer.from(base64Value, 'base64').toString('utf-8');
              console.log('Received data:', decodedData);

              const dataParts = decodedData.split("\t");
              const sensorValues = dataParts.map(value => parseInt(value.trim(), 10));

              console.log('Sensor values:', sensorValues);
              setReceivedData(prevData => [...prevData, sensorValues]);
            }
          });

          // 모니터링 구독 저장
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

  const startAnalysis = () => {
    if (!isScanning) {
      Alert.alert(
        '스캔이 필요합니다',
        '스캔을 먼저 시작해야 분석을 시작할 수 있습니다.',
        [{ text: '확인' }]
      );
      return;
    }

    Alert.alert("분석중..");
    setIsAnalysisEnabled(false);

  };

  const saveDataToRealm = async (data) => {
    try {
      const realmInstance = await Realm.open({ schema: [SensorDataSchema] });
  
      realmInstance.write(() => {
        // 데이터를 JSON 문자열로 변환
        const dataToSave = JSON.stringify(data);
  
        // Realm에 데이터 저장
        realmInstance.create('SensorData', {
          timestamp: new Date(), // 현재 시간을 timestamp로 사용
          values: dataToSave, // JSON 문자열로 저장
        });
      });
  
      console.log('Data saved to Realm');
    } catch (error) {
      console.error('Error saving data to Realm:', error);
    }
  };

  const getDataFromRealm = async () => {
    try {
      const realmInstance = await Realm.open({ schema: [SensorDataSchema] });
      const results = realmInstance.objects('SensorData');
  
      // 데이터 파싱
      const data = results.map(item => ({
        timestamp: item.timestamp,
        values: JSON.parse(item.values), // JSON 문자열을 배열로 변환
      }));
  
      console.log('Data retrieved from Realm:', data);
      return data;
    } catch (error) {
      console.error('Error retrieving data from Realm:', error);
    }
  };

 
}

export default ScanController;
