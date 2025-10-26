import { format } from 'date-fns'

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return format(new Date(dateString), 'MMM dd, yyyy')
}

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  return format(new Date(dateString), 'MMM dd, yyyy hh:mm a')
}

export const getStatusColor = (status) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    REJECTED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getProductColor = (productType) => {
  const colors = {
    Soybean: 'bg-amber-100 text-amber-800',
    Sunflower: 'bg-yellow-100 text-yellow-800',
    Groundnut: 'bg-orange-100 text-orange-800',
    Mustard: 'bg-lime-100 text-lime-800',
    Sesame: 'bg-emerald-100 text-emerald-800',
  }
  return colors[productType] || 'bg-gray-100 text-gray-800'
}