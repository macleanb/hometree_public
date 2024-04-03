from django.db import models
# TODO update to incorporate time zones
#from django.utils import timezone
import datetime
# from django.utils import timezone

from users.models import HOAUser
from address_api.models import Address


class Residence(models.Model):
    """
    This class represents residences in an HOA community
    """
    fk_Address = models.ForeignKey(
        Address,
        on_delete=models.CASCADE,
        related_name='addresses',
        blank=False,
        null=False
    )

    join_date = models.DateField(default=datetime.date.today)
    lat = models.FloatField(blank=True, null=True)
    lng = models.FloatField(blank=True, null=True)

    class Meta:
        """
        This class provides Meta settings to the Residence class
        """
        constraints = [
            models.UniqueConstraint(fields=['fk_Address'], name="%(app_label)s_%(class)s_unique")
        ]

        permissions = (
            ("can_view_all_residences", "Can view ALL residences"),
            ("can_create_all_residences", "Can create ALL residences"), # beyond just a single residence
            ("can_update_all_residences", "Can update ALL residences"),
            ("can_delete_all_residences", "Can delete ALL residences"),
        )

    def __str__(self):
        return f'ID: {self.id} fk_Address: {self.fk_Address.__str__()} lat: {self.lat} lng: {self.lng}'


class HOAUser_Residence(models.Model):
    """
    This class is a join table between HOAUser objects and Residence objects
    """
    fk_HOAUser = models.ForeignKey(
        HOAUser,
        on_delete=models.CASCADE,
        related_name='users',
        blank=False,
        null=False,
    )

    fk_Residence = models.ForeignKey(
        Residence,
        on_delete=models.CASCADE,
        related_name='residences',
        blank=False,
        null=False
    )

    purchase_date = models.DateField(default=datetime.date.today)

    class Meta:
        """
        This class provides Meta settings to the HOAUser_Residence class
        """
        constraints = [
            models.UniqueConstraint(
                fields=['fk_HOAUser', 'fk_Residence'],
                name="%(app_label)s_%(class)s_unique"
            )
        ]

        permissions = (
            ("can_view_all_hoauser_residences", "Can view ALL hoauser_residences"),
            ("can_create_all_hoauser_residences", "Can create ALL hoauser_residences"),
            ("can_update_all_hoauser_residences", "Can update ALL hoauser_residences"),
            ("can_delete_all_hoauser_residences", "Can delete ALL hoauser_residences"),
        )

    def __str__(self):
        return f'ID: {self.id} fk_HOAUser: {self.fk_HOAUser} fk_Residence: {self.fk_Residence}'

