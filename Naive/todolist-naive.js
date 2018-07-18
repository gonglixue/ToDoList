var gTodolist = []
var gTodoCount;
var gDoneCount;

function addTodoItem(input_value){
    var item = {
        todo: "default",
        done: false,
        item_id: gTodolist.length
    };
    var user_input = input_value.trim()

    if(user_input.length == 0){
        return;
    }

    item.todo = user_input
    gTodolist.push(item)

    // save to cache
    saveDataToCache(gTodolist);

    document.getElementById("input_item").value = '';

    // render new dom
    // renderAllItems()
    renderSingleItem(item);

    document.getElementById("input_item").focus();

}

function renderSingleItem(item)
{
    var todolist_dom = document.getElementById("todolist");
    var donelist_dom = document.getElementById("donelist");
    var todocount_dom = document.getElementById("todocount");
    var donecount_dom = document.getElementById("donecount");

    if(item.done)
    {
        var done_item = createItemDom(item);
        donelist_dom.appendChild(done_item);
        gDoneCount++;

        donecount_dom.innerText = gDoneCount.toString();
    }
    else
    {
        var todo_item = createItemDom(item);
        todolist_dom.appendChild(todo_item);
        gTodoCount++;

        todocount_dom.innerText = gTodoCount.toString();
    }
}

function renderAllItems()
{
    var todolist_dom = document.getElementById("todolist");
    var donelist_dom = document.getElementById("donelist");
    var todocount_dom = document.getElementById("todocount");
    var donecount_dom = document.getElementById("donecount");

    var todoCount = 0;
    var doneCount = 0;

    gTodolist = loadDataFromCache();

    if(gTodolist.length > 0)
    {
        console.log("todolist length > 0")
        // 遍历所有事项
        for(var i=0; i<gTodolist.length; i++)
        {
            var item = gTodolist[i];
            if(item.done)
            {
                var done_item = createItemDom(item);
                donelist_dom.appendChild(done_item);

                doneCount++;
            }
            else
            {
                var todo_item = createItemDom(item);

                todolist_dom.appendChild(todo_item);
                todoCount++;
            }
        }

        todocount_dom.innerText = todoCount.toString();
        donecount_dom.innerText = doneCount.toString();
    }
    else{
        todolist_dom.innerHTML = "";
        donelist_dom.innerHTML = "";
        todocount_dom.innerHTML = "0";
        donecount_dom.innerHTML = "0";

        console.log("set empty")
    }

    gTodoCount = todoCount;
    gDoneCount = doneCount;
}

function loadDataFromCache()
{
    var localData = localStorage.getItem("myTodoList");
    if(localData != null)
        return JSON.parse(localData);   // JSON对象转JS对象

    else
        return []
}

function saveDataToCache(data)
{
    localStorage.setItem("myTodoList", JSON.stringify(data));   // JS对象转JSON对象
}

function clear()
{
    localStorage.clear();
    renderAllItems();
}

function load()
{
    renderAllItems();

    var input = document.getElementById("input_item");
    input.onkeypress = function(event)
    {
        if(event.keyCode === 13){
            addTodoItem(event.srcElement.value);
            event.srcElement.value = event.srcElement.value.trim();
        }
    }

    document.getElementById("clear-btn").onclick = clear
}

function createItemDom(item)
{
    var item_dom = document.createElement("li");
    item_dom.setAttribute("item-id", item.item_id)
    var item_checkbox = document.createElement("input");
    item_checkbox.type="checkbox"
    item_checkbox.checked = item.done;
    item_checkbox.onchange = changeTodoCheckbox;
    // item_checkbox.setAttribute("item-id", item.item_id);
    item_dom.appendChild(item_checkbox);

    var item_content_dom = document.createElement("p");
    item_content_dom.className = "item-content"
    item_content_dom.innerText = item.todo;

    item_dom.appendChild(item_content_dom);

    var delete_btn = document.createElement('span')
    delete_btn.innerText = ' Del '
    delete_btn.onclick = deleteItem

    var edit_btn = document.createElement('span')
    edit_btn.innerText = ' Edit '
    edit_btn.onclick = editItem

    item_dom.appendChild(delete_btn)
    item_dom.append(edit_btn)

    return item_dom;

}

