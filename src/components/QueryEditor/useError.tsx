import { useEffect } from 'react';
// This isn't exported in the sdk yet
// @ts-ignore
import { getAppEvents } from '@grafana/runtime';
import { AppEvents } from '@grafana/data';

/**
 * Hook to show error in a toast with additional message.
 */
export function useError(message: string, error?: Error) {
  useEffect(() => {
    if (error) {
      getAppEvents().publish({
        type: AppEvents.alertWarning.name,
        payload: [message, (error as any)?.data?.message || error.message],
      });
    }
  }, [error, message]);
}
