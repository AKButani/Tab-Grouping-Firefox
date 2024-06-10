import React, { createContext, useContext, useRef, useState } from 'react';
import "./TabGroupEntry.css"
import { GroupHeader } from '../GroupHeader/GroupHeader';
import { TabList } from '../TabList/TabList';
import { DarkModeContext } from '../App';
import { useDrop } from 'react-dnd';
import { DraggableTabProps, ItemTypes } from '../types';

//create a context containing the group name and list of tabs
export const GroupContext = createContext<{ groupName: string; tabs: browser.tabs.Tab[] }>({ groupName: "", tabs: [] });

const TabGroupEntry = (props: {groupName: string, tabs: browser.tabs.Tab[], dropHandler: (tabs: browser.tabs.Tab[], newGroupName: string, prevGroupName: string ) => void}) => {
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
        drop: (draggable: DraggableTabProps) => (props.dropHandler((draggable.tabs), groupNameRef.current, draggable.groupName)),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));

    return (
        <div ref={drop} style={{ backgroundColor: (isOver && canDrop) ? 'grey' : (!darkMode.darkMode) ? /* "#f9f9fb" */ "#ffffff": "#42414d", borderRadius: '5px'}} /* style={{backgroundColor: (darkMode.darkMode) ? "#42414d" : "#ffffff", borderRadius: "5px"}} */>
            <GroupContext.Provider value={{groupName: props.groupName, tabs: props.tabs}}>
                <GroupHeader isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                {isExpanded && <TabList />}
            </GroupContext.Provider>   
        </div>
    );
}
 
export default TabGroupEntry;