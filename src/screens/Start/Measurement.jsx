import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { Platform, PermissionsAndroid } from "react-native";
import { Buffer } from "buffer";

const manager = new BleManager();

function MeasurementScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [advertisedData, setAdvertisedData] = useState([]);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        console.log('Bluetooth is powered on');
      }
    }, true);
    return () => subscription.remove();
  }, []);

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

  const startScan = async () => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;

    setIsScanning(true);
    manager.startDeviceScan(
      null, 
      { scanMode: 'LowLatency' }, 
      (error, scannedDevice) => {
      if (error) {
        console.error(error);
        return;
      }

      if (scannedDevice && scannedDevice.name === '압력 인식') {
        manager.stopDeviceScan();
        setDevice(scannedDevice);
        connectToDevice(scannedDevice);
      }
    });
  };

  const connectToDevice = async (device) => {
    try {
      const connectedDevice = await device.connect();
      console.log('Connected to device:', connectedDevice.id);

      await connectedDevice.discoverAllServicesAndCharacteristics();

      const services = await connectedDevice.services();
      const service = services.find(s => s.uuid === '19b10000-e8f2-537e-4f6c-d104768a1214');

      if (service) {
        const characteristics = await service.characteristics();
        const characteristic = characteristics.find(c => c.uuid === '19b10000-e8f2-537e-4f6c-d104768a1214');

        if (characteristic) {
          characteristic.monitor((error, characteristic) => {
            if (error) {
              console.error('Error monitoring characteristic:', error);
              return;
            }

            if (characteristic.value) {
              const base64Value = characteristic.value;
              const decodedData = Buffer.from(base64Value, 'base64').toString('utf-8');
              console.log('Received data:', decodedData);

              // 센서 값을 분할하고 처리
              const sensorValues = decodedData
                .split("\t") // 탭으로 분할
                .slice(1) // "FSR 압력 값 :" 부분을 제거
                .map((value) => parseInt(value.trim(), 10)); // 숫자로 변환

              // state에 추가
              setAdvertisedData(prevData => [...prevData, sensorValues]);
            }
          });
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

  const stopScan = () => {
    setIsScanning(false);
    manager.stopDeviceScan();
    setAdvertisedData([]);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={isScanning ? stopScan : startScan}
        style={{
          backgroundColor: "blue",
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white" }}>
          {isScanning ? "Stop Scanning" : "Start Scanning"}
        </Text>
      </TouchableOpacity>
      <FlatList
         data={advertisedData}
         keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <Text style={{ fontSize: 16 }}>
                {`{${item.join(', ')}}`}
              </Text>
         </View>
             )}
      />
    </View>
  );
}

export default MeasurementScreen;
