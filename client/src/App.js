import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import "./styles/styles.scss";
import Register from "./components/Register";

const App = () => {
  return (
    <div className="App">
      <Register />
      <Header />
      <Main />
      <Footer />
    </div>
  );
};

export default App;
