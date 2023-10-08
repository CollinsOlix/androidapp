import {Image, StyleSheet} from 'react-native';
import React, {memo, useContext, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {CURRENCY_CONTEXT} from '../context/CURRENCY_CONTEXT';

const DropdownComponent = ({id, value, resetValue}) => {
  const [currencyList, getCurrentPair] = useContext(CURRENCY_CONTEXT);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      itemContainerStyle={styles.itemContainerStyle}
      containerStyle={{borderRadius: 13, overflow: 'hidden'}}
      itemTextStyle={styles.itemTextStyle}
      data={currencyList}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={!isFocus ? 'Select Currency' : '...'}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={item => {
        resetValue(id, item.value);
        setIsFocus(false);
      }}
      renderLeftIcon={() => (
        <Image
          source={{
            uri: `https://flagsapi.com/${value?.slice(0, 2)}/shiny/64.png`,
          }}
          style={{padding: 3, height: 25, width: 25}}
        />
      )}
    />
  );
};
const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVerical: 17,
    backgroundColor: '#4e4c40',
    marginVertical: 20,
    minHeight: 'auto',
    width: '100%',
  },
  placeholderStyle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  selectedTextStyle: {
    fontSize: 20,
    color: 'white',
    marginLeft: 10,
  },
  itemContainerStyle: {
    backgroundColor: '#6039ab',
  },
  itemTextStyle: {
    color: 'black',
    fontSize: 20,
    padding: 0,
    margin: 0,
  },
});
export default memo(DropdownComponent);
