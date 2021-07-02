import { BrowserRouter, Route, Switch } from 'react-router-dom';

import {AuthContextProvider} from './contexts/AuthContext'

import { Home } from './page/Home.jsx'
import { NewRoom } from './page/NewRoom.jsx'
import { Room } from './page/Room.jsx'
import { AdminRoom } from './page/AdminRoom.jsx'

function App() {

  return (
      <BrowserRouter >
        <AuthContextProvider>
          <Switch>
            <Route path="/" exact component={ Home } />
            <Route path="/rooms/new" component={ NewRoom } />
            <Route path="/rooms/:id" component={ Room } />
            <Route path="/admin/rooms/:id" component={ AdminRoom } />
          </Switch>
        </AuthContextProvider>
      </BrowserRouter>
  );
}

export default App;
