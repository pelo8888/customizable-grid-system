# Customizable Grid System

A simple, lightweight, and customizable responsive grid system built with SASS. This system allows you to easily create flexible grid layouts with customizable columns, margins, and breakpoints.

## Features

*   **Responsive**: Built-in media queries for different screen sizes.
*   **Customizable**: Easily adjust the number of columns, margins, and breakpoints via SASS variables.
*   **Lightweight**: Generates only the CSS you need.
*   **SASS-based**: Takes advantage of SASS mixins and loops for efficient code generation.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pelo8888/customizable-grid-system.git
    ```

2.  **Install dependencies:**
    Make sure you have [Node.js](https://nodejs.org/) installed. Then run:
    ```bash
    npm ci
    ```
    This installs the Sass/PostCSS toolchain used to build the distributed CSS files from the committed lockfile.

## Usage

### HTML Structure

The grid system uses a container and items.

1.  **Grid Container**: Use the `.grid-container` class to wrap your grid items.
    ```html
    <div class="grid-container">
      <!-- Grid items go here -->
    </div>
    ```
    To add margins to the container itself, add the `.margin` class:
    ```html
    <div class="grid-container margin">
      <!-- ... -->
    </div>
    ```

2.  **Grid Items**: Use the `.grid` class for each item within the container. Then, add a class to define its width.
    The syntax is `.colX-of-Y`, where `X` is the number of columns the item spans, and `Y` is the total number of columns in the row.

    **Examples:**

    *   **Two columns (50% each):**
        ```html
        <div class="grid-container">
          <div class="grid col1-of-2">1 of 2</div>
          <div class="grid col1-of-2">1 of 2</div>
        </div>
        ```

    *   **Three columns (33.33% each):**
        ```html
        <div class="grid-container">
           <div class="grid col1-of-3">1 of 3</div>
           <div class="grid col1-of-3">1 of 3</div>
           <div class="grid col1-of-3">1 of 3</div>
        </div>
        ```

    *   **Mixed widths:**
        ```html
        <div class="grid-container">
           <div class="grid col1-of-4">1 of 4</div>
           <div class="grid col2-of-4">2 of 4 (50%)</div>
           <div class="grid col1-of-4">1 of 4</div>
        </div>
        ```

### Media Queries

The system provides helper classes to control layout on smaller screens (below the `$max-width` breakpoint, default 650px).

*   `.mq-small`: Forces items to take up 1/3 of the width (3 columns per row).
*   `.mq-medium`: Forces items to take up 1/2 of the width (2 columns per row).
*   `.mq-big`: Forces items to take up 100% of the width (1 column per row).

**Example:**
```html
<div class="grid-container">
  <!-- 4 columns on desktop, 1 column on mobile -->
  <div class="grid col1-of-4 mq-big">Content</div>
  <div class="grid col1-of-4 mq-big">Content</div>
  <div class="grid col1-of-4 mq-big">Content</div>
  <div class="grid col1-of-4 mq-big">Content</div>
</div>
```

## Customization

You can customize the grid by editing `sass/_gridVars.scss`.

*   **`$cant-col`**: The maximum number of columns generated (default: 12).
*   **`$max-width`**: The breakpoint for media queries (default: 650px).
*   **Margins**:
    *   `$margin-up`, `$margin-bottom`, `$margin-left`, `$margin-right`: Margins for grid items.
    *   `$margin-container`: Margin for the container when `.margin` is used.
*   **Class Names**:
    *   `$string-name`: Prefix for column classes (default: `.col`).
    *   `$string-separator`: Separator for column classes (default: `-of-`).

## Build Commands

Run these commands using npm scripts:

*   `npm run build`: Compiles Sass, applies PostCSS/autoprefixer, and writes `css/grid.min.css` and `css/inputs.min.css`.
*   `npm run build:compile`: Compiles the Sass sources into expanded CSS.
*   `npm run build:prefix`: Runs PostCSS/autoprefixer on the generated CSS files.
*   `npm run build:minify`: Writes the minified distributable CSS outputs.
*   `npm run lint`: Lints the Sass source files with Stylelint.
*   `npm test`: Rebuilds the CSS outputs and runs regression checks against the generated files.
*   `npm run check`: Runs linting plus the generated CSS regression checks.

## Development Workflow

*   The supported workflow is based on npm scripts plus the Sass and PostCSS CLIs.
*   The repository includes a committed `package-lock.json` so local installs and CI use the same dependency graph.
*   Continuous integration runs `npm ci` followed by `npm run check` on each push and pull request.
*   Published package contents are limited to the distributable CSS, Sass source, and README.

## Example

Check out `example/index.html` for a comprehensive demo of various grid combinations and media queries.
