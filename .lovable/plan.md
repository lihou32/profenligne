

# Refonte Globale : Interface Professeur, Auth Sociale, Mot de Passe Oublie, et Paiements Stripe

## Vue d'ensemble

Transformation majeure de la plateforme en s'inspirant des geants du secteur (Superprof, Preply, Uber). Ce plan couvre 5 grands chantiers :

1. **Authentification enrichie** (Google, Apple, mot de passe oublie)
2. **Dashboard et interface professeur complete**
3. **Sidebar adaptative selon le role**
4. **Systeme de credits eleves (achat via Stripe)**
5. **Interface de retrait d'argent pour les professeurs (Stripe Connect)**

---

## 1. Authentification enrichie

### Connexion Google + Apple
- Utilisation de l'integration Lovable Cloud geree (pas besoin de cles API manuelles)
- Configuration via l'outil `configure-social-auth` pour generer le module `@lovable.dev/cloud-auth-js`
- Ajout de boutons "Continuer avec Google" et "Continuer avec Apple" sur `Login.tsx` et `Signup.tsx`
- Import de `lovable.auth.signInWithOAuth("google")` et `lovable.auth.signInWithOAuth("apple")`

### Mot de passe oublie
- Ajout d'un lien "Mot de passe oublie ?" sur `Login.tsx` sous le champ mot de passe
- Creation d'une page `ForgotPassword.tsx` : saisie de l'email, appel a `supabase.auth.resetPasswordForEmail()`
- Creation d'une page `ResetPassword.tsx` : saisie du nouveau mot de passe, appel a `supabase.auth.updateUser({ password })`
- Ajout des routes `/forgot-password` et `/reset-password` dans `App.tsx`

### Fichiers concernes
- `src/pages/Login.tsx` : boutons Google/Apple + lien mot de passe oublie
- `src/pages/Signup.tsx` : boutons Google/Apple
- `src/pages/ForgotPassword.tsx` (nouveau)
- `src/pages/ResetPassword.tsx` (nouveau)
- `src/hooks/useAuth.tsx` : ajout de `resetPassword` et `updatePassword`
- `src/App.tsx` : nouvelles routes

---

## 2. Dashboard Professeur

Quand un utilisateur avec le role `tutor` arrive sur `/dashboard`, il voit une interface completement differente de l'eleve.

### Composants du dashboard prof
- **Banniere de bienvenue** avec nom + toggle "En ligne / Hors ligne" (bouton switch) qui met a jour `tutors.status`
- **4 cartes de statistiques** :
  - Revenus du mois (calcule depuis les lecons completees x tarif horaire)
  - Cours donnes ce mois
  - Note moyenne (depuis `tutor_reviews`)
  - Eleves uniques ce mois
- **Graphique de revenus** : courbe hebdomadaire avec Recharts (deja installe)
- **Prochains cours** : liste des sessions confirmees avec nom de l'eleve, matiere, heure, et bouton "Demarrer"
- **Demandes en attente** : lecons avec statut "pending" avec boutons Accepter / Refuser

### Page Cours Professeur (`TutorLessons.tsx`)
- Onglets : A venir / En attente / Historique
- Pour chaque cours : nom de l'eleve (jointure profiles), matiere, date, statut
- Actions : Accepter, Refuser, Demarrer le cours

### Fichiers concernes
- `src/pages/TutorDashboard.tsx` (nouveau) : dashboard complet
- `src/pages/TutorLessons.tsx` (nouveau) : gestion des cours
- `src/pages/Dashboard.tsx` : wrapper conditionnel `hasRole("tutor") ? <TutorDashboard /> : <StudentDashboard />`
- `src/pages/Lessons.tsx` : wrapper conditionnel similaire

---

## 3. Sidebar adaptative selon le role

La sidebar detecte le role et affiche des menus differents.

### Pour les professeurs :
- **PRINCIPAL** : Tableau de bord, Mes Cours, Messages
- **ACTIVITE** : Disponibilite (toggle en ligne), Mes Avis, Mes Revenus (page de retrait)
- **GENERAL** : Aide, Administration (si admin)

### Pour les eleves (inchange) :
- **PRINCIPAL** : Tableau de bord, Mes Lecons, Messages
- **APPRENTISSAGE** : Cours en direct, Avis Profs, Club Prestige
- **GENERAL** : Aide

