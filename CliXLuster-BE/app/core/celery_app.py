from celery import Celery

# אנחנו אומרים ל-Celery להשתמש ב-Redis בתור ה"לוח מודעות" (Broker) ובתור המקום לשמור בו את התוצאות (Backend)
celery_app = Celery(
    "clixluster_worker",
    broker="redis://http://192.168.50.11/:6379/0",
    backend="redis://http://192.168.50.11/:6379/0"
)

# הגדרות נוספות ל-Celery
celery_app.conf.update(
    task_track_started=True,
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
)