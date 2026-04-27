const crypto = require('crypto');

// In-memory store for users
const users = [];

const findByEmail = (email) => users.find(u => u.email === email);
const findById = (id) => users.find(u => u.id === id);

const create = (userData) => {
  const user = {
    id: crypto.randomUUID(),
    preferred_mfa: 'email', // 'email' | 'totp'
    totp_secret: null,
    totp_enabled: false,
    ...userData
  };
  users.push(user);
  return user;
};

// Seed 10 test users
for (let i = 1; i <= 10; i++) {
  create({
    email: `user${i}@example.com`,
    passwordHash: crypto.createHash('sha256').update('password123').digest('hex'),
    name: `Test User ${i}`
  });
}

module.exports = {
  findByEmail,
  findById,
  create,
  update: (id, data) => {
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      return users[idx];
    }
    return null;
  }
};
