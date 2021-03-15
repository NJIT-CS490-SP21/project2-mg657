import unittest
import os
import sys
sys.path.append(os.path.abspath('../../'))
from app import updateScore
from app import printData
KEY_INPUT = "input"
SCORE_INPUT = 'score'
ROLE_INPUT = 'role'
KEY_EXPECTED = "expected"
BOARD_INPUT = 'board'
class BoardTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                BOARD_INPUT: {'board': ['X', '', 'O', 'X', 'X', 'O', '', '', ''], 'index': 4, 'isX': True},
                KEY_EXPECTED: {'board': ['X', '', 'O', 'X', 'X', 'O', '', '', ''], 'index': 4, 'isX': True}
            },
            {
                BOARD_INPUT: {'players': {'PlayerO': 'manchi', 'PlayerX': 'mahi', 'Spectators': []}},
                KEY_EXPECTED: {'players': {'PlayerO': 'manchi', 'PlayerX': 'mahi', 'Spectators': []}},
            },
            {
               BOARD_INPUT: {'board': ['', '', '', '', '', '', '', '', ''], 'isX': True},
               KEY_EXPECTED: {'board': ['', '', '', '', '', '', '', '', ''], 'isX': True}
            },
            ]
        
        self.failure_test_params = [
            {
               BOARD_INPUT: {'board': ['X', '', 'O', 'X', 'X', 'O', '', '', ''], 'index': 4, 'isX': True},
               KEY_EXPECTED: {'board': ['', '', '', '', '', '', '', '', ''], 'isX': True}
            },
            {
                BOARD_INPUT: {'players': {'PlayerO': 'manchi', 'PlayerX': 'mahi', 'Spectators': []}},
                KEY_EXPECTED: {'players': {'PlayerO': 'guest', 'PlayerX': 'mahi', 'Spectators': []}},
            },
            {
                BOARD_INPUT: {'board': ['', '', '', '', '', '', '', '', ''], 'isX': True},
                KEY_EXPECTED: {'board': ['', '', '', '', '', '', '', '', ''], 'isX': False}
            },
        ]
    def test_user_success(self):
        for test in self.success_test_params:
            actual_result = printData(test[BOARD_INPUT])
            expected_result=test[KEY_EXPECTED]
            self.assertEqual(actual_result, expected_result)
            self.assertEqual(len(actual_result), len(expected_result))
            
    def test_user_failure(self):
        for test in self.failure_test_params:
            actual_result = printData(test[BOARD_INPUT])
            expected_result=test[KEY_EXPECTED]
            self.assertNotEqual(actual_result, expected_result)
            
class ScoreTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                SCORE_INPUT: 100,
                ROLE_INPUT: "winner",
                KEY_EXPECTED: 101
            },
            {
                SCORE_INPUT: 101,
                ROLE_INPUT: "loser",
                KEY_EXPECTED: 100
            },
            {
                SCORE_INPUT: 102,
                ROLE_INPUT: "winner",
                KEY_EXPECTED: 103
            },
            ]
        self.failure_test_params = [
            {
                SCORE_INPUT: 100,
                ROLE_INPUT: "winner",
                KEY_EXPECTED: 102
            },
            {
                SCORE_INPUT: 101,
                ROLE_INPUT: "loser",
                KEY_EXPECTED: 102
            },
            {
                SCORE_INPUT: 102,
                ROLE_INPUT: "winner",
                KEY_EXPECTED: 102
            },
        ]
    def test_user_success(self):
        for test in self.success_test_params:
            actual_result = updateScore(test[SCORE_INPUT], test[ROLE_INPUT])
            expected_result=test[KEY_EXPECTED]
            self.assertEqual(actual_result, expected_result)
            self.assertNotEqual(test[SCORE_INPUT], expected_result)
    def test_user_failure(self):
        for test in self.failure_test_params:
            actual_result = updateScore(test[SCORE_INPUT], test[ROLE_INPUT])
            expected_result=test[KEY_EXPECTED]
            self.assertNotEqual(actual_result, expected_result)
            
if __name__ == '__main__':
    unittest.main()