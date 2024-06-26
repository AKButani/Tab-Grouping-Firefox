import { useContext, useState } from 'react';
import './AddGroup.css';
import { DarkModeContext } from '../App';

const AddGroup = (props: {onClick: (newGroup: string) => void}) => {
  const [currSearch, setCurrSearch] = useState("");
  const darkMode = useContext(DarkModeContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrSearch(event.target.value);
  };

  const handleSearch = () => {
    props.onClick(currSearch);
    setCurrSearch("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(); // Call handleSearch when Enter key is pressed
    }
  };

  return (
    <div className='add-group-container' style={{backgroundColor: (darkMode.darkMode) ? "#42414d" : "#f9f9fb" }}>
      <input className='add-group-input'
        type="text"
        placeholder="Add Group"
        onChange={handleChange}
        value={currSearch}
        onKeyDown={handleKeyPress}
        style={{ 
          backgroundColor: (darkMode.darkMode) ? "#1c1b22" : "#f0f0f4", 
          color: (darkMode.darkMode) ? "#fbfbfe" : "#15141a",
          width: "75%",
        }}
      />
      <button className={`add-group-button ${(darkMode.darkMode ? 'dark-mode': 'light-mode')}`} onClick={handleSearch}>
        Add
      </button>
    </div>
  );
};

export default AddGroup;
