

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AppState
} from 'react-native';
var wordsArray = ["A","B","C","K","M","O","P","V","Y","X"]
export default class Statistic extends Component {
  constructor(props) {
    super(props);
    this.state={
      wordsArray:[]
    }
  }
  

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
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <View style={{height:200,width:200,borderWidth:1,flexWrap:'wrap',flexDirection:'row'}}>
          {this.state.wordsArray.map(word => (
            <TouchableOpacity style={{height:50,width:50,justifyContent:'center',alignItems:'center'}}>
              <Text>
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={() => this.changeArray()}>
          <Text>Change Array
          </Text>
        </TouchableOpacity>
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

});
