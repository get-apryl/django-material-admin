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
    var editable = document.querySelectorAll('.materialize-editable');
    if (editable.length) {
        editable.forEach((elm) => {
            elm.readOnly = true
        } )
    }
});

window.toggleEditable = function () {
    var editable = document.querySelectorAll('.materialize-editable');
    if (editable.length) {
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
    }
}

window.cancelEdit = function (e) {
    var saveButtonContainer = document.querySelector('#save-fab')
    var cancelButtonContainer = document.querySelector('#cancel-fab')
    var loaderModal = document.querySelector('#loader-modal')
    saveButtonContainer.classList.remove('show')
    saveButtonContainer.classList.add('hide')
    cancelButtonContainer.classList.remove('show')
    cancelButtonContainer.classList.add('hide')
    var modal = M.Modal.init(loaderModal)
    modal.open()
    window.setTimeout(window.location.reload.bind(window.location), 1000)
}
