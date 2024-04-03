from django.db import models
from django.utils import timezone
from users.models import HOAUser

class Announcement(models.Model):
    title = models.CharField(
        max_length=200,
        blank=False,
        null=False
    )
    bodytext = models.TextField(
        blank=True,
        null=True,
        default=None
    )
    created_datetime = models.DateTimeField(
        default=timezone.now
    )
    fk_Author = models.ForeignKey(
        HOAUser,
        on_delete=models.CASCADE,
        related_name='authors',
        blank=True,
        null=True,
    )
    image = models.ImageField(
        verbose_name='Image',
        upload_to='images',
        blank=True,
        null=True
    )


    class Meta:
        # permissions = (
        #     ("can_view_all_announcements", "Can view ALL announcements"),
        #     ("can_create_all_announcements", "Can create ALL announcements"),
        #     ("can_update_all_announcements", "Can update ALL announcements"),
        #     ("can_delete_all_announcements", "Can delete ALL announcements"),
        # )

        constraints = [
            models.UniqueConstraint(fields=['title'], name="%(app_label)s_%(class)s_unique")
        ]

    def __str__(self):
        return f'ID: {self.id} ' \
               f'Title {self.title} ' \
               f'BodyText: {self.bodytext} ' \
               f'CreatedDateTime: {self.created_datetime} ' \
               f'Author: {self.fk_Author} '

#################################
### Permissions Seed Commands ###
#################################

# Be sure to comment these out after runserver operation, it will raise
# errors on subsequent runs because these objects will already exist in the
# database.

# Give Administrators Group some Permissions
# admin_group = Group.objects.get(name="Administrators")
# admin_group.permissions.add(53) # 'Can view ALL announcements'
# admin_group.permissions.add(56) # 'Can add ALL announcements'
# admin_group.permissions.add(54) # 'Can update ALL announcements'
# admin_group.permissions.add(55) # 'Can delete ALL announcements'