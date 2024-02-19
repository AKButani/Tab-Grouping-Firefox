import React, { useState } from 'react';
import "./TabGroupEntry.css"
import { GroupHeader } from '../GroupHeader/GroupHeader';
import { TabList } from '../TabList';


const TabGroupEntry = (props: {groupName: string, tabs: browser.tabs.Tab[], dropHandler: (Tab: browser.tabs.Tab, groupName: string ) => void}) => {
    console.log("in " + props.groupName + " group entry")
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <GroupHeader groupName={props.groupName} onDrop={props.dropHandler} isExpanded={isExpanded} setIsExpanded={setIsExpanded} tabs={props.tabs} />
            {isExpanded && <TabList tabs={props.tabs} />}
        </>
    );
}

export default TabGroupEntry;