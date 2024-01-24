'use client'
import '../app/globals.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface PortfolioTypes {
  [cryptoId: string]: string
}

export default function Result() {
  const router = useRouter()
  const portfolio = router.query as PortfolioTypes
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(0)

  useEffect(() => {
    const calculateTotalValue = async () => {
      let totalValue = 0
      // Create a comma-separated string of crypto IDs.
      const cryptoIds = Object.keys(portfolio).join(',')

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd`
        )

        if (!response.ok) throw new Error('Failed to fetch cryptocurrency prices')

        const prices = await response.json()

        for (const [cryptoId, quantity] of Object.entries(portfolio)) {
          const price = prices[cryptoId]?.usd
          if (price) {
            totalValue += price * parseFloat(quantity)
          }
        }

        setTotalPortfolioValue(totalValue)
      } catch (error) {
        console.error('Error fetching portfolio value:', error)
      }
    }

    // calculate the total portfolio value if the portfolio is not empty.
    if (Object.keys(portfolio).length > 0) {
      calculateTotalValue()
    }
  }, [portfolio])

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-black text-white">
      <h1 className="text-2xl font-bold">
        Your Portfolio Value: <span className="text-etoroGreen">${totalPortfolioValue}</span>
      </h1>
    </div>
  )
}
