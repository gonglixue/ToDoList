var gTodolist = []
var gTodoCount;
var gDoneCount;

function addTodoItem(e){
    var item = {
        todo: "default",
        done: false,
        item_id: gTodolist.length
    };
    var user_input = document.getElementById("input_item").value = document.getElementById("input_item").value.trim()

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
        return JSON.parse(localData);   // JSON对象转JS对下那个

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
            addTodoItem();
        }
    }

    document.getElementById("clear-btn").onclick = clear
}

function createItemDom(item)
{
    var item_dom = document.createElement("li");
    var item_checkbox = document.createElement("input");
    item_checkbox.type="checkbox"
    item_checkbox.checked = item.done;
    item_checkbox.onchange = changeTodoCheckbox;
    item_checkbox.setAttribute("item-id", item.item_id);
    item_dom.appendChild(item_checkbox);

    var item_content_dom = document.createElement("p");
    item_content_dom.innerText = item.todo;

    item_dom.appendChild(item_content_dom);

    return item_dom;

}

function changeTodoCheckbox(e)
{
    var item_id = e.srcElement.getAttribute("item-id");
    console.log(item_id);



    // find item
    var item;
    for(var i=0; i<gTodolist.length; i++)
    {
        if(gTodolist[i].item_id == item_id);
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
