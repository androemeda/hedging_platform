import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = 'http://localhost:8000/api'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

// Helper to get email from localStorage
const getEmail = () => {
  const user = localStorage.getItem('user')
  if (user) {
    return JSON.parse(user).email
  }
  return null
}

// Error handler
const handleError = (error) => {
  const message = error.response?.data?.detail || 'Something went wrong'
  toast.error(message)
  throw error
}

export const api = {
  // Auth
  login: async (email, password) => {
    try {
      const { data } = await axiosInstance.post('/auth/login', { email, password })
      toast.success('Login successful!')
      return data
    } catch (error) {
      handleError(error)
    }
  },

  register: async (userData) => {
    try {
      const { data } = await axiosInstance.post('/auth/register', userData)
      toast.success('Registration successful!')
      return data
    } catch (error) {
      handleError(error)
    }
  },

  // Products
  listProduct: async (productData) => {
    try {
      const { data } = await axiosInstance.post('/farmer/list-product', productData, {
        params: { email: getEmail() }
      })
      toast.success('Product listed successfully!')
      return data
    } catch (error) {
      handleError(error)
    }
  },

  getFarmerProducts: async (farmerId = null) => {
    try {
      const params = { email: getEmail() }
      if (farmerId) params.farmer_id = farmerId
      const { data } = await axiosInstance.get('/farmer/products', { params })
      return data
    } catch (error) {
      handleError(error)
    }
  },

  getAvailableProducts: async (filters = {}) => {
    try {
      const { data } = await axiosInstance.get('/products/available', {
        params: { email: getEmail(), ...filters }
      })
      return data
    } catch (error) {
      handleError(error)
    }
  },

  // Contracts
  createContractByFarmer: async (contractData) => {
    try {
      const { data } = await axiosInstance.post('/farmer/create-contract', contractData, {
        params: { email: getEmail() }
      })
      toast.success('Contract created successfully!')
      return data
    } catch (error) {
      handleError(error)
    }
  },

  createContractByTrader: async (contractData) => {
    try {
      const { data } = await axiosInstance.post('/trader/create-contract', contractData, {
        params: { email: getEmail() }
      })
      toast.success('Contract created successfully!')
      return data
    } catch (error) {
      handleError(error)
    }
  },

  acceptContractByFarmer: async (contractId) => {
    try {
      const { data } = await axiosInstance.post('/farmer/accept-contract', 
        { contract_id: contractId },
        { params: { email: getEmail() } }
      )
      toast.success('Contract accepted!')
      return data
    } catch (error) {
      handleError(error)
    }
  },

  acceptContractByTrader: async (contractId) => {
    try {
      const { data } = await axiosInstance.post('/trader/accept-contract', 
        { contract_id: contractId },
        { params: { email: getEmail() } }
      )
      toast.success('Contract accepted!')
      return data
    } catch (error) {
      handleError(error)
    }
  },

  rejectContract: async (contractId, reason = '') => {
    try {
      const { data } = await axiosInstance.post('/reject-contract', 
        { contract_id: contractId, rejection_reason: reason },
        { params: { email: getEmail() } }
      )
      toast.success('Contract rejected')
      return data
    } catch (error) {
      handleError(error)
    }
  },

  cancelContract: async (contractId) => {
    try {
      const { data } = await axiosInstance.post('/cancel-contract', 
        { contract_id: contractId },
        { params: { email: getEmail() } }
      )
      toast.success('Contract cancelled')
      return data
    } catch (error) {
      handleError(error)
    }
  },

  completeContract: async (contractId, completedBy) => {
    try {
      const { data } = await axiosInstance.post('/complete-contract', 
        { contract_id: contractId, completed_by: completedBy },
        { params: { email: getEmail() } }
      )
      toast.success('Contract completed!')
      return data
    } catch (error) {
      handleError(error)
    }
  },

  getActiveContracts: async (userType, userId = null) => {
    try {
      const endpoint = userType === 'farmer' ? '/farmer/active-contracts' : '/trader/active-contracts'
      const params = { email: getEmail() }
      if (userId) params[`${userType}_id`] = userId
      const { data } = await axiosInstance.get(endpoint, { params })
      return data
    } catch (error) {
      handleError(error)
    }
  },

  getPendingContracts: async (userType, userId = null) => {
    try {
      const endpoint = userType === 'farmer' ? '/farmer/pending-contracts' : '/trader/pending-contracts'
      const params = { email: getEmail() }
      if (userId) params[`${userType}_id`] = userId
      const { data } = await axiosInstance.get(endpoint, { params })
      return data
    } catch (error) {
      handleError(error)
    }
  },

  getProductContracts: async (productId, status = null) => {
    try {
      const params = { email: getEmail() }
      if (status) params.status = status
      const { data } = await axiosInstance.get(`/product/${productId}/contracts`, { params })
      return data
    } catch (error) {
      handleError(error)
    }
  },

  // Market
  getCurrentPrices: async (type = null) => {
    try {
      const params = { email: getEmail() }
      if (type) params.type = type
      const { data } = await axiosInstance.get('/market/current-prices', { params })
      return data
    } catch (error) {
      handleError(error)
    }
  },

  getPriceHistory: async (type, days = 30) => {
    try {
      const { data } = await axiosInstance.get('/market/price-history', {
        params: { email: getEmail(), type, days }
      })
      return data
    } catch (error) {
      handleError(error)
    }
  },

  // Forecasts
  getForecasts: async (type = null, days = 30) => {
    try {
      const params = { email: getEmail(), days }
      if (type) params.type = type
      const { data } = await axiosInstance.get('/forecasts', { params })
      return data
    } catch (error) {
      handleError(error)
    }
  },

  // Dashboard
  getFarmerDashboard: async (farmerId = null) => {
    try {
      const params = { email: getEmail() }
      if (farmerId) params.farmer_id = farmerId
      const { data } = await axiosInstance.get('/farmer/dashboard-summary', { params })
      return data
    } catch (error) {
      handleError(error)
    }
  },

  getTraderDashboard: async (traderId = null) => {
    try {
      const params = { email: getEmail() }
      if (traderId) params.trader_id = traderId
      const { data } = await axiosInstance.get('/trader/dashboard-summary', { params })
      return data
    } catch (error) {
      handleError(error)
    }
  },
}