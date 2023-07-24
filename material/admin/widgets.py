import decimal
import json
import typing as t

from django import forms
from django.contrib.admin import widgets
from django.utils.safestring import mark_safe
from djmoney.forms import MoneyWidget

StrKeyDict = t.Dict[str, t.Any]
OptStrKeyDict = t.Optional[StrKeyDict]


class BaseEditableWidget:
    classes: t.List[str] = ["materialize-editable"]
    editable_widget = True

    def __init__(self, attrs: OptStrKeyDict = None, **kwargs):
        attrs = attrs or {}
        classes = self.__class__.classes.copy()
        classes.extend(attrs.pop("class", "").split(" "))
        super().__init__(attrs={"class": " ".join(classes), **(attrs or {})}, **kwargs)


class MaterialAdminEditableTextInput(BaseEditableWidget, widgets.AdminTextInputWidget):
    pass


class MaterialAdminEditableUrlInput(BaseEditableWidget, widgets.AdminURLFieldWidget):
    classes = ["materialize-editable", "vURLField"]


class MaterialAdminDateWidget(widgets.AdminDateWidget):
    """Date widget with material specific styling"""

    template_name = "material/admin/widgets/date.html"

    def __init__(self, attrs=None, format=None):
        attrs = {"class": "datepicker", "size": "10", **(attrs or {})}
        super().__init__(attrs=attrs, format=format)

    @property
    def media(self):
        return forms.Media(
            js=["material/admin/js/widgets/DateInput.js"],
            css={"all": ("material/admin/css/date-input.min.css",)},
        )


class MaterialAdminEditableDateWidget(BaseEditableWidget, MaterialAdminDateWidget):
    classes = ["materialize-editable", "datepicker"]

    def __init__(self, attrs=None, format=None):
        attrs = {"size": "10", "materialize_editable": True, **(attrs or {})}
        super().__init__(attrs=attrs, format=format)


class MaterialAdminSplitDateTime(forms.SplitDateTimeWidget):
    """A SplitDateTime Widget with material specific styling"""

    template_name = "material/admin/widgets/split_datetime.html"

    class Media:
        js = [
            "material/admin/js/widgets/TimeServerDiff.js",
            "material/admin/js/widgets/DateInput.js",
            "material/admin/js/widgets/TimeInput.js",
        ]
        css = {"all": ("material/admin/css/split_datetime.min.css",)}

    def __init__(
        self,
        attrs=None,
        date_format=None,
        time_format=None,
        date_attrs=None,
        time_attrs=None,
    ):
        date_attrs = date_attrs or {}
        date_attrs.update({"class": "datepicker"})
        time_attrs = time_attrs or {}
        time_attrs.update({"class": "timepicker"})
        super().__init__(attrs, date_format, time_format, date_attrs, time_attrs)


class MaterialAdminTimeWidget(forms.TimeInput):
    """Time input with material css styles"""

    template_name = "material/admin/widgets/time.html"

    @property
    def media(self):
        return forms.Media(
            js=[
                "material/admin/js/widgets/TimeServerDiff.js",
                "material/admin/js/widgets/TimeInput.js",
            ],
            css={"all": ("material/admin/css/time-input.min.css",)},
        )


class MaterialAdminTextareaWidget(widgets.AdminTextareaWidget):
    """Textarea with material css styles"""

    def __init__(self, attrs=None):
        super().__init__(attrs={"class": "materialize-textarea", **(attrs or {})})


class MaterialAdminEditableTextArea(BaseEditableWidget, widgets.AdminTextareaWidget):
    def __init__(self, attrs=None):
        super().__init__(attrs={"class": "materialize-textarea", **(attrs or {})})


class MaterialAdminEditableCheckbox(BaseEditableWidget, forms.CheckboxInput):
    template_name = "material/admin/widgets/checkbox.html"
    classes: t.List[str] = ["materialize-editable-checkbox", "hide"]


class MaterialAdminNumberWidget(widgets.AdminTextInputWidget):
    """Degrade NumberInput to TextInput for better UI, but set inputMode"""

    inputmode = "numeric"
    placeholder = "-"

    def __init__(self, attrs: t.Optional[t.Dict[str, t.Any]] = None):
        attrs = attrs or {}
        attrs.pop("step", None)
        attrs.pop("min", None)
        attrs.pop("max", None)
        attrs.update(
            type="text", inputmode=self.inputmode, placeholder=self.placeholder
        )
        super().__init__(attrs=attrs)


