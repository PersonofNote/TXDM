import './App.css';

import Header from './components/Header'
import Footer from './components/Footer'
import TissueForm from './components/TissueForm'
import sampleData from './data.json'

//TODO: Add React Router

function App() {
  return (
    <div className="App">
      <Header leftLinks={sampleData.header_links}/>
      <TissueForm />
      <Footer />
    </div>
  );
}

export default App;
