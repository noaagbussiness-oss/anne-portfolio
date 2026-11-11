# Anne Dilneka cinematic redesign

All existing biography, education, skills, goals, experience, contact information and CMS project data are retained. The supplied Kasun references informed the crimson, cream, mountain, leopard and editorial typography treatment only.

The header categories are now a left dot navigation rail. The opening sequence, water-drop attention effect, staged content reveals, atmospheric particles, section washes, numeric fact counters and project image crossfades are implemented in CSS and JavaScript. Desktop wheel navigation jumps between section boundaries; long sections still scroll so every detail remains accessible. Mobile retains native scrolling. Reduced-motion settings bypass the intro and large motion effects.

Images use `object-fit: contain` for the portrait, rotating project previews and the project lightbox. Original image and project files remain available. The generated portrait is a background-removal derivative; `images/profile.jpg` is retained as the original and fallback.

No video was attached to this chat, so the opening sequence is an original animation based on the supplied screenshots.

## Generated assets

Created with the built-in image generation tool and saved in this project:

- `images/crimson-landscape.png`: cinematic crimson mountain background.
- `images/leopard-landscape.png`: complete leopard on a rocky outcrop with ivory negative space.
- `images/anne-cutout.png`: transparent portrait derivative with uncropped head and hair.

### Prompts

**Crimson landscape:** Use case: stylized-concept. Asset type: cinematic portfolio background, landscape 16:9. A sophisticated double-exposure editorial landscape of misty Sri Lankan mountain peaks and tropical forest at warm sunset. Ivory cream empty sky across left half and center for readable HTML text; right half deep crimson red sun disk behind mountain peaks, black charcoal ridges, delicate scarlet painterly diagonal brush stroke entering from lower right corner, mist and wispy clouds along lower third. Photographic matte painting, elegant restrained crimson/ivory/charcoal palette, rich detail, atmospheric. No people, no animals, no text, no letters, no logos, no UI. Leave top left 65 percent mostly warm ivory negative space.

**Leopard landscape:** Use case: photorealistic-natural. Asset type: website side artwork, landscape 16:9. A magnificent Sri Lankan leopard sitting calmly on a rocky outcrop on the left third, full animal entirely visible including ears, tail and paws with generous framing. Leopard looks up toward right. Lush forest, crimson foliage and distant misty mountains across bottom; right two thirds mostly empty luminous ivory cream sky for HTML text. Subtle dark burgundy forest upper left, warm golden sunlight. Refined photographic editorial collage like a luxury creative portfolio, edge of scene softly dissolves into cream on right. No text, no letters, no logos, no UI, no people. Complete animal, no cropping.

**Portrait cutout:** Use case: background-extraction. Edit target: supplied portrait photograph. Remove only the room background and produce a clean transparent-background cutout of this exact woman wearing her black blazer and white blouse. Preserve her exact face, identity, hair, natural skin texture, pose, expression and clothing; no beautification or restyling. Preserve the complete original photographed body and all hair. Include generous transparent padding above her entire head and at left and right so absolutely no hair or head is cropped. The full subject from top of hair down to original lower frame must be intact. Natural photographic edges. Do not add objects, text or scenery.

## Verification

Browser checks covered desktop and mobile layouts, all seven navigation links, CMS project loading, category filtering, lightbox opening and Escape closing, numeric fact end values and reduced-motion behavior. An automated comparison of the original main-content detail blocks found none missing. No JavaScript errors or failing asset requests were observed.
