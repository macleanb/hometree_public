from django.contrib import admin
from .models import Policy, PolicyOption, ResidencePolicyChoice

admin.site.register(Policy)
admin.site.register(PolicyOption)
admin.site.register(ResidencePolicyChoice)