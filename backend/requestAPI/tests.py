from .tests.views.test_auth_viewset import AuthViewSetTests
from .tests.views.test_building_viewset import BuildingViewSetTests
from .tests.views.test_service_request_viewset import ServiceRequestViewSetTests
from .tests.views.test_service_type_viewset import ServiceTypeViewSetTests
from .tests.views.test_update_viewset import UpdateViewSetTests
from .tests.views.test_user_viewset import UserViewSetTests
from .tests.test_models import ModelTests
from .tests.test_serializers import SerializerTests

# import all tests here so (python manage.py test) can find