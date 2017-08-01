
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  AppState,
  TouchableHighlight,
} from 'react-native';
const windowSize = Dimensions.get('window');
import {StackNavigator} from 'react-navigation'
import BoardStore from '../stores/board';
import UserStore from '../stores/user';
import ResultStore from '../stores/result';
import TimerStore from '../stores/timer';
import * as Firebase from 'firebase'
import Timer from '../components/timer';
import {observer} from 'mobx-react/native';
import CountdownTimer from 'react-native-countdown-clock'
import MaskedTextInput from '../components/maskedTextInput'
import CharacterButton from '../components/characterButton'
import UndoButton from '../components/undoButton'
import KeepAwake from 'react-native-keep-awake';
import Color from '../const/colors'
@observer
export default class BoardMain extends Component {
  constructor(props) {
    super(props);
    this.state={
      isLoaded:false,
    }

  }
  //BoardStore.currentRoomKey
  pullNewWord(){

  }
  extractWrongWord(wrong){
    let extractedArray = []
    for(var i = 0 ; i < wrong.length ; i++ ){
      extractedArray.push(wrong.substr(i,1))
    }
    BoardStore.currentWrondWordExtracted = extractedArray
  }
  extractCorrectWord(correct){
    //sadece boş maskedtextinput için boş array
    let extractedArray = []
    for(var i = 0 ; i < correct.length ; i++ ){
      extractedArray.push("")
    }
    BoardStore.currentCorrectWordExtracted = extractedArray
  }
  prepareCharacters(correct){
    //alt taraf için ( for keyboard )
    let extractedArray = []
    let charChecker = ""
    for(var i = 0 ; i < correct.length ; i++ ){
      if(charChecker.indexOf(correct.substr(i,1)) == -1){
        charChecker +=correct.substr(i,1)
        extractedArray.push(correct.substr(i,1))
      }
    }
    BoardStore.characters = extractedArray
  }
  listenTheGame(){
    if(UserStore.uid == BoardStore.currentRoomKey){
      //listen as a creater player, is it ended controller here
      const myRoomSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
      myRoomSettings.on('value',(snap) => {
        if(BoardStore.currentRound < 6){
          BoardStore.currentRoomTitle = snap.val().roomTitle
          BoardStore.createdTime = snap.val().createdTime
          BoardStore.currentWrongWord = snap.val().wordsOfRoom[BoardStore.currentRound-1].wrong
          BoardStore.currentCorretWord = snap.val().wordsOfRoom[BoardStore.currentRound-1].correct
          BoardStore.player1DisplayName = snap.val().player1DisplayName
          BoardStore.player2DisplayName = snap.val().player2DisplayName
          this.extractWrongWord(BoardStore.currentWrongWord)
          this.extractCorrectWord(BoardStore.currentCorretWord)
          this.prepareCharacters(BoardStore.currentWrongWord)

        }
      })
    }else{
      //listen as a normal player
      const myRoomSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
      myRoomSettings.on('value',(snap) => {
        if(BoardStore.currentRound < 6){
          BoardStore.currentRoomTitle = snap.val().roomTitle
          BoardStore.createdTime = snap.val().createdTime
          BoardStore.currentWrongWord = snap.val().wordsOfRoom[BoardStore.currentRound-1].wrong
          BoardStore.currentCorretWord = snap.val().wordsOfRoom[BoardStore.currentRound-1].correct
          BoardStore.player1DisplayName = snap.val().player1DisplayName
          BoardStore.player2DisplayName = snap.val().player2DisplayName
          this.extractWrongWord(BoardStore.currentWrongWord)
          this.extractCorrectWord(BoardStore.currentCorretWord)
          this.prepareCharacters(BoardStore.currentWrongWord)
        }
      })
    }
  }
  listenRound(){
    const roundSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('round').child("0")
    roundSettings.on('value',(snap) => {
      if(snap.val().round !== BoardStore.currentRound){
        BoardStore.resetTimer = true
        BoardStore.currentRound = snap.val().round
        this.listenWords()
      }
    })
  }
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = (nextAppState) => {
    if(nextAppState == "background"){
        const roomSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
        roomSettings.update({status: UserStore.uid == BoardStore.currentRoomKey ? 'player1 left' : 'player2 left' })
    }
    console.log(nextAppState.toString())
  }
  componentWillMount(){
   this.setState({isLoaded:true})
   console.disableYellowBox = true;
   this.listenTheGame()
   this.listenRound()
   this.listenStatus()
   this.listenWords()
  }
  stopTheTimer(){
    TimerStore.isStopped = true
  }
  listenWords(){
    if(UserStore.uid == BoardStore.currentRoomKey){
      if(BoardStore.player1Round < 5){
        const wordsRef = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('wordsOfRoom').child(BoardStore.player1Round)
        wordsRef.once('value',(snap) => {
          BoardStore.currentWrongWord = snap.val().wrong
          BoardStore.currentCorretWord = snap.val().correct
        })
      }
    }else{
      if(BoardStore.player2Round < 5){
        const wordsRef = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('wordsOfRoom').child(BoardStore.player2Round)
        wordsRef.once('value',(snap) => {
          BoardStore.currentWrongWord = snap.val().wrong
          BoardStore.currentCorretWord = snap.val().correct
        })
      }
    }
  }
  increaseCorrects(){
    BoardStore.hudCorrects = BoardStore.hudCorrects + 1
  }
  finishRound(){
    let text = ""
    for(var i = 0 ; i < BoardStore.currentCorrectWordExtracted.length ; i++){
      text = text + BoardStore.currentCorrectWordExtracted[i]
    }
    if(UserStore.uid == BoardStore.currentRoomKey){
      if(BoardStore.player1Round !== BoardStore.currentRound){
        const roundSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('round').child("1")
        roundSettings.update({player1:BoardStore.currentRound})
        const myStatsRef= Firebase.database().ref().child('Results').child(BoardStore.currentRoomKey.toString() + BoardStore.createdTime.toString())

        let myStats = BoardStore.myStats
        if(text === BoardStore.currentCorretWord){
          myStats.push({id:BoardStore.player1Round,result:"true",duration:BoardStore.currentTime})
          myStatsRef.update({player1:BoardStore.myStats})
          this.increaseCorrects()
        }else{
          myStats.push({id:BoardStore.player1Round,result:"false",duration:BoardStore.currentTime})
          myStatsRef.update({player1:BoardStore.myStats})
        }
      }
    }else{
      if(BoardStore.player2Round !== BoardStore.currentRound){
        const roundSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('round').child("2")
        roundSettings.update({player2:BoardStore.currentRound})
        const myStatsRef = Firebase.database().ref().child('Results').child(BoardStore.currentRoomKey.toString() + BoardStore.createdTime.toString())

        let myStats = BoardStore.myStats
        if(text === BoardStore.currentCorretWord){
          myStats.push({id:BoardStore.player2Round,result:"true",duration:BoardStore.currentTime})
          myStatsRef.update({player2:BoardStore.myStats})
          this.increaseCorrects()
        }else{
          myStats.push({id:BoardStore.player2Round,result:"false",duration:BoardStore.currentTime})
          myStatsRef.update({player2:BoardStore.myStats})
        }
      }
    }
    const roundPlayer1 = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('round').child("1")
    roundPlayer1.on('value',(snap) => {
      BoardStore.player1Round = snap.val().player1
      this.changeRound()
    })
    const roundPlayer2 = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('round').child("2")
    roundPlayer2.on('value',(snap) => {
      BoardStore.player2Round = snap.val().player2
      this.changeRound()
    })
  }
  changeRound(){
    if(BoardStore.player1Round === BoardStore.player2Round){
      if(BoardStore.player1Round === BoardStore.currentRound){
        //change the round
        const changeRound = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('round').child("0")
        let currentRound = BoardStore.currentRound
        currentRound = currentRound + 1
        if(currentRound == 6){
          this.changeStatus("finished")
        }
        changeRound.update({round:currentRound})
      }
    }
    if(BoardStore.player2Round === BoardStore.player1Round){
      if(BoardStore.player2Round === BoardStore.currentRound){
        //change the round
        const changeRound = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('round').child("0")
        let currentRound = BoardStore.currentRound
        currentRound = currentRound + 1
        if(currentRound == 6){

          this.changeStatus("finished")
        }
        changeRound.update({round:currentRound})
      }
    }
  }
  changeStatus(status){
    const changeStatus = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
    changeStatus.update({status:status.toString()})
  }
  listenStatus(){
    const listenStatus = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
    listenStatus.on('value',(snap) => {

      if(snap.val().status == "finished"){
        if(!BoardStore.isRoutedToResult){
          this.props.navigation.navigate('results')
          BoardStore.isRoutedToResult = true
        }
        this.stopTheTimer()
      }else if(snap.val().status == "player1 left"){
        ResultStore.isCancelled = "player1 left"
        this.stopTheTimer()
        this.props.navigation.navigate('results')
      }else if(snap.val().status == "player2 left"){
        ResultStore.isCancelled = "player2 left"
        this.stopTheTimer()
        this.props.navigation.navigate('results')
      }

    })
  }
  changeText(text){
    BoardStore.text = text
  }
  timerFinished(){
    this.finishRound()
    //random painting
    //var randomNumber  = Math.floor(Math.random() * (6 - 1))
    //Alert.alert(randomNumber.toString() + ":" + randomNumber3.toString(),randomNumber2.toString()+ ":" + randomNumber4.toString())
  }
  characterButtonAction(character){
    for(var i = 0 ; i < BoardStore.currentCorrectWordExtracted.length; i++ ){
      if(BoardStore.currentCorrectWordExtracted[i] === ""){
        BoardStore.currentCorrectWordExtracted[i] = character
        break
      }
    }
  }
  undoButtonAction(){
    for(var i = BoardStore.currentCorrectWordExtracted.length-1 ; i > -1 ; i-- ){
      if(BoardStore.currentCorrectWordExtracted[i] != ""){
        BoardStore.currentCorrectWordExtracted[i] = ""
        break
      }
    }
  }
  render() {
    if(!this.state.isLoaded){return null}
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.h1}>{BoardStore.currentRoomTitle}</Text>
        </View>
        <View style={styles.hudView}>
          <View style={styles.leftHudView}>
            <Text style={styles.h3}>Round</Text>
            <Text style={styles.h4}>{BoardStore.currentRound}</Text>
          </View>
          <View style={styles.middleHudView}>
            <Text style={styles.h3}>Corrects</Text>
            <Text style={styles.h4}>{BoardStore.hudCorrects}</Text>
          </View>
          <View style={styles.rightHudView}>
            <Text style={styles.h3}>Duration</Text>
            <Timer reset={BoardStore.resetTimer} isStopped={TimerStore.isStopped} currentTime={(time) => {BoardStore.currentTime = time}} finished={this.timerFinished.bind(this)} totalDuration={20} />
          </View>

