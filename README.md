# 🛡️ ZeroVault: Zero-Knowledge Password Manager

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-success)
![Security](https://img.shields.io/badge/Security-Zero%20Knowledge-red)

> **"Your Secrets, Secured by Math."**

**ZeroVault** is a high-performance, full-stack password manager engineered with a **Zero-Knowledge Architecture**. Unlike traditional managers, your server **never** sees your passwords. All encryption happens strictly on your device using a custom **Rust + WebAssembly** cryptographic engine before data ever touches the network.

---

## 📸 Screenshots

| **Landing Page** | **Secure Vault** |
|:---:|:---:|
| ![Landing Page](./screenshots/landing.png) | ![Vault View](./screenshots/vault.png) |
| *Modern, Dark-Themed UI* | *Decrypted secrets visible only to you* |

| **Login Screen** | **Add Secret** |
|:---:|:---:|
| ![Login](./screenshots/login.png) | ![Add Secret](./screenshots/add_secret.png) |
| *Token-based Authentication* | *Client-side ChaCha20 Encryption* |

*(Note: Create a folder named `screenshots` and add your images there!)*

---

## 🚀 Key Features

* **🔒 Zero-Knowledge Proof:** The server stores only encrypted blobs (`ciphertext`). It has zero knowledge of your actual data.
* **🦀 Rust & WASM Power:** Cryptography runs at near-native speed in the browser using a compiled Rust library.
* **🛡️ Military-Grade Encryption:**
    * **Algorithm:** ChaCha20-Poly1305 (Authenticated Encryption).
    * **Key Derivation:** PBKDF2 (600,000 iterations) with unique salts.
    * **Randomness:** Secure 96-bit Nonces generated via `getrandom`.
* **🐳 Fully Containerized:** Deploys anywhere (AWS, Render, DigitalOcean) using Docker Compose.
* **📱 Responsive UI:** Built with React + Vite for a smooth mobile and desktop experience.

---

## 🛠️ Tech Stack

### **Frontend (The Face)**
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React (Vite)** - Fast, modern UI.
* ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) **Glassmorphism CSS** - Custom dark mode design.
* ![WASM](https://img.shields.io/badge/WebAssembly-654FF0?style=for-the-badge&logo=webassembly&logoColor=white) **WebAssembly** - Running Rust in the browser.

### **Systems & Security (The Brain)**
* ![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white) **Rust** - Core cryptographic logic.
* **Crates:** `ring` (PBKDF2), `chacha20poly1305`, `getrandom`, `wasm-bindgen`.

### **Backend (The Vault)**
* ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) **Django REST Framework** - Secure API.
* ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) **PostgreSQL** - Persistent, robust storage.

### **Infrastructure**
* ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) **Docker Compose** - Orchestration.
* ![GitHub](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) **CI/CD** - Automated workflows.

---

## 🏗️ Architecture Diagram

```mermaid
graph LR
    User[User] -->|Master Key| Browser[React Browser]
    Browser -->|WASM Call| Rust[Rust Crypto Engine]
    Rust -->|Encrypts| Blob[Encrypted Blob]
    Browser -->|Sends Blob| API[Django API]
    API -->|Stores| DB[(PostgreSQL)]
    
    style Rust fill:#f9f,stroke:#333,stroke-width:2px
    style Blob fill:#bbf,stroke:#333,stroke-width:2px