### Fichier concerne
- `src/components/layout/AppSidebar.tsx` : logique conditionnelle avec `hasRole("tutor")`

---

## 4. Systeme de credits pour les eleves (Stripe)

### Principe
Les eleves achetent des packs de credits (ex: 5 credits = 25EUR, 10 credits = 45EUR, 20 credits = 80EUR). 1 credit = 1 cours.

### Migration SQL
- Table `user_credits` : `id`, `user_id`, `balance` (integer), `updated_at`
- Table `credit_transactions` : `id`, `user_id`, `amount`, `type` (purchase/usage/refund), `stripe_payment_id`, `created_at`
- RLS : chaque user ne voit que ses propres donnees

### Integration Stripe
- Activation de Stripe via l'outil dedie
- Edge function `create-checkout` : cree une session Stripe Checkout pour un pack de credits
- Edge function `stripe-webhook` : ecoute les evenements `checkout.session.completed` et credite le compte de l'eleve
- Page `BuyCredits.tsx` : affiche les packs disponibles avec boutons "Acheter" qui redirigent vers Stripe Checkout

### Fichiers concernes
- Migration SQL pour `user_credits` et `credit_transactions`
- `supabase/functions/create-checkout/index.ts` (nouveau)
- `supabase/functions/stripe-webhook/index.ts` (nouveau)
- `src/pages/BuyCredits.tsx` (nouveau) : interface d'achat de credits
- `src/hooks/useCredits.ts` (nouveau) : hooks pour solde et historique

---

## 5. Interface de retrait pour les professeurs (Stripe Connect)

### Principe
Les professeurs accumulent des gains quand ils donnent des cours. Ils peuvent demander un retrait vers leur compte bancaire.

### Migration SQL
- Table `tutor_earnings` : `id`, `tutor_id`, `lesson_id`, `amount`, `status` (pending/paid), `created_at`
- Table `withdrawal_requests` : `id`, `tutor_id`, `amount`, `status` (pending/processing/completed/rejected), `stripe_transfer_id`, `created_at`
- RLS : chaque tuteur ne voit que ses propres donnees

### Integration Stripe Connect
- Edge function `create-connect-account` : cree un compte Stripe Connect pour le prof
- Edge function `request-withdrawal` : traite la demande de retrait
- Page `TutorEarnings.tsx` : solde disponible, historique des gains par cours, bouton "Demander un retrait", historique des retraits

### Fichiers concernes
- Migration SQL pour `tutor_earnings` et `withdrawal_requests`
- `supabase/functions/create-connect-account/index.ts` (nouveau)
- `supabase/functions/request-withdrawal/index.ts` (nouveau)
- `src/pages/TutorEarnings.tsx` (nouveau) : interface revenus et retraits
- `src/hooks/useEarnings.ts` (nouveau) : hooks pour les gains

---

## Section technique - Ordre d'implementation

### Phase 1 : Auth (pas de migration SQL)
1. Configurer Google + Apple via l'outil `configure-social-auth`
2. Modifier `Login.tsx` et `Signup.tsx` (boutons sociaux + mot de passe oublie)
3. Creer `ForgotPassword.tsx` et `ResetPassword.tsx`
4. Mettre a jour `useAuth.tsx` et `App.tsx`

### Phase 2 : Interface Professeur (pas de migration SQL)
5. Creer `TutorDashboard.tsx` avec stats, toggle, graphique, prochains cours
6. Creer `TutorLessons.tsx` avec gestion des demandes
7. Modifier `Dashboard.tsx` et `Lessons.tsx` (wrappers conditionnels)
8. Adapter `AppSidebar.tsx` selon le role
9. Ajouter hooks tuteur dans `useData.ts`

### Phase 3 : Paiements Stripe
10. Activer Stripe via l'outil dedie
11. Migration SQL pour `user_credits`, `credit_transactions`, `tutor_earnings`, `withdrawal_requests`
12. Creer les edge functions Stripe (checkout, webhook, connect, withdrawal)
13. Creer `BuyCredits.tsx` et `TutorEarnings.tsx`
14. Ajouter les routes et liens dans la sidebar

