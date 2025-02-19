This is a T3 stack application, following technologies have been used build this
- Next.js
- NextAuth.js
- Prisma
- Tailwind CSS
- tRPC

# How to setup
- create a .env file in root directory
    ```AUTH_SECRET=
       AUTH_DISCORD_ID=
       AUTH_DISCORD_SECRET=
       DATABASE_URL=
       NEXT_PUBLIC_URL=
       NEXTAUTH_URL=
    ```
- Run ```npm install```
- Run ```npm run dev```

# How to deploy
- Install aws cli
- Run ```aws configure```
    - Enter AWS Access Key ID
    - Enter AWS Secret Access Key
    - Default region name
- Run ```npx sst deploy```
