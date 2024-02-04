import React, { useState } from 'react';

const AddGroup = (props: {onClick: (newGroup: string) => void}) => {
  let currSearch = "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    currSearch = event.target.value;
  };

  const handleSearch = () => {
    props.onClick(currSearch);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Add Category"
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Add Category</button>
    </div>
  );
};

export default AddGroup;
