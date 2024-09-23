# votting-app
Votting application 
What ?? 

A functionally where user can give to the given set of candidate

 Models?
 Routes?

 Votting app functionality
  1. user sign in /sign up
  2. see the list of candidate
  3.vote one of the candidate
  4.there is a route which shows the list of candidate and therir live vote counts sorted by their vote counts
  5. user data must contain one unique goverment id proof named : aadhar card numeber
  6.there should be one admin who can only maintain the table of candidate and can't able to vote at all 
  7. user can change their password
  8. user can login only with aadhar card number and password
  9. admin can't vote at all
  ---------------------------------------------


  Routes

user Authentication:
  / signup: POST - create  a new user account.
  / login: POST - Log in to an existing account ,[aadhar card number +password] 

voting : 
  / candidate: GET the list of candidate.
  /vote/:candidate: POST - vote for a specific candidate.

vote Counts:
   /vote/count : GET - get the list of candidate serted by their vote counts.

User Profile: 
   / profile :GET the user's profile information.
   /prifile/password:PUT-change the user's password.

Admin candidate Management:
  /candidates:POST -create a new candidate
  /candidate/:candidate:PUT -Update an exiting candidate.
  /candidate/:candidatedId:Delete : Delete a candidate from the list