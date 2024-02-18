
export {}

async function initGroups(){
    let stored = await browser.storage.session.get();
    if (Object.keys(stored).length !== 0){
        console.log(stored);
        console.log("storage already set")
        return;
    }
    let groups: Record<string, Array<browser.tabs.Tab>> = {};
    let tabs = await browser.tabs.query({});
    groups['Unassigned'] = tabs;
    console.log(groups);
    await browser.storage.session.set(groups);
}

console.log("background running")
initGroups().then(() => {
    console.log("initialised groups")
}).catch((e) => console.log("Error " + e));

//executes whenever a new tab is opened
async function addTab(tab: browser.tabs.Tab){
    console.log("in add Tab");
    let stored = await browser.storage.session.get();
    stored['Unassigned'].push(tab);
    await browser.storage.session.set(stored);
}

//removes tab from storage whenever a tab is closed
async function removeTab(TabId: number){
    console.log("in remove tab");
    let stored = await browser.storage.session.get();
    console.log(stored);
    for (let group of Object.keys(stored)){
        stored[group] = stored[group].filter((element: browser.tabs.Tab) => element.id !== TabId);
    }
    await browser.storage.session.set(stored)
}

function findGroup(storage: Record<string, browser.tabs.Tab[]>, tabId: number){
    
    
    for (let group of Object.keys(storage)){
        let ids = storage[group].map((tab) => tab.id); 
        if (ids.includes(tabId)){
            return group;
        }
    }
    return "";
}

//updates the entries when a tab is changed
async function updateTab(tabId: number, changeInfo: browser.tabs._OnUpdatedChangeInfo, tab: browser.tabs.Tab){
    console.log("in update tab");
    console.log(tabId);
    if (tab.status === "complete" && (changeInfo.url || changeInfo.title)){
        let stored = await browser.storage.session.get();
        
        console.log("in updateTab");
        console.log(changeInfo);
        
        let group = findGroup(stored, tabId);
        
        console.log("group: " + group);
        
        console.log(stored[group]);
        
        stored[group] = stored[group].filter((tab: browser.tabs.Tab) => tab.id !== tabId);

        console.log("after filter");
        console.log(stored[group]);
        stored[group].push(tab);
        await browser.storage.session.set(stored);
    }
    
}

browser.tabs.onCreated.addListener(addTab);
//browser.tabs.onDetached.addListener(removeTab);
browser.tabs.onRemoved.addListener(removeTab);
browser.tabs.onUpdated.addListener(updateTab);
browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "open_tabs_new_win"){
        let tabs = msg.tabIds;
        browser.windows.create({tabId: tabs[0]}).then(newWindow => {
            //remove 1st element since it has been moved already
            tabs.shift();
            // Move the tabs to the new window
            browser.tabs.move(tabs, { windowId: newWindow.id, index: -1 });
        });
    }
})