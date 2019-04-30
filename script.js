const doneColor = "#a0a0a0";
let state = {};
let color;

$(document).ready(function () {

    // Loads data from local storage and updates html document
    function loadStorage() {
        state = JSON.parse(localStorage.getItem('state'));

        if (state == null) {
            state = {
                filter: 'all',
                tasks: []
            };
            return state;
        }

        $(".filter").val(state.filter);

        // Add tasks to html
        state.tasks.forEach(function (task) {
            $('<label />', {
                'for': 'cb' + task.id,
                class: 'list-item',
                color: task.color,
            }).appendTo('.cb-list');

            $('<input />', {
                type: 'checkbox',
                class: 'cb-item',
                id: 'cb' + task.id,
                checked: task.done,
            }).appendTo(".list-item:last");

            let taskColor = (task.done) ? doneColor : task.color;

            $(".list-item:last").css("background-color", taskColor);
            $(".list-item:last").append(task.data);

            // Filter
            if (task.done && state.filter == 'todo' || !task.done && state.filter == 'done') {
                $(".list-item:last").hide();
            }
        });

        return state;
    }

    state = loadStorage();

    $(".color-box").on('click', function () {
        color = $(this).css("background-color");
    });

    $("#addBtn").on('click', function () {
        let task = $("#itemText").val();

        // Check if empty input
        if (task == "") {
            $(".message").text("Empty input!");
            $(".message").css("display", "inline");
            $(".message").delay(3000).fadeOut("slow");
            return;
        }

        $("#itemText").val('');

        let container = $('.cb-list');
        let inputs = container.find('label');
        let id = inputs.length + 1;

        // Add task to html
        $('<label />', {
            'for': 'cb' + id,
            class: 'list-item',
            color: color,
        }).appendTo(container);

        $('<input />', {
            type: 'checkbox',
            class: 'cb-item',
            id: 'cb' + id
        }).hide().appendTo(".list-item:last").show('slow');

        $(".list-item:last").append(task);
        $(".list-item:last").css("background-color", color);

        if (state.filter == 'done') {
            $(".list-item:last").hide();
        }

        // Add task to state structure
        state.tasks.push({
            id: id,
            data: task,
            done: false,
            color: color
        });

        // Update local storage
        localStorage.setItem('state', JSON.stringify(state));
    });

    $(".filter").on('change', function () {
        let filterVal = $(this).val()
        state.filter = filterVal;

        localStorage.setItem('state', JSON.stringify(state));

        $(".list-item").each(function () {
            let id = $(this).attr('for').slice(2);
            if (state.tasks.find(x => x.id == id).done) {
                switch (filterVal) {
                    case 'all':
                        {
                            $(this).show('slow');
                            break;
                        }
                    case 'done':
                        {
                            $(this).show('slow');
                            break;
                        }
                    case 'todo':
                        {
                            $(this).hide('slow');
                            break;
                        }
                }
            } else {
                switch (filterVal) {
                    case 'all':
                        {
                            $(this).show('slow');
                            break;
                        }
                    case 'done':
                        {
                            $(this).hide('slow');
                            break;
                        }
                    case 'todo':
                        {
                            $(this).show('slow');
                            break;
                        }
                }
            }
        });

    });
});

$(document).on('change', 'input:checkbox', function () {
    let listElem = $("label[for='" + $(this).attr('id') + "']");
    let taskColor = listElem.attr('color');
    let doneStatus = false;

    if ($(this).prop('checked')) {
        taskColor = doneColor;
        doneStatus = true;
        if (state.filter == 'todo') {
            listElem.hide('slow');
        }
    } else {
        if (state.filter == 'done') {
            listElem.hide('slow');
        }
    }

    // Update task done status
    state.tasks.find(x => x.id == $(this).attr('id').slice(2)).done = doneStatus;

    listElem.css("background-color", taskColor);
    // Update local storage
    localStorage.setItem('state', JSON.stringify(state));
});