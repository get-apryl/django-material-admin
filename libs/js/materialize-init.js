window.initEditable = function() {
    var editable = document.querySelectorAll('.materialize-editable');
    if (editable.length) {
        editable.forEach((elm) => {
            elm.readOnly = true;
        })
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var datepickers = document.querySelectorAll('.datepicker:not(.materialize-editable)');
    console.info(datepickers)
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

window.makeEditable = function () {
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
        // ------ Inlines
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
        // ------ Checkboxes
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
        // ------ Select
        var editableSelects = document.querySelectorAll('select.materialize-editable-select')
        editableSelects.forEach((item) => {
            item.classList.replace('materialize-editable-select', 'materialize-editable-select-enabled')
            var cloned = item.cloneNode(true)
            cloned.disabled = false
            var parent = item.parentElement
            var grandparent = parent.parentElement // save before removal of parent
            if (parent.classList.contains('select-wrapper')) {
                parent.remove()
                grandparent.firstElementChild.insertAdjacentElement('afterend', cloned)
            } else {
                // Empty form for cloning
                item.replaceWith(cloned)
            }
        })
        // redraw
        M.FormSelect.init(document.querySelectorAll('.materialize-editable-select-enabled'))
        // ------ Date pickers
        document.querySelectorAll('.materialize-editable.datepicker').forEach((el) => {
            el.classList.replace('materialize-editable', 'materialize-editable-enabled');
            var today = el.parentElement.querySelector('.today.hide')
            var calendar = el.parentElement.querySelector('.calendar.hide')
            today.classList.replace('hide', 'show');
            calendar.classList.replace('hide', 'show');
        })
        datepickerOptions['format'] = get_format('DATE_INPUT_FORMATS')[0].replace('%Y', 'yyyy').replace('%m', 'mm').replace('%d', 'dd');
        M.Datepicker.init(document.querySelectorAll('.materialize-editable-enabled.datepicker'))
    }
}

window.cancelEdit = function (e) {
    var saveButton = document.querySelector('#save-fab button')
    saveButton.disabled = true
    var cancelButton = document.querySelector('#cancel-fab button')
    cancelButton.disabled = true
    location.href = e.dataset.listViewUrl
}
