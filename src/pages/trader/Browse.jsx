import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Loader from '../../components/common/Loader'
import CreateContractModal from '../../components/contracts/CreateContractModal'
import { api } from '../../utils/api'
import { formatCurrency, getProductColor } from '../../utils/helpers'

export default function TraderBrowse() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    minQty: '',
  })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const productTypes = [
    { value: '', label: 'All Products' },
    { value: 'Soybean', label: 'Soybean' },
    { value: 'Sunflower', label: 'Sunflower' },
    { value: 'Groundnut', label: 'Groundnut' },
    { value: 'Mustard', label: 'Mustard' },
    { value: 'Sesame', label: 'Sesame' },
  ]

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, products])

  const loadProducts = async () => {
    try {
      const data = await api.getAvailableProducts()
      setProducts(data.products || [])
      setFilteredProducts(data.products || [])
    } catch (error) {
      // Error handled by api.js
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type)
    }

    if (filters.minQty) {
      filtered = filtered.filter(p => p.available_qty >= parseFloat(filters.minQty))
    }

    setFilteredProducts(filtered)
  }

  const handleCreateContract = (product) => {
    setSelectedProduct(product)
    setShowCreateModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Browse Products</h1>
        <p className="text-gray-600 mt-1">Find oilseeds available for trading</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Product Type"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            options={productTypes}
          />
          <Input
            label="Minimum Quantity (kg)"
            type="number"
            value={filters.minQty}
            onChange={(e) => setFilters({ ...filters, minQty: e.target.value })}
            placeholder="e.g., 100"
          />
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => setFilters({ type: '', minQty: '' })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredProducts.length} products
        </p>

        {filteredProducts.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No products found matching your filters</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product._id}>
                <div className="space-y-4">
                  {/* Product Header */}
                  <div className="flex items-start justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProductColor(product.type)}`}>
                      {product.type}
                    </span>
                    {product.current_market_price && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Market Price</p>
                        <p className="text-sm font-bold text-primary-600">
                          {formatCurrency(product.current_market_price)}/kg
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Farmer Info */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Farmer</p>
                    <p className="font-semibold text-gray-900">{product.farmer.name}</p>
                    <p className="text-sm text-gray-600">{product.farmer.location}</p>
                  </div>

                  {/* Quantity */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Available Quantity</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {product.available_qty} {product.unit}
                    </p>
                  </div>

                  {/* Pending Contracts Info */}
                  {product.pending_contracts_count > 0 && (
                    <div className="text-sm text-yellow-600">
                      {product.pending_contracts_count} pending contract(s)
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={() => handleCreateContract(product)}
                    className="w-full"
                  >
                    Create Contract
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <CreateContractModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            setSelectedProduct(null)
          }}
          onSuccess={() => {
            loadProducts()
            setShowCreateModal(false)
            setSelectedProduct(null)
          }}
          userType="trader"
          productId={selectedProduct._id}
          farmerId={selectedProduct.farmer._id}
          productType={selectedProduct.type}
          availableQty={selectedProduct.available_qty}
        />
      )}
    </div>
  )
}