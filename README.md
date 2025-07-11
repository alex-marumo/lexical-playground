Lexical Playground
A sleek, client-side text editor built with React, TypeScript, and Vite, featuring an AI-powered "Surprise Me" button that drops creative text snippets from OpenAI’s API (doesnt work as intended though, the rate limits are killing me😅). Rocking a neon #00ffa2 aesthetic, it’s your cyberpunk writing den, Sh.x.dow!

Screenshot
![alt text](<Screenshot 2025-07-11 130345.png>)

Features

Lexical Editor: A powerful, extensible text editor for crafting dope content.
AI-Powered “Surprise Me” Button: Fetches creative snippets from OpenAI’s gpt-3.5-turbo with caching to dodge rate limits.
Neon Styling: Centered toolbar, neon #00ffa2 textbox, and a cyberpunk vibe.
Client-Side Simplicity: No backend, just Vite’s proxy for OpenAI API calls.

Setup

Clone the Repo:git clone https://github.com/alex-marumo/lexical-playground.git
cd lexical-playground


Install Dependencies:npm install


Add OpenAI API Key:
Create a .env file in the root:VITE_OPENAI_API_KEY=your-openai-api-key-here


Get your key from platform.openai.com.


Run Locally:npm run dev


Open http://localhost:5173 in an incognito tab.
Wait 1 minute between “Surprise Me” clicks to respect OpenAI’s rate limits.



Tech Stack

React + TypeScript: For a snappy, type-safe UI.
Vite: Blazing-fast dev server with HMR.
Lexical: Next-gen text editor framework.
OpenAI API: Powers the AI-driven text snippets.
ESLint: Keeps the code clean with TypeScript-aware rules.

Expanding the ESLint Configuration
For production, enable type-aware lint rules in eslint.config.js:
import tseslint from 'typescript-eslint';
export default tseslint.config([
  tseslint.configs.globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);

Optionally, add React-specific lint rules with eslint-plugin-react-x and eslint-plugin-react-dom:
import tseslint from 'typescript-eslint';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  tseslint.configs.globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);

Notes

OpenAI Rate Limits: Free-tier users (20 RPM) should wait 60 seconds between “Surprise Me” clicks. Upgrade to Tier 1 (500 RPM) for smoother usage.
Debugging: Use DevTools (F12) > Console to check for “Sending OpenAI API request” logs. Only one request should fire per click.
Styling: If the UI (e.g., button) looks off, check .toolbar-button in DevTools > Styles.

Built with 💾 and neon dreams by Sh.x.dow!
