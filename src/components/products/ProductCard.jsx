import { Package, TrendingUp } from 'lucide-react'
import { formatCurrency, getProductColor } from '../../utils/helpers'
import Button from '../ui/Button'

export default function ProductCard({ product, onViewContracts, currentPrice }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Package className="text-primary-600" size={24} />
          </div>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getProductColor(product.type)}`}>
              {product.type}
            </span>
          </div>
        </div>
        {currentPrice && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Market Price</p>
            <p className="text-lg font-bold text-primary-600">{formatCurrency(currentPrice)}/kg</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Quantity</p>
            <p className="text-xl font-bold text-gray-900">{product.total_qty} {product.unit}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Available</p>
            <p className="text-xl font-bold text-green-600">{product.available_qty} {product.unit}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Reserved</p>
            <p className="text-sm font-semibold text-yellow-600">{product.reserved_qty} {product.unit}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Committed</p>
            <p className="text-sm font-semibold text-blue-600">{product.committed_qty} {product.unit}</p>
          </div>
        </div>

        {(product.active_contracts_count > 0 || product.pending_contracts_count > 0) && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {product.active_contracts_count} Active • {product.pending_contracts_count} Pending
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewContracts(product._id)}
              >
                View Contracts
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}