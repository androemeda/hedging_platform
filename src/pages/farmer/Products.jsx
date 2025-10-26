import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loader from '../../components/common/Loader';
import ProductCard from '../../components/products/ProductCard';
import AddProductModal from '../../components/products/AddProductModal';
import ContractDetailsModal from '../../components/contracts/ContractDetailsModal';
import { api } from '../../utils/api';

export default function FarmerProducts() {
  const [products, setProducts] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [showContractsModal, setShowContractsModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, pricesData] = await Promise.all([
        api.getFarmerProducts(),
        api.getCurrentPrices(),
      ]);

      setProducts(productsData.products || []);

      const pricesMap = {};
      pricesData.prices?.forEach((p) => {
        pricesMap[p.product_type] = p.price;
      });
      setCurrentPrices(pricesMap);
    } catch (error) {
      // Error handled by api.js
    } finally {
      setLoading(false);
    }
  };

  const handleViewContracts = async (productId) => {
    try {
      const data = await api.getProductContracts(productId);
      setSelectedContracts(data.contracts || []);
      setShowContractsModal(true);
    } catch (error) {
      // Error handled by api.js
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-1">Manage your oilseed inventory</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              You haven't listed any products yet
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus size={20} className="mr-2" />
              Add Your First Product
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              currentPrice={currentPrices[product.type]}
              onViewContracts={handleViewContracts}
            />
          ))}
        </div>
      )}

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadData}
      />

      {/* Contracts Modal */}
      {showContractsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setShowContractsModal(false)}
            />
            <div className="relative bg-white rounded-lg max-w-4xl w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Product Contracts</h3>
              {selectedContracts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No contracts for this product
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedContracts.map((contract) => (
                    <div
                      key={contract._id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">
                            {contract.trader?.name || 'Pending'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {contract.qty} {contract.unit} @ ₹
                            {contract.price_per_unit}/{contract.unit}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            contract.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : contract.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {contract.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Button
                  onClick={() => setShowContractsModal(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
