import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import BoardStore from '../stores/board';
class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalDuration:this.props.totalDuration,
      currentDuration:this.props.totalDuration
    }
  }
  componentWillMount(){
    const finished = this.props.finished
    var mySetInvterval = setInterval(function(){
      if(this.state.currentDuration == 0 ){
        finished()
        BoardStore.timerFinished = true
        this.setState({currentDuration:this.state.totalDuration})
      }else{
        var newDuration = this.state.currentDuration - 1
        this.setState({currentDuration:newDuration})
      }
    }.bind(this), 1000);
  }
  componentDidMount(){
  }
  render(){
    return(
      <View>
        <Text>{this.state.currentDuration}</Text>
      </View>
    )
  }
}

export default Timer;
