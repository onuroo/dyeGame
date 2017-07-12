
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';
import { Routes } from './router';
import { StackNavigator } from 'react-navigation';
import * as Firebase from 'firebase'
import Databases from './realmDB/databases'
import RootStore from './stores/root'
import UserStore from './stores/user'
import {observer} from 'mobx-react/native';

const config = {
    apiKey: "AIzaSyBq39E1pWRb9pU00bt57O2mFDQ39R19wWY",
    authDomain: "dyegame-90689.firebaseapp.com",
    databaseURL: "https://dyegame-90689.firebaseio.com",
    projectId: "dyegame-90689",
    storageBucket: "",
    messagingSenderId: "996624568034"
  };
@observer
export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded:false,
      toHome:false
    }
    this.changeStates = this.changeStates.bind(this)
  }
  changeStates(){
    this.setState({toHome:true,isLoaded:true})
  }
  fillUserStore(uid,email,displayName){

  }
  componentWillMount(){
    Firebase.initializeApp(config)
    Firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //Alert.alert('',JSON.stringify(user))
        UserStore.uid = user.uid
        UserStore.email = user.email
        UserStore.displayName = user.displayName
        RootStore.isLoaded = true
        RootStore.toHome = true
      } else {
        let userInfoDatabase = Databases.objects('UserInfoDB')
        if(userInfoDatabase.length > 0){
          //Alert.alert(userInfoDatabase[0].email.toString(),userInfoDatabase[0].password.toString())
          Firebase.auth().signInWithEmailAndPassword(userInfoDatabase[0].email, userInfoDatabase[0].password).then(function(data){

            UserStore.uid = userInfoDatabase[0].uid
            UserStore.email = userInfoDatabase[0].email
            UserStore.displayName = userInfoDatabase[0].displayName
            RootStore.isLoaded = true
            RootStore.toHome = true

          }).catch(function(error) {
            //Alert.alert('',JSON.stringify(error))
          });
        }else{
          RootStore.isLoaded = true
          RootStore.toHome = false
        }
      }
    });

  }
  render() {
    if(RootStore.isLoaded){
      if(RootStore.toHome){return (<HomePage />);
      }else{return (<LoginPage />);}
    }else{
      return(
        <View></View>
      )
    }


  }
}

const LoginPage = StackNavigator({
  ...Routes,
}, {
  initialRouteName: 'login',
  headerMode: 'none',

});
const HomePage = StackNavigator({
  ...Routes,
}, {
  initialRouteName: 'home',
  headerMode: 'none',

});
