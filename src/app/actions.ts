'use server';

import {R_API_BASE_URL} from '@/lib/constants';

export async function wakeRAPI() {
  try {
    const response = await fetch(`${R_API_BASE_URL}/wake`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!response.ok) {
      // likely got a 404 or other error
      return {
        apiStatus: 'error',
        httpCode: response.status,
        httpBody: response.body,
      };
    }
    try {
      const json = await response.json();
      return {
        apiStatus: 'up',
        httpCode: response.status,
        httpBody: json,
      };
    } catch (error) {
      return {
        apiStatus: 'error',
        apiStatusReason: ('Invalid JSON response' + error) as string,
        httpCode: response.status,
      };
    }
  } catch (error) {
    // likely the fetch failed because the server is down or unreachable
    return {
      apiStatus: 'down',
      apiStatusReason: ('Server unreachable' + error) as string,
    };
  }
}
