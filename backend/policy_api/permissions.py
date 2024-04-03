from rest_framework.permissions import BasePermission
from rest_framework import permissions
from hoa_api.models import HOAUser_Residence

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


class PolicyPermissions(BasePermission):
    """
    Comprehensive permissions class for policies, based on which view is being requested
    and what kind of permissions the user has.
    """

    # Model Permissions.  Use only as needed since DjangoModelPermissions in 
    # the PolicyViewSet permissionclasses will enforce all model permissions
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


class PolicyOptionPermissions(BasePermission):
    """
    Comprehensive permissions class for PolicyOption, based on which view is being requested
    and what kind of permissions the user has.
    """

    # Model Permissions.  Use only as needed since DjangoModelPermissions in 
    # the PolicyViewSet permissionclasses will enforce all model permissions
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


class ResidencePolicyChoicePermissions(BasePermission):
    """
    Comprehensive permissions class for ResidencePolicyChoice, based on which view is being requested
    and what kind of permissions the user has.
    """

    # Model Permissions.  Use only as needed since DjangoModelPermissions in 
    # the PolicyViewSet permissionclasses will enforce all model permissions
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
        
        # Create/delete only if request.user owns fk_Residence
        if request.method in permissions.SAFE_METHODS: # GET, OPTIONS, HEAD
            return True
        
        # for write operations
        residence_id = obj.fk_Residence
        residence_owner_record = HOAUser_Residence.objects.filter(
            fk_Residence=residence_id,
            fk_HOAUser = request.user.id
        ).first()

        if residence_owner_record is not None:
            # request.user owns the residence
            return True

        return False