
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import {StackNavigator} from 'react-navigation'
import Databases from './realmDB/databases';
import * as Firebase from 'firebase'
const windowSize = Dimensions.get('window');
import {observer} from 'mobx-react/native';
@observer
export default class Home extends Component {
  tester(){
    /*const merchantRef = Firebase.database().ref().child('merchant')
    merchantRef.on('value',(snap) => {
      snap.forEach((child) => {
        child.forEach((data) => {
          data.forEach((info) => {
            console.log(info.val().name)
            console.log(info.val().adress)
          })
        })
      })
    })*/



   Firebase.database().ref('merchant/{merchantId}/outlets').once('value', snapshot => {
      const results = [];
      if (snapshot && snapshot.val()) {
         snapshot.forEach(x => { console.log(x.val().name) })
      }

      });
  }
  routing(routeName){
    this.props.navigation.navigate(routeName)
  }
  logout(){
    Firebase.auth().signOut().then(function() {
      let userInfoDatabase = Databases.objects('UserInfoDB')
      Databases.write(()=>{
        Databases.delete(userInfoDatabase)
      })
    }, function(error) {
      Alert.alert('Error',JSON.stringify(error))
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
         <View style={styles.headerLeft}></View>
         <View style={styles.headerMiddle}>
           <Text style={styles.h1}>Dye</Text>
         </View>
         <TouchableOpacity style={styles.headerRigth}>
           <Text style={styles.h2}></Text>
         </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => this.routing('roomCreate')} style={{flex:1,backgroundColor:'#f1c40f',justifyContent:'flex-end'}}>
            <Text style={styles.h1Content}>Create a Room</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.routing('roomList')} style={{flex:1,backgroundColor:'#2ecc71',justifyContent:'flex-end'}}>
            <Text style={styles.h1Content}>Available Rooms</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1,backgroundColor:'#3498db',justifyContent:'flex-end'}}>
            <Text style={styles.h1Content}>Statistics</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.tester()} style={{flex:1,backgroundColor:'#9b59b6',justifyContent:'flex-end'}}>
            <Text style={styles.h1Content}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.logout()} style={{flex:1,backgroundColor:'#e74c3c',justifyContent:'flex-end'}}>
             <Text style={styles.h1Content}>Logout</Text>
          </TouchableOpacity>

        </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#FFF'},
  content:{flex:1,},
  header:{height:50,width:windowSize.width,backgroundColor:'#9b59b6',flexDirection:'row'},
  headerLeft:{flex:1,justifyContent:'center',alignItems:'center'},
  headerMiddle:{flex:4,justifyContent:'center',alignItems:'center'},
  headerRigth:{flex:1,justifyContent:'center',alignItems:'center'},
  h1:{color:'#FFF',fontWeight:'bold',fontSize:18},
  h2:{color:'#FFF',fontWeight:'bold',fontSize:16},
  h1Content:{color:'#FFF',fontWeight:'bold',fontSize:18,marginBottom:20,marginLeft:10}
});
