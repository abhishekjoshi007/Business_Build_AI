import { users } from "@/app/db/userApi";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createCustomer, getCustomerByEmail } from "next-stripe-helper";
import Stripe from "stripe";
import clientPromise from "@/app/lib/mongodb";
import { User } from "@/app/types/user";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  adapter: MongoDBAdapter(clientPromise) as any,
  session: {
    strategy: "jwt",
  },
  providers: [
    // Google provider
    GoogleProvider({  
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Existing credentials provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "something@email.com" },
        name: { label: "Name", type: "text", placeholder: "Your Name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("You must include your name, email, and password!");
        }

        if (!credentials.email) {
          throw new Error("You must include your email.");
        }

        if (!credentials.password) {
          throw new Error("You must include your password.");
        }

        let user = await users.authenticate({
          email: credentials.email,
          password: credentials.password,
        }) as User;

        if (!user) {
          throw new Error("Wrong email or password.");
        }

        if (user.email && !user.customerId) {
          try {
            const stripeCustomer = await getCustomerByEmail(user.email) as Stripe.Customer;
            if (!stripeCustomer || !stripeCustomer.id) {
              const { id } = await createCustomer(user.email) as Stripe.Customer;
              user.customerId = id;
            } else {
              user.customerId = stripeCustomer.id;
            }
          } catch (error) {
            console.error("failed to add stripe customer", error);
          }
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          model: user.model,
          customerId: user.customerId,
          openAiKeyAdded: user.openAiKeyAdded,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await users.getByEmail(user.email);
        if (!existingUser) {
          await users.googleauth({
            name: user.name,
            email: user.email,
            customerId: null,
          });
        } else {
          console.log("User already exists");
        }
      }
      return true; 
    },

    async session({ token, session }) {
      console.log(token);
      if (token) {
        session.user._id = token._id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.model = token.model;
        session.user.customerId = token.customerId;
        session.user.openAiKeyAdded = token.openAiKeyAdded;
        session.user.role = token.role;
        session.user.credits = token.credits
        if (token.email && !token.customerId) {
          try {
            const stripeCustomer = await getCustomerByEmail(token.email) as Stripe.Customer;
            if (!stripeCustomer || !stripeCustomer.id) {
              const { id } = await createCustomer(token.email) as Stripe.Customer;
              session.user.customerId = id;
            } else {
              session.user.customerId = stripeCustomer.id;
            }
          } catch (error) {
            // Handle error if necessary
          }
        }
        return session;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      // For both OAuth and credentials, fetch the full user record
      if (user || token.email) {
        const dbUser = await users.getByEmail(user?.email || token.email);
        if (dbUser) {
          return {
            ...token,
            _id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            model: dbUser.model,
            customerId: dbUser.customerId,
            openAiKeyAdded: dbUser.openAiKeyAdded,
            role: dbUser.role,
            credits: dbUser.credits // Make sure this is included
          };
        }
      }
      return token;
    },
  },
};
