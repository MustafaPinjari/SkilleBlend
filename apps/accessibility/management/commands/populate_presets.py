from django.core.management.base import BaseCommand
from apps.accessibility.models import AccessibilityPreset

class Command(BaseCommand):
    help = 'Populate default accessibility presets'
    
    def handle(self, *args, **options):
        presets = [
            {
                'name': 'Dyslexia Support',
                'description': 'Optimized settings for users with dyslexia',
                'preset_type': 'dyslexia',
                'settings': {
                    'dyslexia_font': True,
                    'text_size': 1.2,
                    'line_height': 1.8,
                    'letter_spacing': 0.05,
                    'reading_mode': True,
                    'pause_animations': True
                }
            },
            {
                'name': 'Low Vision Support',
                'description': 'High contrast and large text for low vision users',
                'preset_type': 'low_vision',
                'settings': {
                    'contrast_level': 150,
                    'text_size': 1.4,
                    'highlight_links': True,
                    'dark_mode': True,
                    'cursor_size': 1.5
                }
            },
            {
                'name': 'Motor Impairment Support',
                'description': 'Larger targets and reduced motion for motor impairments',
                'preset_type': 'motor',
                'settings': {
                    'cursor_size': 2.0,
                    'pause_animations': True,
                    'keyboard_navigation': True,
                    'text_size': 1.2
                }
            },
            {
                'name': 'Cognitive Support',
                'description': 'Simplified interface for cognitive accessibility',
                'preset_type': 'cognitive',
                'settings': {
                    'reading_mode': True,
                    'pause_animations': True,
                    'hide_images': False,
                    'text_size': 1.1,
                    'line_height': 1.6
                }
            }
        ]
        
        created_count = 0
        for preset_data in presets:
            preset, created = AccessibilityPreset.objects.get_or_create(
                name=preset_data['name'],
                defaults=preset_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created preset: {preset.name}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} presets')
        )
