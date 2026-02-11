

# Prof en Ligne — Plateforme de Tutorat en Ligne

## Vue d'ensemble
Recréer l'application "Prof en Ligne" comme une plateforme de tutorat en ligne complète et fonctionnelle avec authentification réelle, base de données, assistant IA et visioconférence.

---

## Phase 1 : Structure & Design
- Reproduire fidèlement le design de l'application (sidebar avec logo "PROF EN LIGNE", navigation, thème gradient bleu/violet/rose)
- Créer toutes les pages : Dashboard, Lessons, LiveConnect, AI Tutor, Notifications, Help, Pricing, Login, Signup, Admin Panel, LessonRoom, LessonReport
- Mise en page responsive avec sidebar fixe et contenu principal

## Phase 2 : Backend & Authentification (Lovable Cloud)
- Activer Lovable Cloud avec Supabase
- Mettre en place l'authentification (inscription, connexion, déconnexion) avec email/mot de passe
- Créer les tables : profiles, tutors, lessons, notifications, user_roles
- Configurer les politiques RLS pour sécuriser les données
- Implémenter les rôles Étudiant / Professeur / Admin
- Routes protégées selon l'authentification et le rôle

## Phase 3 : Dashboard & Gestion des Cours
- Dashboard étudiant : statistiques (heures de cours, moyenne, leçons à venir), liste des tuteurs disponibles, prochains cours
- Dashboard professeur : planning de la semaine, élèves, revenus
- Système de réservation de cours avec un tuteur
- Page "Lessons" : historique et cours à venir avec statuts (Confirmé, En attente, Terminé)
- Page "Lesson Report" : rapport de fin de cours

## Phase 4 : Assistant IA (Lovable AI)
- Intégrer Lovable AI via une edge function pour l'assistance aux devoirs
- Interface de chat avec streaming des réponses en temps réel
- Support de l'envoi d'images (photos de devoirs) pour analyse par l'IA
- Historique des conversations

## Phase 5 : Visioconférence
- Intégrer un service de visioconférence (Daily.co ou similaire) pour les cours en direct
- Page "LessonRoom" avec flux vidéo, chat en direct, partage d'écran
- Page "LiveConnect" pour rejoindre ou démarrer une session

## Phase 6 : Fonctionnalités complémentaires
- Système de notifications en temps réel
- Page d'aide avec FAQ
- Page Pricing avec les différentes formules d'abonnement
- Panel Admin pour gérer les utilisateurs, tuteurs et cours

