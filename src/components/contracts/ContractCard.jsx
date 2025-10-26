import { FileText, User, Calendar, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDateTime, getStatusColor, getProductColor } from '../../utils/helpers'
import Button from '../ui/Button'

export default function ContractCard({ contract, userType, onAccept, onReject, onComplete, onCancel }) {
  const isCreatedByMe = contract.created_by === userType
  const isPending = contract.status === 'PENDING'
  const isActive = contract.status === 'ACTIVE'

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getProductColor(contract.product_type)}`}>
                {contract.product_type}
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                {contract.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Created by {contract.created_by === userType ? 'you' : contract.created_by}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(contract.total_value)}</p>
          <p className="text-xs text-gray-500">Total Value</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Quantity</p>
            <p className="text-sm font-semibold text-gray-900">
              {contract.qty} {contract.unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Price per {contract.unit}</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(contract.price_per_unit)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Created</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDateTime(contract.created_at).split(' ')[0]}
            </p>
          </div>
        </div>

        {(contract.farmer || contract.trader) && (
          <div className="pt-3 border-t border-gray-200">
            {userType === 'farmer' && contract.trader && (
              <div className="flex items-center space-x-2 text-sm">
                <User size={16} className="text-gray-400" />
                <span className="text-gray-600">Trader:</span>
                <span className="font-medium text-gray-900">{contract.trader.name}</span>
              </div>
            )}
            {userType === 'trader' && contract.farmer && (
              <div className="flex items-center space-x-2 text-sm">
                <User size={16} className="text-gray-400" />
                <span className="text-gray-600">Farmer:</span>
                <span className="font-medium text-gray-900">
                  {contract.farmer.name} • {contract.farmer.location}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {isPending && !isCreatedByMe && (
          <div className="flex space-x-2 pt-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAccept(contract._id)}
              className="flex-1"
            >
              Accept Contract
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onReject(contract._id)}
              className="flex-1"
            >
              Reject
            </Button>
          </div>
        )}

        {isPending && isCreatedByMe && (
          <div className="pt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onCancel(contract._id)}
              className="w-full"
            >
              Cancel Contract
            </Button>
          </div>
        )}

        {isActive && (
          <div className="pt-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onComplete(contract._id)}
              className="w-full"
            >
              Mark as Completed
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}