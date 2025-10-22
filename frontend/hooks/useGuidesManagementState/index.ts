/**
 * Custom hook for managing GuidesManagement component state
 * 
 * This hook extracts complex state management logic from GuidesManagement.tsx
 * using a reducer pattern for better maintainability and testability.
 * 
 * Features:
 * - Centralized state management with reducer
 * - Filtering by search, category, and status
 * - Sorting by multiple fields
 * - Pagination support
 * - URL synchronization
 * 
 * @example
 * const {
 *   state,
 *   actions,
 *   paginatedGuides,
 *   paginationInfo,
 * } = useGuidesManagementState(initialGuides);
 */

import { useReducer, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuideData } from '@/types';
import {
  GuidesManagementState,
  GuidesManagementAction,
  createInitialState,
} from './types';
import { guidesManagementReducer } from './reducer';
import {
  filterAndSortGuides,
  getPaginationInfo,
  getPaginatedItems,
} from './utils';

export interface UseGuidesManagementStateReturn {
  /** Current state */
  state: GuidesManagementState;
  /** Filtered and sorted guides */
  filteredGuides: GuideData[];
  /** Paginated subset of filtered guides */
  paginatedGuides: GuideData[];
  /** Pagination information */
  paginationInfo: ReturnType<typeof getPaginationInfo>;
  /** Action dispatchers */
  actions: {
    setGuides: (guides: GuideData[]) => void;
    setSearchQuery: (query: string) => void;
    setSelectedCategoryId: (id: number | null) => void;
    setSelectedStatus: (status: 'all' | 'published' | 'draft') => void;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (items: number) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    toggleSort: (field: 'title' | 'created_at' | 'updated_at' | 'category') => void;
    resetFilters: () => void;
    openCreateForm: () => void;
    openEditForm: (guideId: number) => void;
    closeForm: () => void;
    deleteGuide: (guideId: number) => void;
  };
}

/**
 * Main hook for guides management state
 */
export const useGuidesManagementState = (
  initialGuides: GuideData[] = []
): UseGuidesManagementStateReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state with reducer
  const [state, dispatch] = useReducer(
    guidesManagementReducer,
    createInitialState()
  );

  // Initialize guides from prop
  useEffect(() => {
    if (initialGuides.length > 0) {
      dispatch({ type: 'SET_GUIDES', payload: initialGuides });
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    }
  }, [initialGuides]);

  // Sync state from URL params on mount
  useEffect(() => {
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const sortField = searchParams.get('sortField');
    const sortOrder = searchParams.get('sortOrder');

    if (page) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: parseInt(page, 10) });
    }
    if (search) {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: search });
    }
    if (category) {
      dispatch({
        type: 'SET_SELECTED_CATEGORY_ID',
        payload: parseInt(category, 10),
      });
    }
    if (status === 'published' || status === 'draft' || status === 'all') {
      dispatch({ type: 'SET_SELECTED_STATUS', payload: status });
    }
    if (
      sortField === 'title' ||
      sortField === 'created_at' ||
      sortField === 'updated_at' ||
      sortField === 'category'
    ) {
      dispatch({ type: 'SET_SORT_FIELD', payload: sortField });
    }
    if (sortOrder === 'asc' || sortOrder === 'desc') {
      dispatch({ type: 'SET_SORT_ORDER', payload: sortOrder });
    }
  }, []); // Only run on mount

  // Sync URL when filters/sort/page changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (state.currentPage > 1) {
      params.set('page', state.currentPage.toString());
    }
    if (state.searchQuery) {
      params.set('search', state.searchQuery);
    }
    if (state.selectedCategoryId !== null) {
      params.set('category', state.selectedCategoryId.toString());
    }
    if (state.selectedStatus !== 'all') {
      params.set('status', state.selectedStatus);
    }
    if (state.sortField !== 'updated_at') {
      params.set('sortField', state.sortField);
    }
    if (state.sortOrder !== 'desc') {
      params.set('sortOrder', state.sortOrder);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    
    // Only update if URL actually changed
    if (window.location.search !== `?${queryString}`) {
      router.replace(newUrl, { scroll: false });
    }
  }, [
    state.currentPage,
    state.searchQuery,
    state.selectedCategoryId,
    state.selectedStatus,
    state.sortField,
    state.sortOrder,
    router,
  ]);

  // Compute filtered and sorted guides
  const filteredGuides = useMemo(() => {
    return filterAndSortGuides(state.guides, state);
  }, [
    state.guides,
    state.searchQuery,
    state.selectedCategoryId,
    state.selectedStatus,
    state.sortField,
    state.sortOrder,
  ]);

  // Update filtered guides in state
  useEffect(() => {
    dispatch({ type: 'SET_FILTERED_GUIDES', payload: filteredGuides });
  }, [filteredGuides]);

  // Compute pagination info
  const paginationInfo = useMemo(() => {
    return getPaginationInfo(
      filteredGuides.length,
      state.currentPage,
      state.itemsPerPage
    );
  }, [filteredGuides.length, state.currentPage, state.itemsPerPage]);

  // Get paginated guides
  const paginatedGuides = useMemo(() => {
    return getPaginatedItems(
      filteredGuides,
      state.currentPage,
      state.itemsPerPage
    );
  }, [filteredGuides, state.currentPage, state.itemsPerPage]);

  // Action dispatchers
  const actions = useMemo(
    () => ({
      setGuides: (guides: GuideData[]) =>
        dispatch({ type: 'SET_GUIDES', payload: guides }),
      setSearchQuery: (query: string) =>
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
      setSelectedCategoryId: (id: number | null) =>
        dispatch({ type: 'SET_SELECTED_CATEGORY_ID', payload: id }),
      setSelectedStatus: (status: 'all' | 'published' | 'draft') =>
        dispatch({ type: 'SET_SELECTED_STATUS', payload: status }),
      setCurrentPage: (page: number) =>
        dispatch({ type: 'SET_CURRENT_PAGE', payload: page }),
      setItemsPerPage: (items: number) =>
        dispatch({ type: 'SET_ITEMS_PER_PAGE', payload: items }),
      setIsLoading: (loading: boolean) =>
        dispatch({ type: 'SET_IS_LOADING', payload: loading }),
      setError: (error: string | null) =>
        dispatch({ type: 'SET_ERROR', payload: error }),
      toggleSort: (field: 'title' | 'created_at' | 'updated_at' | 'category') =>
        dispatch({ type: 'TOGGLE_SORT', payload: field }),
      resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
      openCreateForm: () => dispatch({ type: 'OPEN_CREATE_FORM' }),
      openEditForm: (guideId: number) =>
        dispatch({ type: 'OPEN_EDIT_FORM', payload: guideId }),
      closeForm: () => dispatch({ type: 'CLOSE_FORM' }),
      deleteGuide: (guideId: number) =>
        dispatch({ type: 'DELETE_GUIDE', payload: guideId }),
    }),
    []
  );

  return {
    state,
    filteredGuides,
    paginatedGuides,
    paginationInfo,
    actions,
  };
};

// Re-export types for convenience
export type { GuidesManagementState, GuidesManagementAction };
export { createInitialState };
