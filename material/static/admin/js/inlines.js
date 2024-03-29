function initInlineTabularSelect () {
  $('.form-row:not(.empty-form) select').formSelect();
}

function initInlineStackedSelect () {
  $('.inline-group .inline-related:not(.empty-form) select').formSelect();
}

function initTextareaInline() {
  $('.vLargeTextField').addClass('materialize-textarea');
}

(function($, initInlineTabularSelect, initInlineStackedSelect, initTextareaInline) {
    'use strict';
    var initInline = null;
    $.fn.formset = function(opts) {
        var options = $.extend({}, $.fn.formset.defaults, opts);
        var $this = $(this);
        var $parent = $this.parent();
        var updateElementIndex = function(el, prefix, ndx) {
            var id_regex = new RegExp("(" + prefix + "-(\\d+|__prefix__))");
            var replacement = prefix + "-" + ndx;
            if ($(el).prop("for")) {
                $(el).prop("for", $(el).prop("for").replace(id_regex, replacement));
            }
            if (el.id) {
                el.id = el.id.replace(id_regex, replacement);
            }
            if (el.name) {
                el.name = el.name.replace(id_regex, replacement);
            }
        };
        var totalForms = $("#id_" + options.prefix + "-TOTAL_FORMS").prop("autocomplete", "off");
        var nextIndex = parseInt(totalForms.val(), 10);
        var maxForms = $("#id_" + options.prefix + "-MAX_NUM_FORMS").prop("autocomplete", "off");
        // only show the add button if we are allowed to add more items,
        // note that max_num = None translates to a blank string.
        var showAddButton = maxForms.val() === '' || (maxForms.val() - totalForms.val()) > 0;
        $this.each(function(i) {
            $(this).not("." + options.emptyCssClass).addClass(options.formCssClass);
        });
        if ($this.length && showAddButton) {
            var addButton = options.addButton;
            if (addButton === null) {
                if ($this.prop("tagName") === "TR") {
                    // If forms are laid out as table rows, insert the
                    // "add" button in a new table row:
                    var numCols = this.eq(-1).children().length;
                    $parent.append('<tr class="' + options.addCssClass + '"><td colspan="' + numCols + '" class="hide inline-buttons-placeholder"><button type="button" class="btn btn-primary btn-small add-inline-button"><i class="material-icons" aria-hidden="true">add</i><span>' + options.addText + "</span></button></tr>");
                    addButton = $parent.find("tr.add-row td button.add-inline-button");
                } else if ($this[0].classList.contains('fw-card')) {
                    $parent.parent().find('.inline-buttons-placeholder').prepend('<button type="button" class="btn btn-primary btn-small add-inline-button"><i class="material-icons" aria-hidden="true">add</i><span>' + options.addText + "</span></button>");
                    addButton = $parent.parent().find('.inline-buttons-placeholder button');
                } else {
                    // Otherwise, insert it immediately after the last form:
                    $this.parent().after('<div><a href="#" class="add-inline-link"><i class="material-icons" aria-hidden="true">add</i><span>' + options.addText + "</span></a></div>");
                    addButton = $this.parent().next().find("a");
                }
            }
            addButton.on('click', function(e) {
                e.preventDefault();
                var template = $("#" + options.prefix + "-empty");
                var row = template.clone(true);
                row.removeClass(options.emptyCssClass)
                .addClass(options.formCssClass)
                .attr("id", options.prefix + "-" + nextIndex);
                if (row.is("tr")) {
                    // If the forms are laid out in table rows, insert
                    // the remove button into the last table cell:
                    row.children(":last").append('<div><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></div>");
                } else if (row.is("ul") || row.is("ol")) {
                    // If they're laid out as an ordered/unordered list,
                    // insert an <li> after the last list item:
                    row.append('<li><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></li>");
                } else if (row[0].classList.contains('fw-card')) {
                    // Material card style: inject in the container if it is not
                    // already there. If it is, replace it.
                    var container = row.find('.stacked-inline-close-container')
                    container.children('*').remove()
                    container.append('<button class="stacked-inline-close btn btn-small red white-text" type="button">' + options.deleteText + '<i class="material-icons right" aria-hidden="true">delete_forever</i></button>');
                } else {
                    // Otherwise, just insert the remove button as the
                    // last child element of the form's container:
                    row.children(":first").append('<span><a class="' + options.deleteCssClass + '" href="#">' + options.deleteText + "</a></span>");
                }
                // Each inline form has one ID field which can be a CUID field.
                // But the fields are repeated (there's an initial and current),
                // so make sure they have the same ID, or we risk triggering
                // unwanted behaviour like a forced insert instead of update.
                // The ID field MUST have the materialize-cuid class. The
                // sibling field with the initial value does not have the class,
                // but it SHALL be the next sibling.
                var newId = cuid()
                row.find(".materialize-cuid").each((idx, cur) => {
                    cur.value = newId
                    cur.nextSibling.value = newId
                })
                var _datePickers = row[0].querySelectorAll('.datepicker')
                if (_datePickers.length) {
                    M.Datepicker.init(_datePickers, datepickerOptions);
                }
                // Needed or not? For now: not
                // var dropdowns = row[0].querySelectorAll('.dropdown-menu');
                // if (dropdowns.length) {
                //     M.Dropdown.init(dropdowns, {
                //         alignment: 'right',
                //         constrainWidth: false,
                //         coverTrigger: false,
                //         inDuration: 400,
                //         outDuration: 300,
                //     });
                // }
                var formSelects = row.find("select.materialize-editable-select");
                if (formSelects.length) {
                    formSelects.each((idx, cur) => {
                        cur.classList.replace('materialize-editable-select', 'materialize-editable-select-enabled');
                    })
                }
                row.find("*").each(function() {
                    updateElementIndex(this, options.prefix, totalForms.val());
                });
                // Insert the new form when it has been fully edited
                row.insertBefore($(template));
                // Update number of total forms
                $(totalForms).val(parseInt(totalForms.val(), 10) + 1);
                nextIndex += 1;
                // Hide add button in case we've hit the max, except when we
                // want to add infinitely
                if ((maxForms.val() !== '') && (maxForms.val() - totalForms.val()) <= 0) {
                    addButton.parent().hide();
                }
                // The delete button of each row triggers a bunch of other things
                row.find("a." + options.deleteCssClass + ', button.stacked-inline-close').on('click', function(e1) {
                    e1.preventDefault();
                    // Remove the parent form containing this button:
                    row.remove();
                    nextIndex -= 1;
                    // If a post-delete callback was provided, call it with the deleted form:
                    if (options.removed) {
                        options.removed(row);
                    }
                    $(document).trigger('formset:removed', [row, options.prefix]);
                    // Update the TOTAL_FORMS form count.
                    var forms = $("." + options.formCssClass);
                    $("#id_" + options.prefix + "-TOTAL_FORMS").val(forms.length);
                    // Show add button again once we drop below max
                    if ((maxForms.val() === '') || (maxForms.val() - forms.length) > 0) {
                        addButton.parent().show();
                    }
                    // Also, update names and ids for all remaining form controls
                    // so they remain in sequence:
                    var i, formCount;
                    var updateElementCallback = function() {
                        updateElementIndex(this, options.prefix, i);
                    };
                    for (i = 0, formCount = forms.length; i < formCount; i++) {
                        updateElementIndex($(forms).get(i), options.prefix, i);
                        $(forms.get(i)).find("*").each(updateElementCallback);
                    }
                });
                // If a post-add callback was supplied, call it with the added form:
                if (options.added) {
                    options.added(row);
                }
                $(document).trigger('formset:added', [row, options.prefix]);
                initInline();
                row[0].scrollIntoView()
            });
        }
        return this;
    };

    /* Setup plugin defaults */
    $.fn.formset.defaults = {
        prefix: "form",          // The form prefix for your django formset
        addText: "add another",      // Text for the add link
        deleteText: "remove",      // Text for the delete link
        addCssClass: "add-row",      // CSS class applied to the add link
        deleteCssClass: "delete-row",  // CSS class applied to the delete link
        emptyCssClass: "empty-row",    // CSS class applied to the empty row
        formCssClass: "dynamic-form",  // CSS class applied to each form in a formset
        added: null,          // Function called each time a new form is added
        removed: null,          // Function called each time a form is deleted
        addButton: null       // Existing add button to use
    };


    // Tabular inlines ---------------------------------------------------------
    $.fn.tabularFormset = function(selector, options) {
        var $rows = $(this);
        var alternatingRows = function(row) {
            $(selector).not(".add-row").removeClass("row1 row2")
            .filter(":even").addClass("row1").end()
            .filter(":odd").addClass("row2");
        };

        var reinitDateTimeShortCuts = function() {
            // Reinitialize the calendar and clock widgets by force
            if (typeof DateTimeShortcuts !== "undefined") {
                $(".datetimeshortcuts").remove();
                DateTimeShortcuts.init();
            }
        };

        var updateSelectFilter = function() {
            // If any SelectFilter widgets are a part of the new form,
            // instantiate a new SelectFilter instance for it.
            if (typeof SelectFilter !== 'undefined') {
                $('.selectfilter').each(function(index, value) {
                    var namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], false);
                });
                $('.selectfilterstacked').each(function(index, value) {
                    var namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], true);
                });
            }
        };

        var initPrepopulatedFields = function(row) {
            row.find('.prepopulated_field').each(function() {
                var field = $(this),
                    input = field.find('input, select, textarea'),
                    dependency_list = input.data('dependency_list') || [],
                    dependencies = [];
                $.each(dependency_list, function(i, field_name) {
                    dependencies.push('#' + row.find('.field-' + field_name).find('input, select, textarea').attr('id'));
                });
                if (dependencies.length) {
                    input.prepopulate(dependencies, input.attr('maxlength'));
                }
            });
        };

        $rows.formset({
            prefix: options.prefix,
            addText: options.addText,
            formCssClass: "dynamic-" + options.prefix,
            deleteCssClass: "inline-deletelink",
            deleteText: options.deleteText,
            emptyCssClass: "empty-form",
            removed: alternatingRows,
            added: function(row) {
                initPrepopulatedFields(row);
                reinitDateTimeShortCuts();
                updateSelectFilter();
                alternatingRows(row);
            },
            addButton: options.addButton
        });

        return $rows;
    };

    // Stacked inlines ---------------------------------------------------------
    $.fn.stackedFormset = function(selector, options) {
        var $rows = $(this);
        var updateInlineLabel = function(row) {
            $(selector).find(".inline_label").each(function(i) {
                var count = i + 1;
                $(this).html($(this).html().replace(/(#\d+)/g, "#" + count));
            });
        };

        var reinitDateTimeShortCuts = function() {
            // Reinitialize the calendar and clock widgets by force, yuck.
            if (typeof DateTimeShortcuts !== "undefined") {
                $(".datetimeshortcuts").remove();
                DateTimeShortcuts.init();
            }
        };

        var updateSelectFilter = function() {
            // If any SelectFilter widgets were added, instantiate a new instance.
            if (typeof SelectFilter !== "undefined") {
                $(".selectfilter").each(function(index, value) {
                    var namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], false);
                });
                $(".selectfilterstacked").each(function(index, value) {
                    var namearr = value.name.split('-');
                    SelectFilter.init(value.id, namearr[namearr.length - 1], true);
                });
            }
        };

        var initPrepopulatedFields = function(row) {
            row.find('.prepopulated_field').each(function() {
                var field = $(this),
                    input = field.find('input, select, textarea'),
                    dependency_list = input.data('dependency_list') || [],
                    dependencies = [];
                $.each(dependency_list, function(i, field_name) {
                    dependencies.push('#' + row.find('.form-row .field-' + field_name).find('input, select, textarea').attr('id'));
                });
                if (dependencies.length) {
                    input.prepopulate(dependencies, input.attr('maxlength'));
                }
            });
        };

        $rows.formset({
            prefix: options.prefix,
            addText: options.addText,
            formCssClass: "dynamic-" + options.prefix,
            deleteCssClass: "inline-deletelink",
            deleteText: options.deleteText,
            emptyCssClass: "empty-form",
            removed: updateInlineLabel,
            added: function(row) {
                initPrepopulatedFields(row);
                reinitDateTimeShortCuts();
                updateSelectFilter();
                updateInlineLabel(row);
            },
            addButton: options.addButton
        });

        return $rows;
    };

    $(document).ready(function() {
        $(".js-inline-admin-formset").each(function() {
            var data = $(this).data(),
                inlineOptions = data.inlineFormset,
                selector;
            switch(data.inlineType) {
            case "stacked":
                initInline = initInlineStackedSelect;
                selector = inlineOptions.name + "-group .inline-related";
                $(selector).stackedFormset(selector, inlineOptions.options);
                break;
            case "tabular":
                initInline = initInlineTabularSelect;
                selector = inlineOptions.name + "-group .tabular.inline-related tbody:first > tr";
                $(selector).tabularFormset(selector, inlineOptions.options);
                break;
            }
        });
        initTextareaInline();
        $('.stacked-inline-close').on('click', function () {
            var $parent = $(this).parent();
            var closeLabel = $parent.find('.vCheckboxLabel');
            if (closeLabel.length) {
                closeLabel.click();
                $parent.hide()
            } else if($(this).is("button")) {
                $(this).closest(".inline-related").remove()
            } else {
                $parent.remove();
            }
        });
    });
})(django.jQuery, initInlineTabularSelect, initInlineStackedSelect, initTextareaInline);
