import React from "react";
import ReactDOM from "react-dom";
import "antd"; 
import Schedules from "../(user)/page";

const App: React.FC = () => {
  return (
    <div id="app-container">
      <Schedules
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
