# Hackathon Connect — Project Notes

Last Updated: October 2, 2026

## 1. Project Overview

Hackathon Connect is a full-stack platform that helps students find teammates and form teams for specific hackathons.

Users can browse hackathons, create teams, apply to join existing teams, and manage team applications.

**Tech Stack**
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- API Testing: Postman
- Version Control: Git + GitHub

## 2. Completed Features

### Users
- [x] Users database table
- [x] Create user API
- [x] Fetch all users API
- [x] Fetch user by ID API
- [x] Basic users frontend

### Hackathons
- [x] Hackathons database table
- [x] Create hackathon API
- [x] Fetch all hackathons API
- [x] Minimum and maximum team-size constraints
- [x] Basic hackathons frontend

### Teams
- [x] Teams database table
- [x] Team creation API with validation
- [x] Automatic leader insertion into team_members
- [x] Transaction for team creation and leader membership
- [x] Team capacity validation against hackathon limits

### Applications
- [x] Applications database table
- [x] Create application API with validation
- [x] Prevent duplicate applications to the same team
- [x] Prevent applications from users already belonging to a team for that hackathon
- [x] Accept application API
- [x] Reject application API
- [x] View applications for a team using SQL JOIN
- [x] Automatically reject other pending applications for the same hackathon after acceptance
- [x] Application acceptance transaction

## 3. Pending Features

### Backend
- [ ] Review one-team-per-user-per-hackathon database constraint
- [ ] Strengthen concurrent application acceptance and team-capacity handling
- [ ] Authentication (signup/login)
- [ ] Authorization using authenticated user identity
- [ ] Review remaining team and application retrieval endpoints
- [ ] Search and filtering

### Frontend
- [x] Team listing page
- [x] Team creation form
- [ ] Hackathon-specific team browsing
- [ ] Apply-to-team functionality
- [ ] View application status
- [ ] Leader dashboard for accepting/rejecting applications
- [x] Frontend integration with remaining backend APIs
- [x] Loading, error and success states
- [ ] UI polishing and responsive design

### Final Phase
- [ ] End-to-end testing
- [ ] Deployment
- [ ] Environment variable configuration
- [ ] README documentation
- [ ] Screenshots and demo preparation

## 4. Important Business Rules

1. A user can belong to only one team per hackathon.
2. A user can apply to multiple teams before being accepted.
3. Duplicate applications to the same team are not allowed in V1.
4. Only the respective team leader should accept or reject applications.
5. A team cannot exceed its maximum member capacity.
6. When an application is accepted, the applicant becomes a team member.
7. Other pending applications by that user for the same hackathon are automatically rejected.
8. Team creation and leader membership must succeed or fail together.

## 5. Current Progress

The basic application lifecycle is implemented:

Create Application → View Applications → Accept / Reject

The next major phase is reviewing backend gaps and beginning frontend integration.

## 6. Development Approach

- Write important business logic yourself.
- Reuse familiar CRUD and Express boilerplate.
- Understand AI-generated code before integrating it.
- Test backend endpoints using Postman.
- Commit and push meaningful changes to GitHub.
- Aim for approximately one hour of consistent work per day, with smaller tasks on busy days.

# Hackathon Connect — Session Notes

## Completed: Apply to Team frontend

Implemented the application submission flow in `TeamsPage.jsx`.

### Features completed
- Added an Apply to Team button to each team card.
- Clicking the button stores the selected `team_id`.
- Application form appears conditionally when a team is selected.
- Controlled inputs for `user_id` and `message`.
- `handleAppFormChange` updates form state.
- `handleAppSubmit` submits the application.
- Success and error feedback implemented.

### Application state
```jsx
const [appData, setAppData] = useState({
    team_id: '',
    user_id: '',
    message: ''
});
```

### Backend integration
- Uses `createApplication` imported from `../services/applicationService`.
- Sends a POST request to `/api/applications`.
- Backend already validates duplicate applications and team membership restrictions.

## Next Session: My Applications

Goal: Allow users to see all applications they have submitted.

Suggested steps:
1. Create a backend GET endpoint to fetch applications by `user_id`, if not already implemented.
2. Create a frontend service function to fetch applications.
3. Display applications in a list.
4. Show team name, hackathon, application message and status.
5. Handle loading, empty and error states.

## Pending improvements
- Replace manually entered user ID with authenticated user ID.
- Add proper authentication and authorization before deployment.
- Push today's changes to GitHub if not already done.

**Starting point:** `TeamsPage.jsx` and `applicationService.js`.
