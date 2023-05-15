from django.forms import DecimalField, ChoiceField
from djmoney.forms.fields import MoneyField
from djmoney.settings import CURRENCY_CHOICES, DECIMAL_PLACES

from .widgets import (
    MaterialAdminMoneyWidget,
    MaterialAdminEditableMoneyAmountWidget,
    MaterialAdminMoneyAmountWidget,
    MaterialAdminEditableSelect,
    MaterialAdminMoneyStaticCurrencyWidget,
    MaterialAdminCalculatedMoneyAmountWidget,
)


class AdminMoneyField(MoneyField):
    amount_widget = MaterialAdminMoneyAmountWidget

    def __init__(
            self,
            *,
            currency_widget=None,
            currency_choices=CURRENCY_CHOICES,
            max_value=None,
            min_value=None,
            max_digits=None,
            decimal_places=DECIMAL_PLACES,
            default_amount=None,
            default_currency=None,
            **kwargs,
    ):
        amount_field = DecimalField(
            max_value=max_value,
            min_value=min_value,
            max_digits=max_digits,
            decimal_places=decimal_places,
            **kwargs,
        )
        currency_field = ChoiceField(choices=currency_choices)

        self.widget = MaterialAdminMoneyWidget(
            amount_widget=self.amount_widget,
            currency_widget=currency_widget or currency_field.widget,
            default_currency=default_currency,
        )

        # The two fields that this widget comprises
        fields = (amount_field, currency_field)
        super(MoneyField, self).__init__(fields, **kwargs)

        # set the initial value to the default currency so that the
        # default currency appears as the selected menu item
        self.initial = [default_amount, default_currency]

class EditableAdminMoneyField(AdminMoneyField):
    amount_widget = MaterialAdminEditableMoneyAmountWidget

    def __init__(self, *, currency_choices=CURRENCY_CHOICES, **kwargs):
        currency_widget = MaterialAdminEditableSelect(choices=currency_choices)
        super().__init__(currency_widget=currency_widget, **kwargs)

class EditableAdminMoneyStaticCurrencyField(AdminMoneyField):
    amount_widget = MaterialAdminEditableMoneyAmountWidget

    def __init__(self, *args, **kwargs):
        currency_widget = MaterialAdminMoneyStaticCurrencyWidget()
        super().__init__(currency_widget=currency_widget, **kwargs)


class CalculatedAdminMoneyField(EditableAdminMoneyStaticCurrencyField):
    amount_widget = MaterialAdminCalculatedMoneyAmountWidget
