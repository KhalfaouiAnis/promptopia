import User from "@models/user";
import { connectToDB } from "@utils/database";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId:process.env.GOOGLE_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async session({ session }) {
            // store the user id from MongoDB to session
            const userSession = await User.findOne({
                email: session?.user?.email
            });
    
            session.user.id = userSession._id.toString();
    
            return session;
        },
        async signIn({ profile }) {
            const {email, name, picture} = profile
            try {
                // serverless -> lambda
                await connectToDB();
    
                // Check if a user already exists
                const userExists = await User.findOne({
                    email
                })
                // if not, create a new user
                if(!userExists){
                    await User.create({
                        email,
                        username: name.replace(" ","").toLowerCase(),
                        image: picture
                    })
                }
    
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
    }
})

export { handler as GET, handler as POST };

