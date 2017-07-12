
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native';
const windowSize = Dimensions.get('window');
import {StackNavigator} from 'react-navigation'
import BoardStore from '../stores/board';
import UserStore from '../stores/user';
import * as Firebase from 'firebase'
import  Timer  from '../components/timer';
import {observer} from 'mobx-react/native';
import CountdownTimer from 'react-native-countdown-clock'
@observer
export default class BoardMain extends Component {
  constructor(props) {
    super(props);
    this.state={
      isLoaded:false,
    }
  }

  prepareTheBoard(){
    BoardStore.mapArray = []
    for(var i =0;i<36;i++){
      BoardStore.mapArray.push({id:i,color:'none',player:'none'})
      if(i == 35){

        const roomSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
        roomSettings.update({boardArray:BoardStore.mapArray})
        //Alert.alert('',JSON.stringify(BoardStore.mapArray))
        this.listenBoardArray()
        this.setState({isLoaded:true})
        //this.listenBoardArray()
      }
    }
  }
  listenBoardSettings(){
    const roomSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
    roomSettings.on('value',(snap) => {
      if(BoardStore.playingPlayer != snap.val().playingPlayer){
        //timer reseting

      }
      BoardStore.playingPlayer = snap.val().playingPlayer
      BoardStore.player1 = snap.val().Player1
      BoardStore.player2 = snap.val().Player2
      BoardStore.currentRandomColor = snap.val().currentColor
    })
  }
  listenBoardArray(){
    this.listenBoardSettings()
    this.setState({isLoaded:true})
    const room = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('boardArray')

    room.on('value',(snap) => {

      var array = []
      //map doesn't visible like this usage
      if(BoardStore.boardArray.length == 0){
        snap.forEach((child) => {
          array.push({id:child.val().id,color:child.val().color,player:child.val().player})
        })

        BoardStore.boardArray = array
      }else{
        snap.forEach((child) => {
          if(BoardStore.boardArray[child.val().id].color != child.val().color){
            BoardStore.boardArray[child.val().id].id = child.val().id
            BoardStore.boardArray[child.val().id].color = child.val().color
            BoardStore.boardArray[child.val().id].player = child.val().player
          }
        })
      }
      //map doesn't visible like this usage
    })
  }
  getRandomColor(){
    BoardStore.currentRandomColor = BoardStore.colors[Math.floor(Math.random()*BoardStore.colors.length)];
    const roomSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
    roomSettings.update({currentColor:BoardStore.currentRandomColor})
  }
  componentWillMount(){

   console.disableYellowBox = true;
   if(UserStore.uid == BoardStore.currentRoomKey){
     this.getRandomColor()
     this.prepareTheBoard()
   }else{
     this.listenBoardArray()
   }

  }
  paintSpecify(id){
    if(BoardStore.boardArray[id].color == 'none'){
      if(BoardStore.playingPlayer == UserStore.uid){
        var cloneBoardArray = BoardStore.boardArray
        cloneBoardArray[id].color = BoardStore.currentRandomColor
        cloneBoardArray[id].player = BoardStore.playingPlayer
        const roomSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
        roomSettings.update({boardArray:cloneBoardArray})
        if(BoardStore.player1 == UserStore.uid){
          roomSettings.update({playingPlayer:BoardStore.player2})
          this.getRandomColor()
        }else{
          roomSettings.update({playingPlayer:BoardStore.player1})
          this.getRandomColor()
        }
      }
    }

  }
  timerFinished(){
    //random painting
    if(BoardStore.playingPlayer == UserStore.uid){
      var randomNumber  = Math.floor(Math.random() * (6 - 1))
      //find space cells
      var spaceCells = []
      for(var i = 0 ; i < 36 ; i++){
        if(BoardStore.boardArray[i].color == 'none'){
          spaceCells.push(i)
        }
        if(i == 35){
          var cellID = spaceCells[Math.floor(Math.random()*spaceCells.length)];
          this.paintSpecify(cellID)
          //Alert.alert(cellID.toString())
        }
      }
    }
    //Alert.alert(randomNumber.toString() + ":" + randomNumber3.toString(),randomNumber2.toString()+ ":" + randomNumber4.toString())
  }
  render() {
    if(!this.state.isLoaded){return null}
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.h1}>{BoardStore.currentRoomKey}</Text>
        </View>
        <View style={styles.hudView}>
          <TouchableOpacity onPress={() => this.getRandomColor()}>
            <Text>Prepare</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.paintSpecify()}>
            <Text>Paint Specify</Text>
          </TouchableOpacity>

          <Timer finished={this.timerFinished.bind(this)} totalDuration={7} />

          <View style={{backgroundColor:''}}></View>
          <View style={styles.randomColor}>
            <View style={{height:50,width:50,backgroundColor:BoardStore.currentRandomColor}}></View>
          </View>
        </View>
        <View style={styles.boardView}>
        {BoardStore.boardArray.map(boxes => (
            <TouchableOpacity onPress={() => this.paintSpecify(boxes.id) } style={[styles.boxes,{backgroundColor:boxes.color == "none" ? 'white' : boxes.color}]}>
            </TouchableOpacity>
        ))}
        </View>
      </View>
    );
  }
}
const options = {
  container: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    justifyContent:'center',
    alignItems:'center',
    width: 40,
  },
  text: {
    fontSize: 30,
    color: '#A0A0A0',

  }
};
const styles = StyleSheet.create({
  container: {flex: 1,justifyContent:'center',alignItems:'center',backgroundColor: '#FFF'},
  header:{height:50,width:windowSize.width,backgroundColor:'#9b59b6'},
  hudView:{flex:2},
  boardView:{flex:4,flexWrap:'wrap',width:300,flexDirection:'row'},
  boxes:{height:50,width:50,borderWidth:1},
  h1:{color:'#FFF',fontWeight:'bold',fontSize:18},
  h2:{color:'#FFF',fontWeight:'bold',fontSize:16},
  randomColor:{height:75,width:75,backgroundColor:'transparent'}
});
