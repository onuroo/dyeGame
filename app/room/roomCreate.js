import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  ListView,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native';
const windowSize = Dimensions.get('window');
import Databases from '../realmDB/databases';
import * as Firebase from 'firebase'
import UserStore from '../stores/user'
import RoomStore from '../stores/room'
import BoardStore from '../stores/board'
import {observer} from 'mobx-react/native';
import Color from '../const/colors'
@observer
export default class RoomCreate extends Component {
  constructor(props) {
    super(props);
    this.state={
      roomTitle:"",
    }
  }
  listenCreatedRoom(){
    const myRoomSettings = Firebase.database().ref().child('Settings').child(UserStore.uid)
    myRoomSettings.update({Player1:UserStore.uid})
    const createdRoom = Firebase.database().ref().child('Rooms').child(UserStore.createdRoom)
    createdRoom.on('value',(snap) => {
      var list = []
      snap.forEach((child) => {
        child.forEach((data) => {
          if(UserStore.uid != child.key){
            myRoomSettings.update({Player2:child.key,playingPlayer:child.key})
          }
          if(UserStore.createdRoom == child.key){
            UserStore.createdRoomKey = data.key
            RoomStore.createdRoomStatus = data.val().status
            if(data.val().status == "active"){
              BoardStore.currentRoomKey = child.key
              this.props.navigation.navigate('boardMain')

            }
          }
          list.push({
            userUID:data.val().uid,
            userDisplayName:data.val().displayName,
            userEmail:data.val().email
          })
        })
      })
      RoomStore.createdRoomList = list
    })
  }
  componentWillMount(){
    console.disableYellowBox = true;
    RoomStore.status = ""

  }
  removeCurrentRoom(){
    const myRoom = Firebase.database().ref().child('Rooms').child(UserStore.uid)
    myRoom.remove()
  }
  action(){
   if(RoomStore.status == "created"){
     RoomStore.status = ""
     this.removeCurrentRoom()
   }else{
    if(this.state.roomTitle != ""){
      this.removeCurrentRoom()
      const createRoom = Firebase.database().ref().child('Rooms').child(UserStore.uid).child(UserStore.uid)
      createRoom.push({
        uid:UserStore.uid,
        email:UserStore.email,
        displayName:UserStore.displayName,
        roomTitle:this.state.roomTitle,
        status:'passive',
      })
      const createRoomSettings = Firebase.database().ref().child('Settings').child(UserStore.uid)
      createRoomSettings.remove()
      createRoomSettings.update({roomTitle:this.state.roomTitle})
      createRoomSettings.update({player1DisplayName:UserStore.displayName})
      UserStore.createdRoom = UserStore.uid
      RoomStore.status = "created"
      this.listenCreatedRoom()
    }
   }
  }
  componentDidMount() {
    BackHandler.addEventListener('backPress', function() {
      if(RoomStore.status == "created"){
        RoomStore.status = ""
        const myRoom = Firebase.database().ref().child('Rooms').child(UserStore.uid)
        myRoom.remove()
        return false;
      }else{
        return false;
      }
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('backPress');
  }
  getWordsPromise(){
    var promise = new Promise(function(resolve, reject) {
      var wordsArray = [{correct:"",wrong:''},{correct:"",wrong:''},{correct:"",wrong:''},{correct:"",wrong:''},{correct:"",wrong:''}]
      var element = {}
      var correct = ""
      var wrong = ""
      const wordsRef = Firebase.database().ref().child('Words')
      wordsRef.once("value")
        .then(function(snapshot) {
          const numChildren = snapshot.numChildren()

          var random1 = Math.floor((Math.random() * numChildren));
          wordsRef.orderByChild('id').startAt(random1).once('value', (snapshot) => {
            wordsArray[0].correct = snapshot.val()[random1].correct
            wordsArray[0].wrong = snapshot.val()[random1].wrong
            if(wordsArray[0].correct != "" && wordsArray[1].correct != "" && wordsArray[2].correct != "" && wordsArray[3].correct != "" && wordsArray[4].correct != "" && wordsArray[0].correct != ""){
              resolve(wordsArray)
            }else if(wordsArray.length > 5){
              reject('fail')
            }
          });
          var random2 = Math.floor((Math.random() * numChildren));

          wordsRef.orderByChild('id').startAt(random2).once('value', (snapshot) => {
            wordsArray[1].correct = snapshot.val()[random2].correct
            wordsArray[1].wrong = snapshot.val()[random2].wrong
            if(wordsArray[0].correct != "" && wordsArray[1].correct != "" && wordsArray[2].correct != "" && wordsArray[3].correct != "" && wordsArray[4].correct != "" && wordsArray[0].correct != ""){
              resolve(wordsArray)
            }else if(wordsArray.length > 5){
              reject('fail')
            }
          });
          var random3 = Math.floor((Math.random() * numChildren));

          wordsRef.orderByChild('id').startAt(random3).once('value', (snapshot) => {
            wordsArray[2].correct = snapshot.val()[random3].correct
            wordsArray[2].wrong = snapshot.val()[random3].wrong
            if(wordsArray[0].correct != "" && wordsArray[1].correct != "" && wordsArray[2].correct != "" && wordsArray[3].correct != "" && wordsArray[4].correct != "" && wordsArray[0].correct != ""){
              resolve(wordsArray)
            }else if(wordsArray.length > 5){
              reject('fail')
            }
          });
          var random4 = Math.floor((Math.random() * numChildren));

          wordsRef.orderByChild('id').startAt(random4).once('value', (snapshot) => {
            wordsArray[3].correct = snapshot.val()[random4].correct
            wordsArray[3].wrong = snapshot.val()[random4].wrong
            if(wordsArray[0].correct != "" && wordsArray[1].correct != "" && wordsArray[2].correct != "" && wordsArray[3].correct != "" && wordsArray[4].correct != "" && wordsArray[0].correct != ""){
              resolve(wordsArray)
            }else if(wordsArray.length > 5){
              reject('fail')
            }
          });
          var random5 = Math.floor((Math.random() * numChildren));

          wordsRef.orderByChild('id').startAt(random5).once('value', (snapshot) => {
            wordsArray[4].correct = snapshot.val()[random5].correct
            wordsArray[4].wrong = snapshot.val()[random5].wrong
            if(wordsArray[0].correct != "" && wordsArray[1].correct != "" && wordsArray[2].correct != "" && wordsArray[3].correct != "" && wordsArray[4].correct != "" && wordsArray[0].correct != ""){
              resolve(wordsArray)
            }else if(wordsArray.length > 5){
              reject('fail')
            }
          });
        });
    })
    return promise
  }
  start(){
    if(RoomStore.createdRoomList.length > 1){
      fetch('https://fenicoapp.com/api/v1/api/servertime?format=m/d/y+h:i:s')
      .then((response) => response.json())
      .then((responseJson) => {
        const serverTime = responseJson.timestamp;
        const myRoomSettings = Firebase.database().ref().child('Settings').child(UserStore.uid)
        this.getWordsPromise().then(function(wordList) {
          console.log('result of promise:' , wordList);
          let roundOfPlayersList = [
            {round:1},
            {player1:0},
            {player2:0},
          ]
          let arrayWithID = []
          for(var i = 0 ; i < 5 ; i++){
            arrayWithID.push({id:i,wrong:wordList[i].wrong,correct:wordList[i].correct})
            if(i == 4){
              BoardStore.currentRound = 0
              myRoomSettings.update({wordsOfRoom:arrayWithID})
              myRoomSettings.update({round:roundOfPlayersList})
              myRoomSettings.update({createdTime:serverTime})
              const myRoom = Firebase.database().ref().child('Rooms').child(UserStore.uid).child(UserStore.uid).child(UserStore.createdRoomKey)
              myRoom.update({status:'active'})
            }
          }
        }, function(err) {
          console.log('error of promise:' , err);
        });
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }
  renderCreatedRoom(rowData){
    return (
      <View style={{flexDirection:'row',height:50,width:windowSize.width-40,margin:5,justifyContent:'center'}}>
        <View style={{flex:7,padding:5,justifyContent:'center',alignItems:'center',backgroundColor:'#8e44ad'}}>
          <Text numberOfLines={1} style={styles.h2}>{rowData.userDisplayName}</Text>
        </View>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
         <View style={styles.headerLeft}></View>
         <View style={styles.headerMiddle}>
           <Text style={styles.h1}>Create a Room</Text>
         </View>
         <TouchableOpacity onPress={() => this.action()} style={styles.headerRight}>
           <Text style={styles.h2}>{RoomStore.status === "created" ? "Cancel" : "Create" }</Text>
         </TouchableOpacity>
        </View>
        <View style={styles.titleView}>
          <View style={{padding:10,borderWidth:0.5,borderColor:'#9b59b6',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Text>Room Title: </Text>
            <TextInput onChangeText={(text) => this.setState({roomTitle:text})} maxLength={30} style={styles.textinputTitle} underlineColorAndroid="white"  />
          </View>
        </View>
        <View style={styles.content}>
          <KeyboardAvoidingView>
          {RoomStore.status == "created" ?
            <View style={styles.roomView}>
              <ListView
                dataSource={RoomStore.datasourceCreatedRoom}
                renderRow={this.renderCreatedRoom.bind(this)}
                enableEmptySections={true}
                />
              <TouchableOpacity onPress={() => this.start()} style={{height:40,width:windowSize.width-40,backgroundColor:'#2ecc71',justifyContent:'center',alignItems:'center'}}>
                 <Text style={styles.h1}>Start</Text>
              </TouchableOpacity>
            </View>
            :
              null
          }
          </KeyboardAvoidingView>
        </View>
        <View style={styles.blank}></View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#FFF',},
  content:{flex:1,justifyContent: 'center',alignItems: 'center'},
  header:{height:50,width:windowSize.width,backgroundColor:Color.darkBlue,flexDirection:'row'},
  headerLeft:{flex:1,justifyContent:'center',alignItems:'center'},
  headerMiddle:{flex:4,justifyContent:'center',alignItems:'center'},
  headerRight:{flex:1,justifyContent:'center',alignItems:'center'},
  h1:{color:'#FFF',fontWeight:'bold',fontSize:18},
  h2:{color:'#FFF',fontWeight:'bold',fontSize:16},
  titleView:{height:70,width:windowSize.width,backgroundColor:'white',justifyContent:'center',alignItems:'center',flexDirection:'row'},
  roomView:{flex:1,height:300,width:300,borderWidth:0.5,borderColor:'#9b59b6'},
  blank:{height:50},
  textinputTitle:{height:40,width:200}
});
