# Generated by Django 4.2.7 on 2025-07-20 12:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='WebsiteAnalysis',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('url', models.URLField()),
                ('domain', models.CharField(max_length=255)),
                ('overall_score', models.IntegerField()),
                ('contrast_score', models.IntegerField()),
                ('structure_score', models.IntegerField()),
                ('navigation_score', models.IntegerField()),
                ('content_score', models.IntegerField()),
                ('issues', models.JSONField(default=list)),
                ('analysis_date', models.DateTimeField(auto_now_add=True)),
                ('analyzed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'website_analyses',
                'ordering': ['-analysis_date'],
            },
        ),
        migrations.CreateModel(
            name='AccessibilitySettings',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('contrast_level', models.IntegerField(default=100)),
                ('text_size', models.FloatField(default=1.0)),
                ('line_height', models.FloatField(default=1.5)),
                ('letter_spacing', models.FloatField(default=0.0)),
                ('highlight_links', models.BooleanField(default=False)),
                ('dark_mode', models.BooleanField(default=False)),
                ('color_blindness_filter', models.CharField(choices=[('none', 'None'), ('protanopia', 'Protanopia'), ('deuteranopia', 'Deuteranopia'), ('tritanopia', 'Tritanopia')], default='none', max_length=20)),
                ('dyslexia_font', models.BooleanField(default=False)),
                ('pause_animations', models.BooleanField(default=False)),
                ('hide_images', models.BooleanField(default=False)),
                ('reading_mode', models.BooleanField(default=False)),
                ('cursor_size', models.FloatField(default=1.0)),
                ('voice_control', models.BooleanField(default=False)),
                ('ai_suggestions', models.BooleanField(default=True)),
                ('keyboard_navigation', models.BooleanField(default=False)),
                ('version', models.IntegerField(default=1)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accessibility_settings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'accessibility_settings',
                'ordering': ['-updated_at'],
            },
        ),
        migrations.CreateModel(
            name='AccessibilityPreset',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('preset_type', models.CharField(choices=[('dyslexia', 'Dyslexia Support'), ('low_vision', 'Low Vision'), ('motor', 'Motor Impairment'), ('cognitive', 'Cognitive Support'), ('custom', 'Custom')], max_length=50)),
                ('settings', models.JSONField()),
                ('is_system', models.BooleanField(default=True)),
                ('usage_count', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'accessibility_presets',
                'ordering': ['name'],
            },
        ),
    ]
