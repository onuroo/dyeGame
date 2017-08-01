import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Text,View,TextInput} from 'react-native';
const MaskedTextInput = ({character}) => {
  return (
      <View style={styles.inputView}>
        <View style={{height:30,width:30,justifyContent:'flex-end',alignItems:'center'}}>
          <Text style={styles.inputText}>
            {character}
          </Text>
        </View>
        <View style={{height:1,width:30,justifyContent:'flex-end',alignItems:'center'}}>
          <View style={{height:2,width:15,backgroundColor:'#fff'}}>
          </View>
        </View>
        <View style={{height:5,width:30,backgroundColor:'#34495e'}}>
        </View>
      </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: '#F5FCFF',},
  inputView:{backgroundColor:'#34495e',width:30},
  inputText:{fontSize:20,color:'#fff'},
  inputUnderLine:{fontSize:20},
});
export default MaskedTextInput
