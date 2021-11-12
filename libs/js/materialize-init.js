window.initEditable = function() {
    var editable = document.querySelectorAll('.materialize-editable');
    if (editable.length) {
        editable.forEach((elm) => {
            elm.readOnly = true;
        })
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var datepickers = document.querySelectorAll('.datepicker');
    if (datepickers.length) {
        datepickerOptions['format'] = get_format('DATE_INPUT_FORMATS')[0].replace('%Y', 'yyyy').replace('%m', 'mm').replace('%d', 'dd');
        M.Datepicker.init(datepickers, datepickerOptions);
    }

    var timepickers = document.querySelectorAll('.timepicker');
    if (timepickers.length) {
        M.Timepicker.init(timepickers, timeOptions);
    }

    var dropdowns = document.querySelectorAll('.dropdown-menu');
    if (dropdowns.length) {
        M.Dropdown.init(dropdowns, {
            alignment: 'right',
            constrainWidth: false,
            coverTrigger: false,
            inDuration: 400,
            outDuration: 300,
        });
    }
    initEditable();
});

window.toggleEditable = function () {
    var editable = document.querySelectorAll('.materialize-editable');
    if (editable.length) {
        document.querySelector('#edit-fab').remove()
        editable.forEach((elm) => {
            elm.readOnly = !elm.readOnly
        })
        var saveButtonContainer = document.querySelector('#save-fab')
        if (saveButtonContainer.classList.contains('hide')) {
            saveButtonContainer.classList.remove('hide')
            saveButtonContainer.classList.add('show')
        }
        var cancelButtonContainer = document.querySelector('#cancel-fab')
        if (cancelButtonContainer.classList.contains('hide')) {
            cancelButtonContainer.classList.remove('hide')
            cancelButtonContainer.classList.add('show')
        }
        var addInlineButtonContainers = document.querySelectorAll('.inline-buttons-placeholder')
        addInlineButtonContainers.forEach((btn) => {
            if (btn.classList.contains('hide')) {
                btn.classList.remove('hide')
                btn.classList.add('show')
            } else {
                btn.classList.remove('show')
                btn.classList.add('hide')
            }
        })
        var deleteButtonContainers = document.querySelectorAll('.stacked-inline-close-container')
        deleteButtonContainers.forEach((btn) => {
            if (btn.classList.contains('hide')) {
                btn.classList.remove('hide')
                btn.classList.add('show')
            } else {
                btn.classList.remove('show')
                btn.classList.add('hide')
            }
        })
        var readOnlyCbContainers = document.querySelectorAll('.checkbox-readonly-container')
        readOnlyCbContainers.forEach((cb) => {
            cb.classList.add('hide')
        })
        var editableCbContainers = document.querySelectorAll('.checkbox-editable-container.hide')
        editableCbContainers.forEach((cb) => {
            cb.classList.remove('hide')
        })
        document.querySelectorAll('.checkbox-label.hide')
          .forEach((cb) => {cb.classList.remove('hide')})
        document.querySelectorAll('.checkbox-label-editable-ro')
          .forEach((cb) => {cb.classList.add('hide')})
    }
}

window.cancelEdit = function (e) {
    var saveButton = document.querySelector('#save-fab button')
    saveButton.disabled = true
    var cancelButton = document.querySelector('#cancel-fab button')
    cancelButton.disabled = true
    location.href = e.dataset.listViewUrl
}
