import api from '@/libs/utils';
import { AxiosError } from 'axios';
import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user?: string;
    }

    interface User {
        accessToken?: string;
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                password_confirmation: { label: 'Password Confirmation', type: 'password' }
            },
            async authorize(credentials, req) {
                try {
                    const res = await api.post('/api/login', {
                        email: credentials?.email,
                        password: credentials?.password,
                        password_confirmation: credentials?.password_confirmation
                    });
                    // Aquí recibes el token del backend
                    const { success, data, token, message } = res.data;
                    // Verifica si el login fue exitoso
                    if (success) {
                        // Devolver el token como "user", puedes devolver otros datos si lo deseas
                        return {
                            ...data,
                            accessToken: token
                        };
                    } else {
                        // Si el backend retorna un error de login
                        throw new Error(message || 'Error en la autenticación');
                    }
                } catch (error) {
                    if (error instanceof AxiosError) {
                        throw new Error(error.response?.data?.message || 'Error al autenticar');
                    }
                    return null;
                }
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken; // Asigna solo el token
                token.user = user; // Opcional: Guarda el objeto user completo si lo necesitas
            }
            return token;
        },
        session({ session, token }) {
            session.accessToken = token.accessToken as string | undefined; // Asigna el accessToken a la sesión
            session.user = token.user as string | undefined; // Mantén la estructura original de `user`
            return session;
        }
    },
    pages: {
        signIn: '/'
    }
});

export { handler as GET, handler as POST };
