export const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
};

// Updated validateDate to prevent future dates
export const validateDate = (date) => {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in yyyy-mm-dd format
    return date <= today;  // Ensure the date is not in the future
};

// Check if a field is empty
export const validateNotEmpty = (value) => {
    return value.trim() !== '';
};
