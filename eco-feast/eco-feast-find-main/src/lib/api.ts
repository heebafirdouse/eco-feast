// Example frontend API calls using fetch

const API_URL = 'http://localhost:4002/api';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface User {
  email: string;
  name: string;
  phone: string;
  points: number;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
  message?: string;
}

// Register a new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// Login a user
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// Get the menu
export async function getMenu() {
  const response = await fetch(`${API_URL}/menu`);
  return response.json();
}

// Place an order
export const placeOrder = async (token: string, orderData: { cart: any[], date: string, timeSlot: string, guests: number }) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// Submit an eco activity
export async function submitActivity(token: string, activityData: { type: string, proof: string }) {
  const response = await fetch(`${API_URL}/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(activityData),
  });
  return response.json();
}

// Get available rewards
export async function getRewards(token: string) {
  const response = await fetch(`${API_URL}/rewards`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

// Redeem a reward
export async function redeemReward(token: string, rewardId: string) {
  const response = await fetch(`${API_URL}/redeem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ rewardId }),
  });
  return response.json();
}

// Get user info (points, activities, etc.)
export async function getUserInfo(token: string) {
  const response = await fetch(`${API_URL}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

// Get user orders
export const getUserOrders = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

export const getUserProfile = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};