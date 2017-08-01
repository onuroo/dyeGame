import React, {Component} from 'react';
import {Text, View, StyleSheet,Alert} from 'react-native';
import TimerStore from '../stores/timer';
import BoardStore from '../stores/board'
import {observer} from 'mobx-react/native';
@observer
class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalDuration:this.props.totalDuration,
      currentDuration:this.props.totalDuration,
    }
  }
  componentWillMount(){
    TimerStore.totalDuration = this.props.totalDuration
    TimerStore.currentDuration = this.props.totalDuration
    TimerStore.reset = this.props.reset
    const finished = this.props.finished
    const currentTime = this.props.currentTime
    var mySetInvterval = setInterval(function(){
      if(TimerStore.isStopped){
        clearInterval(mySetInvterval)
        //Alert.alert('ooooo')
      }
      if(TimerStore.currentDuration == 0 ){
        //Alert.alert('wqewqe',TimerStore.isStopped.toString())
        finished()
        TimerStore.currentDuration = TimerStore.totalDuration
      }else{
        var newDuration = TimerStore.currentDuration - 1
        TimerStore.currentDuration = newDuration
        currentTime(newDuration)
      }
      if(TimerStore.reset){
         TimerStore.currentDuration = TimerStore.totalDuration
         TimerStore.reset= false
      }
    }.bind(this), 1000);

  }

  componentWillReceiveProps(nextProps){
    //Alert.alert('',JSON.stringify(nextProps))
    if(nextProps.reset){

      TimerStore.currentDuration = TimerStore.totalDuration
      BoardStore.resetTimer = false
    }
  }
  render(){

    return(
      <View>
        <Text style={styles.h4}>{TimerStore.currentDuration}</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  h4:{color:'#34495e',fontSize:17,fontWeight:"500"}
});

export default Timer;
