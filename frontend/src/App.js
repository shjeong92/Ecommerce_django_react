import { Container } from 'react-bootstrap';
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div >
      <Header></Header>
      <main className="py-3">

        <Container>
        <h1>Welcom</h1>
        </Container>
          
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;
