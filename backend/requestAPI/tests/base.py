
from django.core.cache import cache
from django.test import TestCase, override_settings

@override_settings(REST_FRAMEWORK={
    'DEFAULT_THROTTLE_CLASSES': [],
    'DEFAULT_THROTTLE_RATES': {}
})
class NoThrottleTestCase(TestCase):
    def setUp(self):
        cache.clear()
        super().setUp()
