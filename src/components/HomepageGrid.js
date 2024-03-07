import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const HomepageGrid = () => {
  // Define the layout configuration for each grid item
  const layoutConfig = [
    { i: 'item1', x: 0, y: 0, w: 6, h: 16 },
    { i: 'item2', x: 6, y: 0, w: 6, h: 16 },
  ];

  const gridItemStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  };

  return (
    <GridLayout className="example-layout" layout={layoutConfig} cols={12} rowHeight={30} width={1920}>
      <div key="item1" style={{ ...gridItemStyle, background: '#ff4d4f' }}>Item 1</div>
      <div key="item2" style={{ ...gridItemStyle, background: '#40a9ff' }}>Item 2</div>
    </GridLayout>
  );
};

export default HomepageGrid;