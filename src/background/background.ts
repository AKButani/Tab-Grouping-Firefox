import { handleContextMenuClicks } from "./contextMenus";
import { handleRepitition } from "./helperfunctions";
import { init } from "./init";
import { addTab, onCloseWindow, removeTab, updateTab } from "./tabEvents";

export {}

browser.runtime.onStartup.addListener(init);
browser.runtime.onInstalled.addListener(init);

browser.contextMenus.onClicked.addListener(handleContextMenuClicks)

browser.tabs.onCreated.addListener(addTab);
browser.tabs.onRemoved.addListener(removeTab);
browser.tabs.onUpdated.addListener(updateTab, {properties: ["title"]});

browser.windows.onRemoved.addListener(onCloseWindow)

/* browser.windows.onCreated.addListener(() => {
    console.log("adding event listener");
    window.addEventListener("beforeunload", onWindowClose);
}) */


browser.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.type === "open_tabs_new_win") {
        //Opens a group of tabs in a new window
        let tabs = msg.tabIds;
        let newWindow = await browser.windows.create({ tabId: tabs[0] })
        //remove 1st element since it has been moved already
        tabs.shift();
        // Move the tabs to the new window
        browser.tabs.move(tabs, { windowId: newWindow.id, index: -1 });
    } else if (msg.type === "store-as-bookmark") {
        //Stores group of tabs as a bookmark
        try {
            let bookmark = await browser.bookmarks.create({ title: msg.title, type: "folder" })
                /* console.log("Bookmark created");
                console.log(bookmark); */
            for (let tab of msg.tabs) {
                await browser.bookmarks.create({ parentId: bookmark.id, title: tab.title, url: tab.url })
            };
            return true;
            //waits until all tabs are bookmarked and only then sends a message
            /* Promise.all(bookmarkPromises).then(() => {
                console.log("sending response");
                sendResponse({ response: "success" });
            }).catch(error => {
                console.error("Error creating bookmarks:", error);
                sendResponse({ response: "error" });
            }); */

        } catch (error) {
            console.error(error);
            return false;
        }
    } else if (msg.type === "remove-group-and-tabs"){
        try {
            await browser.storage.session.remove(msg.title);
            let storage = await browser.storage.session.get();
            console.log("storage after removing key");
            console.log(storage);
            await browser.tabs.remove(msg.tabIds);

        } catch (error) {
            console.error(error);
            return false;
        }

        return true;
    } else if (msg.type === "rename-group"){
        try {
            let storage = await browser.storage.session.get();
            let newUniqueName = handleRepitition(msg.newName, storage); 
            let tabs = storage[msg.oldName];
            storage[newUniqueName] = tabs;
            
            await browser.storage.session.set(storage);
            await browser.storage.session.remove(msg.oldName);
            console.log("storage after renaming");
            console.log(await browser.storage.session.get());
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    } else if (msg.type === "focus-tab"){
        try { 
            let tab = await browser.tabs.get(msg.tabId);
            await browser.windows.update(tab.windowId!, { focused: true });
            await browser.tabs.update(msg.tabId, { active: true });
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }
})