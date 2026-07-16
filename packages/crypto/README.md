# @petoman/crypto

Shared end-to-end cryptography SDK used by every Petoman client.

## Purpose

This package provides a single implementation of the Petoman cryptographic protocol for:

- Nuxt
- Vue
- Android
- iOS
- Electron
- Future Desktop Clients

The backend never performs end-to-end encryption.

---

# Responsibilities

This package is responsible for:

- X25519 key agreement
- Ed25519 signatures
- HKDF key derivation
- AES-256-GCM encryption
- Device key management
- Session key management
- One-Time PreKeys
- Message encryption
- File encryption
- CryptoEnvelope generation

---

# Not Responsible For

This package does NOT:

- Connect to HTTP APIs
- Connect to WebSocket
- Store messages
- Store users
- Authenticate users
- Access databases

---

# Architecture
