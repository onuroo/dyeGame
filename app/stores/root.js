import {observable,computed} from 'mobx'
class RootStore {
  @observable isLoaded = false
  @observable toHome = false
}
const rootStore = new RootStore()
export default rootStore
