import Home from "./Home";
import { Switch, Route } from "wouter";
import Cart from "./Cart";
import NavBar from "./components/Nav";
import LoginPage from "./Login";
import ProfilePage from "./Profile";
import OrderStatusPage from "./OrderSuccess";
import OrderDetail from "./OrderDetail";

function App() {
  return (
    <div className="w-full relative">
      <NavBar />
      <div className="mt-12">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/cart" component={Cart} />
          <Route path="/login" component={LoginPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/confirmation" component={OrderStatusPage} />
          <Route path="/order/:id" component={OrderDetail} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
