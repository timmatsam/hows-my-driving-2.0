
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

### Socrata API
The Javascript SDK has not been updated in 9 years. 
It does not support joins. 
It automatically returns all fields as strings. 

NYC Open Data Tables
There is bad data in the Parking Violations tables.  
- Around half the data in the 2023 table is outside of the 2023 range. 
- It contains dates that don't make any sense whatsover, e.g. dates going forward to 2067. 

Parking and Camera Violations
New or open violations will be updated weekly (Sunday). Violations satisfied by having been paid, dismissed via hearing, statutorily expired, or had other changes to its status, will be updated daily (Tuesday through Sunday). Violations that have been written-off because they have statutorily expired and are no longer valid are indicated with blank financials. Summons images will not be available during scheduled downtime on Sundays from 5:00 am to 10:00 am.

Challenges:

Each Next.js cache instance (which I believe is per page) can only store 2 MB of data at a time.
The tables must be joined to get the fines and locations in a object but the Socrata API does not support joins. 
