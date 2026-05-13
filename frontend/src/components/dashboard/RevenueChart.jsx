import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function RevenueChart({ data }) {
  return (
    <div className='rounded-xl border border-slate-800 bg-slate-900/70 p-5'>
      <h3 className='text-lg font-semibold text-white'>Revenue Analytics</h3>
      <p className='mb-4 mt-1 text-sm text-slate-400'>Monthly revenue trend (dummy data)</p>
      <div className='h-80 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={data}>
            <defs>
              <linearGradient id='revenueGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#10b981' stopOpacity={0.7} />
                <stop offset='95%' stopColor='#10b981' stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#1e293b' />
            <XAxis dataKey='month' stroke='#94a3b8' />
            <YAxis stroke='#94a3b8' />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Area type='monotone' dataKey='revenue' stroke='#10b981' fill='url(#revenueGradient)' strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RevenueChart
