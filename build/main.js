import * as dotenv from 'dotenv';
import http from 'http';
import fs from 'fs';
import path from 'path';
dotenv.config();
const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    switch (request.url) {
        case '/api/users':
            try {
                let data = '';
                response.statusCode = 200;
                const readStream = fs.createReadStream(path.resolve(process.cwd(), './src/model/users.json'));
                readStream.on('data', (chunk) => {
                    data += chunk;
                });
                readStream.on('end', () => {
                    console.log(JSON.parse(data));
                    return response.end(JSON.stringify(data));
                });
            }
            catch (err) {
                throw err;
            }
            break;
        case '':
            break;
        default:
            response.statusCode = 404;
            return response.end(JSON.stringify({ error: 'Not found' }));
    }
});
server.listen(process.env.PORT, () => console.log('server started'));
//# sourceMappingURL=main.js.map