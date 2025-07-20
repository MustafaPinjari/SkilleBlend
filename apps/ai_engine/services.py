import openai
from django.conf import settings
from .models import AISuggestion

class AIService:
    def __init__(self):
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
    
    def generate_suggestions(self, user, domain, url, issues=None, score=None):
        """Generate AI-powered accessibility suggestions"""
        suggestions = []
        
        # Simple rule-based suggestions (replace with OpenAI when API key is available)
        if not settings.OPENAI_API_KEY:
            return self._generate_rule_based_suggestions(user, domain, url, issues, score)
        
        try:
            # Prepare context for OpenAI
            context = f"""
            User is browsing {domain} ({url}).
            Current accessibility score: {score or 'unknown'}
            Issues found: {issues or 'none'}
            
            Generate 3 personalized accessibility suggestions to improve their browsing experience.
            Focus on practical, actionable recommendations.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an accessibility expert providing personalized suggestions."},
                    {"role": "user", "content": context}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            # Parse OpenAI response and create suggestions
            ai_text = response.choices[0].message.content
            suggestions = self._parse_ai_response(user, domain, url, ai_text)
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            # Fallback to rule-based suggestions
            suggestions = self._generate_rule_based_suggestions(user, domain, url, issues, score)
        
        return suggestions
    
    def _generate_rule_based_suggestions(self, user, domain, url, issues, score):
        """Generate suggestions based on rules and patterns"""
        suggestions = []
        
        # Get user's current settings
        current_settings = getattr(user, 'accessibility_settings', None)
        if current_settings:
            current_settings = current_settings.filter(is_active=True).first()
        
        # Suggestion 1: Based on score
        if score and score < 80:
            suggestion = AISuggestion.objects.create(
                user=user,
                title="Enable High Contrast Mode",
                description="Based on the accessibility issues detected, enabling high contrast mode would improve readability significantly.",
                suggestion_type="visual",
                domain=domain,
                url=url,
                confidence_score=0.8,
                priority="high"
            )
            suggestions.append(suggestion)
        
        # Suggestion 2: Based on issues
        if issues:
            for issue in issues:
                if issue.get('type') == 'alt_text':
                    suggestion = AISuggestion.objects.create(
                        user=user,
                        title="Enable Image Descriptions",
                        description="This page has images without descriptions. Consider enabling our AI-powered image description feature.",
                        suggestion_type="interface",
                        domain=domain,
                        url=url,
                        confidence_score=0.9,
                        priority="medium"
                    )
                    suggestions.append(suggestion)
                    break
        
        # Suggestion 3: Based on user patterns
        if current_settings and current_settings.text_size < 1.2:
            suggestion = AISuggestion.objects.create(
                user=user,
                title="Increase Text Size",
                description="Based on your usage patterns, increasing text size to 1.2x might improve your reading experience.",
                suggestion_type="visual",
                domain=domain,
                url=url,
                confidence_score=0.7,
                priority="low"
            )
            suggestions.append(suggestion)
        
        return suggestions
    
    def _parse_ai_response(self, user, domain, url, ai_text):
        """Parse OpenAI response into suggestion objects"""
        # This is a simplified parser - you'd want more sophisticated parsing
        suggestions = []
        
        lines = ai_text.strip().split('\n')
        current_suggestion = {}
        
        for line in lines:
            line = line.strip()
            if line.startswith('1.') or line.startswith('2.') or line.startswith('3.'):
                if current_suggestion:
                    # Save previous suggestion
                    suggestion = AISuggestion.objects.create(
                        user=user,
                        title=current_suggestion.get('title', 'AI Suggestion'),
                        description=current_suggestion.get('description', line),
                        suggestion_type='visual',
                        domain=domain,
                        url=url,
                        confidence_score=0.8,
                        priority='medium'
                    )
                    suggestions.append(suggestion)
                
                # Start new suggestion
                current_suggestion = {'title': line, 'description': line}
            elif line and current_suggestion:
                current_suggestion['description'] += f" {line}"
        
        # Don't forget the last suggestion
        if current_suggestion:
            suggestion = AISuggestion.objects.create(
                user=user,
                title=current_suggestion.get('title', 'AI Suggestion'),
                description=current_suggestion.get('description', ''),
                suggestion_type='visual',
                domain=domain,
                url=url,
                confidence_score=0.8,
                priority='medium'
            )
            suggestions.append(suggestion)
        
        return suggestions

# Global instance
ai_service = AIService()
