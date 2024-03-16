import React, { useContext, useState } from 'react';
import "./TabGroupEntry.css"
import { GroupHeader } from '../GroupHeader/GroupHeader';
import { TabList } from '../TabList';
import { DarkModeContext } from '../App';


const TabGroupEntry = (props: {groupName: string, tabs: browser.tabs.Tab[], dropHandler: (Tab: browser.tabs.Tab, groupName: string ) => void}) => {
    console.log("in " + props.groupName + " group entry")
    const [isExpanded, setIsExpanded] = useState(false);
    const darkMode = useContext(DarkModeContext);

    return (
        <div style={{backgroundColor: (darkMode.darkMode) ? "#42414d" : "#ffffff", borderRadius: "5px"}}>
            <GroupHeader groupName={props.groupName} onDrop={props.dropHandler} isExpanded={isExpanded} setIsExpanded={setIsExpanded} tabs={props.tabs} />
            {isExpanded && <TabList tabs={props.tabs} />}
        </div>
    );
}

export default TabGroupEntry;