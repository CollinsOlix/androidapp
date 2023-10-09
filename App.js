StrictMode;
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Freecurrencyapi from '@everapi/freecurrencyapi-js';
import React, {
  StrictMode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import DropdownComponent from './components/Dropdown';
import {currencyInfo, currencyList} from './components/list';
import {CURRENCY_CONTEXT} from './context/CURRENCY_CONTEXT';
import ClickableLink from './components/ClickableLink';

const freecurrencyapi = new Freecurrencyapi(
  'fca_live_pOYD9cCpaAKKogf3Dn2Xz88DNRUEYw9tBuFeZB2H',
);
function App() {
  const [connected, setConnected] = useState(false);

  useLayoutEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log('Connection type', state.type);
      // console.log('Is Internet Reachable?', state.isInternetReachable);
      if (connected !== state.isInternetReachable)
        setConnected(state.isInternetReachable);
    });
    return () => unsubscribe();
  });

  const value1 = useRef(null);
  const value2 = useRef(null);
  const [activeTextInput, setActiveTextInput] = useState(0);
  const [currentPair, setCurrentPair] = useState(`${value1 + value2}`);
  const [oldPair, setOldPair] = useState('');
  const baseValue = useRef(null);
  const topValue = useRef(null);
  const [firstValue, setFirstValue] = useState('');
  const baseCurrency = useRef(null);
  const topCurrency = useRef(null);
  const [rate, setRate] = useState(0);

  const getCurrentPair = () => {
    return value1.current && value2.current ? currentPair == oldPair : true;
  };
  const makeConversionRequest = ID => {
    ID == 1 && (baseValue.current = `${Number(topValue.current) * rate}`);
    ID == 2 && (topValue.current = `${Number(baseValue.current) / rate}`);

    setActiveTextInput(0);
  };

  function resetValue(id, value) {
    if (id == 1) {
      value1.current = value;
      topCurrency.current.focus();
    }
    if (id == 2) {
      value2.current = value;
      baseCurrency.current.focus();
    }
    setCurrentPair(`${value1.current + value2.current}`);
    const isPairSame = getCurrentPair();
    !isPairSame &&
      freecurrencyapi
        .latest({
          base_currency: value1.current,
          currencies: value2.current,
        })
        .then(response => {
          setOldPair(currentPair);
          topValue.current = topValue.current ? topValue.current : '1';
          baseValue.current = `${
            topValue.current ? Number(topValue.current) * rate : 1 * rate
          }`;
          setRate(response.data[`${value2.current}`]);
        });
    setActiveTextInput(id);
  }
  return (
    <CURRENCY_CONTEXT.Provider value={[currencyList, getCurrentPair]}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}>
        <ScrollView
          style={{
            flex: 1,
            // backgroundColor: 'green',
          }}>
          {connected ? (
            <View
              style={{
                padding: 20,
                // position: 'relative',
                flex: 1,
                alignItems: 'center',
                backgroundColor: '#53499970',
                height: Dimensions.get('window').height,
              }}>
              <DropdownComponent
                id={1}
                value={value1.current}
                resetValue={resetValue}
              />
              <TextInput
                clearTextOnFocus
                ref={topCurrency}
                selectTextOnFocus
                editable={value1.current ? true : false}
                // value={topValue.current}
                value={topValue.current}
                // onFocus={() => {
                //   topValue.current = '';
                //   setActiveTextInput(1);
                // }}
                placeholder="Amount"
                style={[
                  styles.textInput,
                  {
                    backgroundColor: 'white',
                    color: 'black',
                    borderRadius: 13,
                    padding: 10,
                    marginVertical: 5,
                  },
                ]}
                placeholderTextColor="black"
                inputMode="numeric"
                onChangeText={text => {
                  setFirstValue(text);
                  topValue.current = text;
                  makeConversionRequest(1);
                }}
                onSubmitEditing={() => baseCurrency.current.focus()}
              />
              <View
                style={{
                  backgroundColor: '#fff0',
                  height: 50,
                  marginVertical: 30,
                }}
              />
              <DropdownComponent
                id={2}
                value={value2.current}
                resetValue={resetValue}
              />
              <TextInput
                ref={baseCurrency}
                editable={value2.current ? true : false}
                value={baseValue.current}
                placeholder="Amount"
                inputMode="numeric"
                selectTextOnFocus
                style={[
                  styles.textInput,
                  {
                    backgroundColor: 'white',
                    color: 'black',
                    borderRadius: 13,
                    padding: 10,
                    marginVertical: 5,
                  },
                ]}
                onFocus={() => {
                  setActiveTextInput(2);
                }}
                placeholderTextColor="black"
                onChangeText={text => {
                  setFirstValue(text);
                  baseValue.current = text;
                  topValue.current = text;
                  makeConversionRequest(2);
                }}
              />
              <View
                style={{
                  // flex: 1,
                  position: 'absolute',
                  backgroundColor: '#650982',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  padding: 10,
                  borderRadius: 15,
                  paddingHorizontal: 30,
                  flexWrap: 'wrap',
                  // top: 0,
                  bottom: 10,
                  // right: 30,
                }}>
                <Text>Special thanks to </Text>
                <ClickableLink
                  url={'https://iconscout.com/contributors/mcgandhi61'}>
                  Mohit Gandhi
                </ClickableLink>
                <Text> for his </Text>
                <ClickableLink url={'https://iconscout.com/icons/currency'}>
                  Free Currency Icon
                </ClickableLink>
                <Text> on IconScout</Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                height: Dimensions.get('window').height,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 30,
                backgroundColor: '#53499970',
              }}>
              <Text
                style={{
                  fontSize: 24,
                  textAlign: 'center',
                  color: 'white',
                  marginBottom: 15,
                }}>
                An internet connection is required to get current exchange
                information
              </Text>

              <ActivityIndicator size={'small'} color={'#fff'} />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </CURRENCY_CONTEXT.Provider>
  );
}
const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVerical: 17,
    backgroundColor: 'green',
    marginVertical: 20,
    minHeight: 'auto',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'red',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'orange',
  },
  itemContainerStyle: {
    backgroundColor: 'red',
  },
  itemTextStyle: {
    color: 'black',
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
  textInput: {
    width: '100%',
  },
});
export default App;
