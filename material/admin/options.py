from __future__ import annotations

import typing as t

from django.conf import settings
from django.contrib import admin
from django.contrib.auth import get_permission_codename
from django.db import models
from django.forms import SplitDateTimeField, forms

from material.admin import widgets

if t.TYPE_CHECKING:
    from django.http import HttpRequest

FORMFIELD_FOR_DBFIELD_MATERIAL = {
    models.DateField: {'widget': widgets.MaterialAdminDateWidget},
    models.DateTimeField: {
        'form_class': SplitDateTimeField,
        'widget': widgets.MaterialAdminSplitDateTime
    },
    models.TimeField: {'widget': widgets.MaterialAdminTimeWidget},
    models.TextField: {'widget': widgets.MaterialAdminTextareaWidget},
    models.IntegerField: {'widget': widgets.MaterialAdminNumberWidget},
}

class EditableFieldsMixin(admin.options.BaseModelAdmin):
    editable_text_inputs = None
    editable_text_areas = None
    editable_checkboxes = None
    editable_choicefields = None
    editable_datepickers = None
    editable_autocompletes = None
    editable_urlfields = None

    def __init__(self):
        super().__init__()
        self.editable_text_inputs = self.editable_text_inputs or []
        self.editable_text_areas = self.editable_text_areas or []
        self.editable_checkboxes = self.editable_checkboxes or []
        self.editable_choicefields = self.editable_choicefields or []
        self.editable_datepickers = self.editable_datepickers or []
        self.editable_autocompletes = self.editable_autocompletes or []
        self.editable_urlfields = self.editable_urlfields or []

    def formfield_for_dbfield(
            self, db_field: models.Field, request: HttpRequest, **kwargs
    ):
        if db_field.name in self.editable_text_inputs:
            return db_field.formfield(
                widget=widgets.MaterialAdminEditableTextInput, **kwargs
            )
        if db_field.name in self.editable_text_areas:
            return db_field.formfield(
                widget=widgets.MaterialAdminEditableTextArea, **kwargs
            )

        if db_field.name in self.editable_checkboxes:
            return db_field.formfield(
                widget=widgets.MaterialAdminEditableCheckbox,
            )

        if db_field.name in self.editable_choicefields:
            return db_field.formfield(
                widget=widgets.MaterialAdminEditableSelect
            )

        if db_field.name in self.editable_datepickers:
            return db_field.formfield(
                widget=widgets.MaterialAdminEditableDateWidget
            )

        if db_field.name in self.editable_autocompletes:
            return db_field.formfield(
                widget=widgets.MaterialAdminAutocompleteWidget(
                    db_field.remote_field, getattr(self, 'admin_site', None),
                    **kwargs
                )
            )

        if db_field.name in self.editable_urlfields:
            return db_field.formfield(
                widget=widgets.MaterialAdminEditableUrlInput
            )

        return super().formfield_for_dbfield(db_field, request, **kwargs)


class MaterialModelAdminMixin(admin.ModelAdmin, EditableFieldsMixin):
    def __init__(self, model, admin_site):
        super().__init__(model, admin_site)
        self.formfield_overrides.update(FORMFIELD_FOR_DBFIELD_MATERIAL)

    @property
    def media(self):
        extra = '' if settings.DEBUG else '.min'
        js = [
            'vendor/jquery/jquery%s.js' % extra,
            'jquery.init.js',
            'core.js',
            'actions.js',
            'urlify.js',
            'prepopulate.js',
            'vendor/xregexp/xregexp%s.js' % extra,
        ]
        material_js = [
            'material/admin/js/RelatedObjectLookups.min.js',
            'material/admin/js/cuid.js',
        ]
        return super().media + forms.Media(js=['admin/js/%s' % url for url in js] + material_js)

    def has_module_permission(self, request):
        # Because of the MRO setup in MaterialAdminSite.register() we need to do this
        # hack to allow overriding the default implementation.
        model_admin_override = getattr(self, '_has_module_permission', None)
        if model_admin_override and callable(model_admin_override):
            return model_admin_override(request)
        # We tie module permission to view permission for the model, so that things are
        # hidden on the index page if we remove the view permission.
        opts = self.opts
        codename = get_permission_codename('view', opts)
        return request.user.has_perm("%s.%s" % (opts.app_label, codename))
