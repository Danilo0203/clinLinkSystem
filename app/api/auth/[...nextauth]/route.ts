import api from '@/libs/utils';
import { AxiosError } from 'axios';
import NextAuth, { Session } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user?: string;
    }
}
import CredentialsProvider from 'next-auth/providers/credentials';

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
                    console.log('Respuesta de la API:', res.data);

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
            // Si `user` está presente (es decir, si acaba de loguearse)
            if (user) {
                token.accessToken = user; // Guardamos el token en el JWT
                //token.id = user.id; // Guardamos el id del usuario en el token
            }
            return token;
        },
        session({ session, token }) {
            console.log(`Session: ${JSON.stringify(session, null, 2)}`);
            console.log(`Token: ${JSON.stringify(token, null, 2)}`);

            // Pasamos el token al objeto de la sesión
            session.accessToken = token.accessToken as string | undefined;
            session.user = token.user as string | undefined;
            return session;
        }
    },
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
        error: '/auth/error'
    }
});

export { handler as GET, handler as POST };
