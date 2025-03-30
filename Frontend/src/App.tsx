import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Suspense } from "react";
import { Toaster } from "sonner";

import { Spinner } from "./components/ui/spinner";
import { appRouter } from "./routes/router";

function App() {
  return (
    <>
      <Toaster
        duration={2500}
        position="top-center"
        richColors
        toastOptions={{
          className: "custom-toast",
          style: {
            maxWidth: "300px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            fontSize: "15px",
            paddingTop:"12px",
            paddingBottom:"12px"
          },
        }}
      />
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={appRouter} />
      </Suspense>
    </>
  );
}

export default App;
