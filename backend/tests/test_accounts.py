import os
import tempfile
import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.accounts import connect, digest
import time

FARM = dict(nitrogen=80, phosphorus=40, potassium=35, ph=6.5, temperature=28, humidity=65, rainfall=110, water_available=2400, farm_area=2, budget=50000)
HEADERS = {'X-Crop-Client': 'web'}

class AccountTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.env = patch.dict(os.environ, {'DATABASE_PATH': os.path.join(self.temp.name, 'test.db'), 'GOOGLE_CLIENT_ID': 'test-client'})
        self.env.start()
        self.client = TestClient(app)
        self.client.__enter__()

    def tearDown(self):
        self.client.__exit__(None, None, None)
        self.env.stop()
        self.temp.cleanup()

    def login(self, subject='farmer-1'):
        nonce = self.client.get('/api/auth/config').json()['nonce']
        info = dict(sub=subject, email=subject+'@example.com', name='Test Farmer', email_verified=True, nonce=nonce)
        with patch('google.oauth2.id_token.verify_oauth2_token', return_value=info) as verify:
            response = self.client.post('/api/auth/google', json={'credential':'test-token'}, headers=HEADERS)
            self.assertEqual(response.status_code, 200, response.text)
            self.assertEqual(verify.call_args.args[2], 'test-client')
        return response

    def test_auth_required_and_csrf(self):
        for path in ['/api/me','/api/history','/api/journal']:
            self.assertEqual(self.client.get(path).status_code,401)
        self.assertEqual(self.client.post('/api/auth/google',json={'credential':'x'}).status_code,403)

    def test_verified_login_profile_session_and_logout(self):
        response=self.login()
        self.assertIn('HttpOnly',response.headers['set-cookie'])
        self.assertNotIn('crop_session', response.text)
        data=dict(name='New Name',farm_name='Green Acres',location='Warangal',farm_area=4,bio='Growing groundnut')
        self.assertEqual(self.client.patch('/api/me',json=data,headers=HEADERS).json()['farm_name'],'Green Acres')
        self.assertEqual(self.client.get('/api/me').json()['farm_area'],4)
        self.assertEqual(self.client.get('/api/me').headers['cache-control'],'no-store')
        self.client.post('/api/auth/logout',headers=HEADERS)
        self.assertEqual(self.client.get('/api/me').status_code,401)

    def test_invalid_token_nonce_and_replay(self):
        self.client.get('/api/auth/config')
        with patch('google.oauth2.id_token.verify_oauth2_token',side_effect=ValueError('invalid')):
            self.assertEqual(self.client.post('/api/auth/google',json={'credential':'bad'},headers=HEADERS).status_code,401)
        with patch('google.oauth2.id_token.verify_oauth2_token',return_value={'sub':'attacker','nonce':'wrong','email_verified':True}):
            self.assertEqual(self.client.post('/api/auth/google',json={'credential':'bad'},headers=HEADERS).status_code,401)
        self.login()
        self.assertEqual(self.client.post('/api/auth/google',json={'credential':'test-token'},headers=HEADERS).status_code,401)

    def test_history_and_journal_isolated_between_accounts(self):
        self.login('one')
        response=self.client.post('/api/recommend',json=FARM,headers=HEADERS)
        self.assertEqual(response.status_code,200,response.text)
        history=self.client.get('/api/history').json()
        self.assertEqual(len(history),1)
        self.assertEqual(history[0]['farm']['nitrogen'],80)
        self.assertEqual(history[0]['result'],response.json())
        crop=dict(crop='Rice', planted_on='2026-06-10',status='growing',area=2,notes='First planting')
        row=self.client.post('/api/journal',json=crop,headers=HEADERS)
        self.assertEqual(row.status_code,201,row.text)
        row_id=row.json()['id']
        self.login('two')
        self.assertEqual(self.client.get('/api/history').json(),[])
        self.assertEqual(self.client.get('/api/journal').json(),[])
        self.assertEqual(self.client.delete('/api/journal/'+row_id,headers=HEADERS).status_code,404)
        self.assertEqual(self.client.patch('/api/journal/'+row_id,json={**crop,'status':'harvested'},headers=HEADERS).status_code,404)
        self.login('one')
        self.assertEqual(len(self.client.get('/api/journal').json()),1)
        self.assertEqual(self.client.patch('/api/journal/'+row_id,json={**crop,'status':'harvested','notes':'Harvest complete'},headers=HEADERS).status_code,200)
        self.assertEqual(self.client.get('/api/journal').json()[0]['status'],'harvested')
        self.assertEqual(self.client.delete('/api/journal/'+row_id,headers=HEADERS).status_code,200)

    def test_missing_google_setup_and_profile_validation(self):
        with patch.dict(os.environ, {'GOOGLE_CLIENT_ID': ''}):
            self.assertEqual(self.client.get('/api/auth/config').json()['client_id'],'')
            self.assertEqual(self.client.post('/api/auth/google',json={'credential':'x'},headers=HEADERS).status_code,503)
        self.login()
        self.assertEqual(self.client.patch('/api/me',json={'name':'  '},headers=HEADERS).status_code,422)
        self.assertEqual(self.client.patch('/api/me',json={'name':'Farmer','farm_area':-1},headers=HEADERS).status_code,422)

    def test_expired_session_and_invalid_crop(self):
        self.login()
        self.assertEqual(self.client.post('/api/journal',json=dict(crop='Rice',planted_on='not-a-date',area=-1),headers=HEADERS).status_code,422)
        with connect() as db:
            db.execute('UPDATE sessions SET expires=?',(int(time.time())-1,))
        self.assertEqual(self.client.get('/api/me').status_code,401)
        self.assertEqual(self.client.post('/api/recommend',json=FARM,headers=HEADERS).status_code,401)

    def test_guest_recommendation_not_saved(self):
        self.assertEqual(self.client.post('/api/recommend',json=FARM).status_code,200)
        with connect() as db:
            self.assertEqual(db.execute('SELECT COUNT(*) FROM history').fetchone()[0],0)

if __name__ == '__main__':
    unittest.main()
