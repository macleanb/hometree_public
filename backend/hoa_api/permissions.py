from rest_framework.permissions import BasePermission
from .models import HOAUser_Residence

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



class HOAUser_ResidencePermissions(BasePermission):
    """
    Comprehensive permissions class for HOAUser_Residences, based on which view is being requested
    and what kind of permissions the user has.
    """

    # Model Permissions
    def has_permission(self, request, view):
        # Deny actions on objects if the user is not authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        return True

    # Object Permissions. andle GET, PUT, PATCH, DELETE operations on a specific object
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method == 'GET':
            if user_has_perm(request.user, 'Can view ALL hoauser_residences', 'hoa_api.can_view_all_hoauser_residences'):
                return True
            elif obj.fk_HOAUser == request.user and user_has_perm(request.user, 'Can view hoa user_ residence', 'hoa_api.view_hoauser_residence'):
                return True
            return False
        elif request.method == 'POST':
            if user_has_perm(request.user, 'Can create ALL hoauser_residences', 'hoa_api.can_create_all_hoauser_residences'):
                return True
            return False
        
        # elif request.method == 'PUT' or request.method == 'PATCH':
        #     if user_has_perm(request.user, 'Can update ALL hoauser_residences', 'hoa_api.can_update_all_hoauser_residences'):
        #         return True
        #     elif obj.fk_HOAUser == request.user and user_has_perm(request.user, 'Can change hoa user_ residence', 'hoa_api.change_hoauser_residence'):
        #         return True
        #     return False
        
        elif request.method == 'DELETE':
            return user_has_perm(request.user, 'Can delete ALL hoauser_residences', 'hoa_api.can_delete_all_hoauser_residences')
        else:
            return False


# Reference: https://stackoverflow.com/questions/19313314/django-rest-framework-viewset-per-action-permissions
class ResidencePermissions(BasePermission):
    """
    Comprehensive permissions class for residences, based on which view is being requested
    and what kind of permissions the user has.
    """

    # Model Permissions.  Use only as needed since DjangoModelPermissions in 
    # the ResidenceViewSet permissionclasses will enforce all model permissions
    def has_permission(self, request, view):
        # Deny actions on objects if the user is not authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        if view.action == 'create':
            return user_has_perm(request.user, 'Can create ALL residences', 'hoa_api.can_create_all_residences')
        elif view.action == 'list':
            return user_has_perm(request.user, 'Can view ALL residences', 'hoa_api.can_view_all_residences')
        return True

    # Object Permissions
    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        if view.action == 'retrieve':
            if user_has_perm(request.user, 'Can view ALL residences', 'hoa_api.can_view_all_residences'):
                return True
            
            filtered_HOAUser_Residence = HOAUser_Residence.objects.filter(
                fk_HOAUser=request.user,
                fk_Residence=obj
            ).first()

            return filtered_HOAUser_Residence is not None and user_has_perm(request.user, 'Can view residence', 'hoa_api.view_residence')
        elif view.action in ['update', 'partial_update']:
            if user_has_perm(request.user, 'Can update ALL residences', 'hoa_api.can_update_all_residences'):
                return True
            
            filtered_HOAUser_Residence = HOAUser_Residence.objects.filter(
                fk_HOAUser=request.user,
                fk_Residence=obj
            ).first()

            return filtered_HOAUser_Residence is not None and user_has_perm(request.user, 'Can change residence', 'hoa_api.change_residence')
        elif view.action == 'destroy':
            return user_has_perm(request.user, 'Can delete ALL residences', 'hoa_api.can_delete_all_residences')
        else:
            return False
