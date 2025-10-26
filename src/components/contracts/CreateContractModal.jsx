import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { api } from '../../utils/api'
import { formatCurrency } from '../../utils/helpers'

export default function CreateContractModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  userType,
  productId = null,
  farmerId = null,
  productType = null,
  availableQty = 0
}) {
  const [formData, setFormData] = useState({
    product_id: productId || '',
    farmer_id: farmerId || '',
    price_per_unit: '',
    qty: '',
    unit: 'kg',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])

  useEffect(() => {
    if (isOpen && userType === 'farmer') {
      loadProducts()
    }
  }, [isOpen, userType])

  const loadProducts = async () => {
    try {
      const data = await api.getFarmerProducts()
      setProducts(data.products || [])
    } catch (error) {
      // Error handled by api.js
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        product_id: formData.product_id,
        price_per_unit: parseFloat(formData.price_per_unit),
        qty: parseFloat(formData.qty),
        unit: formData.unit,
        notes: formData.notes,
      }

      if (userType === 'farmer') {
        await api.createContractByFarmer(payload)
      } else {
        await api.createContractByTrader({
          ...payload,
          farmer_id: formData.farmer_id,
        })
      }

      onSuccess()
      onClose()
      setFormData({
        product_id: '',
        farmer_id: '',
        price_per_unit: '',
        qty: '',
        unit: 'kg',
        notes: '',
      })
    } catch (error) {
      // Error handled by api.js
    } finally {
      setLoading(false)
    }
  }

  const selectedProduct = products.find(p => p._id === formData.product_id)
  const maxQty = selectedProduct 
    ? (selectedProduct.available_qty - selectedProduct.reserved_qty)
    : availableQty

  const totalValue = formData.price_per_unit && formData.qty
    ? parseFloat(formData.price_per_unit) * parseFloat(formData.qty)
    : 0

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Contract" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {userType === 'farmer' ? (
          <Select
            label="Select Product"
            value={formData.product_id}
            onChange={(e) => {
              const product = products.find(p => p._id === e.target.value)
              setFormData({ 
                ...formData, 
                product_id: e.target.value,
                unit: product?.unit || 'kg'
              })
            }}
            options={products.map(p => ({
              value: p._id,
              label: `${p.type} - ${p.available_qty - p.reserved_qty} ${p.unit} available`
            }))}
            required
          />
        ) : (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Product</p>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-900">{productType}</p>
              <p className="text-sm text-gray-600">Available: {availableQty} kg</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price per unit (₹)"
            type="number"
            step="0.01"
            value={formData.price_per_unit}
            onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
            placeholder="50.00"
            required
          />

          <Input
            label={`Quantity (max: ${maxQty} ${formData.unit})`}
            type="number"
            step="0.01"
            value={formData.qty}
            onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
            placeholder="Enter quantity"
            required
          />
        </div>

        <Input
          label="Notes (Optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes..."
        />

        {totalValue > 0 && (
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Contract Value</p>
            <p className="text-2xl font-bold text-primary-700">{formatCurrency(totalValue)}</p>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Creating...' : 'Create Contract'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}