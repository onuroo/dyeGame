import {observable,computed} from 'mobx'
import { ListView } from 'react-native'
class ResultStore {
  @observable player1Result = {name:"",duration:"",correct:""}
  @observable player2Result = {name:"",duration:"",correct:""}
  @observable whoWin = ""

  @observable isCancelled = ""

}
const resultStore = new ResultStore()
export default resultStore
