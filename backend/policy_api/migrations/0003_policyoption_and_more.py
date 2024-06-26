# Generated by Django 4.2.7 on 2024-01-14 00:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('policy_api', '0002_remove_policy_effective_datetime_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='PolicyOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('option_text', models.CharField(max_length=200)),
                ('fk_Policy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='policies', to='policy_api.policy')),
            ],
        ),
        migrations.AddConstraint(
            model_name='policyoption',
            constraint=models.UniqueConstraint(fields=('option_text', 'fk_Policy'), name='policy_api_policyoption_unique'),
        ),
    ]
