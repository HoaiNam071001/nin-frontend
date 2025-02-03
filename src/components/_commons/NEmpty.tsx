import { Empty } from 'antd';
import React from 'react';

const NEmpty = ({
  description
}: {
  description?: string;  // Description to be displayed when no data is provided.
}) => {

  return (
    <Empty description={description}/>
  );
};

export default NEmpty;
