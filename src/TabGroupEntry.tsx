import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {ItemTypes} from "./types"

const GroupHeader = (props: {groupName: string, onDrop: (TabId: browser.tabs.Tab, groupName: string ) => void}) => {
    const [{canDrop, isOver}, drop] = useDrop(() => ({
        accept: ItemTypes.tab,
        drop: (Tab) => (props.onDrop(((Tab as {tab: browser.tabs.Tab}).tab as browser.tabs.Tab), props.groupName)),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));
    return (
    <h1 ref={drop} style={{backgroundColor: (isOver && canDrop) ? 'grey' : 'red' }}>
        {props.groupName}
    </h1>
    );
}

const DraggableTabEntry = (props: {tab: browser.tabs.Tab}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.tab,
        item: { tab: props.tab },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, backgroundColor: isDragging ? "grey": "white"}}>
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

    
    

    return (
        <>
            <GroupHeader groupName={props.groupName} onDrop={props.dropHandler} />
            <TabList tabs={props.tabs} />
        </>
    );
}

export default TabGroupEntry;