import { ImageResponse } from 'next/og'
import { TAX_YEAR } from '@/lib/us-tax-calculator'

export const runtime = 'edge'

export const alt = 'US Salary Calculator - Calculate Your Take Home Pay'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -100,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          }}
        />

        {/* Tax Year Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 24px',
            borderRadius: '9999px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            marginBottom: '24px',
          }}
        >
          <span style={{ color: 'white', fontSize: '24px', fontWeight: 700 }}>
            {TAX_YEAR} Tax Year
          </span>
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 800,
            color: 'white',
            margin: 0,
            lineHeight: 1.1,
            marginBottom: '16px',
          }}
        >
          US Salary Calculator
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '32px',
            color: '#94a3b8',
            margin: 0,
            marginBottom: '40px',
          }}
        >
          Calculate Your Take Home Pay Instantly
        </p>

        {/* Feature Tags */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          {['Federal Tax', 'State Tax', 'Social Security', '401(k)'].map(
            (feature, i) => (
              <div
                key={feature}
                style={{
                  display: 'flex',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <span
                  style={{
                    color: ['#3b82f6', '#8b5cf6', '#22c55e', '#f97316'][i],
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                >
                  {feature}
                </span>
              </div>
            )
          )}
        </div>

        {/* Sample Calculation */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px 32px',
            gap: '48px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#64748b', fontSize: '16px', marginBottom: '8px' }}>
              Annual Salary
            </span>
            <span style={{ color: 'white', fontSize: '36px', fontWeight: 700 }}>
              $75,000
            </span>
          </div>
          <div
            style={{
              width: '1px',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#64748b', fontSize: '16px', marginBottom: '8px' }}>
              Take Home Pay
            </span>
            <span style={{ color: '#22c55e', fontSize: '36px', fontWeight: 700 }}>
              $56,250/year
            </span>
          </div>
        </div>

        {/* URL */}
        <p
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            color: '#64748b',
            fontSize: '20px',
            margin: 0,
          }}
        >
          calculatesalary.us
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
}
