import { useDrag } from 'react-dnd';
import { DraggableTabProps, ItemTypes } from '../types';
import "./TabList.css"
import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { TabOptionsMenu } from '../TabOptionsMenu';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ContentLoader from 'react-content-loader';
import { GroupContext } from '../TabGroupEntry/TabGroupEntry';

export const TabList = () => {
    
    let tabs = useContext(GroupContext).tabs;
    //state to keep track of selected tabs
    const [selectedTabs, setSelectedTabs] = useState<browser.tabs.Tab[]>([]);

    //record of tab id to favicon url
    const [faviconUrls, setFaviconUrls] = useState<Record<number, string>>({});
    //state to keep track of whether favicons are loading
    const [loadingFavicons, setLoadingFavicons] = useState<boolean>(true);

    useEffect(() => {
        // Function to send a message to the background script
        console.log("update favicons")
        const updateFavicons = async () => {
            
            if (Object.keys(faviconUrls).length === 0){
                setLoadingFavicons(true);
            }
            //console.log("Sending message to background script");
            // Send a message to the background script requesting the favicon URLs
            let message = await browser.runtime.sendMessage({
                type: "get-favicon-urls",
                tabIds: tabs.map((tab) => tab.id),
            });
            //console.log(message);
            if (message) {
                setFaviconUrls(message);
                setLoadingFavicons(false);
            }
        }
        // Run the function to send a message to the background script
        updateFavicons();
    }, [tabs]);

/*     const addTabtoSelected = (tab: browser.tabs.Tab) => {
        setSelectedTabs([...selectedTabs, tab]);
        console.log(selectedTabs);
    }

    const removeTabfromSelected = (tab: browser.tabs.Tab) => {
        setSelectedTabs(selectedTabs.filter((selectedTab) => selectedTab.id !== tab.id));
        console.log(selectedTabs);
    } */
    
    //console.log(faviconUrls);

    const tabSortFunction = (a: browser.tabs.Tab, b: browser.tabs.Tab) => {
        if (a.title && b.title){
            return a.title.localeCompare(b.title);
        }
        return 0;
    }

    return (
        <div className='tabs-list'>
            {tabs.sort(tabSortFunction).map((tab) => {
                return (
                    <DraggableTabEntry tab={tab} setSelectedTabs={setSelectedTabs} selectedTabs={selectedTabs} favicon={faviconUrls[tab.id!]} loadingFavicon={loadingFavicons}/>
                );
            })}
        </div>
    );
};

export const DraggableTabEntry = (props: { tab: browser.tabs.Tab; setSelectedTabs: React.Dispatch<React.SetStateAction<browser.tabs.Tab[]>>, selectedTabs: browser.tabs.Tab[], favicon: string, loadingFavicon: boolean}) => {
   
    const [isChecked, setIsChecked] = useState(false);
    const groupName = useContext(GroupContext).groupName; 


    
    //console.log(props.loadingFavicon);
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
            let dragFields: browser.tabs.Tab[];
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
            return { tabs: dragFields, groupName: groupName } as DraggableTabProps;
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
        <div ref={drag} className="tab-entry" style={{ opacity: isDragging ? 0.5 : 1, maxWidth: '400px' }}>
            <FontAwesomeIcon icon={isChecked ? faSquareCheck : (faSquare as IconProp)} size='lg' onClick={handleCheckboxChange} style={{ margin: '5px 0px 5px 5px', cursor: 'pointer' }} />
            <div onClick={focusOnTab} style={{ flexGrow: 1, display: 'flex', alignItems: 'center', columnGap: '5px' }}>
                {props.loadingFavicon ?
                    <ContentLoader
                        animate={true}
                        speed={2}
                        width={17}
                        height={17}
                        viewBox="0 0 17 17"
                        backgroundColor='#fbfbfe'
                        foregroundColor='#15141a'
                    >
                        <rect x="0" y="0" rx="5" ry="5" width="17" height="17" />
                    </ContentLoader>
                    : null}

                {props.favicon ? <img src={props.favicon} alt='tab icon' style={{ height: '17px', width: '17px', borderRadius: '5px', alignSelf: "center" }} /> : null}

                <div>
                    {props.tab.title}
                </div>

            </div>
            <TabOptionsMenu currentTab={props.tab} selectedTabs={props.selectedTabs} setSelectedTabs={props.setSelectedTabs}/>
        </div>
    );
};

