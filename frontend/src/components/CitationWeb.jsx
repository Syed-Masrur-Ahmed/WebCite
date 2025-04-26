import { useMemo } from 'react';
import ForceGraph from 'react-force-graph';

export default function CitationGraph({ data }) {
  const graphData = useMemo(() => {
    if (!data) return { nodes: [], links: [] };
    
    const nodes = [{
      id: 'main',
      name: data.title,
      val: 15,
      color: 'red'
    }];
    
    const links = [];
    
    // Add referenced works
    data.referenced_works?.forEach((ref, i) => {
      nodes.push({
        id: `ref-${i}`,
        name: `Reference ${i+1}`,
        val: 8,
        color: 'blue'
      });
      links.push({
        source: 'main',
        target: `ref-${i}`
      });
    });
    
    return { nodes, links };
  }, [data]);

  return (
    <div style={{ height: '500px', border: '1px solid #ddd' }}>
      <ForceGraph
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="color"
        linkDirectionalArrowLength={3.5}
        width={800}
        height={500}
      />
    </div>
  );
}