/**
 * Standardized API Response Orchestrator
 * Ensures all outbound payloads adhere to a unified architecture.
 */
const responseWrapper = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    if (data && typeof data === 'object' && !data.hasOwnProperty('success')) {
      const wrappedData = {
        success: true,
        payload: data,
        meta: {
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
          version: 'v4.2.0-stable',
        },
      };
      return originalJson.call(this, wrappedData);
    }
    return originalJson.call(this, data);
  };

  next();
};

module.exports = responseWrapper;
