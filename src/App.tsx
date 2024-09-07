import Home from "./Home";
import { Switch, Route, Router } from "wouter";
import Cart from "./Cart";
import NavBar from "./components/Nav";
import LoginPage from "./Login";
import ProfilePage from "./Profile";
import OrderStatusPage from "./OrderSuccess";
import OrderDetail from "./OrderDetail";
import StartPage from "./Start";
import { usePincodeStore } from "./store";
import FeaturedProducts from "./Featured";
import ListProducts from "./components/ListProducts";

function App() {
  const { pincode } = usePincodeStore();

  if (pincode === "") {
    return (
      <div>
        <StartPage />
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <NavBar />
      <div className="mt-16">
        <Switch>
          <Route path="/" component={FeaturedProducts} />
          <Route path="/app" component={Home} nest>
            
          </Route>
          <Route path="/cart" component={Cart} />
          <Route path="/login" component={LoginPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/confirmation" component={OrderStatusPage} />
          <Route path="/order/:id" component={OrderDetail} />
          <Route path="/start" component={StartPage} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
