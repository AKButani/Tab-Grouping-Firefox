import React, { useContext, useRef, useState } from 'react';
import "./TabGroupEntry.css"
import { GroupHeader } from '../GroupHeader/GroupHeader';
import { TabList } from '../TabList/TabList';
import { DarkModeContext } from '../App';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../types';


const TabGroupEntry = (props: {groupName: string, tabs: browser.tabs.Tab[], dropHandler: (tabs: browser.tabs.Tab[], groupName: string ) => void}) => {
    //console.log("in " + props.groupName + " group entry")
    const [isExpanded, setIsExpanded] = useState(false);
    const darkMode = useContext(DarkModeContext);

    const groupNameRef = useRef(props.groupName); // Initialize the ref with the initial groupName

    // Update the ref whenever the groupName prop changes
    React.useEffect(() => {
        groupNameRef.current = props.groupName;
    }, [props.groupName]);
    

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.tabs,
        drop: (tabs) => (props.dropHandler(((tabs as { tabs: browser.tabs.Tab[]; }).tabs as browser.tabs.Tab[]), groupNameRef.current)),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));

    return (
        <div ref={drop} style={{ backgroundColor: (isOver && canDrop) ? 'grey' : (!darkMode.darkMode) ? /* "#f9f9fb" */ "#ffffff": "#42414d", borderRadius: '5px'}} /* style={{backgroundColor: (darkMode.darkMode) ? "#42414d" : "#ffffff", borderRadius: "5px"}} */>
            <GroupHeader groupName={props.groupName} onDrop={props.dropHandler} isExpanded={isExpanded} setIsExpanded={setIsExpanded} tabs={props.tabs} />
            {isExpanded && <TabList tabs={props.tabs} />}
        </div>
    );
}
 
export default TabGroupEntry;