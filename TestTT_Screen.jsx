// GPS 로 사용자 위치 받고 => 병원 검색하는 페이지


import React, { useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView, ActivityIndicator, PermissionsAndroid, Platform, FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';

const KAKAO_REST_API_KEY = 'c734d7df28d0aabfafcb2e622d57e6c5'; // 카카오 REST API 키

function TesttScreen() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapUrl, setMapUrl] = useState(''); // 지도 URL을 저장할 상태

  useEffect(() => {
    //위치 권한 받기!!!
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 접근 권한 요청',
            message: '이 앱은 사용자의 위치 정보를 필요로 합니다',
            buttonNeutral: '나중에 묻기',
            buttonNegative: '취소',
            buttonPositive: '허용',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('위치 접근 권한이 거부되었습니다.');
          setLoading(false);
          return;
        }
      }
      getLocation();
    };

    //위치 정보 얻기!! 경도/위도 값
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          //여기에다 사용자의 위치정보 저장됨
          setLocation({ latitude, longitude });

          // 병원 검색
          const [dementiaHospitals, neurologyHospitals] = await Promise.all([
            searchHospitalsNearby(latitude, longitude, '치매'),
            searchHospitalsNearby(latitude, longitude, '신경과'),
          ]);

          // 거리 기준으로 정렬 후 상위 6개 선택
          const hospitalsWithDistance = [...dementiaHospitals, ...neurologyHospitals]
            .map(hospital => ({
              ...hospital,
              distance: calculateDistance(latitude, longitude, hospital.y, hospital.x)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 6); // 상위 6개 선택

          setHospitals(hospitalsWithDistance);

          setLoading(false);
        },
        (error) => {
          console.log(error.code, error.message);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    };

    requestLocationPermission();
  }, []);

  const searchHospitalsNearby = async (latitude, longitude, query) => {
    const radius = 5000;

    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&x=${longitude}&y=${latitude}&radius=${radius}`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`
          }
        }
      );

      const data = await response.json();
      console.log(data.documents[0]);
      return data.documents; // 병원 목록
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // 거리 계산 용도
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleHospitalClick = (hospital) => {
    const { x, y, place_name } = hospital;
    const mapUrl = `https://map.kakao.com/?urlX=${x}&urlY=${y}&urlLevel=3&markerCoords=${y},${x}&markerText=${encodeURIComponent(place_name)}`;
    setMapUrl(mapUrl); // 클릭한 병원의 URL을 설정
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleHospitalClick(item)}>
      <View style={styles.item}>
        <Text style={styles.title}>{item.place_name}</Text>
        <Text>{item.address_name}</Text>
        <Text>{item.distance.toFixed(2)} km</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.webviewContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ uri: mapUrl }}
              style={styles.webview}
              javaScriptEnabled={true}
              onLoadEnd={() => console.log("WebView has finished loading")}
              onError={(error) => console.error("WebView error: ", error)}
              startInLoadingState={true}
            />
          </View>
          <FlatList
            data={hospitals}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  list: {
    flex: 1,
    margin: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TesttScreen;
