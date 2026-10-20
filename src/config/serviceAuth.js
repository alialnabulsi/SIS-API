'use strict';

const SERVICE_API_KEY_PATTERN = /^[A-Za-z0-9_-]{43,128}$/;

function getServiceApiKey(environment = process.env) {
  const apiKey = environment.SIS_SERVICE_API_KEY;
  const hasSufficientDiversity = typeof apiKey === 'string' &&
    new Set(apiKey).size >= 10;

  if (!hasSufficientDiversity || !SERVICE_API_KEY_PATTERN.test(apiKey)) {
    throw new Error(
      'SIS_SERVICE_API_KEY must be a high-entropy 43-128 character base64url secret.'
    );
  }

  return apiKey;
}

module.exports = { getServiceApiKey };
