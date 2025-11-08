/**
 * Central export point for all services
 */

export {
	authService,
	type UserProfile,
	type UserRole,
	type SignUpData,
	type SignInData,
	type AuthResponse,
} from './authService';

export {
	VALID_ROLES,
	ADMIN_ROLES,
	hasRecognizedRole,
	isAdminRole,
	isSuperAdminRole,
} from './authPolicies';

export {
	guidesService,
	fetchGuides,
	fetchFeaturedGuideIds,
	createGuide,
	updateGuide,
	deleteGuide,
	setFeaturedGuides,
	refreshGuides,
} from './guidesService';

export {
	categoriesService,
	fetchCategories,
	fetchDivisions,
	fetchTags,
	createCategory,
	deleteCategory,
	createDivision,
	deleteDivision,
	createTag,
	deleteTag,
	refreshTaxonomy,
	type CategoryRecord,
	type DivisionRecord,
	type TagRecord,
} from './categoriesService';

export {
	heroService,
	fetchHeroImages,
	createHeroImage,
	updateHeroImage,
	deleteHeroImage,
	setActiveHero,
	refreshHeroImages,
} from './heroService';
