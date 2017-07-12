import {observable,computed} from 'mobx'
import { ListView } from 'react-native'
class RoomStore {
  @observable status = ""
  @observable roomList = []
  @observable joinedRoomList = []
  @observable joinedRoomStatus = ""

  @observable createdRoomList = []
  @observable createdRoomStatus = ""

  ds = new ListView.DataSource({ rowHasChanged: (r1,r2) => r1 !== r2});
  @computed get datasourceRoomList(){
    return this.ds.cloneWithRows(this.roomList.slice())
  }
  @computed get datasourceJoinedRoom(){
    return this.ds.cloneWithRows(this.joinedRoomList.slice())
  }
  @computed get datasourceCreatedRoom(){
    return this.ds.cloneWithRows(this.createdRoomList.slice())
  }
}
const roomStore = new RoomStore()
export default roomStore
