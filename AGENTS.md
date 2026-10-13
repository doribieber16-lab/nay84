<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS.md

- Reservation availability and creation live in Postgres functions (`get_available_slots`, `create_reservation` with an advisory lock), called only from server functions — keeps overbooking prevention atomic and server-validated.
- Reservations and blocked slots have no anon/authenticated policies; only service_role touches them — guest data stays private until an admin area exists.
- Menu is read from `menu_categories`/`menu_items` (public read) — content is edited in data, never hardcoded.
- Shared institutional data (address, phone, hours, nav) lives in `src/lib/site.ts` — single source for header, footer and pages.
