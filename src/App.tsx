// Main app component rendering the header and Lexical editor
import Editor from "./Editor";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* Header with title and subtitle */}
      <header className="app-header">
        <h1>Just A Simple Editor</h1>
        <h2>Powered by Lexical</h2>
      </header>
      {/* Lexical editor component */}
      <Editor />
    </div>
  );
}

export default App;