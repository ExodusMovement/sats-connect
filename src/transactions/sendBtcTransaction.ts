import type { Json } from 'jsontokens';
import { createUnsecuredToken } from 'jsontokens';

import { getDefaultProvider } from '../provider';
import type { SendBtcTransactionOptions } from './types';

export const sendBtcTransaction = async (options: SendBtcTransactionOptions) => {
  const { getProvider = getDefaultProvider } = options;
  const provider = await getProvider();
  if (!provider) {
    throw new Error('No Bitcoin wallet installed');
  }

  const { recipients, senderAddress } = options.payload;
  if (!recipients || recipients.length === 0) {
    throw new Error('At least one recipient is required');
  }
  if (!senderAddress) {
    throw new Error('The sender address is required');
  }

  try {
    const request = createUnsecuredToken(options.payload as unknown as Json);
    const response = await provider.sendBtcTransaction(request);
    options.onFinish?.(response);
  } catch (error) {
    console.error('[Connect] Error during send BTC transaction request', error);
    options.onCancel?.();
  }
};
