/**
 * Authentication utility functions and constants
 */

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns true if email is valid
 */
export const isValidEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
};

/**
 * Checks if user credentials indicate admin access
 * @param email - User email
 * @returns true if email indicates admin user
 */
export const isAdminEmail = (email: string): boolean => {
    return email === 'admin@travelhosta.com' || email.includes('admin');
};

/**
 * Auth page styling constants
 */
export const AUTH_STYLES = {
    pageBackground: '#f2eee9',
    containerBackground: '#1b3c44',
    borderRadius: '39px',
    inputBackground: '#e4d9d3',
    inputBorderRadius: '37px',
    buttonBackground: '#e4d9d3',
    buttonBorderRadius: '52px',
    accentColor: '#cd8453',
    textColor: '#f2eee9',
    fonts: {
        heading: 'Schibsted_Grotesk',
        body: 'Schibsted_Grotesk',
    },
} as const;

/**
 * Demo credentials for testing
 */
export const DEMO_CREDENTIALS = {
    admin: {
        email: 'admin@travelhosta.com',
        password: 'admin123',
    },
    user: {
        emailHint: 'Any email with @ symbol',
        passwordHint: '3+ characters',
    },
} as const;
