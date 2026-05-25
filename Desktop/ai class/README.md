# 🌌 AetherChat - Premium AI Chatbox Interface

AetherChat is a state-of-the-art, responsive **AI Chatbox Web Application** featuring high-end frosted glassmorphism aesthetics, dynamic color customizers, persistent chat history, and fluid micro-animations.

Designed using modern HTML5, ES6+ JavaScript, and Vanilla CSS3 custom property matrices, it requires **no compilation, bundlers, or server dependencies**. Run it instantly in any browser or host it directly on **GitHub Pages** with a single click!

---

## ✨ Features Highlights

*   **Frosted Glassmorphism Design**: Elegant overlay transparency ratios, subtle glowing backdrops, and harmonious color spaces.
*   **Four Vibrant Theme Configurations**:
    *   🌌 `Midnight Aurora`: Deep space layout illuminated by glowing cyan & purple gradients (Default).
    *   ⚡ `Cyberpunk Grid`: Techy dark charcoal panels highlighted with neon hot-pink and cyan borders.
    *   🌲 `Forest Emerald`: Sophisticated dark forest green tones with organic gold accents.
    *   ❄️ `Minimal Snow`: Ultra-clean, high-accessibility frosted white glass light theme.
*   **Persistent Memory (`localStorage`)**: Your chat lists, messages, customized settings, display name, and active theme choice are preserved seamlessly between page reloads.
*   **Custom Assistant Personas**: Switch personalities in real-time through the settings panel:
    *   🤖 *Smart Helper*: Friendly and balanced, ideal for general brainstorming.
    *   💻 *Coding Expert*: Specializes in writing structured scripts with inline comments.
    *   🎨 *Creative Writer*: Playful, descriptive, and uses emojis for engaging stories.
    *   🍃 *Zen Master*: Ultra-concise, offering peaceful and direct 1-to-2 sentence replies.
*   **Built-in Markdown Renderer**: Autorenders styled markdown headings, bold/italic font weights, list hierarchies, blockquotes, and block syntax code blocks.
*   **Interactive Code Blocks**: Code segments are pre-styled with language tags and featured **Copy-to-Clipboard** triggers.
*   **Fully Responsive Sidebar**: Collapses into a clean drawer on mobile devices with fluid overlays.

---

## 🛠️ Local Setup and Execution

Because AetherChat is written in pure vanilla web technologies, launching it locally is incredibly simple:

1.  Clone this repository or navigate to this folder.
2.  Open `index.html` directly in your favorite browser (Double-click `index.html`).
3.  *Alternative (Recommended for developer flows)*: Start a lightweight local server:
    ```bash
    # Using python (built-in on macOS/Linux)
    python3 -m http.server 8000
    
    # Or using Node.js static server
    npx serve .
    ```
4.  Open `http://localhost:8000` (or `http://localhost:3000`) in your browser.

---

## 🚀 How to Deploy on GitHub Pages

You can host AetherChat for free on GitHub Pages so you can access it from your phone, share it with friends, or show it off on your developer profile!

Follow these simple steps:

1.  **Add and Commit your new files**:
    Make sure your files (`index.html`, `style.css`, `app.js`, `README.md`) are saved inside your git repository directory.
    ```bash
    git add index.html style.css app.js README.md
    git commit -m "feat: Add premium AetherChat interface with multi-theme settings"
    ```

2.  **Push to your GitHub repository**:
    ```bash
    git push origin main
    ```

3.  **Enable GitHub Pages in settings**:
    *   Go to your repository on **GitHub** (e.g. `https://github.com/sivasubbu687-sys/Demo-project`).
    *   Click on the ⚙️ **Settings** tab at the top of the repository page.
    *   In the left sidebar, under the *Code and automation* section, click on **Pages**.
    *   Under **Build and deployment**, change the Source dropdown to **Deploy from a branch**.
    *   Under **Branch**, select **`main`** (or `master`) and specify the root folder (`/root`), then click **Save**.
    *   *Wait 1-2 minutes!* GitHub will build your static site. A notification banner will appear at the top of the Pages section showing your live site URL (e.g., `https://sivasubbu687-sys.github.io/Demo-project/`).

4.  Enjoy your custom online AI Chatbot tool!

---

## 🎨 Technology Stack

*   **Core Logic**: Vanilla ECMAScript 6+ JS (State controllers, Markdown builders, Typewriters, LocalStorage bindings)
*   **Styling**: Pure CSS3 Custom Properties, Glassmorphic Backdrop-filters, Flexbox/Grid grid allocations
*   **Icons**: [Ionicons Crisp Vector Pack](https://ionicons.com)
*   **Fonts**: Google Fonts ([Outfit](https://fonts.google.com/specimen/Outfit) and [Inter](https://fonts.google.com/specimen/Inter))
