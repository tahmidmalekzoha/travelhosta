/**
 * Filtering and sorting utilities for guides
 */

import { GuideData } from '@/types';
import { GuidesManagementState } from './types';

/**
 * Apply all filters and sorting to guides list
 */
export const filterAndSortGuides = (
  guides: GuideData[],
  state: GuidesManagementState
): GuideData[] => {
  let filtered = [...guides];

  // Apply search query filter
  if (state.searchQuery.trim()) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (guide) =>
        guide.title.toLowerCase().includes(query) ||
        (guide.division?.toLowerCase() || '').includes(query) ||
        (guide.description?.toLowerCase() || '').includes(query)
    );
  }

  // Apply category filter
  if (state.selectedCategoryId !== null) {
    // Convert category ID to category name comparison
    // This needs to be adjusted based on how categories are stored
    filtered = filtered.filter(
      (guide) => String(guide.category) === String(state.selectedCategoryId)
    );
  }

  // Apply status filter - Note: GuideData doesn't have is_published
  // This filter is kept for future compatibility
  if (state.selectedStatus !== 'all') {
    // For now, treat all guides as published
    // This should be updated when is_published field is added to GuideData
    filtered = filtered;
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;

    switch (state.sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'created_at':
        comparison =
          new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime();
        break;
      case 'updated_at':
        comparison =
          new Date(a.updated_at || 0).getTime() -
          new Date(b.updated_at || 0).getTime();
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = 0;
    }

    return state.sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

/**
 * Calculate pagination info
 */
export const getPaginationInfo = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Get paginated items
 */
export const getPaginatedItems = <T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): T[] => {
  const { startIndex, endIndex } = getPaginationInfo(
    items.length,
    currentPage,
    itemsPerPage
  );
  return items.slice(startIndex, endIndex);
};
