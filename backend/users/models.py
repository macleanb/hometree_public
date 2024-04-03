# From https://testdriven.io/blog/django-custom-user-model/

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group, Permission, ContentType
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import HOAUserManager
from address_api.models import Address


class HOAUser(AbstractBaseUser, PermissionsMixin):
    # Removes the username field from the class, only needed for
    # AbstractUser but not AbstractBaseUser
    # username = None

    # Makes the email field required and unique
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(max_length=150, verbose_name='first name')
    last_name = models.CharField(max_length=150, verbose_name='last name')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    fk_mailing_address = models.ForeignKey(Address, on_delete=models.SET_DEFAULT, related_name='HOAUsers', blank=True, null=True, default=None)
    image = models.ImageField(verbose_name='Image', upload_to='images', blank=True, null=True)

    # Sets the unique identifier for the User model to email
    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    # All objects for the class must come from HOAUserManager
    objects = HOAUserManager()

    # Reference: https://stackoverflow.com/questions/10252332/how-to-add-permissions-in-django-to-models-and-test-it-using-the-shell
    class Meta:
        permissions = (
            ("can_view_all_hoausers", "Can view ALL hoausers"),
            ("can_update_all_hoausers", "Can update ALL hoausers"),
            ("can_delete_all_hoausers", "Can delete ALL hoausers"),
        )

    def __str__(self):
        return self.email

#################################
### Permissions Seed Commands ###
#################################

# Be sure to comment these out after runserver operation, it will raise
# errors on subsequent runs because these objects will already exist in the
# database.

# Add a Group called Administrators.  
# admin_group = Group(name="Administrators")
# admin_group.save()

# Give Administrators Group some Permissions
# admin_group = Group.objects.get(name="Administrators")
# admin_group.permissions.add(50) # 'Can view ALL hoausers'
# admin_group.permissions.add(51) # 'Can update ALL hoausers'
# admin_group.permissions.add(52) # 'Can delete ALL hoausers'
