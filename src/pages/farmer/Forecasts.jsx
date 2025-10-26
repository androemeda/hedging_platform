import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import Loader from '../../components/common/Loader'
import PriceChart from '../../components/charts/PriceChart'
import ForecastChart from '../../components/charts/ForecastChart'
import { api } from '../../utils/api'
import { formatCurrency } from '../../utils/helpers'

export default function FarmerForecasts() {
  const [selectedProduct, setSelectedProduct] = useState('Soybean')
  const [priceHistory, setPriceHistory] = useState([])
  const [forecasts, setForecasts] = useState([])
  const [currentPrice, setCurrentPrice] = useState(null)
  const [loading, setLoading] = useState(true)

  const productOptions = [
    { value: 'Soybean', label: 'Soybean' },
    { value: 'Sunflower', label: 'Sunflower' },
    { value: 'Groundnut', label: 'Groundnut' },
    { value: 'Mustard', label: 'Mustard' },
    { value: 'Sesame', label: 'Sesame' },
  ]

  useEffect(() => {
    loadData()
  }, [selectedProduct])

  const loadData = async () => {
    setLoading(true)
    try {
      const [historyData, forecastData, pricesData] = await Promise.all([
        api.getPriceHistory(selectedProduct, 90),
        api.getForecasts(selectedProduct, 45),
        api.getCurrentPrices(selectedProduct),
      ])

      setPriceHistory(historyData.history || [])
      
      const productForecast = forecastData.forecasts?.find(f => f.product_type === selectedProduct)
      setForecasts(productForecast?.predictions || [])
      
      const productPrice = pricesData.prices?.find(p => p.product_type === selectedProduct)
      setCurrentPrice(productPrice?.price || null)
    } catch (error) {
      // Error handled by api.js
    } finally {
      setLoading(false)
    }
  }

  // Calculate price change
  const getPriceChange = () => {
    if (!priceHistory || priceHistory.length < 2) return null
    const oldPrice = priceHistory[0].price
    const newPrice = priceHistory[priceHistory.length - 1].price
    const change = ((newPrice - oldPrice) / oldPrice) * 100
    return {
      value: change,
      isPositive: change > 0,
    }
  }

  const priceChange = getPriceChange()

  // Get predicted price for next 30 days
  const getPredictedPrice = () => {
    if (!forecasts || forecasts.length === 0) return null
    const futurePrice = forecasts[29] || forecasts[forecasts.length - 1]
    return futurePrice?.predicted_price
  }

  const predictedPrice = getPredictedPrice()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Price Forecasts</h1>
          <p className="text-gray-600 mt-1">AI-powered price predictions</p>
        </div>
        <div className="w-64">
          <Select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            options={productOptions}
          />
        </div>
      </div>

      {/* Current Price & Prediction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Current Price</p>
            <p className="text-4xl font-bold text-gray-900">
              {currentPrice ? formatCurrency(currentPrice) : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">per kg</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">90-Day Change</p>
            <div className="flex items-center justify-center space-x-2">
              <p className={`text-4xl font-bold ${priceChange?.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange ? `${priceChange.isPositive ? '+' : ''}${priceChange.value.toFixed(2)}%` : 'N/A'}
              </p>
              {priceChange && (
                priceChange.isPositive ? (
                  <TrendingUp className="text-green-600" size={32} />
                ) : (
                  <TrendingDown className="text-red-600" size={32} />
                )
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Predicted (30 days)</p>
            <p className="text-4xl font-bold text-primary-600">
              {predictedPrice ? formatCurrency(predictedPrice) : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">per kg</p>
          </div>
        </Card>
      </div>

      {/* Historical Prices */}
      <Card title="Price History (Last 90 Days)">
        {priceHistory.length > 0 ? (
          <PriceChart data={priceHistory} productType={selectedProduct} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            No historical data available
          </div>
        )}
      </Card>

      {/* Forecast Chart */}
      <Card title="Price Forecast (Next 45 Days)">
        {forecasts.length > 0 ? (
          <ForecastChart data={forecasts} productType={selectedProduct} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            No forecast data available
          </div>
        )}
      </Card>

      {/* Insights */}
      <Card title="Market Insights">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📊 Historical Analysis</h4>
            <p className="text-sm text-blue-800">
              {priceChange?.isPositive ? (
                <>
                  Prices have increased by <strong>{priceChange.value.toFixed(2)}%</strong> over the last 90 days. 
                  This indicates a bullish market trend for {selectedProduct}.
                </>
              ) : priceChange ? (
                <>
                  Prices have decreased by <strong>{Math.abs(priceChange.value).toFixed(2)}%</strong> over the last 90 days. 
                  Consider hedging to protect against further decline.
                </>
              ) : (
                'Insufficient historical data for analysis.'
              )}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">🔮 Forecast Insight</h4>
            <p className="text-sm text-green-800">
              {predictedPrice && currentPrice ? (
                predictedPrice > currentPrice ? (
                  <>
                    Our AI model predicts prices will increase to <strong>{formatCurrency(predictedPrice)}</strong> in 30 days. 
                    This is a good time to hold inventory and consider creating contracts at higher prices.
                  </>
                ) : (
                  <>
                    Our AI model predicts prices will decrease to <strong>{formatCurrency(predictedPrice)}</strong> in 30 days. 
                    Consider creating hedging contracts now to lock in current prices.
                  </>
                )
              ) : (
                'Enable price forecasting to get AI-powered predictions.'
              )}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">💡 Recommendation</h4>
            <p className="text-sm text-purple-800">
              Based on current market conditions, we recommend actively monitoring prices and creating hedging 
              contracts to minimize risk from price volatility. Consider diversifying your product portfolio 
              across multiple oilseed types.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}