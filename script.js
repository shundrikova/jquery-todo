
$(document).ready(function () {
    
    let color;

    $(".color-box").on('click', function () {
        color = $(this).css("background-color");
    });

    $("#addBtn").on('click', function () {
        let item = $("#itemText").val();
        
        if (item == ""){
            $(".message").text("Empty input!");
            $(".message").css("display", "inline");
            $(".message").delay(3000).fadeOut("slow");
            return;
        }
        
        $("#itemText").val('');

        let container = $('.cb-list');
        let inputs = container.find('label');
        let id = inputs.length + 1;

        $('<label />', {
            'for': 'cb' + id,
            class: 'list-item',
            value: color,
        }).appendTo(container);

        $('<input />', {
            type: 'checkbox',
            class: 'cb-item',
            id: 'cb' + id
        }).appendTo(".list-item:last");

        $(".list-item:last").append(item);
        $(".list-item:last").css("background-color", color);
    });

});

$(document).on('change', 'input:checkbox', function () {
    let listElem = $("label[for='" + $(this).attr('id') + "']");
    let backColor = listElem.attr('value');

    if ($(this).prop('checked') == true) {
        backColor = "#a0a0a0";
    }

    $("label[for='" + $(this).attr('id') + "']").css("background-color", backColor);
});