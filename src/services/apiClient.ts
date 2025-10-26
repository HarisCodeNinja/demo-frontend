import axios from 'axios';
import { BASE_URL } from '@/config/app';
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/config/constant';
import { store } from '@/store';
import { setSession } from '@/store/slice/sessionSlice';
import { toast } from 'sonner';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();

  store.dispatch(
    setSession({
      token: null,
      refreshToken: null,
      user: null,
      isLoggedIn: false,
      lang: 'en',
      dir: 'ltr',
      isDarkTheme: false,
      isCompactTheme: false,
      area: 'default',
    }),
  );

  toast.error('Session expired. Please login again.');

  window.location.replace('/');
};

// Request interceptor to add authorization token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Redux store
    const state = store.getState();
    const token = state.session?.token;

    if (token) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE} ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      handleLogout();
      // Handle unauthorized - could redirect to login
      console.warn('Unauthorized request - token may be expired');
      // You can dispatch logout action here if needed
    }

    if (error.response?.status === 403) {
      
      console.warn('Forbidden request - insufficient permissions');
      toast.error('Forbidden request - insufficient permissions');

      window.location.replace('/notAuth');
    }

    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  },
);

export default apiClient; 