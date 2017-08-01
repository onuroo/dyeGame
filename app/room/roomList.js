/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  ListView
} from 'react-native';

const windowSize = Dimensions.get('window');
import Databases from '../realmDB/databases';
import RoomStore from '../stores/room'
import UserStore from '../stores/user'
import BoardStore from '../stores/board';
import * as Firebase from 'firebase'
import {observer} from 'mobx-react/native';
import Color from '../const/colors'
@observer
export default class RoomList extends Component {
  constructor(props) {
    super(props);

  }
  listenJoinedRoom(){
    const joinedRoom = Firebase.database().ref().child('Rooms').child(UserStore.joinedRoom)
    joinedRoom.on('value',(snap) => {
      var list = []
      snap.forEach((child) => {
        child.forEach((data) => {
          if(UserStore.joinedRoom == child.key){
            RoomStore.joinedRoomStatus = data.val().status
            //Alert.alert(data.val().status.toString())
            if(data.val().status == "active"){
              //Alert.alert('sadasdasd')
              BoardStore.currentRoomKey = child.key
              this.props.navigation.navigate('boardMain')

            }
          }
          //Alert.alert(data.val().uid,JSON.stringify(data))
          list.push({
            userUID:data.val().uid,
            userDisplayName:data.val().displayName,
            userEmail:data.val().email
          })
        })

      })
      if(list.length == 0 ){
        UserStore.joinedRoom = ""
      }
      RoomStore.joinedRoomList = list
    })
  }
  listenList(){

    const rooms = Firebase.database().ref().child('Rooms')
    rooms.on('value',(snap) => {
      var list = []
      snap.forEach((child) => {
        child.forEach((data) => {
          data.forEach((detail) => {
            if(detail.val().status == "passive")
            list.push({
              creatorUID:detail.val().uid,
              creatorDisplayName:detail.val().displayName,
              creatorEmail:detail.val().email,
              roomTitle:detail.val().roomTitle,
              key:data.key
            })
            //Alert.alert(data.key.toString(),JSON.stringify(detail))
          })
        })
      })
      RoomStore.roomList = list
    })
  }
  componentWillMount(){
    this.listenList()
  }
  joinToRoom(roomKey){
    //Alert.alert('',roomKey.toString())
    const joinRoom = Firebase.database().ref().child('Rooms').child(roomKey).child(UserStore.uid)
    joinRoom.push({
      uid:UserStore.uid,
      email:UserStore.email,
      displayName:UserStore.displayName
    })
    const joinSettings = Firebase.database().ref().child('Settings').child(roomKey)
    joinSettings.update({player2DisplayName:UserStore.displayName})

    UserStore.joinedRoom = roomKey
    this.listenJoinedRoom()
  }
  renderList(rowData){
    return(
      <View style={{flexDirection:'row',height:50,width:windowSize.width-40,margin:5,justifyContent:'center'}}>
        <View style={{flex:7,padding:5,justifyContent:'center',alignItems:'center',backgroundColor:'#2ecc71'}}>
          <Text numberOfLines={1} style={styles.h2}>{rowData.creatorDisplayName}</Text>
        </View>
        <View style={{flex:0.3,backgroundColor:'white'}}></View>
        <TouchableOpacity onPress={() => this.joinToRoom(rowData.key)} style={{flex:1.2,justifyContent:'center',alignItems:'center',backgroundColor:'#2980b9'}}>
          <Text style={styles.h2}>Join</Text>
        </TouchableOpacity>
      </View>
    )
  }
  renderJoinedRoom(rowData){
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
           <Text style={styles.h1}>Available Rooms</Text>
         </View>
         <TouchableOpacity style={styles.headerRigth}>
           <Text style={styles.h2}></Text>
         </TouchableOpacity>
        </View>
        <View style={styles.content}>
            {UserStore.joinedRoom == ""
            ?
              <ListView
                dataSource={RoomStore.datasourceRoomList}
                renderRow={this.renderList.bind(this)}
                enableEmptySections={true}
              />
            :
            <View style={styles.roomView}>
              <ListView

                dataSource={RoomStore.datasourceJoinedRoom}
                renderRow={this.renderJoinedRoom.bind(this)}
                enableEmptySections={true}
                />
            </View>
            }


        </View>
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
  headerRigth:{flex:1,justifyContent:'center',alignItems:'center'},
  h1:{color:'#FFF',fontWeight:'bold',fontSize:18},
  h2:{color:'#FFF',fontWeight:'bold',fontSize:16},
  h2:{color:'#FFF',fontWeight:'100',fontSize:16},
  roomView:{height:400,width:300,borderWidth:0.5,borderColor:'#9b59b6'},
});
