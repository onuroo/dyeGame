
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  AppState,
  StatusBar,
  Image
} from 'react-native';
import {StackNavigator} from 'react-navigation'
import Databases from './realmDB/databases';
import * as Firebase from 'firebase'
import ResultStore from './stores/result'
import Color from './const/colors'
const windowSize = Dimensions.get('window');
import {observer} from 'mobx-react/native';
import Images from './assets/images/images';

@observer
export default class Home extends Component {
  tester(){
    for(var i = 0 ; i < 10 ; i++){
      const wordsRef = Firebase.database().ref('Words/' + i).set({
        correct: 'sadsad' + i,
        wrong: 'scccvc' + i,
        id: i
      });
    }


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
  componentWillUnmount(){
    console.log('sqdsadsad')
  }
  componentDidUnMount(){
    console.log('sadasd')
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor= {Color.statusBarColor}
          barStyle="light-content"
        />
        <Image source={Images.bg} style={{position:'absolute',resizeMode:'stretch',width:windowSize.width,height:windowSize.height,left:0,top:0}} /> 
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
          <TouchableOpacity onPress={() => this.routing('roomCreate')} style={styles.selectionView}>
            <Text style={styles.h1Content}>Create a Room</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.routing('roomList')} style={styles.selectionView}>
            <Text style={styles.h1Content}>Available Rooms</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.routing('statistic')} style={styles.selectionView}>
            <Text style={styles.h1Content}>Statistics</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.tester()} style={styles.selectionView}>
            <Text style={styles.h1Content}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.logout()} style={styles.selectionView}>
             <Text style={styles.h1Content}>Logout</Text>
          </TouchableOpacity>

        </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#FFF'},
  content:{flex:1,justifyContent:'center',alignItems:'center'},
  header:{height:50,width:windowSize.width,backgroundColor:Color.darkBlue,flexDirection:'row'},
  headerLeft:{flex:1,justifyContent:'center',alignItems:'center'},
  headerMiddle:{flex:4,justifyContent:'center',alignItems:'center'},
  headerRigth:{flex:1,justifyContent:'center',alignItems:'center'},
  h1:{color:'#FFF',fontWeight:'bold',fontSize:18},
  h2:{color:'#FFF',fontWeight:'bold',fontSize:16},
  h1Content:{color:'#FFF',fontWeight:'bold',fontSize:18},
  selectionView:{height:50,width:220,backgroundColor:Color.darkBlue,justifyContent:'center',alignItems:'center',marginBottom:10,borderRadius:25},
});
