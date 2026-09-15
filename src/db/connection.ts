import { Connection, ConnectionConfiguration } from 'tedious';

export default function createConnection(): Promise<Connection> {
    const config: ConnectionConfiguration = {
        server: process.env['DB_SERVER'] || '',
        authentication: {
            type: 'default',
            options: {
                userName: process.env['DB_USER'],
                password: process.env['DB_PASSWORD'],
            },
        },
        options: {
            database: process.env['DB_NAME'],
            trustServerCertificate: true,
        },
    };

    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });

        connection.connect();
    });
}