          <View style={{backgroundColor:''}}></View>

        </View>
        <View style={styles.boardView}>
          <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
            <View style={{flexDirection:'row',marginBottom:20}}>
              {BoardStore.currentWrondWordExtracted.map(character => (
                <View style={{marginLeft:5}}>
                  <MaskedTextInput character={character.toString()} />
                </View>
              ))}
            </View>
            <View style={{flexDirection:'row'}}>
              {BoardStore.currentCorrectWordExtracted.map(character => (
                <MaskedTextInput character={character.toString()} />
              ))}
            </View>
          </View>
          <View style={{flex:3,justifyContent:'center',alignItems:'center',flexWrap:'wrap',flexDirection:'row'}}>
            {BoardStore.characters.map(character => (
              <CharacterButton  onPress={() => this.characterButtonAction(character)} character={character} />
            ))}
            <UndoButton onPress={() => this.undoButtonAction()} />
          </View>

        </View>
        <View style={{flex:3,width:windowSize.width,backgroundColor:'transparent'}}>
          <TouchableHighlight onPress={() => this.finishRound()} style={{position:'absolute',bottom:0,left:0,width:windowSize.width,height:50,backgroundColor:'#34495e',justifyContent:'center',alignItems:'center'}}>
            <Text style={styles.h1}>Try</Text>
          </TouchableHighlight>
        </View>
        <KeepAwake />
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
  header:{height:50,width:windowSize.width,backgroundColor:Color.darkBlue,justifyContent:'center',alignItems:'center'},
  hudView:{flex:2,flexDirection:'row'},
  leftHudView:{flex:1,alignItems:'center'},
  middleHudView:{flex:3,justifyContent:'center',alignItems:'center'},
  rightHudView:{flex:1,alignItems:'center'},
  boardView:{flex:8,flexWrap:'wrap',width:300,flexDirection:'column'},
  boxes:{height:50,width:50,borderWidth:1},
  h1:{color:'#FFF',fontWeight:'bold',fontSize:18},
  h2:{color:'#FFF',fontWeight:'bold',fontSize:16},
  randomColor:{height:75,width:75,backgroundColor:'transparent'},
  h3:{color:'#34495e',fontSize:18,fontWeight:'bold'},
  h4:{color:'#34495e',fontSize:17,fontWeight:"500"}
});

/*
<TextInput
  onChangeText={(text) => this.changeText(text)}
  style={{height:50,width:250,borderWidth:0.5,borderColor:'#A0A0A0',padding:10}}
  underlineColorAndroid='transparent'
  />
*/
