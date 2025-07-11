// Lexical editor component with rich text and custom plugins
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useState } from "react";
import { InsertTextPlugin } from "./plugins/InsertTextPlugin";
import "./Editor.css";

// Editor configuration with namespace and error handling
const initialConfig = {
  namespace: "MyEditor",
  onError: (error: Error) => console.error("Editor error:", error),
};

export default function Editor() {
  // State for editor content (JSON) and JSON visibility toggle
  const [content, setContent] = useState<string>("");
  const [showJson, setShowJson] = useState(false);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        {/* Custom plugin for inserting text */}
        <InsertTextPlugin />
        {/* Rich text editing area */}
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<div className="editor-placeholder">Start typing your masterpiece...</div>}
        />
        {/* Undo/redo history */}
        <HistoryPlugin />
        {/* Update state on content change */}
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              setContent(JSON.stringify(editorState.toJSON(), null, 2));
            });
          }}
        />
        {/* Toggle button for JSON output */}
        <button
          className="toolbar-button"
          onClick={() => setShowJson(!showJson)}
          title={showJson ? "Hide JSON output" : "Show JSON output"}
        >
          {showJson ? "Hide JSON" : "Show JSON"}
        </button>
        {/* Display JSON state when toggled */}
        {showJson && <pre className="editor-output">{content}</pre>}
      </div>
    </LexicalComposer>
  );
}