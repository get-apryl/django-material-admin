import pytz
from django.contrib.admin.forms import AdminAuthenticationForm
from django.forms import HiddenInput, CharField
from django.utils import timezone
from django_otp.admin import OTPAdminAuthenticationForm


class BackofficeAuthenticationForm(OTPAdminAuthenticationForm):
    timezone = CharField(widget=HiddenInput, max_length=64, required=False)

    def clean_timezone(self):
        tz = self.data['timezone']
        try:
            cleaned = pytz.timezone(tz)
        except pytz.exceptions.UnknownTimeZoneError:
            cleaned = None
        else:
            timezone.activate(cleaned)
            self.request.session['django_timezone'] = str(cleaned)

        return cleaned
