import React, {useState, useEffect, createContext, useContext} from "react";
import TabGroupEntry from "./TabGroupEntry/TabGroupEntry";
import { TabGroups } from "./types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AddGroup from "./AddGroup/AddGroup";
import Tooltips from "./Tooltips";
import { DarkModeContext } from "./App";
import { Alert } from "@mui/material";

export const UpdateGroupsContext = createContext<{
  updateGroups: React.Dispatch<React.SetStateAction<TabGroups>>;
  groups: TabGroups;
}>({updateGroups: () => {}, groups: {},});

/* export const UpdateGroupsContext = createContext<React.Dispatch<React.SetStateAction<TabGroups>> | undefined>(undefined); */

const GroupList = () => {
  //console.log("in grouplist")
  const [groups, setGroups] = useState({} as TabGroups);
  const [showAddGroupAlert, setAddGroupAlert] = useState(false);
  const darkMode = useContext(DarkModeContext);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log("fetching group");
        const storedGroups = await browser.storage.session.get() as TabGroups;
        setGroups(storedGroups);
        console.log(storedGroups)
      } catch (error) {
        console.error('Error fetching groups from storage:', error);
      }
    };

    fetchGroups();
  }, []);


  const dropHandler =  async (tabs: browser.tabs.Tab[], newGroupName: string, prevGroupName: string) => {
    if (newGroupName === prevGroupName) {
      return;
    }

    let message = await browser.runtime.sendMessage({
      type: "change-tab-group",
      tabs: tabs,
      groupName: newGroupName,
    });

    if (message){
      const groups = await browser.storage.session.get();
      setGroups(groups);
    }else{
      console.error("error");
    }
  };

  const addGroup = async (newGroup: string) => {
    console.log("in addGroup")
    if (newGroup === "") {
      setAddGroupAlert(true);
      return;
    }

    let message = await browser.runtime.sendMessage({
      type: "add-group",
      groupName: newGroup,
    });
    if (message) {
      const groups = await browser.storage.session.get();
      setGroups(groups);
    } else {
      console.error("error");
    }
    
    /* const updatedGroups = { ...groups };
    updatedGroups[newGroup] = [];
    console.log(updatedGroups);
    browser.storage.session.set(updatedGroups).then(
      () => console.log("Added " + newGroup),
      (error) => console.log("Error while adding group " + newGroup, error)
    );

    setGroups(updatedGroups); */

  };


  return (
    <div className={`group-list-container ${darkMode.darkMode ? "dark-mode" : "light-mode"}`}>
      <DndProvider backend={HTML5Backend}>
        <UpdateGroupsContext.Provider value={{updateGroups: setGroups, groups:groups}}>
          {Object.keys(groups).map((groupName) => {
            return (
              <TabGroupEntry groupName={groupName} tabs={groups[groupName]} dropHandler={dropHandler} />
            );
          })}
        </UpdateGroupsContext.Provider>
      </DndProvider>
      {showAddGroupAlert && <Alert severity='error' onClose={() => setAddGroupAlert(false)}>
        Group name cannot be empty
      </Alert>}
      <AddGroup onClick={addGroup} />
      <Tooltips />
    </div>
  );
}

export default GroupList;