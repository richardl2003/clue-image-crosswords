<div align="center">
<h3 align="center">Clue Image Crosswords</h3>

  <p align="center">
    A New York Times-style crossword puzzle with image clues, built with React, TypeScript, and Tailwind CSS.
  </p>
</div>

## Table of Contents

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
      </ul>
    </li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

This project is a web application that allows users to play crossword puzzles where the clues are images instead of text. It is designed to mimic the style of the New York Times crossword puzzle, providing a familiar and engaging user experience. The application is built using React, TypeScript, and styled with Tailwind CSS and shadcn-ui components. It fetches crossword data from JSON files, allowing for easy creation and integration of new puzzles.

### Key Features

- **Image Clues:** Crossword clues are represented by images, adding a visual and intuitive element to the puzzle-solving experience.
- **NYT Style Grid:** The crossword grid is styled to resemble the classic New York Times crossword puzzle.
- **Crossword Selection:** Users can select from a list of available crosswords or upload their own custom JSON crossword files.
- **Interactive Grid:** The crossword grid is fully interactive, allowing users to input letters, navigate cells, and toggle between across and down directions.
- **Clue Highlighting:** When a cell is selected, the corresponding clue is highlighted in the clue list.
- **Answer Checking:** Users can check individual words or the entire puzzle for correctness, with visual feedback provided for correct and incorrect answers.
- **Reveal Options:** Options to reveal a single letter or an entire word are available to assist users.
- **Responsive Design:** The application is designed to be responsive and accessible on various devices.
- **Dark Mode Support:** The application supports both light and dark modes, adapting to the user's preferred theme.

## Built With

- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [shadcn-ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@tanstack/react-query](https://tanstack.com/query/latest)
- [react-router-dom](https://reactrouter.com/en/main)
- [sonner](https://sonner.emilkowal.ski/)

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Node.js (version >=18) and npm installed. You can use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage Node.js versions.

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/richardl2003/clue-image-crosswords.git
   ```

2. Navigate to the project directory:

   ```sh
   cd clue-image-crosswords
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

4. Start the development server:

   ```sh
   npm run dev
   ```

   This will start the development server with hot-reloading. Open your browser and navigate to `http://localhost:8080` to view the application.

## Acknowledgments

- This README was created using [gitreadme.dev](https://gitreadme.dev) — an AI tool that looks at your entire codebase to instantly generate high-quality README files.
