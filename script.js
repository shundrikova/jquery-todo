const doneColor = '#a0a0a0';
let state = {};
let color;

$(document).ready(function () {

    // Loads data from local storage and updates html document
    function loadStorage() {
        state = JSON.parse(localStorage.getItem('state'));

        if (state === null) {
            state = {
                filter: 'all',
                tasks: []
            };
            return state;
        }

        $('.filter').val(state.filter);

        // Add tasks to html
        state.tasks.forEach(function (task) {
            $(`<label for=${task.id} class='task' color='${task.color}' </label>`).appendTo('.task-list');
            
            let listElem = $('.task:last');

            let checked = (task.done) ? 'checked': '';
            $(`<input type='checkbox' class='task-cb' id=${task.id} ${checked}>`).hide().appendTo(listElem).show('slow');

            $(`<span>${task.data}</span>`).appendTo(listElem);

            $(`<input type='button' class='edit-btn' id=${task.id} value='Edit'>`).appendTo(listElem);

            let taskClass = (task.done) ? 'done' : 'undone';
            listElem.addClass(taskClass);

            let taskColor = (task.done) ? doneColor : task.color;
            listElem.css('background-color', taskColor);

            // Filter
            if (task.done && state.filter === 'todo' || !task.done && state.filter === 'done') {
                listElem.hide();
            }
        });

        return state;
    }

    state = loadStorage();

    $('.color-box').on('click', function () {
        color = $(this).css('background-color');
    });

    $('#add-btn').on('click', function () {
        let task = $('#new-task').val();

        // Check if empty input
        if (task === '') {
            $('.message').text('Empty input!');
            $('.message').css('display', 'inline');
            $('.message').delay(3000).fadeOut('slow');
            return;
        }

        $('#new-task').val('');

        let container = $('.task-list');
        let inputs = container.find('label');
        let id = inputs.length + 1;

        // Add task to html
        $(`<label for=${id} class='task' color='${color}' </label>`).appendTo(container);

        let listElem = $('.task:last');

        $(`<input type='checkbox' class='task-cb' id=${id}>`).hide().appendTo(listElem).show('slow');

        $(`<span>${task}</span>`).appendTo(listElem);

        $(`<input type='button' class='edit-btn' id=${id} value='Edit'>`).appendTo(listElem);


        listElem.css('background-color', color);
        
        listElem.addClass('undone');
        if (state.filter === 'done') {
            listElem.hide();
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

    $('.filter').on('change', function () {
        let filterVal = $(this).val()
        state.filter = filterVal;

        localStorage.setItem('state', JSON.stringify(state));

        switch (filterVal) {
            case 'all': {
                $('.done').show('slow');
                $('.undone').show('slow');
                break;
            }
            case 'done': {
                $('.done').show('slow');
                $('.undone').hide('slow');
                break;
            }
            case 'todo': {
                $('.done').hide('slow');
                $('.undone').show('slow');
                break;
            }
        }
    });
});

$(document).on('change', 'input:checkbox', function () {
    let id = $(this).attr('id')
    let listElem = $(`label[for='${id}']`);
    let taskColor = listElem.attr('color');
    let doneStatus = false;

    if ($(this).prop('checked')) {
        taskColor = doneColor;
        doneStatus = true;

        listElem.removeClass('undone').addClass('done');
        if (state.filter === 'todo') {
            listElem.hide('slow');
        }
    } else {
        listElem.removeClass('done').addClass('undone');
        if (state.filter === 'done') {
            listElem.hide('slow');
        }
    }

    listElem.css('background-color', taskColor);

    // Update task done status
    state.tasks.find(x => x.id == $(this).attr('id')).done = doneStatus;
    // Update local storage
    localStorage.setItem('state', JSON.stringify(state));
});

// Edit
$(document).on('click', '.edit-btn', function () {
    let taskDesc = $(this).parent().text();
    $('#edit-box').val(taskDesc);
    $('.popup-overlay').attr('label-id', $(this).parent().attr('for'));
    $('.popup-overlay, .popup-content').addClass('active');
});

//Cancel
$(document).on('click', '#cancel-btn', function () {
    $('.popup-overlay, .popup-content').removeClass('active');
});

//Save
$(document).on('click', '#save-btn', function () {
    let labelId = $('.popup-overlay').attr('label-id');
    let listElem = $(`label[for='${labelId}']`);
    let newDesc = $('#edit-box').val();

    listElem.find('span').text(newDesc);

    state.tasks.find(x => x.id == labelId).data = newDesc;

    localStorage.setItem('state', JSON.stringify(state));

    $('.popup-overlay, .popup-content').removeClass('active');
});