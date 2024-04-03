from django.db import models
#from django.utils import timezone
import datetime
from users.models import HOAUser
from hoa_api.models import Residence

class Policy(models.Model):
    statement = models.CharField(
        max_length=200,
        blank=False,
        null=False
    )
    question = models.CharField(
        max_length=200,
        blank=False,
        null=False
    )
    description = models.TextField(
        blank=True,
        null=True,
        default=None
    )
    effective_date = models.DateField(
        default=datetime.date.today
    )
    fk_Author = models.ForeignKey(
        HOAUser,
        on_delete=models.CASCADE,
        related_name='policyauthors',
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
        #     ("can_view_all_policies", "Can view ALL policies"),
        #     ("can_create_all_policies", "Can create ALL policies"),
        #     ("can_update_all_policies", "Can update ALL policies"),
        #     ("can_delete_all_policies", "Can delete ALL policies"),
        # )

        constraints = [
            models.UniqueConstraint(fields=['statement'], name="%(app_label)s_%(class)s_unique")
        ]

    def __str__(self):
        return f'ID: {self.id} ' \
               f'Statement {self.statement} ' \
               f'Question: {self.question} ' \
               f'Description: {self.description} ' \
               f'EffectiveDate: {self.effective_date} ' \
               f'Author: {self.fk_Author} '

#################################
### Permissions Seed Commands ###
#################################

# Be sure to comment these out after runserver operation, it will raise
# errors on subsequent runs because these objects will already exist in the
# database.

# Give Administrators Group some Permissions
# admin_group = Group.objects.get(name="Administrators")
# admin_group.permissions.add(xx) # 'Can view ALL policies'
# admin_group.permissions.add(xx) # 'Can add ALL policies'
# admin_group.permissions.add(xx) # 'Can update ALL policies'
# admin_group.permissions.add(xx) # 'Can delete ALL policies'


class PolicyOption(models.Model):
    option_text = models.CharField(
        max_length=200,
    )

    fk_Policy = models.ForeignKey(
        Policy,
        on_delete=models.CASCADE,
        related_name='policies',
    )


    class Meta:
        # permissions = (
        #     ("can_view_all_policy_options", "Can view ALL policy options"),
        #     ("can_create_all_policy_options", "Can create ALL policy options"),
        #     ("can_update_all_policy_options", "Can update ALL policy options"),
        #     ("can_delete_all_policy_options", "Can delete ALL policy options"),
        # )

        constraints = [
            models.UniqueConstraint(fields=['option_text', 'fk_Policy'], name="%(app_label)s_%(class)s_unique")
        ]

    def __str__(self):
        return f'ID: {self.id} ' \
               f'Option Text {self.option_text} ' \
               f'Policy: {self.fk_Policy} '

#################################
### Permissions Seed Commands ###
#################################

# Be sure to comment these out after runserver operation, it will raise
# errors on subsequent runs because these objects will already exist in the
# database.

# Give Administrators Group some Permissions
# admin_group = Group.objects.get(name="Administrators")
# admin_group.permissions.add(xx) # 'Can view ALL policy options'
# admin_group.permissions.add(xx) # 'Can add ALL policy options'
# admin_group.permissions.add(xx) # 'Can update ALL policy options'
# admin_group.permissions.add(xx) # 'Can delete ALL policy options'


class ResidencePolicyChoice(models.Model):
    """
    This class represents policy choices for residences in an HOA community
    """
    fk_Residence = models.ForeignKey(
        Residence,
        on_delete=models.CASCADE,
        related_name='residencepolicychoices',
    )

    fk_Policy = models.ForeignKey(
        Policy,
        on_delete=models.CASCADE,
        related_name='residencepolicychoices',
    )

    fk_PolicyOption = models.ForeignKey(
        PolicyOption,
        on_delete=models.CASCADE,
        related_name='residencepolicychoices',
    )

    make_public = models.BooleanField(default=True)

    class Meta:
            """
            This class provides Meta settings to the ResidencePolicyChoice class.
            The whole purpose of including fk_Policy as a field in this class is to
            enable the unique constraint below.  Without it, it would be difficult to
            enforce only a single PolicyOption for each Policy per Residence
            """
            constraints = [
                models.UniqueConstraint(
                    fields=['fk_Residence', 'fk_Policy'],
                    name="%(app_label)s_%(class)s_unique"
                )
            ]

            # permissions = (
            #     ("can_view_all_residencepolicychoices", "Can view ALL residencepolicychoices"),
            #     ("can_create_all_residencepolicychoices", "Can create ALL residencepolicychoices"),
            #     ("can_update_all_residencepolicychoices", "Can update ALL residencepolicychoices"),
            #     ("can_delete_all_residencepolicychoices", "Can delete ALL residencepolicychoices"),
            # )

    def __str__(self):
        return f'ID: {self.id} fk_Residence: {self.fk_Residence} fk_Policy: {self.fk_Policy} fk_PolicyOption: {self.fk_PolicyOption}'
