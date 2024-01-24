'use client'
import { useEffect, useState, ChangeEvent } from 'react'
import Link from 'next/link'

const cryptoList = [
  { symbol: 'ETH', id: 'ethereum' },
  { symbol: 'BTC', id: 'bitcoin' },
  { symbol: 'ADA', id: 'cardano' },
]

type PortfolioEntry = {
  balance: string
  symbol: string
}

export default function Home() {
  const [inputValue, setInputValue] = useState<string>('1')
  const [selectValue, setSelectValue] = useState<string>('')

  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([])

  // change the selected values of input and select fields to default when the portfolio changes.
  useEffect(() => {
    const availableCryptos = cryptoList.filter(
      (crypto) => !portfolio.some((entry) => entry.symbol === crypto.symbol)
    )

    setSelectValue(availableCryptos[0]?.symbol || '')
    setInputValue('1')
  }, [portfolio])

  // Function to add a new balance to the portfolio.
  const handleAddBalance = () => {
    const newEntry: PortfolioEntry = { balance: inputValue, symbol: selectValue }
    setPortfolio((prevPortfolio) => [...prevPortfolio, newEntry])
    setSelectValue('')
  }

  // Function to remove a balance from the portfolio.
  const handleRemoveBalance = (symbolToRemove: string) => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.filter((entry) => entry.symbol !== symbolToRemove)
    )
  }

  // Generate URL parameters from the portfolio and beautify the URL.
  const beautifyUrlParams = portfolio
    .map((entry) => {
      const cryptoId = cryptoList.find((crypto) => crypto.symbol === entry.symbol)?.id as string
      return `${encodeURIComponent(cryptoId)}=${encodeURIComponent(entry.balance)}`
    })
    .join('&')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="px-2 flex flex-col mb-20">
        <span>- When all crypto items are selected, the `Add a Balance` button will be hidden</span>
        <span>- The `Show result` button appears after adding at least 2 crypto balances.</span>
      </div>

      {/* Display the selected balances here */}
      <div className="space-y-4 w-72">
        {portfolio.map((entry) => (
          <div key={entry.symbol} className="flex justify-between">
            {entry.symbol}: {entry.balance}
            <div
              className="text-white cursor-pointer"
              onClick={() => handleRemoveBalance(entry.symbol)}
            >
              x
            </div>
          </div>
        ))}

        {/* Input and Select Fields  */}
        {cryptoList.length !== portfolio.length && (
          <div className="flex space-x-4 text-black items-center gap-2 align-center">
            <input
              type="number"
              min="1"
              className="p-2 rounded border border-etoroGreen"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            />

            <select
              className="p-2 rounded border border-etoroGreen"
              value={selectValue}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSelectValue(e.target.value)
              }}
            >
              {cryptoList.map((crypto) => (
                <option value={crypto.symbol} key={crypto.symbol}>
                  {crypto.symbol}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Buttons */}
      <button
        type="button"
        onClick={handleAddBalance}
        disabled={cryptoList.length === portfolio.length}
        className="mt-4 px-4 text-black py-2 bg-etoroGreen rounded hover:bg-etoroGreen disabled:opacity-40 disabled:hover:bg-etoroGreen"
      >
        Add a balance
      </button>

      <Link
        aria-disabled={portfolio.length < 2}
        className={`mt-20 px-4 py-2 border-2 text-etoroGreen border-etoroGreen border-style-solid rounded shadow transition-colors text-center block ${portfolio.length < 2 ? 'opacity-40 pointer-events-none' : ''}`}
        href={{ pathname: '/result', query: beautifyUrlParams }}
      >
        Show result
      </Link>
    </div>
  )
}
