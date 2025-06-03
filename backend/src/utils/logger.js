const getTimestamp = () => new Date().toISOString();

const logger = {
  log: (message, ...optionalParams) => {
    console.log(`[LOG][${getTimestamp()}] ${message}`, ...optionalParams);
  },
  info: (message, ...optionalParams) => {
    console.info(`[INFO][${getTimestamp()}] ${message}`, ...optionalParams);
  },
  warn: (message, ...optionalParams) => {
    console.warn(`[WARN][${getTimestamp()}] ${message}`, ...optionalParams);
  },
  error: (message, ...optionalParams) => {
    if (message instanceof Error) {
        console.error(`[ERROR][${getTimestamp()}] ${message.message}`, message.stack, ...optionalParams);
    } else {
        console.error(`[ERROR][${getTimestamp()}] ${message}`, ...optionalParams);
    }
  },
  debug: (message, ...optionalParams) => {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      console.debug(`[DEBUG][${getTimestamp()}] ${message}`, ...optionalParams);
    }
  },
};

export default logger;
