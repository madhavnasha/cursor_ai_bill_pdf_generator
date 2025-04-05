import React from 'react';
import InvoiceForm from './components/InvoiceForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Invoice Generator App</h1>
      </header>
      <main>
        <InvoiceForm />
      </main>
      <footer>
        <p>Invoice Generator &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
