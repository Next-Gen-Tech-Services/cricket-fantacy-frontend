import { useState } from 'react';

export default function MobileTabs({ tabs, activeTab, onTabChange, className = "" }) {
  return (
    <div className={`md:hidden bg-white border-b border-gray-200 ${className}`}>
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 px-4 py-2 mr-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-yellow-400 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.icon && <tab.icon className="inline-block mr-2" size={16} />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MobileCard({ children, className = "", padding = "p-4" }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${padding} ${className}`}>
      {children}
    </div>
  );
}

export function MobileContainer({ children, className = "" }) {
  return (
    <div className={`px-4 py-4 space-y-4 ${className}`}>
      {children}
    </div>
  );
}

export function MobilePageHeader({ title, subtitle, action, className = "" }) {
  return (
    <div className={`md:hidden bg-gradient-to-r from-[#273470] to-[#1e2a5e] text-white px-4 py-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="text-white/80 text-sm mt-1">{subtitle}</p>}
        </div>
        {action && (
          <div className="ml-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}