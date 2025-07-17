import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';

async function startServer() {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin: ['http://localhost:3000', 'http://localhost:3001'],
            credentials: true,
        }),
        express.json(),
        expressMiddleware(server)
    );

    const PORT = process.env.PORT || 4000;

    await new Promise<void>((resolve) => {
        httpServer.listen({ port: PORT }, resolve);
    });

    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startServer().catch((error) => {
    console.error('Error starting server:', error);
});