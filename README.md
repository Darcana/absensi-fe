<b>Steps :</b>
1. run `npm install`
2. run `npm run dev`

<b>Menu :</b>
1. Login
2. Register
3. Attendance ( Check In / Check Out )
4. Self History
5. Employee Attendance History ( ADMIN ONLY )
6. Employee Data ( ADMIN ONLY )
7. Editable Employee Data ( ADMIN ONLY )

<b>Noteworthy Feature :</b>
1. You can do Checkin, only if your last status is checkout or none.
2. You can do Checkout, only if you are checked in.
3. Yes you can do it multiple times in a day, but the Attendance History will only take the earliest checked in of the day AND latest checked out of the day.
4. In History, you are considered late if you checked in above 9 AM
5. In History, you are considered overtime if you checked out above 6 PM
6. In Self history, you can see all your attendance info-including the multiple times in a day
7. There is a validation if you edit an employee email for existing emails
8. JWT is applied to the code
9. Images are temporarily stored in backend local, further development to S3 or any storage service needed.
