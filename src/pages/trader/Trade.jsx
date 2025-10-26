import { useState, useEffect } from 'react'
import { Clock, CheckCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Loader from '../../components/common/Loader'
import ContractCard from '../../components/contracts/ContractCard'
import { api } from '../../utils/api'

export default function TraderTrade() {
  const [activeContracts, setActiveContracts] = useState([])
  const [pendingContracts, setPendingContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending') // 'pending' or 'active'

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = async () => {
    try {
      const [activeData, pendingData] = await Promise.all([
        api.getActiveContracts('trader'),
        api.getPendingContracts('trader'),
      ])
      
      setActiveContracts(activeData.contracts || [])
      setPendingContracts(pendingData.contracts || [])
    } catch (error) {
      // Error handled by api.js
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptContract = async (contractId) => {
    try {
      await api.acceptContractByTrader(contractId)
      await loadContracts()
    } catch (error) {
      // Error handled by api.js
    }
  }

  const handleRejectContract = async (contractId) => {
    try {
      await api.rejectContract(contractId, 'Price not acceptable')
      await loadContracts()
    } catch (error) {
      // Error handled by api.js
    }
  }

  const handleCancelContract = async (contractId) => {
    try {
      await api.cancelContract(contractId)
      await loadContracts()
    } catch (error) {
      // Error handled by api.js
    }
  }

  const handleCompleteContract = async (contractId) => {
    try {
      await api.completeContract(contractId, 'trader')
      await loadContracts()
    } catch (error) {
      // Error handled by api.js
    }
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
        <h1 className="text-3xl font-bold text-gray-900">My Contracts</h1>
        <p className="text-gray-600 mt-1">Manage your trading contracts</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'pending'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Clock size={18} />
            <span>Pending ({pendingContracts.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'active'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle size={18} />
            <span>Active ({activeContracts.length})</span>
          </div>
        </button>
      </div>

      {/* Pending Contracts */}
      {activeTab === 'pending' && (
        <div>
          {pendingContracts.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No pending contracts</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingContracts.map((contract) => (
                <ContractCard
                  key={contract._id}
                  contract={contract}
                  userType="trader"
                  onAccept={handleAcceptContract}
                  onReject={handleRejectContract}
                  onCancel={handleCancelContract}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Contracts */}
      {activeTab === 'active' && (
        <div>
          {activeContracts.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No active contracts yet</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeContracts.map((contract) => (
                <ContractCard
                  key={contract._id}
                  contract={contract}
                  userType="trader"
                  onComplete={handleCompleteContract}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}