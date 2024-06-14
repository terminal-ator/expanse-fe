import { useLocation } from "wouter";
import pb from "./pb";

const LoginPage = () => {
  const [_, setLocation] = useLocation();

  const move = () => {
    setLocation("/");
  };

  const authenticateWithGithub = async () => {
    try {
      const authData = await pb
        .collection("users")
        .authWithOAuth2({ provider: "github" });
      console.log({ authData });
      move();
    } catch (e) {
      console.log({ e });
    }
  };

  const authenticateWithGoogle = async () => {
    try {
      const authData = await pb
        .collection("users")
        .authWithOAuth2({ provider: "google" });
      console.log({ authData });
      move();
    } catch (e) {
      console.log({ e });
    }
  };

  return (
    <div className="container p-2 relative top-12">
      <p className="font-bold">To login, press one of the buttons</p>
      <div className="flex sm:w-96 sm:m-auto flex-col gap-2">
        <button className="btn rounded-3xl" onClick={authenticateWithGoogle}>
          Continue with google
        </button>
        <button className="btn rounded-3xl" onClick={authenticateWithGithub}>
          Continue with github
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