class MaterialAdminMoneyWidget(MoneyWidget):
    template_name = "material/admin/widgets/money.html"

    @property
    def media(self):
        return forms.Media(css={"all": ("material/admin/css/money_widget.min.css",)})


class MaterialAdminMoneyAmountWidget(MaterialAdminNumberWidget):
    inputmode = "decimal"

    def __init__(self, attrs: t.Optional[t.Dict[str, t.Any]] = None):
        attrs = attrs or {}
        if "class" in attrs:
            attrs["class"] += " amount"
        else:
            attrs["class"] = "amount"

        super().__init__(attrs)

    def format_value(self, value):
        if isinstance(value, decimal.Decimal):
            return str(
                value.quantize(decimal.Decimal("0.01"), rounding=decimal.ROUND_HALF_UP)
            )
        else:
            return super().format_value(value)


class MaterialAdminMoneyStaticCurrencyWidget(forms.Widget):
    template_name = "material/admin/widgets/currency-static.html"


class MaterialAdminEditableMoneyAmountWidget(
    BaseEditableWidget, MaterialAdminMoneyAmountWidget
):
    pass


class MaterialAdminCalculatedMoneyAmountWidget(MaterialAdminMoneyAmountWidget):
    template_name = "material/admin/widgets/amount-calculated.html"


class MaterialAdminEditableSelect(BaseEditableWidget, forms.Select):
    classes = ["materialize-editable-select"]


class MaterialAdminCuidWidget(BaseEditableWidget, widgets.AdminTextInputWidget):
    def __init__(self, attrs=None):
        super().__init__(attrs={"class": "materialize-cuid", **(attrs or {})})


class MaterialAdminHiddenCuidWidget(forms.HiddenInput):
    def __init__(self, attrs=None):
        super().__init__(attrs={"class": "materialize-cuid", **(attrs or {})})


class MaterialAdminAutocompleteWidget(widgets.AutocompleteSelect):
    def __init__(
        self,
        field,
        admin_site,
        display_field: str = "",
        **kwargs
    ):
        self.display_field = display_field
        super().__init__(field, admin_site, **kwargs)

    def render(self, name, value, attrs=None, renderer=None):
        _ac = super().render(name, value, attrs=attrs, renderer=renderer)
        hidden = mark_safe(
            f'<div class="materialize-hidden-autocomplete">\n{_ac}\n</div>'
        )
        if value and self.display_field:
            obj = self.field.remote_field.model.objects.get(pk=value)
            value = getattr(obj, self.display_field, None)

        value = value or '-'
        return mark_safe(
            f'<input id="id_{name}" name="{name}" value="{value}" type="text" class="materialize-editable-autocomplete" readonly>\n{hidden}'
        )




class MaterialAdminAutocompleteMultipleWidget(
    widgets.AutocompleteSelectMultiple
):
    def __init__(
        self,
        field,
        admin_site,
        display_field: str = "",
        **kwargs
    ):
        self.display_field = display_field
        super().__init__(field, admin_site, **kwargs)

    def render(self, name, value, attrs=None, renderer=None):
        _ac = super().render(name, value, attrs=attrs, renderer=renderer)
        hidden = mark_safe(
            f'<div class="materialize-hidden-autocomplete">\n{_ac}\n</div>'
        )
        values = []
        if value and self.display_field:
            values: t.List[str] = list(self.field.remote_field.model.objects.filter(pk__in=value).values_list(self.display_field, flat=True))
        elif value:
            values: t.List[str] = [str(obj) for obj in self.field.remote_field.model.objects.filter(pk__in=value)]


        if values:
            value = ", ".join(values)
        else:
            value = '-'

        return mark_safe(
            f'<input id="id_{name}" name="{name}" value="{value}" type="text" class="materialize-editable-autocomplete" readonly>\n{hidden}'
        )


class MaterialJsonOutputWidget(forms.Textarea):
    template_name = "material/admin/widgets/json.html"

    class Media:
        js = ["admin/js/highlight.min.js", "admin/js/highlight-init.js"]
        css = {"screen": ["admin/css/highlight/night-owl.min.css"]}

    def format_value(self, value):
        if not value:
            return value
        try:
            data = json.loads(value)
        except json.JSONDecodeError:
            return value
        return json.dumps(data, indent=2)
