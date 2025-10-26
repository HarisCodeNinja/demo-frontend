import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotificationContext } from '@/context/NotificationContext';
import { CleanError } from '@/util/CleanError';

export type CrudOperationType = 'add' | 'update' | 'delete' | null;

export const useCrudNotifications = (
  operationType: CrudOperationType,
  isSuccess: boolean,
  error: any,
  modelName: string
) => {
  const { t } = useTranslation(['common']);
  const { showNotification } = useNotificationContext();

  useEffect(() => {
    if (isSuccess && operationType) {
      const messages = {
        add: {
          title: 'addedSuccessTitle',
          message: 'addedMessage'
        },
        update: {
          title: 'updateSuccessTitle',
          message: 'updateMessage'
          },
          delete: {
            title: 'deleteSuccessTitle',
            message: 'deleteMessage'
          }
      };

      const selectedMessage = messages[operationType];
      showNotification(
        t(selectedMessage.title), 
        modelName + ' ' + t(selectedMessage.message), 
        'success'
      );
    }
  }, [isSuccess, operationType, modelName, t, showNotification]);

  useEffect(() => {
    if (error) {
      const errorMessage = CleanError(error);
      const errorTitle = t('errorOn' + 
        (operationType ? operationType.charAt(0).toUpperCase() + operationType.slice(1) : 'Fetching') + 
        'Record'
      );
      showNotification(errorTitle, errorMessage, 'error');
    }
  }, [error, operationType, t, showNotification]);
};
