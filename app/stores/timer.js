import {observable,computed} from 'mobx'
class TimerStore {

  @observable timerFinished = false
  @observable totalDuration = ""
  @observable currentDuration = ""
  @observable reset = ""
  @observable isStopped = false

}
const timerStore = new TimerStore()
export default timerStore
