import React, { Component } from 'react';
import {AppRegistry,StyleSheet,Text,View,TextInput,TouchableOpacity,Image} from 'react-native';
import Images from '../assets/images/images'
const UndoButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress && onPress()} style={styles.buttonView}>
      <Image style={styles.imageView} source={Images.undoButton} />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  buttonView:{marginLeft:5,marginBottom:5,height:50,width:50,justifyContent:'center',alignItems:'center',borderWidth:0.5,borderColor:'#34495e',borderRadius:10},
  imageView:{height:25,width:25,resizeMode:'stretch'}
});
export default UndoButton
