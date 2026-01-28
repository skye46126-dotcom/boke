# Hacker Mode Terminal Specification

## Overview
Transform the existing static `Terminal.vue` component into a globally accessible, interactive command-line interface ("Hacker Mode") that can be toggled visibility from anywhere in the application.

## User Stories
1.  **Global Access**: As a user, I want to press a specific key (e.g., `~` or `Ctrl + \``) on any page to toggle the terminal overlay.
2.  **Navigation**: As a user, I want to use commands like `cd /about` or `cd articles` to navigate the website without using the mouse.
3.  **Persisted History**: As a user, I want my command history to be preserved even if I close and reopen the terminal (within the same session).
4.  **Visual Feedback**: As a user, I want the terminal to slide down smoothly with a backdrop blur effect, feeling like a native overlay.

## Functional Requirements

### 1. Global Visibility Control
*   **State Management**: Use Vue's `ref` or a light global state (composable) to track `isTerminalOpen`.
*   **Shortcut**: Listen for `Backquote` (`\``) or `Tilde` (`~`) keyup events globally on `window`.
*   **Z-Index**: Ensure the terminal overlay has a `z-index` higher than the navbar and modals (e.g., `z-50`).

### 2. UI/UX Enhancements
*   **Animation**: Use Vue `<Transition>` for a "slide-down" enter and "slide-up" leave animation.
*   **Styling**:
    *   Full-width or centered modal style.
    *   Glassmorphism background (semi-transparent blur).
    *   Focus management: Auto-focus the input when opened.

### 3. Command Integration
*   Ensure existing commands in `Terminal.vue` (`cd`, `ls`, `help`) work correctly in the global context.
*   The `router` instance is already present in `Terminal.vue`, so navigation logic should work out-of-the-box.

## Technical Implementation Steps
1.  **Refactor**: Move `Terminal.vue` logic to support being mounted globally (in `App.vue`).
2.  **Global Listener**: in `App.vue` or a new `useTerminal` composable, add the key listener.
3.  **Overlay Wrapper**: Wrap `Terminal.vue` in a fixed-position overlay div in `App.vue`.
4.  **Transition**: Add CSS transitions for the slide effect.

## Future Extensions (Phase 2)
*   `theme` command to switch site themes.
*   `play` command to trigger easter egg music.
