var gTodolist = []
var gTodoCount;
var gDoneCount;

function addTodoItem(e){
    var item = {
        todo: "default",
        done: false
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
        var done_item = document.createElement("li");
        done_item.innerText = item.todo;
        donelist_dom.appendChild(done_item);
        gDoneCount++;

        donecount_dom.innerText = gDoneCount.toString();
    }
    else
    {
        var todo_item = document.createElement("li");
        todo_item.innerText = item.todo;
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
                var done_item = document.createElement("li");
                done_item.innerText = item.todo;
                donelist_dom.appendChild(done_item);
                doneCount++;
            }
            else
            {
                var todo_item = document.createElement("li");
                todo_item.innerText = item.todo;

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


window.addEventListener("load", load);