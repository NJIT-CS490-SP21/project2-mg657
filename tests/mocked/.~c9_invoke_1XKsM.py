import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

# This lets you import from the parent directory (one level up)
sys.path.append(os.path.abspath('../../'))
from app import add_user
from app import update_score_db
from app import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"
INITIAL_USERNAME = 'firstUser'
SECOND_USER = 'mahi'
THIRD_USER = 'manchi'
WINNER_INPUT = "winner"
LOSER_INPUT = "loser"
INITIAL_SCORE = 100
class AddUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: SECOND_USER,
                KEY_EXPECTED: [INITIAL_USERNAME, SECOND_USER],
            },
            {
                KEY_INPUT: THIRD_USER,
                KEY_EXPECTED: [INITIAL_USERNAME, SECOND_USER, THIRD_USER],
            },
            {
                KEY_INPUT: 'user1',
                KEY_EXPECTED: [INITIAL_USERNAME, SECOND_USER, THIRD_USER, 'user1'],
            },
        ]
        
        first_user = models.Leaderboard(username=INITIAL_USERNAME, score=100)
        self.initial_db_mock = [first_user]
    
    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)
    
    def mocked_db_session_commit(self):
        pass
    
    def mocked_person_query_all(self):
        return self.initial_db_mock
    
    def add_user_test_success(self):
        for test in self.success_test_params:
            with patch('app.db.session.add', self.mocked_db_session_add):
                with patch('app.db.session.commit', self.mocked_db_session_commit):
                    with patch('models.Leaderboard.query') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all
                        print(self.initial_db_mock)
                        actual_result = add_user(test[KEY_INPUT])
                        print(actual_result)
                        expected_result = test[KEY_EXPECTED]
                        print(self.initial_db_mock)
                        print(expected_result)
                        self.assertEqual(len(actual_result), len(expected_result))
                        self.assertEqual(actual_result[1], expected_result[1])
class UpdateScoreTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                WINNER_INPUT: 'mahi',
                LOSER_INPUT: 'manchi',
                KEY_EXPECTED: {
                    'mahi': INITIAL_SCORE+1,
                    'manchi': INITIAL_SCORE-1,
                },
            },
        ]
        
        
        winner = models.Leaderboard(username='mahi', score=INITIAL_SCORE)
        loser = models.Leaderboard(username='manchi', score=INITIAL_SCORE)
        self.initial_db_mock = [winner, loser]
        self.initial_db_mock_score = [winner.score, loser.score]
    
    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)
    
    def mocked_db_session_commit(self):
        pass
    
    def mocked_person_query_all(self):
        return self.initial_db_mock
    
    def test_success(self):
        for test in self.success_test_params:
            with patch('app.db.session.add', self.mocked_db_session_add):
                with patch('app.db.session.commit', self.mocked_db_session_commit):
                   # with patch('models.Leaderboard.query') as mocked_query:
                       # mocked_query.all = self.mocked_person_query_all
                    print(self.initial_db_mock)
                    print(self.initial_db_mock_score)
                    actual_result = update_score_db(test[WINNER_INPUT], test[LOSER_INPUT])
                    print(actual_result)
                    expected_result = test[KEY_EXPECTED]
                    print(self.initial_db_mock)
                    print(expected_result)
                    self.assertEqual(len(actual_result), len(expected_result))
                    self.assertEqual(actual_result, expected_result)
                        #self.assertEqual(actual_result[1], expected_result[1])



if __name__ == '__main__':
    unittest.main()