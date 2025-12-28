import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AssignmentList from './components/AssignmentList/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt/AssignmentAttempt';
import { SessionProvider } from './utils/sessionContext';

function App() {
  return (
    <SessionProvider>
      <div className="app">
        <Header />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<AssignmentList />} />
            <Route path="/assignment/:id" element={<AssignmentAttempt />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}

export default App;