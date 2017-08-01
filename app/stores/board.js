import {observable,computed} from 'mobx'
class BoardStore {

  @observable timerFinished = false
  //----------------------------------------
  @observable mapArray = []
  @observable boardArray = []

  @observable colors = ['#2ecc71','#3498db','#f39c12','#e74c3c','#ae44c8']
  @observable currentRoomTitle = ""
  @observable currentRoomKey = ""
  @observable currentRandomColor = ""
  @observable playingPlayer = ""

  @observable currentRound = 0
  @observable currentWrongWord = ""
  @observable currentCorretWord = ""
  @observable player1Round = 0
  @observable player2Round = 0
  @observable myStats = []

  @observable currentWrongWord = ""
  @observable currentWrondWordExtracted = []
  @observable currentCorrectWord = ""
  @observable currentCorrectWordExtracted = []

  @observable currentTime = 0
  @observable text = ""

  @observable player1 = ""
  @observable player2 = ""
  @observable player1DisplayName = ""
  @observable player2DisplayName = ""

  @observable resetTimer = false

  @observable characters = []
  @observable createdTime = ""

  @observable isRoutedToResult = false

  @observable hudCorrects = 0
}
const boardStore = new BoardStore()
export default boardStore
