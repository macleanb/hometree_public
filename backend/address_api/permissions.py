# This is just needed to supplement built-in DjangoModelPermissions
# with a custom permission for GET
from rest_framework.permissions import BasePermission

def user_has_perm(user, required_perm, perm_codename):
    # Get all the groups the user belongs to and see if any contain
    # the required permission
    if user:
        groups = user.groups.all()

        if groups:
            for group in groups:
                perms = group.permissions.all()

                if perms:
                    for perm in perms:
                        if perm.name == required_perm:
                            return True

    return user.has_perm(perm_codename)


# Reference: https://stackoverflow.com/questions/19313314/django-rest-framework-viewset-per-action-permissions
class AddressPermissions(BasePermission):
    """
    Comprehensive permissions class for addresses, based on which view is being requested
    and what kind of permissions the user has.
    """

    # Model Permissions.  Use only as needed since DjangoModelPermissions in 
    # the AddressViewSet permissionclasses will enforce all model permissions
    def has_permission(self, request, view):
        # Deny actions on objects if the user is not authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        # This will prevent basic users from creating more addresses if they 
        # already have a mailing address.  But we also need to ensure that
        # they don't have delete permissions on mailing addresses, otherwise
        # they could just delete their mailing address and then go on to create
        # an infinite number of mailing addresses.
        if view.action == 'create':
            if user_has_perm(request.user, 'Can create ALL addresses', 'address_api.can_create_all_addresses'):
                return True
            elif user_has_perm(request.user, 'Can add address', 'address_api.add_address') and request.user.fk_mailing_address is None:
                return True
            else:
                return False
        elif view.action == 'list':
            return user_has_perm(request.user, 'Can view ALL addresses', 'address_api.can_view_all_addresses')
        # elif view.action == 'create':
        #     return True
        # elif view.action in ['retrieve', 'update', 'partial_update', 'destroy']:
        #     return True
        # else:
        #     return False
        return True

    # Object Permissions
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        if view.action == 'retrieve':
            return obj == request.user.fk_mailing_address or user_has_perm(request.user, 'Can view ALL addresses', 'address_api.can_view_all_addresses')
        elif view.action in ['update', 'partial_update']:
            return obj == request.user.fk_mailing_address or user_has_perm(request.user, 'Can update ALL addresses', 'address_api.can_update_all_addresses')
        elif view.action == 'destroy':
            return obj == request.user.fk_mailing_address or user_has_perm(request.user, 'Can delete ALL addresses', 'address_api.can_delete_all_addresses')
        else:
            return False
