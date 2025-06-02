"use client";

import { useState, useEffect } from "react";

type ConversionMode = "USD_TO_COP" | "COP_TO_USD";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("");
  const [mode, setMode] = useState<ConversionMode>("USD_TO_COP");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // No longer loading mode from localStorage

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

  // Recalculate result on keypress or when exchangeRate/mode changes
  useEffect(() => {
    calculateResult(amount, mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, mode, exchangeRate]);

  const handleAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      calculateResult(value, mode);
    }
  };

  const calculateResult = (
    inputAmount: string,
    currentMode: ConversionMode
  ) => {
    if (!exchangeRate || !inputAmount) {
      setResult("");
      return;
    }

    const numericAmount = parseFloat(inputAmount);
    if (isNaN(numericAmount)) {
      setResult("");
      return;
    }

    const calculatedResult =
      currentMode === "USD_TO_COP"
        ? (numericAmount * exchangeRate).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })
        : (numericAmount / exchangeRate).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          });

    setResult(calculatedResult);
  };

  const multiplyAmount = (multiplier: number) => {
    if (!amount) return;
    const newAmount = (parseFloat(amount) * multiplier).toString();
    setAmount(newAmount);
    calculateResult(newAmount, mode);
  };

  const toggleMode = () => {
    const newMode = mode === "USD_TO_COP" ? "COP_TO_USD" : "USD_TO_COP";
    setMode(newMode);
    calculateResult(amount, newMode);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Currency Converter: {mode === "USD_TO_COP" ? "USD → COP" : "COP → USD"}
      </h1>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2 text-gray-500">
            {mode === "USD_TO_COP" ? "USD" : "COP"}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => multiplyAmount(1000)}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            × 1,000
          </button>
          <button
            onClick={() => multiplyAmount(1000000)}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            × 1,000,000
          </button>
        </div>

        <button
          onClick={toggleMode}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Switch Direction
        </button>

        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">Result:</p>
          <p className="text-xl font-semibold">
            {result
              ? `${result} ${mode === "USD_TO_COP" ? "COP" : "USD"}`
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
