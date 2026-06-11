import time
from app.core.celery_app import celery_app
from celery import current_task

@celery_app.task(bind=True, name="provision_cluster_task")
def provision_cluster_task(self, cluster_name: str, node_count: int):
    logs = []
    
    def update_status(state: str, message: str):
        logs.append(message)
        # כאן אנחנו מעדכנים את ה-Redis בסטטוס הנוכחי כדי שה-API יוכל לקרוא אותו
        self.update_state(state=state, meta={'logs': logs, 'status': state})
        print(message)
    
    update_status('STARTING', f'Received request to provision cluster: {cluster_name} with {node_count} nodes.')
    time.sleep(3)
    
    update_status('TERRAFORM_INIT', 'Initializing Terraform...')
    time.sleep(4)
    
    update_status('TERRAFORM_APPLY', 'Provisioning 3 OCI Compute Instances...')
    time.sleep(5)
    
    update_status('ANSIBLE_WAIT', 'Waiting for SSH access to instances...')
    time.sleep(4)
    
    update_status('ANSIBLE_PLAYBOOK', 'Running Kubeadm via Ansible to bootstrap cluster...')
    time.sleep(6)
    
    update_status('COMPLETED', 'Cluster provisioning complete! Kubeconfig is ready.')
    
    return {'logs': logs, 'status': 'COMPLETED', 'kubeconfig_mock': 'apiVersion: v1\nclusters:\n- cluster: ...'}