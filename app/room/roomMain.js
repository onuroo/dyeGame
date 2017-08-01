
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
const windowSize = Dimensions.get('window');
import Databases from '../realmDB/databases';
import * as Firebase from 'firebase'
import {observer} from 'mobx-react/native';
import Color from '../const/colors'
@observer
export default class RoomMain extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
         <View style={styles.headerLeft}></View>
         <View style={styles.headerMiddle}>
           <Text style={styles.h1}>Create a Room</Text>
         </View>
         <TouchableOpacity onPress={() => this.routing('roomMain')} style={styles.headerRigth}>
           <Text style={styles.h2}></Text>
         </TouchableOpacity>
        </View>
        <View style={styles.content}>

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
});
