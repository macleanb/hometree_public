"""
URL configuration for hoa_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from users.views import *
from hoa_api.views import AllUsersForAllResidencesView, AllResidencesForAllUsersView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/users/', include('users.urls')),
    path('api/v1/residences/users/', AllUsersForAllResidencesView.as_view(), name='all_users_for_all_residences'),
    path('api/v1/users/residences/', AllResidencesForAllUsersView.as_view(), name='all_residences_for_all_users'),
    path('api/v1/announcements/', include('announcement_api.urls')),
    path('api/v1/residences/', include('hoa_api.urls')),
    path('api/v1/addresses/', include('address_api.urls')),
    path('api/v1/policies/', include('policy_api.urls')),
    path('api/v1/weather/', include('weather_api.urls')),
    path('api/v1/validateaddress/', include('address_validation.urls')),
    path('api/v1/map/', include('map_api.urls')),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
