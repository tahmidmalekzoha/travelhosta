/**
 * Type definitions for GuidesManagement state management
 */

import { GuideData } from '@/types';

/**
 * UI state for guides management
 */
export interface GuidesManagementState {
  // Data states
  guides: GuideData[];
  filteredGuides: GuideData[];
  
  // UI states
  isFormVisible: boolean;
  selectedGuideId: number | null;
  
  // Filter states
  searchQuery: string;
  selectedCategoryId: number | null;
  selectedStatus: 'all' | 'published' | 'draft';
  
  // Pagination states
  currentPage: number;
  itemsPerPage: number;
  
  // Loading/Error states
  isLoading: boolean;
  error: string | null;
  
  // Sort state
  sortField: 'title' | 'created_at' | 'updated_at' | 'category';
  sortOrder: 'asc' | 'desc';
}

/**
 * Action types for state reducer
 */
export type GuidesManagementAction =
  | { type: 'SET_GUIDES'; payload: GuideData[] }
  | { type: 'SET_FILTERED_GUIDES'; payload: GuideData[] }
  | { type: 'SET_IS_FORM_VISIBLE'; payload: boolean }
  | { type: 'SET_SELECTED_GUIDE_ID'; payload: number | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY_ID'; payload: number | null }
  | { type: 'SET_SELECTED_STATUS'; payload: 'all' | 'published' | 'draft' }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_ITEMS_PER_PAGE'; payload: number }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SORT_FIELD'; payload: 'title' | 'created_at' | 'updated_at' | 'category' }
  | { type: 'SET_SORT_ORDER'; payload: 'asc' | 'desc' }
  | { type: 'TOGGLE_SORT'; payload: 'title' | 'created_at' | 'updated_at' | 'category' }
  | { type: 'RESET_FILTERS' }
  | { type: 'OPEN_CREATE_FORM' }
  | { type: 'OPEN_EDIT_FORM'; payload: number }
  | { type: 'CLOSE_FORM' }
  | { type: 'DELETE_GUIDE'; payload: number };

/**
 * Initial state factory
 */
export const createInitialState = (): GuidesManagementState => ({
  guides: [],
  filteredGuides: [],
  isFormVisible: false,
  selectedGuideId: null,
  searchQuery: '',
  selectedCategoryId: null,
  selectedStatus: 'all',
  currentPage: 1,
  itemsPerPage: 10,
  isLoading: true,
  error: null,
  sortField: 'updated_at',
  sortOrder: 'desc',
});
