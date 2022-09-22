import './App.css';

import TestList from './components/TestList'

// TEMP
const url = "http://localhost:5000/users"

//TODO: Add React Router

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
