from celery import Celery

celery_app = Celery(
    "clixluster_worker",
    broker="redis://192.168.50.11:6379/0",  # <--- שים לב: נקודתיים מיד אחרי ה-IP
    backend="redis://192.168.50.11:6379/0"  # <--- כנ"ל כאן
)

celery_app.conf.update(
    task_track_started=True,
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
)