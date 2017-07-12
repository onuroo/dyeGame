import {observable,computed} from 'mobx'
class BoardStore {

  @observable timerFinished = false
  //----------------------------------------
  @observable mapArray = []
  @observable boardArray = []

  @observable colors = ['#2ecc71','#3498db','#f39c12','#e74c3c','#ae44c8']
  @observable currentRoomKey = ""
  @observable currentRandomColor = ""
  @observable playingPlayer = ""

  @observable player1 = ""
  @observable player2 = ""

}
const boardStore = new BoardStore()
export default boardStore
