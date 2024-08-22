import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';

const KakaoMap = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'file:///android_asset/map.html' }} // 안드로이드의 경우
        
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default KakaoMap;
