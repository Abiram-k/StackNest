import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Spinner } from "./components/ui/spinner";
import { appRouter } from "./routes/router";

function App() {
  return (
    <>
      <Toaster />
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={appRouter} />
      </Suspense>
    </>
  );
}

export default App;
