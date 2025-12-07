import React, { useState } from 'react';
import { ExternalLink, Sparkles, Wrench, BookOpen, ShoppingBag } from 'lucide-react';
import { JourneyResource } from '../../types/types';

interface JourneyProps {
  styles: JourneyResource[];
  tools: JourneyResource[];
  resources: JourneyResource[];
  stores: JourneyResource[];
}

export const Journey: React.FC<JourneyProps> = ({ styles, tools, resources, stores }) => {
  const [activeTab, setActiveTab] = useState<'styles' | 'tools' | 'resources' | 'stores'>('styles');

  const tabs = [
    { id: 'styles' as const, label: 'Crochet Styles & Patterns', icon: Sparkles, data: styles },
    { id: 'tools' as const, label: 'Essential Tools', icon: Wrench, data: tools },
    { id: 'resources' as const, label: 'Learning Resources', icon: BookOpen, data: resources },
    { id: 'stores' as const, label: 'Best Stores', icon: ShoppingBag, data: stores }
  ];

  const activeData = tabs.find(tab => tab.id === activeTab)?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-900 mb-4">
            Your Crochet Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore styles, discover essential tools, learn from the best resources, and find top stores for all your crochet needs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-purple-50 hover:shadow-md'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeData.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-lg">No resources available yet. Check back soon!</p>
            </div>
          ) : (
            activeData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-purple-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Link */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm group/link"
                  >
                    <span>Learn More</span>
                    <ExternalLink size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-3xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-purple-900 mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Browse our handmade collection and find the perfect piece or get inspired to create your own!
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg hover:shadow-xl"
          >
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
};
