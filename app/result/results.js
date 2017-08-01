import React, { Component } from 'react';
import {
  AppRegistry,StyleSheet,Text,View,TouchableOpacity,Alert,Image,BackHandler,Dimensions
} from 'react-native';
import BoardStore from '../stores/board';
import UserStore from '../stores/user';
import TimerStore from '../stores/timer';
import ResultStore from '../stores/result';
import * as Firebase from 'firebase'
import {observer} from 'mobx-react/native';
import Images from '../assets/images/images'
import Color from '../const/colors'
const windowSize = Dimensions.get('window');

@observer
export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state={
      isLoaded:false,
      thisPlayer:""
    }
  }
  whoWin(player1Duration,player1Corrects,player2Duration,player2Corrects){
    if(player1Corrects > player2Corrects){
      ResultStore.whoWin = "player1"
    }else{
      ResultStore.whoWin = "player2"
    }
    if(player1Corrects == player2Corrects){
      if(player1Duration > player2Duration){
        ResultStore.whoWin = "player1"
      }else{
        ResultStore.whoWin = "player2"
      }
    }
  }
  componentDidMount() {
    BackHandler.addEventListener('backPress', function() {
      return true;
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('backPress');
  }
  getResults(){
      var player1Corrects = 0
      var player1Duration = 0
      var player2Corrects = 0
      var player2Duration = 0
      const results = Firebase.database().ref().child('Results').child(BoardStore.currentRoomKey.toString() + BoardStore.createdTime.toString())
      results.once('value', (snap) => {
        snap.forEach((child) => {
          child.forEach((data) => {
            if(child.key == "player1"){
              player1Duration = player1Duration + data.val().duration
              if(data.val().result == "true"){
                player1Corrects = player1Corrects + 1
              }
              console.log(player1Corrects , player1Duration)
            }else{
              player2Duration = player2Duration + data.val().duration
              if(data.val().result == "true"){
                player2Corrects = player2Corrects + 1
              }
              console.log(player2Corrects , player2Duration)
            }
          })
        })
      }).then((data) => {
        this.setResults(player1Duration,player1Corrects,player2Duration,player2Corrects)
        this.whoWin(player1Duration,player1Corrects,player2Duration,player2Corrects),
        this.setState({isLoaded:true})
        this.deleteSettings()
        this.deleteRoom()
      })
  }
  deleteRoom(){
    const room = Firebase.database().ref().child('Room').child(BoardStore.currentRoomKey)
    room.remove()
  }
  deleteSettings(){
    const roomSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
    roomSettings.remove()
  }
  setResults(p1Duration,p1Corrects,p2Duration,p2Corrects){
    ResultStore.player1Result.duration = 100 - p1Duration
    ResultStore.player1Result.correct = p1Corrects
    ResultStore.player2Result.duration = 100 - p2Duration
    ResultStore.player2Result.correct = p2Corrects
  }
  closeBoardListeners(){
    const myRoomSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
    const roundSettings = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('round').child("0")
    const wordsRef = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('wordsOfRoom').child(BoardStore.player1Round)
    const roundPlayer1 = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('round').child("1")
    const roundPlayer2 = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey).child('round').child("2")
    const listenStatus = Firebase.database().ref().child('Settings').child(BoardStore.currentRoomKey)
    myRoomSettings.off('value')
    roundSettings.off('value')
    wordsRef.off('value')
    roundPlayer1.off('value')
    roundPlayer2.off('value')
    listenStatus.off('value')
  }
  checkPlayer(){
    if(UserStore.uid == BoardStore.currentRoomKey){
      this.setState({thisPlayer:"player1"})
    }else{
      this.setState({thisPlayer:"player2"})
    }
  }
  componentWillMount(){
    //SETTINGSI SILECEGIZ
    this.closeBoardListeners()
    this.checkPlayer()
    if(ResultStore.isCancelled === ""){
      this.getResults()
    }else{
      if(ResultStore.isCancelled == "player1 left"){
        ResultStore.whoWin = "player2"
        this.setState({isLoaded:true})
        this.deleteSettings()
        this.deleteRoom()
      }else{
        ResultStore.whoWin = "player1"
        this.setState({isLoaded:true})
        this.deleteSettings()
        this.deleteRoom()
      }
    }
  }
  resetStore(){
    ResultStore.player1Result = {name:"",duration:"",correct:""}
    ResultStore.player2Result = {name:"",duration:"",correct:""}
    ResultStore.whoWin = ""
    ResultStore.isCancelled = ""
  }
  goHome(){
    this.resetStore()
    this.props.navigation.dispatch({type: 'Reset', index: 0, actions: [{ type: 'Navigate', routeName:'home'}]})
  }
  render() {
    console.log(ResultStore.whoWin)
    if(!this.state.isLoaded){
      return(
        <View style={styles.container}>
          <Text style={styles.welcome}>Waiting for results
          </Text>
        </View>
      )
    }else{
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.goHome() } style={styles.headerLeft}>
              <Image style={styles.leftArrowIcon} source={Images.leftArrow} />
              <Text style={styles.h5}>Home</Text>
            </TouchableOpacity>
            <View style={styles.headerMiddle}>
              <Text style={styles.h4}>Results</Text>

            </View>
            <View style={styles.headerRight}>

            </View>
          </View>
          <View style={styles.topView}>
          </View>
          <View style={styles.iconView}>
            {ResultStore.whoWin == this.state.thisPlayer ?
              <View style={styles.winnerView}>
                <Image style={styles.winnerIcon} source={Images.winner} />
                <Text style={styles.h3}>Congratulations. You Won</Text>
              </View>
              :
              <View style={styles.loserView}>
                <Image style={styles.loserIcon} source={Images.loser} />
                <Text style={styles.h3}>We are sorry, You Lost</Text>
              </View>
            }
          </View>
          {ResultStore.isCancelled === ""
            ?
            <View style={styles.statisticView}>
              <View style={styles.leftStatisticView}>
                <Text style={styles.h1}>
                  {BoardStore.player1DisplayName}
                </Text>
                <Text style={styles.h2}>
                  Duration: {ResultStore.player1Result.duration}
                </Text>
                <Text style={styles.h2}>
                  Corrects: {ResultStore.player1Result.correct}
                </Text>
              </View>
              <View style={styles.rightStatisticView}>
                <Text style={styles.h1}>
                  {BoardStore.player2DisplayName}
                </Text>
                <Text style={styles.h2}>
                  Duration: {ResultStore.player2Result.duration}
                </Text>
                <Text style={styles.h2}>
                  Corrects: {ResultStore.player2Result.correct}
                </Text>
              </View>
            </View>
            : null }

          <View style={styles.bottomView}>
          </View>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: '#F5FCFF',},
  winnerIcon:{height:100,width:100,marginBottom:20},
  loserIcon:{height:75,width:75,marginBottom:20},
  topView:{flex:1},
  header:{height:50,width:windowSize.width,backgroundColor:Color.darkBlue,justifyContent:'center',alignItems:'center',flexDirection:'row'},
  headerLeft:{flex:2,justifyContent:'center',alignItems:'center',flexDirection:'row'},
  headerMiddle:{flex:4,justifyContent:'center',alignItems:'center',flexDirection:'row'},
  headerRight:{flex:2,justifyContent:'center',alignItems:'center',flexDirection:'row'},
  iconView:{flex:1,justifyContent:'center',alignItems:'center'},
  statisticView:{flex:1,flexDirection:'row'},
  leftStatisticView:{flex:1,justifyContent:'center',alignItems:'center'},
  rightStatisticView:{flex:1,justifyContent:'center',alignItems:'center'},
  bottomView:{flex:1,backgroundColor:'blue'},
  winnerView:{justifyContent:'center',alignItems:'center'},
  loserView:{justifyContent:'center',alignItems:'center'},
  h1:{fontWeight:'bold',fontSize:18},
  h2:{fontSize:17},
  h3:{fontSize:19,color:Color.darkBlue},
  h4:{color:'#FFF',fontWeight:'bold',fontSize:18},
  h5:{color:'#FFF',fontSize:17},
  leftArrowIcon:{height:20,width:20,marginRight:5}
});
