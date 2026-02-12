# Plan de refonte : QCM post-session, suppression AI Tutor, Pricing, et Avis Profs

## 1. QCM et Carte Mentale IA en fin de visio

Quand un cours se termine (clic sur "Raccrocher"), au lieu de rediriger directement vers `/lessons`, une page de **rapport enrichi** s'affiche avec :

- **QCM genere par IA** : L'edge function `ai-chat` est appelee avec le sujet et le topic du cours pour generer 5-10 questions a choix multiples. L'eleve repond et voit son score.
- **Carte mentale** : L'IA genere une structure JSON (concepts + liens) et un composant React la rend visuellement sous forme d'arbre/carte mentale interactive.

### Fichiers concernes

- `**supabase/functions/ai-chat/index.ts**` : Ajouter un mode `quiz` et `mindmap` qui utilise le tool calling pour extraire du JSON structure (questions QCM + arbre de concepts).
- `**src/pages/LessonReport.tsx**` : Refonte complete pour afficher le QCM interactif et la carte mentale au lieu des donnees statiques actuelles.
- `**src/pages/LessonRoom.tsx**` : Modifier `handleEndCall` pour rediriger vers `/report/{id}` avec le sujet/topic en query params.

---

## 2. Suppression de la page AI Tutor

- `**src/components/layout/AppSidebar.tsx**` : Retirer l'entree `AI Tutor` du tableau `mainNav` et le sparkle icon associe.
- `**src/App.tsx**` : Retirer la route `/ai-tutor` et l'import de `AITutor`.
- Le fichier `src/pages/AITutor.tsx` reste dans le projet mais n'est plus accessible.

---

## 3. Mise a jour de la page Pricing

Refonte de `src/pages/Pricing.tsx` pour correspondre exactement au design de reference :


| Plan       | Prix       | Style                                                         |
| ---------- | ---------- | ------------------------------------------------------------- |
| Decouverte | 0EUR/mois  | Carte blanche, bouton outline                                 |
| Pro        | 29EUR/mois | Bordure doree, badge "LE PLUS POPULAIRE", bouton violet plein |
| Prestige   | 99EUR/mois | Bouton gradient orange/dore                                   |


### Features par plan (d'apres la reference)

- **Decouverte** : support email 48h, quiz de base. Pas de :  cours en direct, Club Prestige, certificats.
- **Pro** : support 24h, quiz avances et tournois, certificats. Pas de : Club Prestige, correction devoirs < 30min.
- **Prestige** : Tout Pro + Club Prestige, tuteurs elite 17h-22h, correction devoirs en direct, suivi parental, garantie "Satisfait ou Rembourse".

Icones par plan : etoile (Decouverte), eclair (Pro), couronne (Prestige).

---

## 4. Page d'avis des professeurs

Nouvelle page `/reviews` accessible depuis la sidebar (section "Apprentissage").

- `**src/pages/TutorReviews.tsx**` (nouveau) : Affiche la liste des tuteurs avec leurs notes, nombre d'avis, et commentaires des eleves. Design avec cards glass, etoiles, et avatars.
- **Migration SQL** : Creer une table `tutor_reviews` (id, tutor_id, student_id, rating 1-5, comment, created_at) avec RLS pour que les eleves puissent lire tous les avis et ecrire les leurs.
- `**src/hooks/useData.ts**` : Ajouter les hooks `useTutorReviews` et `useCreateReview`.
- `**src/components/layout/AppSidebar.tsx**` : Ajouter "Avis Profs" dans `mainNav` avec l'icone `Star`.
- `**src/App.tsx**` : Ajouter la route `/reviews`.

---

## 5. Alignement design avec les references

Ajustements dans les pages modifiees pour coller au style "Prof en ligne" :

- Sidebar avec les categories PRINCIPAL / APPRENTISSAGE / GENERAL
- Cards blanches avec coins arrondis sur fond violet
- Badges colores (jaune pour Prestige, violet pour Pro)
- Boutons gradient violet ou orange selon le contexte

### Modifications sidebar

Reorganiser `AppSidebar.tsx` avec 3 groupes :

- **PRINCIPAL** : Tableau de bord, Mes Lecons, Messages (notifications)
- **APPRENTISSAGE** : Cours en direct, Trouver un prof (avis), Club Prestige (pricing)
- **GENERAL** : Parametres, Aide

---

## Section technique - Ordre d'implementation

1. Migration SQL pour `tutor_reviews`
2. Modifier `AppSidebar.tsx` (retirer AI Tutor, ajouter Avis, reorganiser groupes)
3. Modifier `App.tsx` (retirer route AI Tutor, ajouter route Reviews)
4. Refondre `Pricing.tsx` avec les vrais prix et le design reference
5. Creer `TutorReviews.tsx`
6. Modifier `ai-chat/index.ts` pour supporter le mode quiz/mindmap
7. Refondre `LessonReport.tsx` avec QCM interactif + carte mentale
8. Modifier `LessonRoom.tsx` pour rediriger vers le rapport enrichi
9. Ajouter hooks dans `useData.ts`