function deleteItem(e)
{
    var item_id = e.srcElement.parentElement.getAttribute("item-id")

    // find item
    var item;
    for(var i=0; i<gTodolist.length; i++)
    {
        if(gTodolist[i].item_id == item_id)
        {
            item = gTodolist[i]
            gTodolist.splice(i, 1)
            break;
        }
    }
    if(item == null)
    {
        console.log("Error: no item with id " + item_id)
        return
    }

    // 移除DOM
    var selected_dom = e.srcElement.parentElement
    selected_dom.parentElement.removeChild(selected_dom)
    // 更新count
    var todocount_dom = document.getElementById("todocount");
    var donecount_dom = document.getElementById("donecount");
    if(item.done){
        donecount_dom.innerText = (--gDoneCount).toString();
    }else{
        todocount_dom.innerText = (--gTodoCount).toString();
    }

    saveDataToCache(gTodolist);
}

function editItem(e)
{
    var item_id = e.srcElement.parentElement.getAttribute("item-id")

    // find item
    var item;
    for(var i=0; i<gTodolist.length; i++)
    {
        if(gTodolist[i].item_id == item_id)
        {
            item = gTodolist[i];
            // item.todo = "renew item";
            item_content_p = e.srcElement.parentElement.getElementsByClassName("item-content")[0];
            warp_editing_box(item_content_p, item.todo, i);
            break;
        }
    }
    if(item == null)
    {
        console.log("Error: no item with id " + item_id)
        return
    }

    // saveDataToCache(gTodolist)
}

function warp_editing_box(item_dom, old_todo_str, id)
{
    console.log("warp editing box")

    item_dom.innerHTML = ""
    var editing_box = document.createElement("input")
    editing_box.className = "editing-box"
    editing_box.value = old_todo_str
    editing_box.id = id;

    editing_box.onkeypress = function(event)
    {
        if(event.keyCode === 13){
            // renew
            event.srcElement.value = event.srcElement.value.trim()
            renewItemById(id, event.srcElement.value.trim())
            // destropy input box
            event.srcElement.parentElement.innerText = event.srcElement.value.trim()
            // event.srcElement.parentElement.removeChild(event.srcElement)
        }
    }


    item_dom.appendChild(editing_box)
}

function renewItemById(id, new_str)
{
    gTodolist[id].todo = new_str;
    saveDataToCache(gTodolist)
}

function changeTodoCheckbox(e)
{
    var item_id = e.srcElement.parentElement.getAttribute("item-id");
    console.log(item_id);



    // find item
    var item;
    for(var i=0; i<gTodolist.length; i++)
    {
        if(gTodolist[i].item_id == item_id)
        {
            gTodolist[i].done = !gTodolist[i].done;
            item = gTodolist[i];
        }
    }
    if(item==null)
    {
        console.log("Error: no item with id " + item_id);
        return;
    }

    // remove dom node from todo to done, or from done to doto
    var selected_dom = e.srcElement.parentNode;
    var todocount_dom = document.getElementById("todocount");
    var donecount_dom = document.getElementById("donecount");

    // append
    if(item.done){
        // append to done
        var donelist_dom = document.getElementById("donelist");
        selected_dom.parentNode.removeChild(selected_dom);
        donelist_dom.appendChild(selected_dom);
        gDoneCount++;
        gTodoCount--;
    }
    else{
        var todolist_dom = document.getElementById("todolist");
        selected_dom.parentNode.removeChild(selected_dom);
        todolist_dom.appendChild(selected_dom);
        gDoneCount--;
        gTodoCount++;
    }
    todocount_dom.innerText = gTodoCount.toString();
    donecount_dom.innerText = gDoneCount.toString();

    saveDataToCache(gTodolist);
}

window.addEventListener("load", load);
