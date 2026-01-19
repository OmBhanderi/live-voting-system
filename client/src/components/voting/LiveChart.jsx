import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatChartData, getTotalVotes, calculatePercentage, getChartColor } from '../../utils/chartHelpers';

const LiveChart = ({ poll, liveData }) => {
  const [chartData, setChartData] = useState([]);
  const totalVotes = getTotalVotes(poll.options);

  useEffect(() => {
    // Use live data if available, otherwise use poll data
    const options = liveData?.options || poll.options;
    setChartData(formatChartData(options));
  }, [poll, liveData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = calculatePercentage(data.votes, totalVotes);
      
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.votes} votes ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Live Results</h3>
        <div className="text-sm text-gray-600">
          Total: <span className="font-bold text-blue-600">{totalVotes}</span> votes
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
            {chartData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getChartColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Detailed breakdown */}
      <div className="space-y-2">
        {chartData?.map((option, index) => {
          const percentage = calculatePercentage(option.votes, totalVotes);
          return (
            <div key={option.id} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: getChartColor(index) }}
              ></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {option.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {option.votes} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getChartColor(index),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveChart;