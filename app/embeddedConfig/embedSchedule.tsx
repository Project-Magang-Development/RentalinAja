import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "antd"; 
import Schedules from "../(user)/page";

const App: React.FC = () => {
 const [apiKey, setApiKey] = useState<string>("");
  useEffect(() => {
    window.addEventListener("load", () => {
      const scriptTag = document.querySelector("script[data-api-key]");
      const key = scriptTag?.getAttribute("data-api-key");
      if (key) {
        setApiKey(key);
      } 
    });
  }, []);
  return (
    <div id="app-container">
      <Schedules
        apiKey={apiKey}
        onFinish={(queryString: string) => {
          console.log("Query String for redirection:", queryString);
        }}
      />
    </div>
  );
};

const rootElement = document.getElementById("schedules-root");
if (rootElement) {
  ReactDOM.render(<App />, rootElement);
}

export default App;
