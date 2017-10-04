

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AppState
} from 'react-native';
const h = 80
const w = 80
var wordsArray = ["A","B","C","K","M","O","P","V","Y","X"]
export default class Statistic extends Component {
  constructor(props) {
    super(props);
    this.state={
      wordsArray:[]
    }
  }
  //341.3
  //256

  render() {
    return (
      <Text>Current state is: {this.state.appState}</Text>
    );
  }
  changeArray(){
    var oldArray = this.state.wordsArray
    oldArray.push("G")
    this.setState({wordsArray: oldArray})
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection:'row'}} >
          <View style={{height:h,width:w,backgroundColor:'#d0d0d0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#808080',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#c0c0c0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#b0b0b0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#a0a0a0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          
        </View>
        <View style={{flexDirection:'row'}} >
          <View style={{height:h,width:w,backgroundColor:'#808080',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#a0a0a0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#c0c0c0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#b0b0b0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#d0d0d0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          
        </View>
        <View style={{flexDirection:'row'}} >
          <View style={{height:h,width:w,backgroundColor:'#a0a0a0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#d0d0d0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#808080',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#b0b0b0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#c0c0c0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          
        </View> 
        <View style={{flexDirection:'row'}} >
          <View style={{height:h,width:w,backgroundColor:'#c0c0c0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#d0d0d0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#a0a0a0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#b0b0b0',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          <View style={{height:h,width:w,backgroundColor:'#808080',opacity:0.5,borderWidth:1,borderColor:'#b0b0b0'}}></View>
          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  border:{
    borderWidth:1,borderColor:'#b0b0b0'
  }

});
