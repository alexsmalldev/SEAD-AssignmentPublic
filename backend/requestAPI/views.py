from django.http import HttpResponse

# Create your views here.

# default view - not used
# see requestAPI.api.views
def home(request):
    return HttpResponse(content="Home Test")
