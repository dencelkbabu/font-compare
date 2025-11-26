# Font Compare

A local, web-based tool to compare two fonts visually and inspect their metadata. Built with Vite and opentype.js.

## Features

-   **Visual Comparison**:
    -   **Overlay Mode**: Overlap two fonts with color-coding (Red/Blue), visibility toggles, and opacity sliders.
    -   **Side-by-Side Mode**: Compare fonts adjacent to each other.
-   **Variable Font Support**: Automatically detects variable axes (Weight, Slant, etc.) and provides sliders for real-time adjustment.
-   **Smart Defaults**: Automatically applies font-specific default values for variable axes.
-   **Metadata Inspection**: View font family, style, glyph count, and format.
-   **Responsive Design**: Optimized for FHD (2.0rem text) and QHD (4.0rem text) displays.
-   **Privacy Focused**: All font processing happens locally in your browser. No files are uploaded to any server.
-   **Premium Design**: Dark mode interface with glassmorphism aesthetics.

## Usage

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the local URL (usually `http://localhost:5173`) in your browser.
5.  Upload two font files (TTF, OTF, WOFF) and start comparing!

## Credits

This project was vibecoded on Google Antigravity.
