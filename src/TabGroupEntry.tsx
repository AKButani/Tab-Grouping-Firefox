import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {ItemTypes} from "./types";
import {FaAngleRight, FaAngleDown} from "react-icons/fa"
import "./TabGroupEntry.css"


const GroupHeader = (props: {groupName: string, isExpanded: boolean, setIsExpanded: React.Dispatch<React.SetStateAction<boolean>> , onDrop: (TabId: browser.tabs.Tab, groupName: string ) => void}) => {
    const [{canDrop, isOver}, drop] = useDrop(() => ({
        accept: ItemTypes.tab,
        drop: (Tab) => (props.onDrop(((Tab as {tab: browser.tabs.Tab}).tab as browser.tabs.Tab), props.groupName)),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));
    return (
        <div ref={drop} className='group-header' onClick={() => props.setIsExpanded(!props.isExpanded)} style={{ backgroundColor: (isOver && canDrop) ? 'grey' : 'red' }}>
            {props.isExpanded ? <FaAngleDown/> : <FaAngleRight/>}
            <h1  >
                {props.groupName}
            </h1>
        </div>
    );
}

const DraggableTabEntry = (props: {tab: browser.tabs.Tab}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.tab,
        item: { tab: props.tab },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [props.tab]);

    const openTab = () => {
        browser.tabs.update(props.tab.id!, {active: true});
    } 

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, backgroundColor: isDragging ? "grey": "white", cursor: 'pointer'}} onClick={openTab}>
            {props.tab.title} {props.tab.id}
        </div>
    )
}


const TabList = (props: {tabs: browser.tabs.Tab[]}) => {
    
    return (
        <>
            {props.tabs.map((tab) => {
                return (
                    <DraggableTabEntry tab={tab} />
                );
            })}
        </>
    );
}



const TabGroupEntry = (props: {groupName: string, tabs: browser.tabs.Tab[], dropHandler: (Tab: browser.tabs.Tab, groupName: string ) => void}) => {
    console.log("in tab group entry")
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <GroupHeader groupName={props.groupName} onDrop={props.dropHandler} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            {isExpanded && <TabList tabs={props.tabs} />}
        </>
    );
}

export default TabGroupEntry;