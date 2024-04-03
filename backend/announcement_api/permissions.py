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


class AnnouncementPermissions(BasePermission):
    """
    Comprehensive permissions class for announcements, based on which view is being requested
    and what kind of permissions the user has.
    """

    # Model Permissions.  Use only as needed since DjangoModelPermissions in 
    # the AnnouncementViewSet permissionclasses will enforce all model permissions
    def has_permission(self, request, view):
        # Deny actions on objects if the user is not authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        return True

    # Object Permissions
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        return True