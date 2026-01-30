import { useState } from "react";

interface TabContent {
  label: string;
  content: React.ReactNode;
}

interface ServiceDetailTabsProps {
  tabs: TabContent[];
  className?: string;
}

export const ServiceDetailTabs = ({ tabs, className = "" }: ServiceDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={className}>
      {/* Tab Buttons - Full width matching content cards (max-w-6xl) */}
      <div className="w-full max-w-6xl mx-auto mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(index)}
              className={`px-3 py-2.5 rounded-lg font-bebas text-xs md:text-sm tracking-wider transition-all duration-200 text-center ${
                index === activeTab
                  ? 'bg-accent text-black'
                  : 'bg-black/40 border border-white/20 hover:border-accent/50 text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-opacity duration-300">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default ServiceDetailTabs;
