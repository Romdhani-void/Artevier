const mongoSanitize = require('express-mongo-sanitize');

const sanitizeRequest = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    // Silently replace prohibited keys
  },
});

module.exports = sanitizeRequest;
