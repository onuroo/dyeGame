
import Login from './login';
import Home from './home';
import BoardMain from './board/boardMain';

import RoomMain from './room/roomMain';
import RoomCreate from './room/roomCreate';
import RoomList from './room/roomList';

export const Routes = {
  login: {screen: Login},
  home: {screen: Home},
  boardMain: {screen: BoardMain},

  roomMain: {screen: RoomMain},
  roomCreate: {screen: RoomCreate},
  roomList: {screen: RoomList},


}
