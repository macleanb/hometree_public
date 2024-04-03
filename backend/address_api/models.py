from django.db import models
from django.contrib.auth.models import Group, Permission

class Address(models.Model):
    street = models.CharField(max_length=200, blank=False, null=False)
    street_2 = models.CharField(max_length=200, blank=True, null=True, default=None)
    city = models.CharField(max_length=200, blank=False, null=False)
    addr_state = models.CharField(max_length=200, blank=False, null=False)
    zipcode = models.IntegerField(blank=False, null=False)
    image = models.ImageField(verbose_name='Image', upload_to='images', blank=True, null=True)


    class Meta:
        permissions = (
            ("can_view_all_addresses", "Can view ALL addresses"),
            ("can_create_all_addresses", "Can create ALL addresses"), # beyond just a single mailing address
            ("can_update_all_addresses", "Can update ALL addresses"),
            ("can_delete_all_addresses", "Can delete ALL addresses"),
        )

        """
        This constraint is commented to ALLOW duplicate addresses.
        Otherwise, users sharing the same address wouldn't be able to
        update their address without affecting other users.
        """
        # constraints = [
        #     models.UniqueConstraint(fields=['street', 'street_2', 'city', 'addr_state', 'zipcode'], name="%(app_label)s_%(class)s_unique")
        # ]

    def __str__(self):
        return f'ID: {self.id} ' \
               f'Street {self.street} ' \
               f'Street2: {self.street_2} ' \
               f'City: {self.city} ' \
               f'State: {self.addr_state} ' \
               f'Zip: {self.zipcode}'


#################################
### Permissions Seed Commands ###
#################################

# Be sure to comment these out after runserver operation, it will raise
# errors on subsequent runs because these objects will already exist in the
# database.

# Give Administrators Group some Permissions
# admin_group = Group.objects.get(name="Administrators")
# admin_group.permissions.add(53) # 'Can view ALL addresses'
# admin_group.permissions.add(56) # 'Can add ALL addresses' (beyond just a mailing address)
# admin_group.permissions.add(54) # 'Can update ALL addresses'
# admin_group.permissions.add(55) # 'Can delete ALL addresses'
