import React from 'react';
import MoviePage from "./pages/MoviePage";
import SecondServicePage from './pages/SecondServicePage';
function App() {
    return (
        <div className="App">
            <header>
                <h1>First service Movie Management</h1>
            </header>
            <main>
                <MoviePage/>
            </main>
            <header>
                <h1>Second service Movie Management</h1>
            </header>
            <main>
                <SecondServicePage/>
            </main>
        </div>
    );
}

export default App;
