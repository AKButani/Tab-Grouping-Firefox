import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './types';

export const TabList = (props: { tabs: browser.tabs.Tab[]; }) => {

    return (
        <>
            {props.tabs.map((tab) => {
                return (
                    <DraggableTabEntry tab={tab} />
                );
            })}
        </>
    );
};

export const DraggableTabEntry = (props: { tab: browser.tabs.Tab; }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.tab,
        item: { tab: props.tab },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [props.tab]);

    const openTab = async () => {
        let windows = await browser.windows.getAll({
            populate: true,
        });

        //find in which window the tab is
        for (let window of windows){
            for(let tab of window.tabs!){
                if(tab.id === props.tab.id){
                    await browser.windows.update(window.id!, {focused: true});
                    break;
                }
            }
        }
        browser.tabs.update(props.tab.id!, { active: true });
    };

    return (
        <div ref={drag} className="tab-entry" style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer' }} onClick={openTab}>
            {props.tab.title} {props.tab.id}
        </div>
    );
};

