async function add_category(e) {
    let cat_to_add = document.getElementById("category-to-add").value;
    if (cat_to_add == ""){
        return; //error handling required
    }
    let categories_stored = await browser.storage.session.get();
    if(Object.keys(categories_stored).includes(cat_to_add)){
        return; //error handling required
    }
    categories_stored[cat_to_add] = [];
    browser.storage.session.set(categories_stored);
    console.log(cat_to_add.value)
}

document.getElementById("add-category-form").addEventListener("submit", add_category);