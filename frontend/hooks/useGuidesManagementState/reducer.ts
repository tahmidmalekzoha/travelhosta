/**
 * Reducer for GuidesManagement state
 */

import { GuidesManagementState, GuidesManagementAction } from './types';

/**
 * State reducer with all action handlers
 */
export const guidesManagementReducer = (
  state: GuidesManagementState,
  action: GuidesManagementAction
): GuidesManagementState => {
  switch (action.type) {
    case 'SET_GUIDES':
      return { ...state, guides: action.payload };
      
    case 'SET_FILTERED_GUIDES':
      return { ...state, filteredGuides: action.payload };
      
    case 'SET_IS_FORM_VISIBLE':
      return { ...state, isFormVisible: action.payload };
      
    case 'SET_SELECTED_GUIDE_ID':
      return { ...state, selectedGuideId: action.payload };
      
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload, currentPage: 1 };
      
    case 'SET_SELECTED_CATEGORY_ID':
      return { ...state, selectedCategoryId: action.payload, currentPage: 1 };
      
    case 'SET_SELECTED_STATUS':
      return { ...state, selectedStatus: action.payload, currentPage: 1 };
      
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
      
    case 'SET_ITEMS_PER_PAGE':
      return { ...state, itemsPerPage: action.payload, currentPage: 1 };
      
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'SET_SORT_FIELD':
      return { ...state, sortField: action.payload };
      
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload };
      
    case 'TOGGLE_SORT':
      if (state.sortField === action.payload) {
        // Toggle order if same field
        return {
          ...state,
          sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
        };
      } else {
        // Set new field with ascending order
        return {
          ...state,
          sortField: action.payload,
          sortOrder: 'asc',
        };
      }
      
    case 'RESET_FILTERS':
      return {
        ...state,
        searchQuery: '',
        selectedCategoryId: null,
        selectedStatus: 'all',
        currentPage: 1,
      };
      
    case 'OPEN_CREATE_FORM':
      return {
        ...state,
        isFormVisible: true,
        selectedGuideId: null,
      };
      
    case 'OPEN_EDIT_FORM':
      return {
        ...state,
        isFormVisible: true,
        selectedGuideId: action.payload,
      };
      
    case 'CLOSE_FORM':
      return {
        ...state,
        isFormVisible: false,
        selectedGuideId: null,
      };
      
    case 'DELETE_GUIDE':
      return {
        ...state,
        guides: state.guides.filter(guide => guide.id !== action.payload),
        filteredGuides: state.filteredGuides.filter(guide => guide.id !== action.payload),
      };
      
    default:
      return state;
  }
};
