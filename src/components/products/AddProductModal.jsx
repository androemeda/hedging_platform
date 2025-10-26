import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { api } from '../../utils/api'

export default function AddProductModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    type: '',
    qty: '',
    unit: 'kg',
  })
  const [loading, setLoading] = useState(false)

  const productTypes = [
    { value: 'Soybean', label: 'Soybean' },
    { value: 'Sunflower', label: 'Sunflower' },
    { value: 'Groundnut', label: 'Groundnut' },
    { value: 'Mustard', label: 'Mustard' },
    { value: 'Sesame', label: 'Sesame' },
  ]

  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'tonne', label: 'Tonnes' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.listProduct({
        type: formData.type,
        qty: parseFloat(formData.qty),
        unit: formData.unit,
      })
      onSuccess()
      onClose()
      setFormData({ type: '', qty: '', unit: 'kg' })
    } catch (error) {
      // Error handled by api.js
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Product Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          options={productTypes}
          required
        />

        <Input
          label="Quantity"
          type="number"
          value={formData.qty}
          onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
          placeholder="Enter quantity"
          required
        />

        <Select
          label="Unit"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          options={units}
          required
        />

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}