/* eslint-disable react/no-deprecated */
import ReactDOM from "react-dom";
import "antd"; 
import Schedules from "../(user)/page";

const App: React.FC = () => {
 
  return (
    <div id="app-container">
      <Schedules
      />
    </div>
  );
};

const rootElement = document.getElementById("schedules-root");
if (rootElement) {
  ReactDOM.render(<App />, rootElement);
}

export default App;
