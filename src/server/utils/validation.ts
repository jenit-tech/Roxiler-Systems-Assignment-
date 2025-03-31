
import validator from 'validator';

export const validateRegistration = (data: any) => {
  const errors = [];
  
  // Name validation: 20-60 characters
  if (!data.name || data.name.length < 20 || data.name.length > 60) {
    errors.push('Name must be between 20 and 60 characters');
  }
  
  // Email validation
  if (!data.email || !validator.isEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }
  
  // Address validation: max 400 characters
  if (data.address && data.address.length > 400) {
    errors.push('Address must not exceed 400 characters');
  }
  
  // Password validation: 8-16 characters, uppercase, special char
  if (!data.password || data.password.length < 8 || data.password.length > 16 ||
      !/[A-Z]/.test(data.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
    errors.push('Password must be 8-16 characters and include at least one uppercase letter and one special character');
  }
  
  return errors;
};

export const validateLogin = (data: any) => {
  const errors = [];
  
  if (!data.email || !validator.isEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!data.password) {
    errors.push('Password is required');
  }
  
  return errors;
};

export const validateUser = (data: any) => {
  const errors = [];
  
  // Name validation: 20-60 characters
  if (!data.name || data.name.length < 20 || data.name.length > 60) {
    errors.push('Name must be between 20 and 60 characters');
  }
  
  // Email validation
  if (!data.email || !validator.isEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }
  
  // Address validation: max 400 characters
  if (data.address && data.address.length > 400) {
    errors.push('Address must not exceed 400 characters');
  }
  
  // Password validation: 8-16 characters, uppercase, special char
  if (data.password && (data.password.length < 8 || data.password.length > 16 ||
      !/[A-Z]/.test(data.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(data.password))) {
    errors.push('Password must be 8-16 characters and include at least one uppercase letter and one special character');
  }
  
  // Role validation
  if (data.role && !['ADMIN', 'USER', 'STORE_OWNER'].includes(data.role)) {
    errors.push('Invalid role. Role must be ADMIN, USER, or STORE_OWNER');
  }
  
  return errors;
};

export const validateStore = (data: any) => {
  const errors = [];
  
  // Name validation: 20-60 characters
  if (!data.name || data.name.length < 20 || data.name.length > 60) {
    errors.push('Name must be between 20 and 60 characters');
  }
  
  // Email validation
  if (!data.email || !validator.isEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }
  
  // Address validation: max 400 characters
  if (data.address && data.address.length > 400) {
    errors.push('Address must not exceed 400 characters');
  }
  
  return errors;
};

export const validateRating = (data: any) => {
  const errors = [];
  
  if (!data.storeId) {
    errors.push('Store ID is required');
  }
  
  if (!data.rating || !Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
    errors.push('Rating must be an integer between 1 and 5');
  }
  
  return errors;
};
