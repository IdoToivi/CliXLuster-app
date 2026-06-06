    # 🚀 CliXLuster

> One-Click Oracle Kubernetes Engine (OKE) Provisioner

CliXLuster is a modern, GitOps-ready infrastructure automation tool designed to instantly provision OKE clusters in the Oracle Cloud (Frankfurt region) with a single click. 

## 🏗️ Project Structure (Monorepo)

This repository is structured as a Monorepo containing both the user interface and the backend provisioning engine:

- `/FE` (Frontend) - A modern, single-page React application providing a sleek, dark-mode infrastructure dashboard.
- `/BE` (Backend) - *[Work in Progress]* The API server responsible for executing the infrastructure logic.

## 💻 Tech Stack

**Frontend:**
* React
* Vite
* Tailwind CSS (Pure utility classes)
* Lucide React (Icons)
* Vanilla JavaScript

**Infrastructure & Deployment (Planned):**
* Docker
* Kubernetes
* ArgoCD (GitOps Continuous Delivery)

## 🛠️ Getting Started (Local Development)

### Frontend
1. Navigate to the frontend directory:
   `cd FE`

2. Install dependencies:
   `npm install`

3. Start the Vite development server:
   `npm run dev`

4. Open `http://localhost:5173` in your browser to view the dashboard.

## 🗺️ Roadmap
- [x] Design and build the frontend dashboard UI.
- [ ] Initialize the Backend API service.
- [ ] Connect the "CLICK" button to the Backend.
- [ ] Implement cloud provisioning logic (Terraform / OCI CLI).
- [ ] Dockerize FE and BE components.
- [ ] Set up CI/CD pipelines and ArgoCD synchronization.

---
*Built by Ido Toivi.*