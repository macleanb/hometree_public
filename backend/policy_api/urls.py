from .views import PolicyViewSet, PolicyOptionViewSet, ResidencePolicyChoiceViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path

app_name = 'policy_api'

policy_router = DefaultRouter()
policy_router.register(r'', PolicyViewSet, basename='policy_viewset') # responds to '/' and '/<int:policy_id>/'
urlpatterns = policy_router.urls

urlpatterns.append(path('<int:policy_id>/options/', PolicyOptionViewSet.as_view({
    'get': 'list', # only allow list and create at /options/
    'post': 'create'
}), name='policy_options_viewset'))
urlpatterns.append(path('<int:policy_id>/options/<int:pk>/', PolicyOptionViewSet.as_view({
    'get': 'retrieve', # only allow retrieve and destroy (no update)
    'delete': 'destroy'
}), name='policy_options_detail_viewset'))

urlpatterns.append(path('<int:policy_id>/residencepolicychoices/', ResidencePolicyChoiceViewSet.as_view({
    'get': 'list', # only allow list and create at /options/
    'post': 'create'
}), name='policy_choices_viewset'))
urlpatterns.append(path('<int:policy_id>/residencepolicychoices/<int:pk>/', ResidencePolicyChoiceViewSet.as_view({
    'get': 'retrieve', # only allow retrieve and update (no destroy)
    'patch': 'partial_update'
}), name='policy_choices_detail_viewset'))