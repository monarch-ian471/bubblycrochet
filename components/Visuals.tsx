import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// --- Yarn Logo Animation ---
export const YarnLogo: React.FC<{ size?: 'sm' | 'lg', animated?: boolean }> = ({ size = 'lg', animated = false }) => {
  const dim = size === 'lg' ? 80 : 40;
  
  return (
    <div className={`relative flex items-center justify-center ${animated ? 'animate-bounce-slow' : ''}`}>
      <svg width={dim} height={dim} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#fce7f3" />
        <path d="M50 10C35 10 20 25 20 50C20 75 35 90 50 90C65 90 80 75 80 50" stroke="#d946ef" strokeWidth="6" strokeLinecap="round"/>
        <path d="M50 10C65 10 80 25 80 50C80 75 65 90 50 90" stroke="#a21caf" strokeWidth="6" strokeLinecap="round" strokeDasharray="10 10"/>
        <path d="M25 35L75 65" stroke="#7e22ce" strokeWidth="4" strokeLinecap="round"/>
        <path d="M75 35L25 65" stroke="#7e22ce" strokeWidth="4" strokeLinecap="round"/>
      </svg>
      {animated && (
        <div className="absolute -right-2 -bottom-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
        </div>
      )}
    </div>
  );
};

// --- D3 Matrix Visualization ---
interface MatrixProps {
  dataPoints: number;
}

export const MatrixVis: React.FC<MatrixProps> = ({ dataPoints }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 300;
    const svg = d3.select(svgRef.current);
    
    svg.selectAll("*").remove(); // Clear previous

    // Generate random nodes based on "dataPoints"
    const nodes = Array.from({ length: Math.min(dataPoints, 50) }, (_, i) => ({
      id: i,
      r: Math.random() * 5 + 3,
      group: Math.floor(Math.random() * 3)
    }));

    const links = [];
    for (let i = 0; i < nodes.length; i++) {
        if (Math.random() > 0.7) {
            links.push({
                source: i,
                target: Math.floor(Math.random() * nodes.length)
            });
        }
    }

    const colorScale = d3.scaleOrdinal<string>()
        .domain(['0', '1', '2'])
        .range(['#d946ef', '#a855f7', '#ec4899']);

    const simulation = d3.forceSimulation(nodes as any)
      .force("charge", d3.forceManyBody().strength(-20))
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#e9d5ff")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => colorScale(String(d.group)));

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [dataPoints]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100 flex flex-col items-center">
      <h3 className="text-purple-900 font-semibold mb-2 self-start">Traction Matrix</h3>
      <svg ref={svgRef} width="100%" height="300" viewBox="0 0 400 300" className="overflow-visible" />
      <p className="text-xs text-gray-400 mt-2">Real-time interaction nodes</p>
    </div>
  );
};

// --- Framer-like transition utility ---
export const FadeIn: React.FC<{ children: React.ReactNode, delay?: number }> = ({ children, delay = 0 }) => (
  <div className="animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${delay}ms`, opacity: 0 }}>
    {children}
  </div>
);
