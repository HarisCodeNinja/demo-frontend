import axios from 'axios';
import { BASE_URL } from '@/config/app';
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/config/constant';
import { store } from '@/store';
import { setSession } from '@/store/slice/sessionSlice';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forOf(({ resolve, reject }: any) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

const formatMessage = (message: string): string => {
  if (!message || typeof message !== 'string') {
    return message;
  }

  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return trimmed;
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const refreshToken = async () => {
  try {
    const state = store.getState();
    const refreshTokenValue = state.session?.refreshToken;

    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(
      `${BASE_URL}/users-auth/refresh-token`,
      {
        refreshToken: refreshTokenValue,
      },
      {
        timeout: 5000,
      },
    );

    const { token: newToken, refreshToken: newRefreshToken, user } = response.data;

    if (!newToken || !newRefreshToken) {
      throw new Error('Invalid tokens received from refresh endpoint');
    }

    const currentSession = store.getState().session;
    store.dispatch(
      setSession({
        ...currentSession,
        token: newToken,
        refreshToken: newRefreshToken,
        user: user || currentSession.user,
        isLoggedIn: true,
      }),
    );

    return newToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

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
      isFullscreen: false,
    }),
  );

  toast.error('Session expired. Please login again.');

  window.location.replace('/userLogin');
};

const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return formatMessage(error.response.data.message);
  }
  if (error.response?.data?.error) {
    return formatMessage(error.response.data.error);
  }
  if (error.message) {
    return formatMessage(error.message);
  }
  return 'An unexpected error occurred';
};

const getSuccessMessage = (response: any): string | null => {
  if (response.data?.message) {
    return formatMessage(response.data.message);
  }
  if (response.data?.success && typeof response.data.success === 'string') {
    return formatMessage(response.data.success);
  }
  return null;
};

apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.session?.token;

    if (token) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE} ${token}`;
    }

    return config;
  },
  (error) => {
    toast.error(getErrorMessage(error));

    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    const successMessage = getSuccessMessage(response);
    if (successMessage) {
      toast.success(successMessage);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (originalRequest.url?.includes('/refresh-token')) {
        console.warn('Refresh token endpoint failed, logging out');
        handleLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE} ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();

        processQueue(null, newToken);

        originalRequest.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE} ${newToken}`;

        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.warn('Token refresh failed, logging out user');
        processQueue(refreshError, null);
        isRefreshing = false;

        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    let errorTitle = 'Error';
    let errorMessage = getErrorMessage(error);

    switch (error.response?.status) {
      case 400:
        errorTitle = 'Bad Request';
        break;
      case 404:
        errorTitle = 'Not Found';
        errorMessage = 'The requested resource was not found';
        break;
      case 422:
        errorTitle = 'Validation Error';
        break;
      case 429:
        errorTitle = 'Too Many Requests';
        errorMessage = 'Please wait before making another request';
        break;
      case 500:
        errorTitle = 'Server Error';
        errorMessage = 'Internal server error. Please try again later.';
        break;
      case 502:
      case 503:
      case 504:
        errorTitle = 'Service Unavailable';
        errorMessage = 'Service is temporarily unavailable. Please try again later.';
        break;
      default:
        if (error.response?.status >= 500) {
          errorTitle = 'Server Error';
        }
    }

    if (error.response?.status !== 401 && error.response?.status !== 403) {
      toast.error(formatMessage(errorMessage), {
        description: errorTitle !== 'Error' ? `${errorTitle}: ${formatMessage(errorMessage)}` : undefined,
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
