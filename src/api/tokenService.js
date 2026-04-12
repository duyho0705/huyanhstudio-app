// ==============================
// tokenService.js
// ==============================
let inMemoryToken = null;

const ACCESS_TOKEN_KEY = "access_token";

const TokenService = {
  set(token) {
    inMemoryToken = token;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  get() {
    return inMemoryToken || localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  clear() {
    inMemoryToken = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

export default TokenService;
