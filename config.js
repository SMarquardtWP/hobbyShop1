'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/hobbyShop';
exports.JWT_SECRET = "secret";
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '30m';

exports.PORT = process.env.PORT || 8080;