# This makes Python treat the directory as a package
try:
    from .celery import app as celery_app
    __all__ = ('celery_app',)
except ImportError:
    print("Warning: Celery not properly configured. Async tasks will not be available.")
    __all__ = ()
