import { useEffect } from 'react';
// @ts-ignore
import appEvents from 'grafana/app/core/app_events';
import { AppEvents } from '@grafana/data';

/**
 * Hook to show error in a toast with additional message.
 */
export function useError(message: string, error?: Error) {
  useEffect(() => {
    if (error) {
      appEvents.emit(AppEvents.alertWarning, [message, (error as any)?.data?.message || error.message]);
      // This is going to be deprecated. Should be using this
      // https://github.com/grafana/grafana/blob/9305117902a3698fcefc5d3063f58867717e34ce/public/app/core/services/backend_srv.ts#L265
      // instead but DataSourceWithBackend.getResource does not allow us to send the config right now.
      // TODO change when that is allowed.
      (error as any).isHandled = true;
    }
  }, [error]);
}
