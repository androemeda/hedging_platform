import Modal from '../ui/Modal'
import { formatCurrency, formatDateTime, getStatusColor, getProductColor } from '../../utils/helpers'

export default function ContractDetailsModal({ isOpen, onClose, contract }) {
  if (!contract) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contract Details" size="md">
      <div className="space-y-6">
        {/* Status & Type */}
        <div className="flex items-center justify-between">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getProductColor(contract.product_type)}`}>
            {contract.product_type}
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
            {contract.status}
          </span>
        </div>

        {/* Total Value */}
        <div className="p-6 bg-primary-50 rounded-xl text-center">
          <p className="text-sm text-gray-600 mb-1">Total Contract Value</p>
          <p className="text-4xl font-bold text-primary-700">{formatCurrency(contract.total_value)}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Quantity</p>
            <p className="text-lg font-semibold text-gray-900">{contract.qty} {contract.unit}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Price per {contract.unit}</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(contract.price_per_unit)}</p>
          </div>
        </div>

        {/* Parties */}
        <div className="space-y-3">
          {contract.farmer && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Farmer</p>
              <p className="font-semibold text-gray-900">{contract.farmer.name}</p>
              <p className="text-sm text-gray-600">{contract.farmer.location}</p>
            </div>
          )}
          {contract.trader && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Trader</p>
              <p className="font-semibold text-gray-900">{contract.trader.name}</p>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Created:</span>
            <span className="font-medium text-gray-900">{formatDateTime(contract.created_at)}</span>
          </div>
          {contract.accepted_at && (
            <div className="flex justify-between">
              <span className="text-gray-600">Accepted:</span>
              <span className="font-medium text-gray-900">{formatDateTime(contract.accepted_at)}</span>
            </div>
          )}
          {contract.completed_at && (
            <div className="flex justify-between">
              <span className="text-gray-600">Completed:</span>
              <span className="font-medium text-gray-900">{formatDateTime(contract.completed_at)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Created by:</span>
            <span className="font-medium text-gray-900 capitalize">{contract.created_by}</span>
          </div>
        </div>

        {/* Notes */}
        {contract.notes && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Notes</p>
            <p className="text-sm text-gray-700">{contract.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}