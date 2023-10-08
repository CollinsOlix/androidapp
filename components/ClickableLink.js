import {
  Linking,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from 'react-native';
import React, {useCallback} from 'react';

const ClickableLink = ({url, children}) => {
  const handlePress = useCallback(async () => {
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      await Linking.openURL(url);
    } else {
      if (Platform.OS == 'android') {
        ToastAndroid.show('Cannot open this kind of link', ToastAndroid.SHORT);
      } else Alert.alert('Cannot open this kind of link');
    }
  }, [url]);
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        borderRadius: 23,
      }}>
      <Text style={{color: '#87feca'}}>{children}</Text>
    </TouchableOpacity>
  );
};

export default ClickableLink;

const styles = StyleSheet.create({});
