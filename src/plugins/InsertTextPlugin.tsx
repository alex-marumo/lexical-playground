// Custom Lexical plugin to insert AI-generated text from OpenAI
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { TextNode } from "lexical";
import { useState, useCallback } from "react";

// Fetches creative text snippet from OpenAI API via proxy
const fetchAISuggestedText = async (cache: { texts: string[]; index: number }): Promise<string> => {
  // Cycle through cached texts if available
  if (cache.texts.length > 0) {
    const text = cache.texts[cache.index % cache.texts.length];
    cache.index = (cache.index + 1) % cache.texts.length; // Rotate index
    console.log("Using cached AI text:", text);
    return text;
  }

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not found. Add VITE_OPENAI_API_KEY to .env");
  }

  console.log("Sending OpenAI API request:", new Date().toISOString());

  try {
    const response = await fetch("/api/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Generate 5 short, creative text snippets (1-2 sentences each) for a text editor, inspiring the user to write something unique.",
          },
        ],
        max_tokens: 150, // Enough for 5 snippets
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Wait 60 seconds and try again!");
      }
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    if (!content) throw new Error("No content from AI!");

    // Split response into snippets and cache them
    const snippets = content.split("\n").filter((s: string) => s.trim());
    cache.texts = snippets;
    cache.index = 1; // Start with first snippet
    return snippets[0] || "AI failed, try again!";
  } catch (error: any) {
    console.error("OpenAI API call failed:", error);
    return error.message.includes("Rate limit")
      ? "Too many requests! Wait 60 seconds, fam."
      : "AI glitch, try again!";
  }
};

// Debounce function to limit rapid API calls
const debounce = <F extends (...args: any[]) => any>(func: F, wait: number) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise((resolve) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        resolve(func(...args));
      }, wait);
    });
  };
};

// Inserts AI-generated text into the editor
export function InsertTextPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isLoading, setIsLoading] = useState(false);
  const [cache] = useState<{ texts: string[]; index: number }>({ texts: [], index: 0 });

  // Debounced handler to fetch and insert AI-suggested text
  const handleInsertText = useCallback(
    debounce(async () => {
      setIsLoading(true);
      try {
        const aiText = await fetchAISuggestedText(cache);
        editor.update(() => {
          const textNode = new TextNode(aiText + " ");
          $insertNodes([textNode]);
        });
      } catch (error) {
        console.error("Failed to insert AI text:", error);
        editor.update(() => {
          const textNode = new TextNode("Oops, AI glitch! Try again. ");
          $insertNodes([textNode]);
        });
      } finally {
        setIsLoading(false);
      }
    }, 15000), // 15-second debounce for strict rate limits
    [editor, cache]
  );

  return (
    <div className="editor-toolbar">
      {/* Button to trigger AI text insertion */}
      <button
        className="toolbar-button"
        onClick={handleInsertText}
        title="Insert AI-generated creative text"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Surprise Me"}
      </button>
    </div>
  );
}