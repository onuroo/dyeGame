import Realm from 'realm'

class UserInfoDB extends Realm.Object {}
UserInfoDB.schema = {
  name:'UserInfoDB',
  properties : {
    uid:'string',
    displayName:'string',
    photoURL:'string',
    email:'string',
    password:'string',

  }
}
export default new Realm({schema:[UserInfoDB],schemaVersion:1})
