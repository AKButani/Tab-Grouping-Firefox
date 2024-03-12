import React, { useContext } from 'react';
import './AddGroup.css';
import { DarkModeContext } from '../App';

const AddGroup = (props: {onClick: (newGroup: string) => void}) => {
  let currSearch = "";
  const darkMode = useContext(DarkModeContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    currSearch = event.target.value;
  };

  const handleSearch = () => {
    props.onClick(currSearch);
    currSearch = "";
  };

  return (
    <div className='add-group-container' style={{backgroundColor: (darkMode.darkMode) ? "#42414d" : "#f9f9fb" }}>
      <input className='add-group-input'
        type="text"
        placeholder="Add Group"
        onChange={handleChange}
        style={{ 
          width: '75%', 
          border: 'none', 
          backgroundColor: (darkMode.darkMode) ? "#1c1b22" : "#f0f0f4", 
          color: (darkMode.darkMode) ? "#fbfbfe" : "#15141a", 
          fontSize: '1em' }}
      />
      <button className='add-group-button' onClick={handleSearch}>Add Group</button>
    </div>
  );
};

export default AddGroup;
