
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import {StackNavigator} from 'react-navigation'
import * as Firebase from 'firebase'
import Databases from './realmDB/databases'
import UserStore from './stores/user'
import {observer} from 'mobx-react/native';
@observer
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      email:'',
      password:''
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
    if(this.state.username != "" && this.state.password != ""){
      email = this.state.email
      password = this.state.password
      const navigation = this.props.navigation
      var p = new Promise(function(resolve, reject) {
  	    var error = false
        Firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data){
          if(!error) {
            resolve('Success!');
          }
          else {
            Alert.alert('Error','Already exist email')
            reject('Failure!');
          }
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
        setTimeout(function(){
          Firebase.auth().signInWithEmailAndPassword(email, password).then(function(data){
            //Alert.alert('Success',data.uid.toString())
            let displayName = ""
            let photoURL = ""

            let userInfoDatabase = Databases.objects('UserInfoDB')
            Databases.write(()=>{
              Databases.create('UserInfoDB',{
                uid:data.uid,
                displayName:displayName,
                photoURL:photoURL,
                email:email,
                password:password,
              })

            })
            this.fillUserStore(data.uid,email,displayName)
            navigation.navigate('home')

          }).catch(function(error) {
            Alert.alert('',JSON.stringify(error))
          });

        }, 4000)

      }).catch(function() {
      	Alert.alert('',JSON.stringify(error))
      })
    }

  }
  componentWillMount(){


  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Login!
        </Text>
        <TouchableOpacity onPress={() =>this.routing() }>
          <Text>Play!</Text>
        </TouchableOpacity>
        <TextInput style={styles.textInput} underlineColorAndroid={'white'} onChangeText={(text) => this.setState({email:text})} placeholder="username" />
        <TextInput style={styles.textInput} underlineColorAndroid={'white'} onChangeText={(text) => this.setState({password:text})} />
        <TouchableOpacity onPress={() =>this.createUser() }>
          <Text>Create User!</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>this.testRealmDB()}>
          <Text>Test Realm DB!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textInput:{width:250,height:50,borderWidth:0.5,borderColor:'#A0A0A0'}

});
