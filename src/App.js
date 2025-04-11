import React, { useState, useEffect } from 'react';

const InvestmentCalculator = () => {
  const [totalAmount, setTotalAmount] = useState(75000);
  const [weeksToInvest, setWeeksToInvest] = useState(12); // 3 months = ~12 weeks
  
  // Initial stock allocation data
  const initialSectors = [
    {
      name: "Health",
      allocation: 0.20,
      stocks: [
        { ticker: "LLY", allocation: 0.25 },
        { ticker: "UNH", allocation: 0.25 },
        { ticker: "NVO", allocation: 0.25 },
        { ticker: "MRK", allocation: 0.25 }
      ]
    },
    {
      name: "Finance",
      allocation: 0.10,
      stocks: [
        { ticker: "BRK.B", allocation: 0.25 },
        { ticker: "BLK", allocation: 0.25 },
        { ticker: "GS", allocation: 0.25 },
        { ticker: "JPM", allocation: 0.25 }
      ]
    },
    {
      name: "Tech",
      allocation: 0.30,
      stocks: [
        { ticker: "NVDA", allocation: 0.12 },
        { ticker: "MSFT", allocation: 0.12 },
        { ticker: "TSM", allocation: 0.12 },
        { ticker: "AAPL", allocation: 0.12 },
        { ticker: "AMD", allocation: 0.08 },
        { ticker: "META", allocation: 0.12 },
        { ticker: "AMZN", allocation: 0.16 },
        { ticker: "NFLX", allocation: 0.06 },
        { ticker: "GOOGL", allocation: 0.08 }
      ]
    },
    {
      name: "Energy",
      allocation: 0.10,
      stocks: [
        { ticker: "XOM", allocation: 0.33 },
        { ticker: "CVX", allocation: 0.33 },
        { ticker: "SHEL", allocation: 0.33 }
      ]
    },
    {
      name: "Communications",
      allocation: 0.10,
      stocks: [
        { ticker: "CMCSA", allocation: 0.34 },
        { ticker: "TMUS", allocation: 0.33 },
        { ticker: "T", allocation: 0.33 }
      ]
    },
    {
      name: "Consumer",
      allocation: 0.10,
      stocks: [
        { ticker: "COST", allocation: 0.30 },
        { ticker: "WMT", allocation: 0.20 },
        { ticker: "HD", allocation: 0.20 },
        { ticker: "PG", allocation: 0.15 },
        { ticker: "KO", allocation: 0.15 }
      ]
    },
    {
      name: "Defense",
      allocation: 0.05,
      stocks: [
        { ticker: "NOC", allocation: 0.34 },
        { ticker: "LMT", allocation: 0.33 },
        { ticker: "GD", allocation: 0.33 }
      ]
    },
    {
      name: "Metals",
      allocation: 0.05,
      stocks: [
        { ticker: "GLD", allocation: 1.0 }
      ]
    }
  ];
  
  const [sectors, setSectors] = useState(initialSectors);
  const [editingSectorIndex, setEditingSectorIndex] = useState(null);
  const [editingStockIndex, setEditingStockIndex] = useState(null);
  const [showAllocationWarning, setShowAllocationWarning] = useState(false);

  // Check if sector allocations sum to 100%
  useEffect(() => {
    const totalAllocation = sectors.reduce((sum, sector) => sum + sector.allocation, 0);
    setShowAllocationWarning(Math.abs(totalAllocation - 1) > 0.01);
  }, [sectors]);
  
  // Check if stock allocations within each sector sum to 100%
  const validateStockAllocations = (sectorIndex) => {
    const sector = sectors[sectorIndex];
    if (!sector) return false;
    
    const totalStockAllocation = sector.stocks.reduce((sum, stock) => sum + stock.allocation, 0);
    return Math.abs(totalStockAllocation - 1) > 0.01;
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatPercent = (value) => {
    return (value * 100).toFixed(1) + '%';
  };

  // Handle sector allocation changes
  const updateSectorAllocation = (index, newAllocation) => {
    const updatedSectors = [...sectors];
    updatedSectors[index] = {
      ...updatedSectors[index],
      allocation: parseFloat(newAllocation) || 0
    };
    setSectors(updatedSectors);
  };
  
  // Handle stock allocation changes within a sector
  const updateStockAllocation = (sectorIndex, stockIndex, newAllocation) => {
    const updatedSectors = [...sectors];
    updatedSectors[sectorIndex].stocks[stockIndex] = {
      ...updatedSectors[sectorIndex].stocks[stockIndex],
      allocation: parseFloat(newAllocation) || 0
    };
    setSectors(updatedSectors);
  };
  
  // Handle ticker symbol changes
  const updateStockTicker = (sectorIndex, stockIndex, newTicker) => {
    const updatedSectors = [...sectors];
    updatedSectors[sectorIndex].stocks[stockIndex] = {
      ...updatedSectors[sectorIndex].stocks[stockIndex],
      ticker: newTicker
    };
    setSectors(updatedSectors);
  };
  
  // Add a new stock to a sector
  const addStockToSector = (sectorIndex) => {
    const updatedSectors = [...sectors];
    updatedSectors[sectorIndex].stocks.push({
      ticker: "NEW",
      allocation: 0
    });
    setSectors(updatedSectors);
  };
  
  // Remove a stock from a sector
  const removeStockFromSector = (sectorIndex, stockIndex) => {
    const updatedSectors = [...sectors];
    updatedSectors[sectorIndex].stocks.splice(stockIndex, 1);
    setSectors(updatedSectors);
  };

  const calculateWeeklyInvestments = () => {
    const weeklyTotal = totalAmount / weeksToInvest;
    
    let results = [];
    
    sectors.forEach(sector => {
      const sectorWeeklyAmount = weeklyTotal * sector.allocation;
      
      sector.stocks.forEach(stock => {
        const stockWeeklyAmount = sectorWeeklyAmount * stock.allocation;
        const totalStockAmount = stockWeeklyAmount * weeksToInvest;
        
        results.push({
          sector: sector.name,
          ticker: stock.ticker,
          weeklyAmount: stockWeeklyAmount,
          totalAmount: totalStockAmount,
          sectorAllocation: sector.allocation * 100,
          stock_in_sector: stock.allocation * 100
        });
      });
    });
    
    return results;
  };

  const investments = calculateWeeklyInvestments();
  
  return (
    <div className="p-4 max-w-full">
      <h1 className="text-2xl font-bold mb-4">Weekly Investment Calculator</h1>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="mb-4 md:mb-0">
          <label className="block text-sm font-medium mb-1">Total Investment Amount ($)</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Math.max(0, Number(e.target.value)))}
            className="border rounded p-2 w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Weeks to Invest (3 months ≈ 12 weeks)</label>
          <input
            type="number"
            value={weeksToInvest}
            onChange={(e) => setWeeksToInvest(Number(e.target.value))}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>
      
      {showAllocationWarning && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
          Warning: Sector allocations do not sum to 100%. The current total is {formatPercent(sectors.reduce((sum, sector) => sum + sector.allocation, 0))}.
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Sector Allocations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 border-b text-left">Sector</th>
                <th className="py-2 px-3 border-b text-left">Allocation (%)</th>
                <th className="py-2 px-3 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((sector, sIndex) => (
                <tr key={sIndex} className={sIndex % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-2 px-3 border-b font-medium">{sector.name}</td>
                  <td className="py-2 px-3 border-b">
                    <input
                      type="number"
                      value={sector.allocation * 100}
                      onChange={(e) => updateSectorAllocation(sIndex, e.target.value / 100)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="border rounded p-1 w-20"
                    />
                    %
                  </td>
                  <td className="py-2 px-3 border-b">
                    <button
                      onClick={() => setEditingSectorIndex(editingSectorIndex === sIndex ? null : sIndex)}
                      className="mr-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      {editingSectorIndex === sIndex ? 'Hide' : 'Edit'} Stocks
                    </button>
                    {validateStockAllocations(sIndex) && editingSectorIndex === sIndex && (
                      <span className="text-red-500 text-sm">
                        Stock allocations don't add up to 100%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td className="py-2 px-3 border-b">Total</td>
                <td className="py-2 px-3 border-b">
                  {formatPercent(sectors.reduce((sum, sector) => sum + sector.allocation, 0))}
                </td>
                <td className="py-2 px-3 border-b"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {editingSectorIndex !== null && (
          <div className="mb-6 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-bold mb-2">{sectors[editingSectorIndex].name} Stocks</h3>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 border-b text-left">Ticker</th>
                  <th className="py-2 px-3 border-b text-left">Allocation in Sector (%)</th>
                  <th className="py-2 px-3 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sectors[editingSectorIndex].stocks.map((stock, stIndex) => (
                  <tr key={stIndex}>
                    <td className="py-2 px-3 border-b">
                      <input
                        type="text"
                        value={stock.ticker}
                        onChange={(e) => updateStockTicker(editingSectorIndex, stIndex, e.target.value)}
                        className="border rounded p-1 w-24"
                      />
                    </td>
                    <td className="py-2 px-3 border-b">
                      <input
                        type="number"
                        value={stock.allocation * 100}
                        onChange={(e) => updateStockAllocation(editingSectorIndex, stIndex, e.target.value / 100)}
                        min="0"
                        max="100"
                        step="0.1"
                        className="border rounded p-1 w-20"
                      />
                      %
                    </td>
                    <td className="py-2 px-3 border-b">
                      <button
                        onClick={() => removeStockFromSector(editingSectorIndex, stIndex)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                        title="Remove stock"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td className="py-2 px-3 border-b">Total</td>
                  <td className="py-2 px-3 border-b">
                    {formatPercent(sectors[editingSectorIndex].stocks.reduce((sum, stock) => sum + stock.allocation, 0))}
                  </td>
                  <td className="py-2 px-3 border-b">
                    <button
                      onClick={() => addStockToSector(editingSectorIndex)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                    >
                      Add Stock
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
      
      <h2 className="text-xl font-bold mb-3">Weekly Investment Plan</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 border-b text-left">Sector</th>
              <th className="py-2 px-3 border-b text-left">Ticker</th>
              <th className="py-2 px-3 border-b text-left">Sector %</th>
              <th className="py-2 px-3 border-b text-left">Stock in Sector %</th>
              <th className="py-2 px-3 border-b text-right">Weekly Investment</th>
              <th className="py-2 px-3 border-b text-right">Total Investment</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-3 border-b">{item.sector}</td>
                <td className="py-2 px-3 border-b font-medium">{item.ticker}</td>
                <td className="py-2 px-3 border-b">{item.sectorAllocation.toFixed(1)}%</td>
                <td className="py-2 px-3 border-b">{item.stock_in_sector.toFixed(1)}%</td>
                <td className="py-2 px-3 border-b text-right">{formatCurrency(item.weeklyAmount)}</td>
                <td className="py-2 px-3 border-b text-right">{formatCurrency(item.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td colSpan="4" className="py-2 px-3 border-b text-right">Total Weekly Investment:</td>
              <td className="py-2 px-3 border-b text-right">{formatCurrency(totalAmount / weeksToInvest)}</td>
              <td className="py-2 px-3 border-b text-right">{formatCurrency(totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Summary</h2>
        <p>This plan divides your ${totalAmount.toLocaleString()} investment over {weeksToInvest} weeks.</p>
        <p>Weekly investment amount: {formatCurrency(totalAmount / weeksToInvest)}</p>
      </div>
    </div>
  );
};

export default InvestmentCalculator;