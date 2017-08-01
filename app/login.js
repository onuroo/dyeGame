
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  StatusBar
} from 'react-native';
import {StackNavigator} from 'react-navigation'
import * as Firebase from 'firebase'
import Databases from './realmDB/databases'
import Color from './const/colors'
import UserStore from './stores/user'
import {observer} from 'mobx-react/native';
@observer
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      username:'',
      password:'',
      email:'',
    }
    this.routing = this.routing.bind(this)
  }

  routing(){
    this.props.navigation.navigate('home')
  }
  fillUserStore(uid,email,displayName){
   UserStore.uid = uid
   UserStore.email = email
   UserStore.displayName = displayName
  }
  createUser(){
    if(this.state.email != "" && this.state.password != "" && this.state.username != ""){
      UserStore.displayName = this.state.username
      email = this.state.email
      password = this.state.password
      const navigation = this.props.navigation
      var p = new Promise(function(resolve, reject) {
  	    var error = false
        Firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data){
          //console.log(data)
          resolve('Success!');

        }).catch(function(error) {
          error = true
          if(!error) {
            Alert.alert('brda')
        		resolve('Success!');
        	}
        	else {
            Alert.alert('Error','Already exist email')
        		reject('Failure!');
        	}
        });
      });
      p.then(function() {

          Firebase.auth().signInWithEmailAndPassword(email, password).then(function(data){

          }).catch(function(error) {
            Alert.alert('ERROR1',JSON.stringify(error))
          });



      }).catch(function(error) {
      	Alert.alert('ERROR2',JSON.stringify(error))
      })
    }

  }
  componentWillMount(){


  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor= {Color.statusBarColor}
          barStyle="light-content"
        />
        <View style={styles.topView}>
          <Text style={styles.h1}>Wordy</Text>
        </View>
        <View style={styles.middleView}>
          <View style={styles.textInputView}>
            <TextInput style={styles.textInput} underlineColorAndroid={Color.lightBlue} placeholderTextColor={'#FFF'} onChangeText={(text) => this.setState({username:text})} placeholder="username" />
          </View>
          <View style={styles.textInputView}>
            <TextInput style={styles.textInput} underlineColorAndroid={Color.lightBlue} placeholderTextColor={'#FFF'} onChangeText={(text) => this.setState({password:text})} placeholder="password" />
          </View>
          <View style={styles.textInputView}>
            <TextInput style={styles.textInput} underlineColorAndroid={Color.lightBlue} placeholderTextColor={'#FFF'} onChangeText={(text) => this.setState({email:text})} placeholder="email" />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={() =>this.createUser() }>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>




        <View style={styles.bottomView}>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: Color.darkBlue,},
  h1:{fontSize:18,fontSize:25,color:Color.white,fontWeight:'bold'},
  topView:{flex:1,justifyContent:'center',alignItems:'center'},
  middleView:{flex:2,justifyContent:'center',alignItems:'center'},
  bottomView:{flex:1,justifyContent:'center',alignItems:'center'},
  textInput:{width:250,height:50,color:'#FFF',fontWeight:'bold'},
  textInputView:{height:50,width:275,justifyContent:'center',alignItems:'center',backgroundColor:Color.lightBlue,marginBottom:10},
  loginButton:{height:45,width:275,borderRadius:25,backgroundColor:Color.white,justifyContent:'center',alignItems:'center',marginTop:10},
  loginButtonText:{fontWeight:'bold',fontSize:18,color:Color.darkBlue}

});
