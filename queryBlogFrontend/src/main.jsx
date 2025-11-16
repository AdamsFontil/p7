import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient()
import { NotificationContextProvider } from "../notificationContext";
import { UserContextProvider } from "../userContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient} >
  <UserContextProvider>
  <NotificationContextProvider >
    <App />
  </NotificationContextProvider >
  </UserContextProvider>
  </QueryClientProvider>
);
