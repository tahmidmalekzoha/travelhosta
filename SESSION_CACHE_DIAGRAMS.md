# 📊 Session Cache Flow Diagrams

## 1. First-Time Sign In Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER SIGNS IN                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Check localStorage for cache                                   │
│  └─► No cache found (first time)                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Call Supabase API                                              │
│  ├─► signInWithPassword() .................. [API CALL 1]       │
│  └─► Response: User + Session                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Fetch User Profile from Database                               │
│  ├─► SELECT * FROM user_profiles .......... [API CALL 2]        │
│  └─► Response: UserProfile                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Validate Profile                                               │
│  ├─► Profile exists? ✅                                         │
│  ├─► Valid role? ✅                                             │
│  └─► All checks passed                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Save to Cache                                                  │
│  ├─► Calculate expiry: Now + 24 hours                           │
│  ├─► Save to localStorage                                       │
│  └─► Console: "💾 Session cached - expires at: [date]"          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Update React State                                             │
│  ├─► setUser(user)                                              │
│  ├─► setProfile(profile)                                        │
│  ├─► setSession(session)                                        │
│  └─► User is logged in ✅                                       │
└─────────────────────────────────────────────────────────────────┘

TOTAL API CALLS: 2 (auth + profile)
```

---

## 2. Subsequent Page Load Flow (Within 24 Hours)

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER LOADS PAGE                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Initialize AuthContext                                         │
│  └─► Console: "🔐 Initializing authentication..."               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Check Session Expiry                                           │
│  ├─► Get cached data from localStorage                          │
│  ├─► Current time: 1729526400000                                │
│  ├─► Expiry time: 1729612800000                                 │
│  ├─► Expired? NO (still valid)                                  │
│  └─► Console: "✅ Session valid - expires in 23h 45m"           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Get Cached Profile                                             │
│  ├─► Read from localStorage                                     │
│  ├─► Parse JSON data                                            │
│  ├─► Return cached UserProfile                                  │
│  └─► Console: "📦 Loading auth from cache: user@example.com"    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Get Session (from localStorage - managed by Supabase)          │
│  ├─► No API call - read from storage                            │
│  └─► Return Session object                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Update React State                                             │
│  ├─► setUser(user)                                              │
│  ├─► setProfile(cachedProfile) ← FROM CACHE                     │
│  ├─► setSession(session)                                        │
│  └─► User is logged in ✅                                       │
└─────────────────────────────────────────────────────────────────┘

TOTAL API CALLS: 0 ✅ (Everything from cache!)
```

---

## 3. Page Load After 24 Hours (Session Expired)

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER LOADS PAGE                              │
│                    (24+ hours later)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Initialize AuthContext                                         │
│  └─► Console: "🔐 Initializing authentication..."               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Check Session Expiry                                           │
│  ├─► Get cached data from localStorage                          │
│  ├─► Current time: 1729615000000                                │
│  ├─► Expiry time: 1729612800000                                 │
│  ├─► Expired? YES (current > expiry)                            │
│  └─► Console: "⏰ Session expired - clearing cache"             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Clear Session Cache                                            │
│  ├─► Remove 'travelhosta-session-timestamp'                     │
│  ├─► Remove 'travelhosta-cached-profile'                        │
│  ├─► Remove 'travelhosta-session-expiry'                        │
│  └─► Console: "🧹 Session cache cleared"                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Sign Out User                                                  │
│  ├─► Call supabase.auth.signOut()                               │
│  └─► Clear Supabase session                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Update React State                                             │
│  ├─► setUser(null)                                              │
│  ├─► setProfile(null)                                           │
│  ├─► setSession(null)                                           │
│  └─► User is logged out                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Redirect to Sign In Page                                       │
│  └─► User must log in again                                     │
└─────────────────────────────────────────────────────────────────┘

TOTAL API CALLS: 1 (signOut only)
```

---

## 4. Manual Sign Out Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER CLICKS SIGN OUT                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Call handleSignOut()                                           │
│  └─► From AuthContext                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Call authService.signOut()                                     │
│  ├─► supabase.auth.signOut() ............. [API CALL]           │
│  └─► Clear Supabase session                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Clear Session Cache                                            │
│  ├─► sessionCache.clearSessionCache()                           │
│  ├─► Remove all localStorage data                               │
│  └─► Console: "🧹 Session cache cleared"                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Update React State                                             │
│  ├─► setUser(null)                                              │
│  ├─► setProfile(null)                                           │
│  ├─► setSession(null)                                           │
│  └─► User is logged out ✅                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Redirect to Home/Sign In                                       │
│  └─► User sees logged out state                                 │
└─────────────────────────────────────────────────────────────────┘

TOTAL API CALLS: 1 (signOut only)
```

---

