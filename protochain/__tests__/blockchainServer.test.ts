import request from 'supertest';
import { describe, expect, test, jest } from '@jest/globals';
import { app } from '../src/server/blockchainServer';

jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');

// Testa requisições do blockchainServer 
describe('BlockchainServer Tests', () => {
    test('GET /status', async ()=> {
        const response = await request(app)
            .get('/status');

        expect(response.status).toEqual(200);
        console.log(response.body);
        expect(response.body.isValid.success).toEqual(true);
    })
}) 