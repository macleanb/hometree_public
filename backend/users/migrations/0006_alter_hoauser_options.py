# Generated by Django 4.2.7 on 2023-12-03 13:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_hoauser_image'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='hoauser',
            options={'permissions': (('can_view_all_hoausers', 'Can view ALL hoausers'), ('can_update_all_hoausers', 'Can update ALL hoausers'), ('can_delete_all_hoausers', 'Can delete ALL hoausers'))},
        ),
    ]
