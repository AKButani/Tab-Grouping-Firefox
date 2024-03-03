import { addToQueue } from "./tabQueue";

//executes whenever a new tab is opened
export async function addTab(tab: browser.tabs.Tab) {
    console.log("in add Tab");
    const task = async () => {
        let stored = await browser.storage.session.get();
        stored['Unassigned'].push(tab);
        await browser.storage.session.set(stored);
    }
    await addToQueue(task);
}

//removes tab from storage whenever a tab is closed and NOT the whole window
export async function removeTab(TabId: number, removeInfo: browser.tabs._OnRemovedRemoveInfo) {
    
    if(!removeInfo.isWindowClosing){
        const task = async () => {
            console.log("in remove tab");
            let stored = await browser.storage.session.get();
            console.log(stored);
            for (let group of Object.keys(stored)) {
                stored[group] = stored[group].filter((element: browser.tabs.Tab) => element.id !== TabId);
            }
            await browser.storage.session.set(stored);
            console.log("FINISHED REMOVE TAB");
        }

        await addToQueue(task);
        
    }
    
}

function findGroup(storage: Record<string, browser.tabs.Tab[]>, tabId: number) {


    for (let group of Object.keys(storage)) {
        let ids = storage[group].map((tab) => tab.id);
        if (ids.includes(tabId)) {
            return group;
        }
    }
    return "";
}
//updates the entries, namely title and url, when a tab is changed
export async function updateTab(tabId: number, changeInfo: browser.tabs._OnUpdatedChangeInfo, tab: browser.tabs.Tab) {
    console.log("in update tab");
    console.log(changeInfo);
    /* console.log(tabId); */
    let stored = await browser.storage.session.get();

    console.log("in updateTab");
    /* console.log(changeInfo);
       console.log(stored); */

    let group = findGroup(stored, tabId);

    /* console.log("group: " + group);
    console.log(stored[group]); */
    stored[group] = stored[group].filter((tab: browser.tabs.Tab) => tab.id !== tabId);

    /*  console.log("after filter");
     console.log(stored[group]); */
    stored[group].push(tab);
    await browser.storage.session.set(stored);

}

export async function onCloseWindow(windowId: number){
    console.log("window close triggered");
    
    let tabs = await browser.tabs.query({});
    let tabsIds = tabs.map((tab) => tab.id);
    
    let storage = await browser.storage.session.get() as Record<string, browser.tabs.Tab[]>;

    //removes tab entries that are not in list of all open tabs
    //meaning these tabs have been closed
    for (let group of Object.keys(storage)){
        storage[group] = storage[group].filter((tab) => tabsIds.includes(tab.id));
    }
    
    await browser.storage.session.set(storage);
}