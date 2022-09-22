import logo from './logo.svg';
import './App.css';

import TestList from './TestList'

const url = "http://localhost:5000/users"

function App() {
  return (
    <div className="App">
      <header className="header">
        Component here
      </header>
      <TestList url={url} />
    </div>
  );
}

export default App;
