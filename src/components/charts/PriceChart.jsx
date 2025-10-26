import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../utils/helpers'

export default function PriceChart({ data, productType }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value) => [formatCurrency(value), 'Price']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#16a34a" 
            strokeWidth={2}
            dot={{ fill: '#16a34a', r: 3 }}
            activeDot={{ r: 5 }}
            name={productType || 'Price'}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}