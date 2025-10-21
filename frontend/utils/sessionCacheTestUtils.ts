/**
 * Session Cache Test Utilities
 * Copy these functions into browser console to test session cache
 */

// =====================================================
// TEST UTILITIES - Run in Browser Console
// =====================================================

/**
 * View current cache status
 */
function viewCache() {
    console.log('=== SESSION CACHE STATUS ===');
    
    const cacheData = localStorage.getItem('travelhosta-session-timestamp');
    
    if (!cacheData) {
        console.log('❌ No cache found');
        return;
    }
    
    try {
        const data = JSON.parse(cacheData);
        const now = Date.now();
        const remaining = data.expiresAt - now;
        
        console.log('✅ Cache exists');
        console.log('User:', data.profile.email);
        console.log('Role:', data.profile.role);
        console.log('Cached at:', new Date(data.timestamp).toLocaleString());
        console.log('Expires at:', new Date(data.expiresAt).toLocaleString());
        
        if (remaining > 0) {
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            console.log(`⏰ Time remaining: ${hours}h ${minutes}m`);
        } else {
            console.log('⏰ EXPIRED');
        }
    } catch (error) {
        console.error('Error parsing cache:', error);
    }
}

/**
 * Clear cache manually
 */
function clearCache() {
    console.log('🧹 Clearing session cache...');
    localStorage.removeItem('travelhosta-session-timestamp');
    localStorage.removeItem('travelhosta-cached-profile');
    localStorage.removeItem('travelhosta-session-expiry');
    console.log('✅ Cache cleared');
}

/**
 * Expire cache manually (for testing)
 */
function expireCache() {
    console.log('⏰ Expiring session cache...');
    
    const cacheData = localStorage.getItem('travelhosta-session-timestamp');
    
    if (!cacheData) {
        console.log('❌ No cache to expire');
        return;
    }
    
    try {
        const data = JSON.parse(cacheData);
        const past = Date.now() - 1000; // 1 second ago
        data.expiresAt = past;
        
        localStorage.setItem('travelhosta-session-timestamp', JSON.stringify(data));
        console.log('✅ Cache expired - refresh page to see logout');
    } catch (error) {
        console.error('Error expiring cache:', error);
    }
}

/**
 * Extend cache by 24 hours
 */
function extendCache() {
    console.log('🔄 Extending session cache...');
    
    const cacheData = localStorage.getItem('travelhosta-session-timestamp');
    
    if (!cacheData) {
        console.log('❌ No cache to extend');
        return;
    }
    
    try {
        const data = JSON.parse(cacheData);
        const now = Date.now();
        const newExpiry = now + (24 * 60 * 60 * 1000); // +24 hours
        
        data.timestamp = now;
        data.expiresAt = newExpiry;
        
        localStorage.setItem('travelhosta-session-timestamp', JSON.stringify(data));
        console.log('✅ Cache extended by 24 hours');
        console.log('New expiry:', new Date(newExpiry).toLocaleString());
    } catch (error) {
        console.error('Error extending cache:', error);
    }
}

/**
 * View all auth-related localStorage
 */
function viewAllAuth() {
    console.log('=== ALL AUTH DATA ===');
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('travelhosta') || key.includes('supabase'))) {
            const value = localStorage.getItem(key);
            console.log(`\n${key}:`);
            
            if (value) {
                try {
                    const parsed = JSON.parse(value);
                    console.log(parsed);
                } catch {
                    console.log(value);
                }
            }
        }
    }
}

/**
 * Test cache expiry check
 */
function testExpiryCheck() {
    console.log('=== TESTING EXPIRY CHECK ===');
    
    const cacheData = localStorage.getItem('travelhosta-session-timestamp');
    
    if (!cacheData) {
        console.log('❌ No cache to test');
        return false;
    }
    
    try {
        const data = JSON.parse(cacheData);
        const now = Date.now();
        const isExpired = now > data.expiresAt;
        
        console.log('Current time:', new Date(now).toLocaleString());
        console.log('Expiry time:', new Date(data.expiresAt).toLocaleString());
        console.log('Is expired?', isExpired);
        
        return isExpired;
    } catch (error) {
        console.error('Error checking expiry:', error);
        return true;
    }
}

/**
 * Simulate different time scenarios
 */
function simulateTime(scenario: 'expired' | 'almost-expired' | 'fresh' | 'half') {
    console.log(`=== SIMULATING: ${scenario} ===`);
    
    const cacheData = localStorage.getItem('travelhosta-session-timestamp');
    
    if (!cacheData) {
        console.log('❌ No cache - sign in first');
        return;
    }
    
    try {
        const data = JSON.parse(cacheData);
        const now = Date.now();
        
        switch (scenario) {
            case 'expired':
                // Set expiry to 1 hour ago
                data.expiresAt = now - (60 * 60 * 1000);
                console.log('Set expiry to: 1 hour ago');
                break;
                
            case 'almost-expired':
                // Set expiry to 5 minutes from now
                data.expiresAt = now + (5 * 60 * 1000);
                console.log('Set expiry to: 5 minutes from now');
                break;
                
            case 'fresh':
                // Set expiry to 24 hours from now
                data.expiresAt = now + (24 * 60 * 60 * 1000);
                console.log('Set expiry to: 24 hours from now');
                break;
                
            case 'half':
                // Set expiry to 12 hours from now
                data.expiresAt = now + (12 * 60 * 60 * 1000);
                console.log('Set expiry to: 12 hours from now');
                break;
                
            default:
                console.log('❌ Invalid scenario. Use: expired, almost-expired, fresh, half');
                return;
        }
        
        localStorage.setItem('travelhosta-session-timestamp', JSON.stringify(data));
        console.log('✅ Simulation complete - refresh page to see effect');
        console.log('New expiry:', new Date(data.expiresAt).toLocaleString());
    } catch (error) {
        console.error('Error simulating time:', error);
    }
}

/**
 * Run all tests
 */
function runAllTests() {
    console.log('\n=== RUNNING ALL CACHE TESTS ===\n');
    
    console.log('Test 1: View cache');
    viewCache();
    
    console.log('\n\nTest 2: View all auth data');
    viewAllAuth();
    
    console.log('\n\nTest 3: Test expiry check');
    testExpiryCheck();
    
    console.log('\n\n=== ALL TESTS COMPLETE ===');
}

// =====================================================
// EXPORT FUNCTIONS FOR CONSOLE USE
// =====================================================

console.log(`
═══════════════════════════════════════════════════
  SESSION CACHE TEST UTILITIES
═══════════════════════════════════════════════════

Available functions:

  viewCache()           - View current cache status
  clearCache()          - Clear all cache data
  expireCache()         - Expire cache immediately
  extendCache()         - Extend cache by 24 hours
  viewAllAuth()         - View all auth localStorage
  testExpiryCheck()     - Test expiry logic
  simulateTime(type)    - Simulate time scenarios
                          Types: 'expired', 'almost-expired', 'fresh', 'half'
  runAllTests()         - Run all test functions

Example usage:
  > viewCache()
  > simulateTime('expired')
  > clearCache()

═══════════════════════════════════════════════════
`);

// Make functions available globally in console
(window as any).cacheTest = {
    viewCache,
    clearCache,
    expireCache,
    extendCache,
    viewAllAuth,
    testExpiryCheck,
    simulateTime,
    runAllTests
};

console.log('💡 TIP: Use cacheTest.viewCache() to check cache status');