## 5. API Call Comparison Over 1 Day

### **Scenario: User logs in, then loads pages 10 times over 1 day**

#### **WITHOUT Caching:**

```
Action                  │ API Calls │ Total
─────────────────────────┼───────────┼──────
Sign in                 │     2     │   2
Load page 1             │     2     │   4
Load page 2             │     2     │   6
Load page 3             │     2     │   8
Load page 4             │     2     │  10
Load page 5             │     2     │  12
Load page 6             │     2     │  14
Load page 7             │     2     │  16
Load page 8             │     2     │  18
Load page 9             │     2     │  20
Load page 10            │     2     │  22
Sign out                │     1     │  23
─────────────────────────┼───────────┼──────
TOTAL                   │           │  23 ❌
```

#### **WITH Caching:**

```
Action                  │ API Calls │ Total │ Note
─────────────────────────┼───────────┼───────┼──────────────────
Sign in                 │     2     │   2   │ Cache saved
Load page 1             │     0     │   2   │ From cache ✅
Load page 2             │     0     │   2   │ From cache ✅
Load page 3             │     0     │   2   │ From cache ✅
Load page 4             │     0     │   2   │ From cache ✅
Load page 5             │     0     │   2   │ From cache ✅
Load page 6             │     0     │   2   │ From cache ✅
Load page 7             │     0     │   2   │ From cache ✅
Load page 8             │     0     │   2   │ From cache ✅
Load page 9             │     0     │   2   │ From cache ✅
Load page 10            │     0     │   2   │ From cache ✅
Sign out                │     1     │   3   │
─────────────────────────┼───────────┼───────┼──────────────────
TOTAL                   │           │   3 ✅ │ 87% reduction!
```

---

## 6. localStorage Data Structure

### **Before Login:**

```
localStorage
├─ travelhosta-auth: null
└─ [empty]
```

### **After Login (Cached):**

```
localStorage
├─ travelhosta-auth: "{...Supabase token...}"  ← Managed by Supabase
└─ travelhosta-session-timestamp:               ← Our cache
   {
     "timestamp": 1729526400000,               ← When cached
     "expiresAt": 1729612800000,               ← When expires (24h)
     "profile": {                               ← Cached profile
       "id": "uuid-here",
       "email": "user@example.com",
       "full_name": "John Doe",
       "role": "admin",
       "avatar_url": null,
       "created_at": "2025-10-21T10:00:00Z",
       "updated_at": "2025-10-21T10:00:00Z"
     }
   }
```

### **After Logout:**

```
localStorage
└─ [empty - all cleared]
```

---

## 7. Time-Based Decision Tree

```
                    ┌──────────────────┐
                    │  Page Loads      │
                    └────────┬─────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │  Check localStorage   │
                 └──────────┬────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │  Cache exists?   │        │  No cache        │
    │      YES         │        │                  │
    └────────┬─────────┘        └────────┬─────────┘
             │                            │
             ▼                            ▼
    ┌──────────────────┐        ┌──────────────────┐
    │  Check expiry    │        │  Validate with   │
    └────────┬─────────┘        │  Supabase        │
             │                  │  [API CALL]      │
       ┌─────┴─────┐            └──────────────────┘
       │           │
       ▼           ▼
┌──────────┐ ┌──────────┐
│ Expired? │ │ Valid?   │
│   YES    │ │   NO     │
└────┬─────┘ └────┬─────┘
     │            │
     ▼            ▼
┌──────────┐ ┌──────────────────┐
│  Logout  │ │  Use cache       │
│  User    │ │  [NO API CALL] ✅│
└──────────┘ └──────────────────┘
```

---

## 8. Cache Validity Timeline

```
Time: 0h (Login)
│
├─► Cache saved
│   Expiry set to: Now + 24h
│
Time: 6h
│
├─► Cache valid ✅
│   Remaining: 18h
│
Time: 12h
│
├─► Cache valid ✅
│   Remaining: 12h
│
Time: 18h
│
├─► Cache valid ✅
│   Remaining: 6h
│
Time: 23h
│
├─► Cache valid ✅
│   Remaining: 1h
│
Time: 24h
│
├─► Cache EXPIRED ❌
│   Auto logout
│   Cache cleared
│
```

---

## Summary Table

| Scenario                  | API Calls | Cache Used         | Duration  |
| ------------------------- | --------- | ------------------ | --------- |
| First login               | 2         | No (creates cache) | Once      |
| Page refresh (within 24h) | 0         | Yes ✅             | 24 hours  |
| Page refresh (after 24h)  | 1         | No (expired)       | On expiry |
| Manual logout             | 1         | No (cleared)       | Anytime   |
| Navigation (within 24h)   | 0         | Yes ✅             | 24 hours  |

**Average API reduction: 80-90%** 🎉
