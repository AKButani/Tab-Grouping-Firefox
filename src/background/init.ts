import { createContextMenus } from "./contextMenus";

export async function init() {
    console.log("background running");
    try {
        await initGroups();
        console.log("initialised groups");
    } catch (e) {
        console.log("Error: " + e);
    }
    createContextMenus();

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        let mode = "dark";
        await browser.storage.local.set({mode});
    }

}

//Creates groups datastructure as well as puts all open tabs in "Unassigned"
export async function initGroups() {
    let stored = await browser.storage.session.get();
    if (Object.keys(stored).length !== 0) {
        console.log(stored);
        console.log("storage already set");
        return;
    }
    let groups: Record<string, Array<browser.tabs.Tab>> = {};
    let tabs = await browser.tabs.query({});
    groups['Unassigned'] = tabs;
    console.log(groups);
    await browser.storage.session.set(groups);
}


