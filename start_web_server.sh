#!/bin/bash

# Script pour démarrer le serveur web local
echo "🌐 Démarrage du serveur web pour le jeu RPG..."
echo ""
echo "Le jeu sera accessible à : http://localhost:8000"
echo ""
echo "Pour arrêter le serveur : Ctrl+C"
echo "============================================"
echo ""

# Démarrer le serveur Python
python3 -m http.server 8000