# Dog Painting Gallery - TODO

## Database & Backend
- [x] Paintings table schema (title, description, medium, dimensions, imageUrl, featured, price, createdAt)
- [x] Enquiries table schema (name, email, message, createdAt)
- [x] tRPC router: list paintings (public)
- [x] tRPC router: get single painting by id (public)
- [x] tRPC router: create painting (admin only)
- [x] tRPC router: delete painting (admin only)
- [x] tRPC router: update featured painting (admin only)
- [x] tRPC router: submit contact enquiry (public)
- [x] tRPC router: list enquiries (admin only)
- [x] S3 upload route for painting images

## Frontend Pages
- [x] Global theme: Playfair Display + Inter fonts, ivory/charcoal palette
- [x] Navbar with links: Gallery, About, Contact + Admin login
- [x] Footer with email and social links
- [x] Homepage: hero banner with featured painting + Browse Gallery CTA
- [x] Gallery page: masonry grid with title, medium, dimensions
- [x] Painting detail lightbox (full-size image preview)
- [x] About page: artist story and studio background
- [x] Contact page: name, email, message form

## Admin Dashboard
- [x] Admin login (role-based, owner only)
- [x] Admin dashboard: upload new painting form
- [x] Admin dashboard: list/delete existing paintings
- [x] Admin dashboard: view enquiries
- [x] Mark painting as featured (hero)

## Quality & Delivery
- [x] Responsive design (mobile, tablet, desktop)
- [x] Vitest tests for backend routers (16 tests passing)
- [x] GitHub push to leomylord08/dog-for-fun

## Feature Flags & Local Storage
- [x] Create shared/featureFlags.ts with isStoreLocally = true
- [x] Create uploads/ folder with .gitkeep
- [x] Update uploadImage procedure to store locally when isStoreLocally is true
- [x] Serve /uploads static route via Express when local storage is active
- [x] Update tests to cover both storage paths
- [x] Push changes to GitHub
