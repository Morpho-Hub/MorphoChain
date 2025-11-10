// Backend 2.0 Services
const emailService = require('./emailService');

// Backend 3.0 Services (Blockchain)
const blockchainService = require('./blockchainService');
const morphoCoinService = require('./morphoCoinService');
const plantationService = require('./plantationService');
const marketplaceService = require('./marketplaceService');

module.exports = {
  // 2.0
  emailService,
  
  // 3.0
  blockchainService,
  morphoCoinService,
  plantationService,
  marketplaceService,
};
