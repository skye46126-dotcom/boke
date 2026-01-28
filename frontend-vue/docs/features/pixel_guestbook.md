# Pixel Guestbook Specification

## Overview
A real-time interactive guestbook where visitors can leave messages accompanied by a small 16x16 pixel art drawing.

## User Stories
1.  **View Guestbook**: As a user, I want to see a wall of previous messages and pixel art creations from other visitors.
2.  **Real-time Updates**: As a user, I want new messages to appear immediately without refreshing the page.
3.  **Create Entry**: As a user, I want to draw a small pixel art icon and write a text message to sign the guestbook.
4.  **Personalize**: As a user, I want to choose colors for my pixel art.

## Functional Requirements

### 1. Database Schema (Supabase)
*   **Table**: `guestbook`
*   **Columns**:
    *   `id`: UUID (Primary Key)
    *   `created_at`: Timestamptz (Default: now())
    *   `nickname`: Text (Visitor's display name)
    *   `message`: Text (The text content)
    *   `pixels`: JSONB (Array of color strings representing the 16x16 grid, or a compressed string)
    *   `approved`: Boolean (Default: true, for simple moderation if needed)

### 2. Frontend Components
*   **`PixelEditor.vue`**:
    *   A 16x16 interactive grid.
    *   Color palette picker (primary, secondary, black, white, transparent).
    *   "Clear" and "Fill" tools.
*   **`GuestbookWall.vue`**:
    *   Grid/Masonry layout to display entries.
    *   Each entry shows: The Pixel Art, Nickname, Message, Date.
*   **`PixelCanvas` (Read-only)**:
    *   Component to render the saved JSON pixel data as an image/grid.

### 3. Interaction Flow
1.  User clicks "Sign Guestbook".
2.  A modal opens with `PixelEditor`.
3.  User draws pixel art and types a message.
4.  User clicks "Submit".
5.  Data is sent to Supabase.
6.  Supabase Realtime triggers a `INSERT` event.
7.  All connected clients receive the new row and prepend it to the wall.

## Technical Implementation Steps
1.  **Backend**: Create `guestbook` table in Supabase and enable RLS/Realtime.
2.  **Editor**: Build the grid drawing logic in Vue.
3.  **Display**: Build the feed component with real-time subscription.
4.  **Integration**: Add specific route `/guestbook` or section on Home.

## Constraints
*   **Rate Limiting**: Prevent one user from spamming (via simple local storage check or IP if possible).
*   **Data Size**: 16x16 grid = 256 items. JSON storage is efficient enough.
