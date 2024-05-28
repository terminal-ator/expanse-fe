import Home from "./Home";
import { Switch, Route } from "wouter";
import Cart from "./Cart";
import NavBar from "./components/Nav";
import LoginPage from "./Login";
import ProfilePage from "./Profile";

function App() {
  return (
    <>
      <NavBar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/cart" component={Cart} />
        <Route path="/login" component={LoginPage} />
        <Route path="/profile" component={ProfilePage} />
      </Switch>
    </>
  );
}

export default App;
