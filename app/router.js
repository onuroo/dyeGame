
import Login from './login';
import Home from './home';
import BoardMain from './board/boardMain';

import RoomMain from './room/roomMain';
import RoomCreate from './room/roomCreate';
import RoomList from './room/roomList';

import Results from './result/results';

import Statistic from './statistic/statistic';

export const Routes = {
  login: {screen: Login},
  home: {screen: Home},
  boardMain: {screen: BoardMain},

  roomMain: {screen: RoomMain},
  roomCreate: {screen: RoomCreate},
  roomList: {screen: RoomList},

  results: {screen: Results},

  statistic: {screen: Statistic},
  
  
}
