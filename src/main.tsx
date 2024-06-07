import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import { PostHogProvider } from "posthog-js/react";
import "./index.css";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider
      options={{ api_host: "https://us.i.posthog.com" }}
      apiKey="phc_rS5ryxCPw7rFvu0be9tizxs8yvABSqXNmuknG7uuNtc"
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </PostHogProvider>
  </React.StrictMode>
);
