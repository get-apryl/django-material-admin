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
    // Set labels correctly
    $('.date-input.date-block, .related-wrapper').each(function () {
        $(this).siblings('label').addClass('active')
    })
    $('.money-widget').each(function () {
        $(this).siblings('label').addClass('active')
    })
});

window.makeEditable = function () {
    document.querySelector('#edit-fab').remove()
    var saveButtonContainer = document.querySelector('#save-fab')
    if (saveButtonContainer.classList.contains('hide')) {
        saveButtonContainer.classList.replace('hide', 'show')
    }
    var continueButtonContainer = document.querySelector('#continue-fab')
    if (continueButtonContainer.classList.contains('hide')) {
        continueButtonContainer.classList.replace('hide', 'show')
    }
    var cancelButtonContainer = document.querySelector('#cancel-fab')
    if (cancelButtonContainer.classList.contains('hide')) {
        cancelButtonContainer.classList.replace('hide', 'show')
    }
    // ------ Inlines
    var addInlineButtonContainers = document.querySelectorAll('.inline-buttons-placeholder')
    addInlineButtonContainers.forEach((btn) => {
        if (btn.classList.contains('hide')) {
            btn.classList.replace('hide', 'show')
        }
    })
    var deleteButtonContainers = document.querySelectorAll('.stacked-inline-close-container, td.delete')
    deleteButtonContainers.forEach((btn) => {
        if (btn.classList.contains('hide')) {
            btn.classList.replace('hide', 'show')
        }
    })
    var editable = document.querySelectorAll('.materialize-editable');
    if (editable.length) {
        editable.forEach((elm) => {
            elm.readOnly = !elm.readOnly
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
        document.querySelectorAll('label.checkbox-block')
          .forEach((cb) => {cb.classList.add('editable')})
        // ------ Date pickers
        document.querySelectorAll('.materialize-editable.datepicker').forEach((el) => {
            el.classList.replace('materialize-editable', 'materialize-editable-enabled');
            var today = el.parentElement.querySelector('.today.hide')
            var calendar = el.parentElement.querySelector('.calendar.hide')
            today.classList.replace('hide', 'show');
            calendar.classList.replace('hide', 'show');
        })
        datepickerOptions['format'] = get_format('DATE_INPUT_FORMATS')[0].replace('%Y', 'yyyy').replace('%m', 'mm').replace('%d', 'dd');
        M.Datepicker.init(document.querySelectorAll('.materialize-editable-enabled.datepicker'), datepickerOptions)
    }
    // ------ Select
    var editableSelects = document.querySelectorAll('select.materialize-editable-select')
    if (editableSelects.length) {
        editableSelects.forEach((item) => {
            var parent = item.parentElement
            var grandparent = parent.parentElement // save before removal of parent
            if (parent.classList.contains('select-wrapper')) {
                var cloned = item.cloneNode(true)
                cloned.disabled = false
                cloned.classList.replace('materialize-editable-select', 'materialize-editable-select-enabled')
                parent.remove()
                var helpTextElement = grandparent.querySelector('.help')
                if (helpTextElement) {
                    helpTextElement.insertAdjacentElement('beforebegin', cloned)
                } else {
                    grandparent.appendChild(cloned)
                }
            }
        })
        // redraw
        M.FormSelect.init(document.querySelectorAll('.materialize-editable-select-enabled'))
    }
    // ------ Autocompletes
    var editableAutocompleteWrappers = document.querySelectorAll('.materialize-hidden-autocomplete')
    var editableAutocompleteInputs = document.querySelectorAll('.materialize-editable-autocomplete')
    if (editableAutocompleteWrappers.length === editableAutocompleteInputs.length && editableAutocompleteInputs.length > 0) {
        editableAutocompleteWrappers.forEach((item) => {
            item.style.display = 'block'
            item.style.marginTop = '18px'
        })
        editableAutocompleteInputs.forEach((item) => {
            item.style.display = 'none'
        })
    }
}

window.cancelEdit = function (e) {
    var saveButton = document.querySelector('#save-fab button')
    saveButton.disabled = true
    var cancelButton = document.querySelector('#cancel-fab button')
    cancelButton.disabled = true
    location.href = e.dataset.listViewUrl
}
