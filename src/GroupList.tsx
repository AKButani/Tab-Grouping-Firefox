import React, {useState, useEffect} from "react";
import TabGroupEntry from "./TabGroupEntry";
import { TabGroups } from "./types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddGroup from "./AddGroup";

const GroupList = () => {
  console.log("in grouplist")
  const [groups, setGroups] = useState({} as TabGroups);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const storedGroups = await browser.storage.session.get() as TabGroups;
        setGroups(storedGroups);
        console.log(storedGroups)
      } catch (error) {
        console.error('Error fetching groups from storage:', error);
      }
    };

    fetchGroups();
  }, []);


  const dropHandler = (Tab: browser.tabs.Tab, groupName: string) => {
    // Fetch the current groups
    console.log("in drop handler");
    console.log(Tab);
    console.log(groupName);
    browser.storage.session.get().then((storedGroups) => {
      const updatedGroups = { ...storedGroups };
      console.log(updatedGroups);
      // Remove the tab from the old group
      for (let group of Object.keys(updatedGroups)) {
        updatedGroups[group] = updatedGroups[group].filter((tab: browser.tabs.Tab) => tab.id !== Tab.id);
      }
  
      // Add tab to the new group
      updatedGroups[groupName] = [...updatedGroups[groupName], Tab];
  
      // Update the state and storage
      
      browser.storage.session.set(updatedGroups).then(
        () => console.log("Set Tab: " + Tab.title + " to group " + groupName),
        (error) => console.log("Error while setting TabID: " + Tab.id + " to group " + groupName, error)
      );
      setGroups(updatedGroups);
    });
  };

  const addGroup = (newGroup: string) => {
    console.log("in addGroup")
    if (newGroup === "" || Object.keys(groups).includes(newGroup)) {
      return;
    }

    
    const updatedGroups = { ...groups };
    updatedGroups[newGroup] = [];
    console.log(updatedGroups);
    browser.storage.session.set(updatedGroups).then(
      () => console.log("Added " + newGroup),
      (error) => console.log("Error while adding group " + newGroup, error)
    );

    setGroups(updatedGroups);
  };


  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {Object.keys(groups).map((groupName) => {
          return (
            <TabGroupEntry groupName={groupName} tabs={groups[groupName]} dropHandler={dropHandler} />
          );
        })}
      </DndProvider>
      <AddGroup onClick={addGroup} />
    </>
  );
}

export default GroupList;