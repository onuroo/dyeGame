import {observable,computed} from 'mobx'
class UserStore {
  @observable uid = ""
  @observable email = ""
  @observable displayName = ""
  @observable joinedRoom = ""

  @observable createdRoom = ""
  @observable createdRoomKey = ""
}
const userStore = new UserStore()
export default userStore
