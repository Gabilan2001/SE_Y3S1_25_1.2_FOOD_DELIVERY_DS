const { v4: uuidv4 } = require('uuid');

const generateOrderId = () => {
    return `ORDER-${uuidv4().split('-')[0].toUpperCase()}`;
};

module.exports = generateOrderId;
