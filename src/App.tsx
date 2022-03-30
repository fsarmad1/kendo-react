import React from 'react';
import './App.css';
import Home from './screens/Home';
import { store, StoreContext } from '../src/store/store';

function App() {
  return (
    <StoreContext.Provider value={store}>
      <Home />
    </StoreContext.Provider>
  );
}

export default App;
