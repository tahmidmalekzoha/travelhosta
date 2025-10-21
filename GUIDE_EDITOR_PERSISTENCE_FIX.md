# Guide Editor Persistence Fix

## Problem

When working in the admin panel's guide editor/creator:

1. Reloading the page would take you back to the "Guides" list page
2. All typed data in the current session would be erased
3. Users would lose their work if they accidentally reloaded

## Solution

Implemented state persistence across page reloads using:

1. **URL Parameters** - To maintain the current view state (list/create/edit/view)
2. **LocalStorage** - To persist form data during the editing session
3. **Automatic Cleanup** - To clear stored data when appropriate

## Changes Made

### 1. GuidesManagement Component (`frontend/components/admin/GuidesManagement.tsx`)

- Added URL parameter support using Next.js `useRouter` and `useSearchParams`
- Added localStorage keys for storing form data
- Implemented state restoration logic that runs on component mount:
  - Checks URL parameters for current mode (`create`, `edit`, `view`)
  - Restores form data from localStorage if available
  - Loads the appropriate guide if in edit/view mode
- Added `updateURL()` function to sync URL with current state
- Added `clearFormData()` function to clean up localStorage
- Updated all navigation handlers to update URL parameters:
  - `handleViewGuide()` - Updates URL to view mode
  - `handleEdit()` - Updates URL to edit mode
  - `handleCreateNew()` - Updates URL to create mode
  - `handleDelete()` - Clears form data if deleting current guide
  - `resetForm()` - Returns to list view and clears data
  - `handleSubmit()` - Clears localStorage after successful save

### 2. useGuideForm Hook (`frontend/hooks/useGuideForm.ts`)

- Added localStorage support to persist form data
- Added session ID to track form sessions
- Modified form data type to include optional `id` field
- Added effect to save form data to localStorage on every change
- Changed guide change detection to only re-run when guide ID changes (not on every guide update)

### 3. useContentParser Hook (`frontend/hooks/useContentParser.ts`)

- Added localStorage keys for content text storage
- Added `isInitialized` flag to prevent multiple initializations
- Added `prevGuideIdRef` to track guide ID changes
- Implemented content restoration from localStorage on mount
- Added effects to save content text to localStorage on every change
- Stores both English and Bengali content separately

### 4. EnhancedGuideForm Component (`frontend/components/admin/EnhancedGuideForm.tsx`)

- Added `clearFormStorage()` helper function to clear all form-related localStorage
- Added `handleCancel()` function with confirmation dialog
- Added `beforeunload` event listener to warn users about unsaved changes
- Updated cancel button to use new handler

## How It Works

### Creating a New Guide

1. User clicks "Create New Guide"
2. URL updates to `/admin/guides?mode=create`
3. As user types, data is automatically saved to localStorage
4. If user reloads, form reopens with their typed data restored
5. On submit or cancel, localStorage is cleared

### Editing an Existing Guide

1. User clicks "Edit" on a guide
2. URL updates to `/admin/guides?mode=edit&guideId=123`
3. Form loads with guide data
4. As user makes changes, data is saved to localStorage
5. If user reloads, form reopens with their unsaved changes
6. On submit, localStorage is cleared and form stays open with saved data
7. On cancel, localStorage is cleared and returns to list

### Viewing a Guide

1. User clicks "View Details" on a guide
2. URL updates to `/admin/guides?mode=view&guideId=123`
3. If user reloads, view stays open with the same guide

### Returning to List

1. User clicks "Back to Guides" or cancels form
2. URL updates to `/admin/guides` (no parameters)
3. localStorage is cleared
4. If user reloads, they see the guides list

## Data Stored in LocalStorage

The following keys are used:

- `guideFormData` - Main form data (title, description, division, category, image URL, tags, etc.)
- `guideContentText` - English content text from the editor
- `guideContentTextBn` - Bengali content text from the editor
- `guideFormSession` - Session ID to track form sessions

All data is automatically cleared when:

- User submits the form successfully
- User cancels and confirms
- User deletes the guide they're editing
- User navigates to a different guide

## Browser Warnings

Users will see a browser warning if they try to:

- Close the browser tab/window
- Navigate away from the page
- Reload the page

This warning only appears when there's unsaved data in localStorage.

## Testing

To test the fix:

1. Go to Admin Panel → Guides
2. Click "Create New Guide"
3. Start filling in the form
4. Reload the page (F5 or Ctrl+R)
5. Verify: Form reopens with your data intact
6. Submit or cancel the form
7. Reload the page
8. Verify: You're back at the guides list

Repeat with editing an existing guide to test edit mode persistence.
