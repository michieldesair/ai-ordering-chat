import { Maxim, MaximLogger } from '@maximai/maxim-js';

let maximInstance: Maxim | null = null;
let maximLogger: MaximLogger | undefined = undefined;
let maximInitialised = false;

export async function getMaximLogger() {
  if (maximInitialised && maximLogger) {
    return maximLogger;
  }

  try {
    if (!process.env.MAXIM_API_KEY || !process.env.MAXIM_LOG_REPO_ID) {
      console.warn(
        'Maxim API key or Log Repo ID is missing. Maxim logger will not be initialized.',
      );
      return null;
    }

    if (!maximInstance) {
      maximInstance = new Maxim({ apiKey: process.env.MAXIM_API_KEY });
    }

    const logger = await maximInstance.logger({ id: process.env.MAXIM_LOG_REPO_ID });
    maximLogger = logger;
    maximInitialised = true;
    console.log('Maxim logger initialized successfully.');
    return logger;
  } catch (error) {
    console.error('Error accessing environment variables for Maxim:', error);
    return null;
  }
}

export function getMaximInstance() {
  if (!maximInstance && process.env.MAXIM_API_KEY) {
    maximInstance = new Maxim({ apiKey: process.env.MAXIM_API_KEY });
  }
}
