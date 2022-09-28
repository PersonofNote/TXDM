import './App.css';

import TableList from './components/TableList'
import TissueForm from './components/TissueForm'


//TODO: Add React Router

function App() {
  return (
    <div className="App">
      <header className="header">
        Header Component here (from AMS library probably)
      </header>
      <TissueForm />
    </div>
  );
}

export default App;
