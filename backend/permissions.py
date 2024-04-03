# run this file with: python manage.py shell < permissions.py

from django.contrib.auth.models import User, Group, Permission, ContentType
from users.models import HOAUser

# # users = HOAUser.objects.all()

# # Permissions
# Permission.objects.all().delete()


# Helper: print all Permission IDs, names, codenames:
existing_permissions = Permission.objects.all()
if existing_permissions:
    for perm in existing_permissions:
        print(
                f'Permission ID: {perm.id}, ' \
                f'app: {perm.content_type.app_label}, ' \
                f'model: {perm.content_type.model}, ' \
                f'perm_name: {perm.name}, ' \
                f'codename: {perm.codename}'
            )

# perm_to_delete = Permission.objects.get(pk=44)
# perm_to_delete.delete()
# perm_to_delete = Permission.objects.get(pk=45)
# perm_to_delete.delete()
# perm_to_delete = Permission.objects.get(pk=27)
# perm_to_delete.delete()
# perm_to_delete = Permission.objects.get(pk=28)
# perm_to_delete.delete()
# perm_to_delete = Permission.objects.get(pk=29)
# perm_to_delete.delete()
# perm_to_delete = Permission.objects.get(pk=42)
# perm_to_delete.delete()
# perm_to_delete = Permission.objects.get(pk=46)
# perm_to_delete.delete()
# perm_to_delete = Permission.objects.get(pk=47)
# perm_to_delete.delete()

# # Groups
#--------------------------------------------
# admin_group = Group.objects.get(name="Administrators")
# content_type = ContentType.objects.get_for_model(HOAUser)
#--------------------------------------------
# view_all_users = Permission(name="View All Users", codename="view_all_users", content_type=content_type)
# view_all_users.save()
# admin_group.permissions.add(view_all_users)
# update_all_users = Permission(name="Update All Users", codename="update_all_users", content_type=content_type)
# update_all_users.save()
# admin_group.permissions.add(update_all_users)
# delete_all_users = Permission(name="Delete All Users", codename="delete_all_users", content_type=content_type)
# delete_all_users.save()
# admin_group.permissions.add(delete_all_users)
#---------------------------------------------
# view_all_addresses = Permission(name="View All Addresses", codename="view_all_addresses", content_type=content_type)
# view_all_addresses.save()
# admin_group.permissions.add(view_all_addresses)
# update_all_addresses = Permission(name="Update All Addresses", codename="update_all_addresses", content_type=content_type)
# update_all_addresses.save()
# admin_group.permissions.add(update_all_addresses)
# delete_all_addresses = Permission(name="Delete All Addresses", codename="delete_all_addresses", content_type=content_type)
# delete_all_addresses.save()
# admin_group.permissions.add(delete_all_addresses)
# view_all_user_residences = Permission(name="View All User Residences", codename="view_all_user_residences", content_type=content_type)
# view_all_user_residences.save()
# admin_group.permissions.add(view_all_user_residences)
# update_all_user_residences = Permission(name="Update All User Residences", codename="update_all_user_residences", content_type=content_type)
# update_all_user_residences.save()
# admin_group.permissions.add(update_all_user_residences)
# delete_all_user_residences = Permission(name="Delete All User Residences", codename="delete_all_user_residences", content_type=content_type)
# delete_all_user_residences.save()
# admin_group.permissions.add(delete_all_user_residences)
#-----------------------------------------------
# assign_all_permissions = Permission(name="Can assign ALL permissions", codename="can_assign_all_permissions", content_type=content_type)
# assign_all_permissions.save()
# admin_group.permissions.add(assign_all_permissions)

# admin_group = Group(name="admin_group")
# admin_group.save()

# basic_user_group = Group(name="basic_user_group")
# basic_user_group.save()

# # Add Permissions to Groups
# admin_group.permissions.add(update_all_beers)
# admin_group.permissions.add(delete_all_beers)

# #Users
# admin = User.objects.get(id=4)
# if admin:
#     admin.groups.add(admin_group)
# else:
#     print('admin user not found!')
