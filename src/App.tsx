import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';

type Page = 'login' | 'signup';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');

  return (
    <>
      {currentPage === 'login' ? (
        <Login onNavigateToSignup={() => setCurrentPage('signup')} />
      ) : (
        <Signup onNavigateToLogin={() => setCurrentPage('login')} />
      )}
    </>
  );
}

export default App;
