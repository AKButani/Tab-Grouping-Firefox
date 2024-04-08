import { useDrag } from 'react-dnd';
import { ItemTypes } from '../types';
import "./TabList.css"
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons';

export const TabList = (props: { tabs: browser.tabs.Tab[]; }) => {
    
    const [selectedTabs, setSelectedTabs] = useState<browser.tabs.Tab[]>([]);

/*     const addTabtoSelected = (tab: browser.tabs.Tab) => {
        setSelectedTabs([...selectedTabs, tab]);
        console.log(selectedTabs);
    }

    const removeTabfromSelected = (tab: browser.tabs.Tab) => {
        setSelectedTabs(selectedTabs.filter((selectedTab) => selectedTab.id !== tab.id));
        console.log(selectedTabs);
    } */
    
    return (
        <div className='tabs-list'>
            {props.tabs.map((tab) => {
                return (
                    <DraggableTabEntry tab={tab} setSelectedTabs={setSelectedTabs} selectedTabs={selectedTabs}/>
                );
            })}
        </div>
    );
};

export const DraggableTabEntry = (props: { tab: browser.tabs.Tab; setSelectedTabs: React.Dispatch<React.SetStateAction<browser.tabs.Tab[]>>, selectedTabs: browser.tabs.Tab[]}) => {
   
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        setIsChecked(props.selectedTabs.includes(props.tab));
    }, [props.selectedTabs, props.tab]);

    const handleCheckboxChange = () => {
        if(!isChecked){
            console.log("Adding to selected tabs");
            props.setSelectedTabs([...props.selectedTabs, props.tab]);
        }else{
            console.log("Removing from selected tabs");
            props.setSelectedTabs(props.selectedTabs.filter((selectedTab) => selectedTab.id !== props.tab.id));
        }
        setIsChecked(!isChecked);
    }
    
    /* const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.tab,
        item: { tab: props.tab },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [props.tab]); */

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.tabs,
        item: () => {
            let dragFields;
            //If for Drag multiple Elemets
            if (props.selectedTabs.length > 0) {
                if (!props.selectedTabs.includes(props.tab)){
                    dragFields = [...props.selectedTabs, props.tab];
                }else{
                    dragFields = props.selectedTabs;
                }
            } else { //Else for Drag one element
                dragFields = [props.tab];
            }
            return { tabs: dragFields };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: () => {
            props.setSelectedTabs([]);
        }
    }, [props.selectedTabs, props.tab]);

    const focusOnTab = async () => {

        await browser.runtime.sendMessage({
            type: "focus-tab",
            tabId: props.tab.id,
        });

    };

    return (
        <div ref={drag} className="tab-entry" style={{ opacity: isDragging ? 0.5 : 1 }}>
            <FontAwesomeIcon icon={isChecked ? faSquareCheck : faSquare} onClick={handleCheckboxChange} style={{cursor: 'pointer'}}/>
            <div onClick={focusOnTab}>
                {props.tab.title}
            </div>
        </div>
    );
};

