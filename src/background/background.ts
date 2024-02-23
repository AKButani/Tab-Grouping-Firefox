
export {}

browser.runtime.onStartup.addListener(init);
browser.runtime.onInstalled.addListener(init);
function init(){
    console.log("background running")
    initGroups().then(() => {
        console.log("initialised groups")
    }).catch((e) => console.log("Error " + e));

    createContextMenus();
}

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

function createContextMenus(){
    browser.contextMenus.create({
        id: "OPEN_BOOKMARK_SAME_WINDOW",
        /* command: "_execute_browser_action", */
        contexts: ["bookmark"],
        title: "Open Bookmark in Same Window",
    });

    browser.contextMenus.create({
        id: "OPEN_BOOKMARK_NEW_WINDOW",
        /* command: "_execute_browser_action", */
        contexts: ["bookmark"],
        title: "Open Bookmark in New Window",
    });
}

browser.contextMenus.onClicked.addListener(handleContextMenuClicks)

async function handleContextMenuClicks(info: browser.contextMenus.OnClickData){
    if (info.menuItemId === "OPEN_BOOKMARK_SAME_WINDOW"){
        await openBookmarksameWindow(info);

    }else if (info.menuItemId === "OPEN_BOOKMARK_NEW_WINDOW"){
        await openBookmarknewWindow(info);
    }
}

async function openBookmarksameWindow(info: browser.contextMenus.OnClickData){
    console.log(info);
    let bookmarkId = info.bookmarkId;
    if (typeof bookmarkId === "string"){ //checking if not undefined
        //bookmarks will always have length 1 since bookmarkId is a single string
        let bookmarks = await browser.bookmarks.get(bookmarkId); 
        console.log(bookmarks);
        for (let bookmark of bookmarks){
            await recursiveOpener(bookmark);
        }
    }
    //now need to add these newly opened tabs to a group
}

async function openBookmarknewWindow(info: browser.contextMenus.OnClickData){
    console.log("clicked on openBookmarknewWindow")
    let bookmarkId = info.bookmarkId;
    if (typeof bookmarkId === "string"){
        let bookmarks = await browser.bookmarks.get(bookmarkId);
        let urls: string[] = [];
        for (let bookmark of bookmarks){ //this only runs once
            urls = await getAllurls(bookmark)
        }
        let window = await browser.windows.create({focused: true, type: "normal", url: urls})
    }

}
//bookmark: folder or a url
//opens all the urls in a bookmark 
//including every child 
async function recursiveOpener(bookmark: browser.bookmarks.BookmarkTreeNode){
    if (bookmark.url){
        await browser.tabs.create({
            active: false,
            url: bookmark.url,
        });    
    } else {
        let children = await browser.bookmarks.getChildren(bookmark.id);
        for (let child of children){
            recursiveOpener(child);
        }
    }
}

async function getAllurls(bookmark: browser.bookmarks.BookmarkTreeNode){
    const urls: string[] = [];

    // Check if the bookmark is a folder
    let children = await browser.bookmarks.getChildren(bookmark.id);
    if (children) {
        // Iterate over each child
        children.forEach(async (child) => {
            // If the child is a URL, add it to the list of URLs
            if (child.url) {
                urls.push(child.url);
            }
            // If the child is a folder, recursively call the function to get URLs from it
            else {
                let child_children = await browser.bookmarks.getChildren(child.id);
                if (child_children) {
                    const childUrls = await getAllurls(child);
                    urls.push(...childUrls);
                }
            }
        });
    }

    return urls;
} 

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
    /* console.log("in update tab");
    console.log(tabId); */
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
        //Opens a group of tabs in a new window
        
        let tabs = msg.tabIds;
        browser.windows.create({tabId: tabs[0]}).then(newWindow => {
            //remove 1st element since it has been moved already
            tabs.shift();
            // Move the tabs to the new window
            browser.tabs.move(tabs, { windowId: newWindow.id, index: -1 });
        });
    } else if (msg.type === "store-as-bookmark"){
        //Stores group of tabs as a bookmark


        browser.bookmarks.create({title: msg.title, type: "folder"}).then((bookmark) => {
            /* console.log("Bookmark created");
            console.log(bookmark); */
            let bookmarkPromises = [];
            for (let tab of msg.tabs){
                bookmarkPromises.push(browser.bookmarks.create({parentId: bookmark.id, title: tab.title, url: tab.url}).then(() =>
                   {console.log("added bookmark of " + tab.title + "to folder");}
                ));
            };

            //waits until all tabs are bookmarked and only then sends a message
            Promise.all(bookmarkPromises).then(() => {
                console.log("sending response");
                sendResponse({ response: "success" });
            }).catch(error => {
                console.error("Error creating bookmarks:", error);
                sendResponse({ response: "error" });
            });
        }, (e) => {
            sendResponse({response: "error" + e});
        });

        
    }
})