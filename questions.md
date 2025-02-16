## Can you explain the difference between Server-Side Rendering (SSR) and Static Site Generation (SSG) in Next.js? When would you use each?

SSR (Server-Side Rendering)

In SSR, the page is generated on the server at the time of the request.
The server processes the request, fetches data if needed, then returns a fully rendered HTML page.
This means faster initial load for dynamic content but can be slower on repeated requests compared to static pages.

Example: A news website where articles update frequently—each request needs fresh data.
SSG (Static Site Generation)

In SSG, the page is pre-built at build time and stored as a static file.
This means super-fast load times because the file is ready to go.
However, it doesn’t update dynamically unless you rebuild the site.
Example: A blog or marketing website where content doesn’t change frequently.
When to Use Each?

Use SSR when content changes frequently and needs to be fresh on each request (e.g., dashboards, real-time data).
Use SSG for pages that don’t change often and need fast performance (e.g., blogs, landing pages)

## How would you design an authentication system for a web app? What technologies would you use, and how would you ensure security?

### **Designing an Authentication System for a Web Application**

**1. Choosing the Right Authentication Method**  
There are several ways to handle authentication, depending on the application's needs:

- **JWT (JSON Web Tokens)** – Used for stateless authentication in APIs. Tokens are stored on the client (local storage or HTTP-only cookies).
- **Session-Based Authentication** – The server stores the session in memory or a database, and the client holds a session ID in a cookie.
- **OAuth 2.0 (Third-Party Login)** – Users can log in with Google, GitHub, or Facebook without storing credentials in our system.
- **Multi-Factor Authentication (MFA)** – Adds an extra layer of security (e.g., email or SMS verification).

**2. Technologies to Use**

- **Frontend (Client-Side):** Next.js with `next-auth` for authentication or Firebase Authentication.
- **Backend (Server-Side):**
  - **Node.js** with **Express** or **Next.js API routes**.
  - **Auth0 or Firebase Auth** for easy integration.
  - **PostgreSQL or MongoDB** to store user credentials securely.
- **Security Tokens:**
  - **JWT** stored in **HTTP-only cookies** (safer than local storage).
  - **Refresh tokens** to extend sessions without storing passwords.

**3. Security Measures to Protect Authentication**

- **Use HTTPS** – Encrypt all communication between client and server.
- **Hash passwords** – Store only hashed passwords using **bcrypt**.
- **HTTP-Only and Secure Cookies** – Prevent access via JavaScript (mitigates XSS attacks).
- **Rate Limiting & IP Blocking** – Prevent brute-force attacks on login endpoints.
- **Expiration & Token Refreshing** – Short-lived access tokens with secure refresh tokens.
- **MFA (Multi-Factor Authentication)** – Extra protection for sensitive accounts.

---

### **Example Workflow for a Secure Authentication System**

1. **User signs up:** Password is hashed with **bcrypt** and stored in the database.
2. **User logs in:** The backend verifies credentials, generates a **JWT**, and sends it as an **HTTP-only cookie**.
3. **User accesses protected routes:** The JWT is verified with middleware before allowing access.
4. **Token refresh:** If the access token expires, a refresh token generates a new one.
5. **User logs out:** Session is cleared, and tokens are invalidated.

---

### **Final Touch: Why This Approach?**

✅ Secure **(HTTPS, hashed passwords, HTTP-only cookies)**  
✅ Scalable **(JWTs for APIs, session-based for web apps, OAuth for third-party login)**  
✅ User-Friendly **(MFA, OAuth, and refresh tokens enhance the experience without compromising security)**

## 👉 How would you improve the performance of a React application?

**1. Optimize Rendering & Reduce Re-Renders**

- **Use `React.memo()`** to prevent unnecessary re-renders of components.
- **Use `useCallback()` and `useMemo()`** to optimize expensive computations and functions.
- **Avoid unnecessary state updates**—store only what’s needed in the component’s state.

**2. Implement Code Splitting & Lazy Loading**

- **Use React's `React.lazy()` and `Suspense`** to load components only when needed.
- **Split code into smaller chunks** using Webpack’s dynamic `import()`.
- **Load images efficiently** with `next/image` in Next.js for automatic optimization.

**3. Optimize Network Performance**

- **Use caching** (`React Query` or Apollo Client for GraphQL) to reduce redundant API calls.
- **Debounce API requests** (for search bars, etc.) using `lodash.debounce()`.
- **Use HTTP/2 & compression** (e.g., Brotli, Gzip) to reduce payload size.

**4. Optimize Asset Loading & Bundle Size**

- **Minimize CSS & JavaScript** using Tree Shaking to remove unused code.
- **Use SVGs & WebP** instead of large PNGs/JPEGs for faster image loading.
- **Lazy load images & videos** to defer loading until they are visible on screen.

**5. Improve State Management**

- **Use Context API efficiently**—avoid prop drilling.
- **Leverage state management libraries** like Redux Toolkit, Zustand, or React Query for optimized global state management.

### **Final Thoughts**

✅ **Faster UI rendering** → `React.memo()`, `useCallback()`, `useMemo()`.  
✅ **Reduced load time** → Lazy loading, code splitting, and optimized assets.  
✅ **Efficient API handling** → Caching, debouncing, and minimizing requests.

## 👉 How do you handle errors in a React application?

1. Catching Errors in UI

Use React Error Boundaries (componentDidCatch in class components or ErrorBoundary in libraries like React Error Boundary) to prevent the app from crashing.

2. Preventing Crashes with Defensive Programming

Use conditional rendering to prevent rendering error

3. Handling API Errors & Network Failures

Use try/catch blocks for async function

4. Logging & Debugging

Use console.log() and console.error() for local debugging.
Use monitoring tools like Sentry, LogRocket, or Datadog to track errors in production.
Add proper error messages in logs for easier debugging.

Final Thoughts
✅ UI stays functional → Error Boundaries & conditional rendering.
✅ Users see meaningful error messages instead of app crashes.
✅ API errors are handled gracefully → Try/Catch & fallback UI.
✅ Production monitoring → Tools like Sentry for tracking issues.
