"use client";

import { useState, useEffect } from "react";

type ConversionMode = "USD_TO_COP" | "COP_TO_USD";

export default function CurrencyConverter() {
  const [usdAmount, setUsdAmount] = useState<string>("");
  const [copAmount, setCopAmount] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [usdToCopResult, setUsdToCopResult] = useState<string>("");
  const [copToUsdResult, setCopToUsdResult] = useState<string>("");

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("/api/exchange-rate");
        const data = await response.json();
        if (data && typeof data.rate === "number") {
          setExchangeRate(data.rate);
        } else {
          console.error("Unexpected exchange rate API response:", data);
          setExchangeRate(null);
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        setExchangeRate(null);
      }
    };
    fetchExchangeRate();
  }, []);

  // USD to COP calculation
  useEffect(() => {
    if (!exchangeRate || !usdAmount) {
      setUsdToCopResult("");
      return;
    }
    const numericAmount = parseFloat(usdAmount);
    if (isNaN(numericAmount)) {
      setUsdToCopResult("");
      return;
    }
    setUsdToCopResult((numericAmount * exchangeRate).toLocaleString("en-US", { maximumFractionDigits: 2 }));
  }, [usdAmount, exchangeRate]);

  // COP to USD calculation
  useEffect(() => {
    if (!exchangeRate || !copAmount) {
      setCopToUsdResult("");
      return;
    }
    const numericAmount = parseFloat(copAmount);
    if (isNaN(numericAmount)) {
      setCopToUsdResult("");
      return;
    }
    setCopToUsdResult((numericAmount / exchangeRate).toLocaleString("en-US", { maximumFractionDigits: 2 }));
  }, [copAmount, exchangeRate]);

  const handleUsdAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setUsdAmount(value);
    }
  };

  const handleCopAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCopAmount(value);
    }
  };

  const multiplyCopAmount = (multiplier: number) => {
    if (!copAmount) return;
    const newAmount = (parseFloat(copAmount) * multiplier).toString();
    setCopAmount(newAmount);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Currency Converter</h1>

      {/* USD to COP Card */}
      <div className="bg-white rounded-lg shadow p-3 mb-2">
        <h2 className="text-base font-semibold mb-2 text-blue-700">USD to COP</h2>
        <div className="mb-2">
          <input
            type="text"
            value={usdAmount}
            onChange={e => handleUsdAmountChange(e.target.value)}
            placeholder="Enter USD amount"
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="bg-gray-50 rounded-md p-2 mt-1">
          <p className="text-xs text-gray-600">COP</p>
          <p className="text-base font-semibold">{usdToCopResult ? `${usdToCopResult} COP` : '-'}</p>
        </div>
      </div>

      {/* COP to USD Card */}
      <div className="bg-white rounded-lg shadow p-3">
        <h2 className="text-base font-semibold mb-2 text-green-700">COP to USD</h2>
        <div className="mb-2">
          <input
            type="text"
            value={copAmount}
            onChange={e => handleCopAmountChange(e.target.value)}
            placeholder="Enter COP amount"
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
          />
        </div>
        <div className="flex gap-1 mb-2">
          <button
            onClick={() => multiplyCopAmount(1000)}
            className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-xs"
          >
            × 1,000
          </button>
          <button
            onClick={() => multiplyCopAmount(1000000)}
            className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-xs"
          >
            × 1,000,000
          </button>
        </div>
        <div className="bg-gray-50 rounded-md p-2">
          <p className="text-xs text-gray-600">USD</p>
          <p className="text-base font-semibold">{copToUsdResult ? `${copToUsdResult} USD` : '-'}</p>
        </div>
      </div>
    </div>
  );
}
