import { liveMatchService } from '../services/liveMatchService';

// Sample match data from the provided JSON response
const sampleMatchData = {
  "data": {
    "key": "a-rz--cricket--Uj1994994972167917605",
    "name": "Gujarat Giants Women vs Delhi Capitals Women",
    "short_name": "GG-W vs DC-W",
    "status": "completed",
    "play_status": "result",
    "start_at": 1769522400.0,
    "tournament": {
      "key": "a-rz--cricket--bcci--wplt20--2026-5x1x",
      "name": "Womens Premier League, 2026",
      "short_name": "WPLT20"
    },
    "teams": {
      "b": {
        "key": "c__team__dcw__5bd62",
        "code": "DC-W",
        "name": "Delhi Capitals Women"
      },
      "a": {
        "key": "c__team__ggw__518ce",
        "code": "GG-W",
        "name": "Gujarat Giants Women"
      }
    },
    "venue": {
      "key": "a-rz--vbsk-un9T",
      "name": " Vadodara, BCA Stadium, Kotambi",
      "city": "India"
    },
    "play": {
      "result": {
        "pom": ["w_sfm_devine"],
        "winner": "a",
        "result_type": "runs",
        "win_by": 3,
        "msg": "Gujarat Giants Women beat Delhi Capitals Women by 3 runs"
      }
    },
    "players": {
      "w_be_mooney": {
        "player": {
          "key": "w_be_mooney",
          "name": "Beth Mooney",
          "jersey_name": "Mooney",
          "seasonal_role": "keeper"
        },
        "score": {
          "1": {
            "batting": {
              "score": {
                "runs": 58,
                "balls": 46,
                "fours": 7,
                "sixes": 0,
                "strike_rate": 126.09
              },
              "dismissal": {
                "wicket_type": "caught"
              }
            },
            "bowling": {
              "score": {
                "balls": 0,
                "runs": 0,
                "economy": 0,
                "wickets": 0
              }
            },
            "fielding": {
              "catches": 0,
              "stumpings": 0,
              "runouts": 0
            }
          }
        }
      },
      "w_sfm_devine": {
        "player": {
          "key": "w_sfm_devine",
          "name": "Sophie Devine",
          "jersey_name": "Devine",
          "seasonal_role": "all_rounder"
        },
        "score": {
          "1": {
            "batting": {
              "score": {
                "runs": 13,
                "balls": 10,
                "fours": 3,
                "sixes": 0,
                "strike_rate": 130.0
              },
              "dismissal": {
                "wicket_type": "bowled"
              }
            },
            "bowling": {
              "score": {
                "balls": 24,
                "runs": 37,
                "economy": 9.25,
                "wickets": 4
              }
            },
            "fielding": {
              "catches": 0,
              "stumpings": 0,
              "runouts": 0
            }
          }
        }
      },
      "w_as_gardner": {
        "player": {
          "key": "w_as_gardner",
          "name": "Ashleigh Gardner",
          "jersey_name": "Gardner",
          "seasonal_role": "all_rounder"
        },
        "score": {
          "1": {
            "batting": {
              "score": {
                "runs": 2,
                "balls": 4,
                "fours": 0,
                "sixes": 0,
                "strike_rate": 50.0
              },
              "dismissal": {
                "wicket_type": "caught"
              }
            },
            "bowling": {
              "score": {
                "balls": 24,
                "runs": 37,
                "economy": 9.25,
                "wickets": 1
              }
            },
            "fielding": {
              "catches": 4,
              "stumpings": 0,
              "runouts": 0
            }
          }
        }
      },
      "c__player__sneh_rana__f7925": {
        "player": {
          "key": "c__player__sneh_rana__f7925",
          "name": "Sneh Rana",
          "jersey_name": "Sneh Rana",
          "seasonal_role": "bowler"
        },
        "score": {
          "1": {
            "batting": {
              "score": {
                "runs": 29,
                "balls": 15,
                "fours": 3,
                "sixes": 2,
                "strike_rate": 193.33
              },
              "dismissal": {
                "wicket_type": "caught"
              }
            },
            "bowling": {
              "score": {
                "balls": 6,
                "runs": 11,
                "economy": 11.0,
                "wickets": 0
              }
            },
            "fielding": {
              "catches": 1,
              "stumpings": 0,
              "runouts": 0
            }
          }
        }
      }
    }
  }
};

/**
 * Test the live match service with sample data
 */
export function testLiveMatchService() {
  console.log('=== Testing Live Match Service ===');
  
  // Test match completion detection
  const isCompleted = liveMatchService.isMatchCompleted(sampleMatchData);
  console.log('Match completed:', isCompleted);
  
  // Test player data processing
  const results = liveMatchService.processTestData(sampleMatchData);
  
  // Test individual player lookups
  console.log('\n=== Individual Player Tests ===');
  
  // Test Sophie Devine (Player of the Match)
  const devineData = liveMatchService.findPlayerStatsInLiveData('w_sfm_devine', sampleMatchData);
  if (devineData) {
    const devinePoints = liveMatchService.calculateFantasyPoints(devineData, 'all_rounder');
    console.log(`Sophie Devine: ${devinePoints} points (Player of the Match)`);
  }
  
  // Test Beth Mooney (top run scorer)
  const mooneyData = liveMatchService.findPlayerStatsInLiveData('w_be_mooney', sampleMatchData);
  if (mooneyData) {
    const mooneyPoints = liveMatchService.calculateFantasyPoints(mooneyData, 'keeper');
    console.log(`Beth Mooney: ${mooneyPoints} points (Top run scorer with 58 runs)`);
  }
  
  // Test Ashleigh Gardner (fielder)
  const gardnerData = liveMatchService.findPlayerStatsInLiveData('w_as_gardner', sampleMatchData);
  if (gardnerData) {
    const gardnerPoints = liveMatchService.calculateFantasyPoints(gardnerData, 'all_rounder');
    console.log(`Ashleigh Gardner: ${gardnerPoints} points (4 catches)`);
  }
  
  return results;
}

/**
 * Simulate a live match scenario
 */
export function simulateLiveMatch() {
  console.log('\n=== Simulating Live Match Scenario ===');
  
  // This would typically be called by the live tracking system
  const matchId = 'test_match_123';
  const matchKey = 'a-rz--cricket--Uj1994994972167917605';
  
  console.log(`Starting live tracking for match: ${matchId}`);
  console.log(`Roanuz Match Key: ${matchKey}`);
  console.log('Match Status:', sampleMatchData.data.status);
  console.log('Play Status:', sampleMatchData.data.play_status);
  
  // Process the match data
  const playerResults = liveMatchService.processTestData(sampleMatchData);
  
  return {
    matchId,
    matchKey,
    playerResults,
    isCompleted: liveMatchService.isMatchCompleted(sampleMatchData)
  };
}

// Auto-run tests when file is imported (for development)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  console.log('Running live match service tests...');
  testLiveMatchService();
  simulateLiveMatch();
}