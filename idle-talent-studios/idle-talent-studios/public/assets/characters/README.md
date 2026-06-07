# Character Asset Dimensions

Place final character art in `public/assets/characters/<id>/`.  
Regenerate placeholders: `node scripts/generate-placeholders.cjs`

| File | Dimensions | Usage |
|------|-----------|-------|
| `portrait.png` | 400 × 600 | Full-height portrait in CharacterProfile sheet |
| `bust.png` | 200 × 300 | Dialogue box speaker bust |
| `silhouette.png` | 400 × 600 | Locked character in CollectionScreen |
| `card.png` | 300 × 400 | GachaPull card reveal face |
| `apartment.png` | 200 × 400 | Character visit sprite in Apartment |
| `thumb.png` | 120 × 120 | CollectionScreen grid tile, CharacterCard |
| `expr/neutral.png` | 200 × 200 | Dialogue expression — default |
| `expr/happy.png` | 200 × 200 | Dialogue expression — joy |
| `expr/surprised.png` | 200 × 200 | Dialogue expression — shock |
| `expr/sad.png` | 200 × 200 | Dialogue expression — sorrow |
| `expr/flustered.png` | 200 × 200 | Dialogue expression — embarrassment |

## Characters

`amy` · `marcus` · `olivier` · `remy` · `dex` · `sunny` · `driver` · `celeste`

## Format requirements

- PNG, sRGB color space
- Transparent background for bust, silhouette, expressions, and apartment sprite
- `silhouette.png` should be a solid black fill of the character outline
