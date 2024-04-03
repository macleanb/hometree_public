#from .views import HOAUserResidenceViewSet
from .views import UsersForResidenceView, UserForResidenceView
from .views import ResidenceViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path

app_name = 'hoa_api'

residence_router = DefaultRouter()
residence_router.register(r'', ResidenceViewSet, basename='residence_viewset') # additional views in project urls

urlpatterns = residence_router.urls
urlpatterns.append(path('<int:residence_id>/users/', UsersForResidenceView.as_view(), name='users_for_residence'))
urlpatterns.append(path('<int:residence_id>/users/<int:user_id>/', UserForResidenceView.as_view(), name='user_for_residence'))
