import React, { useEffect, useRef, useState } from 'react'
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    LineController,
    BarController,
} from "chart.js";

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    LineController,
    BarController
);

const GraphChart = () => {
    const salesChartRef = useRef(null);
  const productViewsChartRef = useRef(null);
  const salesChart = useRef(null);
  const productViewsChart = useRef(null);
  const [viewPeriod, setViewPeriod] = useState('thisWeek');

  useEffect(() => {
    // Destroy existing charts if any
    if (salesChart.current) salesChart.current.destroy();
    if (productViewsChart.current) productViewsChart.current.destroy();

    // Sales Trend Line Chart
    const salesCtx = salesChartRef.current?.getContext('2d');
    if (salesCtx) {
      salesChart.current = new Chart(salesCtx, {
        type: 'line',
        data: {
          labels: ['January', 'March', 'May', 'July', 'September', 'December'],
          datasets: [
            {
              label: 'Current year',
              data: [15, 25, 35, 45, 38, 42],
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: '#8b5cf6',
              pointHoverBorderColor: '#fff',
              pointHoverBorderWidth: 2,
              borderWidth: 2
            },
            {
              label: 'Last year',
              data: [10, 20, 28, 42, 35, 30],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: '#ef4444',
              pointHoverBorderColor: '#fff',
              pointHoverBorderWidth: 2,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#ddd',
              borderWidth: 1,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y + 'k';
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              max: 60,
              ticks: {
                callback: (value) => value + 'k'
              }
            }
          }
        }
      });
    }

    // Product Views Bar Chart
    const viewsCtx = productViewsChartRef.current?.getContext('2d');
    if (viewsCtx) {
      const thisWeekData = [35, 42, 28, 45, 38, 32, 48, 35, 42, 45, 52, 48];
      const lastWeekData = [28, 35, 25, 38, 32, 28, 40, 30, 35, 38, 45, 42];
      
      productViewsChart.current = new Chart(viewsCtx, {
        type: 'bar',
        data: {
          labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ],
          datasets: [
            {
              label: viewPeriod === 'thisWeek' ? 'This Week' : 'Last Week',
              data: viewPeriod === 'thisWeek' ? thisWeekData : lastWeekData,
              backgroundColor: viewPeriod === 'thisWeek' ? '#8b5cf6' : '#ef4444'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              max: 60,
              ticks: {
                callback: (value) => value + 'k'
              }
            }
          }
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (salesChart.current) salesChart.current.destroy();
      if (productViewsChart.current) productViewsChart.current.destroy();
    };
  }, [viewPeriod]);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Sales Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Sales Trend</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-600">Current year</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Last year</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <canvas ref={salesChartRef}></canvas>
            </div>
          </div>

          {/* Product Views Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Product Views</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewPeriod('thisWeek')}
                  className={`text-xs px-3 py-1 rounded-md transition-colors ${
                    viewPeriod === 'thisWeek' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  This Week
                </button>
                <button 
                  onClick={() => setViewPeriod('lastWeek')}
                  className={`text-xs px-3 py-1 rounded-md transition-colors ${
                    viewPeriod === 'lastWeek' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Last Week
                </button>
              </div>
            </div>
            <div className="h-64">
              <canvas ref={productViewsChartRef}></canvas>
            </div>
          </div>
        </div> 
    </div>
  )
}

export default GraphChart