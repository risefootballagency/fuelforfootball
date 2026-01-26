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
      {/* Tab Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(index)}
            className={`px-5 py-2.5 rounded-lg font-bebas text-sm md:text-base tracking-wider transition-all duration-200 ${
              index === activeTab
                ? 'bg-accent text-black'
                : 'bg-black/40 border border-white/20 hover:border-accent/50 text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="transition-opacity duration-300">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default ServiceDetailTabs;
