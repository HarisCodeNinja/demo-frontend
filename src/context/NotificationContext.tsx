import React, { createContext, useContext, ReactNode } from 'react';
import { toast, Toaster } from 'sonner';
import { ALERT_SHOW_TIME } from '@/config/constant';
import { NotificationType } from '@/interface/common';

/**
 * Props for the NotificationContext.
 */
interface NotificationContextProps {
  /**
   * Function to show a notification.
   * @param title - The title of the notification.
   * @param message - The message of the notification.
   * @param type - The type of the notification.
   */
  showNotification: (title: string, message: string, type: NotificationType) => void;
}

/**
 * Props for the NotificationProvider component.
 */
interface NotificationProviderProps {
  children: ReactNode;
}

const defaultValue: NotificationContextProps = {
  showNotification: () => {
    console.log('Default notification');
  },
};

const NotificationContext = createContext<NotificationContextProps>(defaultValue);

/**
 * A provider component that provides the NotificationContext to its children.
 * @param children - The children components.
 */
const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  /**
   * Function to show a notification.
   * @param title - The title of the notification.
   * @param message - The message of the notification.
   * @param type - The type of the notification.
   */
  const showNotification = (title: string, message: string, type: NotificationType) => {
    const fullMessage = `${title}: ${message}`;

    switch (type) {
      case 'success':
        toast.success(fullMessage, { duration: ALERT_SHOW_TIME });
        break;
      case 'error':
        toast.error(fullMessage, { duration: ALERT_SHOW_TIME });
        break;
      case 'warning':
        toast.warning(fullMessage, { duration: ALERT_SHOW_TIME });
        break;
      case 'info':
      default:
        toast.info(fullMessage, { duration: ALERT_SHOW_TIME });
        break;
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <Toaster richColors position="bottom-right" />
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * A hook to access the NotificationContext.
 * @returns The NotificationContext.
 */
export const useNotificationContext = () => useContext(NotificationContext);

export default NotificationProvider;
