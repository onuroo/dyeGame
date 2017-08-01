import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Text,View,TextInput,TouchableOpacity} from 'react-native';
const CharacterButton = ({onPress,character}) => {
  return (
    <TouchableOpacity onPress={() => onPress && onPress()} style={styles.buttonView}>
      <Text style={styles.textView}>{character}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  buttonView:{marginLeft:5,marginBottom:5,height:50,width:50,justifyContent:'center',alignItems:'center',borderWidth:0.5,borderColor:'#34495e',borderRadius:10},
  textView:{color:'#34495e',fontWeight:'bold',fontSize:18}
});
export default CharacterButton
