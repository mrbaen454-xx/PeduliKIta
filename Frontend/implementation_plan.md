# Implementation Plan: Campaign List Page

## Overview
Rebuild the `/campaigns` page (`CampaignList.jsx`) to match the new mockup provided by the user. The page will feature a rich hero header, an advanced search/filter bar, an asymmetrical featured campaigns section, a grid of campaigns, and pagination. Additionally, the backend database seeding will be updated to exactly match the campaign data shown in the new mockup.

## Open Questions
- The mockup shows "1.149 Inisiatif Aktif" in the hero. I will use the actual number of active campaigns from the database (`pagination.totalItems`). Please confirm if this is acceptable, or if you prefer me to hardcode "1.149". (Based on your previous instructions, I will use the real database count).

## Proposed Changes

### Backend Database (seed.js)
Update the campaigns and campaigners in `seed.js` to match the text, targets, and amounts in the new mockup exactly.
- **[MODIFY]** `Backend/prisma/seed.js`: Update the 6 active campaigns to have the titles, collected amounts, and targets from the new mockup.

### Frontend Components
- **[MODIFY]** `Frontend/src/pages/public/CampaignList.jsx`: Rewrite the page to implement:
  - The hero section ("Temukan Kampanye yang Berarti").
  - The search and filter bar (Search input, category chips, status dropdown, sort dropdown).
  - The asymmetrical layout for the first 3 campaigns (1 large, 2 stacked small).
  - The standard grid for the remaining campaigns.
  - The pagination controls.
  - The bottom CTA ("Punya Inisiatif Sosial yang Perlu Bantuan?").
- **[MODIFY]** `Frontend/src/components/campaign/CampaignCard.jsx`: Ensure the card component supports the horizontal layout for the main featured campaign as seen in the mockup (image on left, content on right).

## Verification Plan
- Run `node prisma/seed.js` to reset and seed the database.
- Navigate to `http://localhost:5173/campaigns` and verify the layout exactly matches the mockup.
- Verify that filtering and pagination components are structurally correct (even if full filtering logic requires more backend work, the UI will be fully interactive).
