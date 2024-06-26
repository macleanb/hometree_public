# Generated by Django 4.2.7 on 2024-01-15 21:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hoa_api', '0002_residence_lat_residence_lng'),
        ('policy_api', '0003_policyoption_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResidencePolicyChoice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('make_public', models.BooleanField(default=True)),
                ('fk_Policy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='residencepolicychoices', to='policy_api.policy')),
                ('fk_PolicyOption', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='residencepolicychoices', to='policy_api.policyoption')),
                ('fk_Residence', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='residencepolicychoices', to='hoa_api.residence')),
            ],
        ),
        migrations.AddConstraint(
            model_name='residencepolicychoice',
            constraint=models.UniqueConstraint(fields=('fk_Residence', 'fk_Policy'), name='policy_api_residencepolicychoice_unique'),
        ),
    ]
