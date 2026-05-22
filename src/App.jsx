import React, { useState } from "react";

export default function App() {
  const defaultAssessment = {
    technical: 7,
    physical: 7,
    attitude: 7,
    gameUnderstanding: 7,
    potential: 7,

    shooting: 7,
    passing: 7,
    dribbling: 7,
    defending: 7,
    heading: 7,
    firstTouch: 7,
    speed: 7,
    strength: 7,
    workRate: 7,
    decisionMaking: 7,

    notes: "",
  };

  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "Emmanuel A",
      age: "15",
      position: "CAM",
      club: "AR Elite",
      rating: 8,
      notes:
        "Strong dribbling ability, confident on the ball and can create chances in attacking areas.",
    },
    {
      id: 2,
      name: "Jayden M",
      age: "14",
      position: "ST",
      club: "AR Elite U14",
      rating: 7,
      notes:
        "Good movement as a striker and works hard off the ball. Needs to improve finishing consistency.",
    },
  ]);

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [newPlayer, setNewPlayer] = useState({
    name: "",
    age: "",
    position: "",
    club: "",
  });

  const [assessment, setAssessment] = useState(defaultAssessment);
  const [report, setReport] = useState("");

  const activePlayer = selectedPlayer || players[0];

  const coreRatings = [
    { key: "technical", label: "Technical Ability" },
    { key: "physical", label: "Physical Ability" },
    { key: "attitude", label: "Attitude" },
    { key: "gameUnderstanding", label: "Game Understanding" },
    { key: "potential", label: "Academy Potential" },
  ];

  const abilityRatings = [
    { key: "shooting", label: "Shooting" },
    { key: "passing", label: "Passing" },
    { key: "dribbling", label: "Dribbling" },
    { key: "defending", label: "Defending" },
    { key: "heading", label: "Heading" },
    { key: "firstTouch", label: "First Touch" },
    { key: "speed", label: "Speed" },
    { key: "strength", label: "Strength" },
    { key: "workRate", label: "Work Rate" },
    { key: "decisionMaking", label: "Decision Making" },
  ];

  function addPlayer() {
    if (!newPlayer.name || !newPlayer.age || !newPlayer.position) {
      alert("Please add player name, age and position.");
      return;
    }

    const player = {
      id: Date.now(),
      name: newPlayer.name,
      age: newPlayer.age,
      position: newPlayer.position,
      club: newPlayer.club || "Not added",
      rating: 0,
      notes: "No assessment completed yet.",
    };

    setPlayers([player, ...players]);
    setSelectedPlayer(player);
    setNewPlayer({
      name: "",
      age: "",
      position: "",
      club: "",
    });
    setAssessment(defaultAssessment);
    setReport("");
  }

  function calculateAverage() {
    const ratingKeys = [
      ...coreRatings.map((item) => item.key),
      ...abilityRatings.map((item) => item.key),
    ];

    const average =
      ratingKeys.reduce((total, key) => total + Number(assessment[key]), 0) /
      ratingKeys.length;

    return average;
  }

  function generateReport() {
    if (!activePlayer) {
      alert("Please select or add a player first.");
      return;
    }

    const average = calculateAverage();

    let recommendation = "";

    if (average >= 8) {
      recommendation = "Academy watchlist / trial recommendation";
    } else if (average >= 7) {
      recommendation = "Good potential - continue monitoring";
    } else if (average >= 6) {
      recommendation = "Development player - needs a clear improvement plan";
    } else {
      recommendation = "Needs further development before academy level";
    }

    const professionalScoutNotes = `
${activePlayer.name} has been assessed with an overall rating of ${average.toFixed(
      1
    )}/10. Based on the scout notes provided, the player shows clear signs of potential and has several areas that can be developed further with the right coaching structure.

Original Scout Notes:
${assessment.notes || "No additional scout notes were added."}

Professional Scout Summary:
${activePlayer.name} demonstrated qualities that are important for a player operating in the ${activePlayer.position} position. The assessment highlights the player's current level, attitude, technical ability and potential to progress within a more structured football environment.

From the notes provided, ${activePlayer.name} appears to have strengths that can be built upon, while also having key areas that require continued development. The player should focus on improving consistency, decision-making under pressure, and applying their strengths more effectively during match situations.

Based on the rating of ${average.toFixed(
      1
    )}/10, ${activePlayer.name} should continue to be monitored and supported with a clear individual development plan. With regular feedback, focused training and strong match performances, the player has the opportunity to progress further within the Next Phase Football pathway.
`;

    const finalReport = `
NEXT PHASE FOOTBALL PLAYER REPORT

Player Name: ${activePlayer.name}
Age: ${activePlayer.age}
Position: ${activePlayer.position}
Current Club: ${activePlayer.club}

Overall Score: ${average.toFixed(1)}/10

CORE SCOUT RATINGS

Technical Ability: ${assessment.technical}/10
Physical Ability: ${assessment.physical}/10
Attitude: ${assessment.attitude}/10
Game Understanding: ${assessment.gameUnderstanding}/10
Academy Potential: ${assessment.potential}/10

DETAILED ABILITY RATINGS

Shooting: ${assessment.shooting}/10
Passing: ${assessment.passing}/10
Dribbling: ${assessment.dribbling}/10
Defending: ${assessment.defending}/10
Heading: ${assessment.heading}/10
First Touch: ${assessment.firstTouch}/10
Speed: ${assessment.speed}/10
Strength: ${assessment.strength}/10
Work Rate: ${assessment.workRate}/10
Decision Making: ${assessment.decisionMaking}/10

SCOUT NOTES

${professionalScoutNotes}

AI SUMMARY

${activePlayer.name} is a ${activePlayer.age}-year-old ${activePlayer.position}. Based on the assessment, the player has achieved an overall score of ${average.toFixed(
      1
    )}/10.

RECOMMENDATION

${recommendation}

DEVELOPMENT PLAN

1. Improve weaker areas through focused weekly training.
2. Create better match clips showing the player's key strengths.
3. Review decision-making moments after games.
4. Complete another assessment in 30 days.
5. Continue monitoring the player within the Next Phase Football pathway.
`;

    setReport(finalReport);

    const updatedPlayers = players.map((player) =>
      player.id === activePlayer.id
        ? {
            ...player,
            rating: average.toFixed(1),
            notes: assessment.notes || player.notes,
          }
        : player
    );

    setPlayers(updatedPlayers);
  }

  function printReport() {
    if (!report) {
      alert("Please generate a report first.");
      return;
    }
  
    const printWindow = window.open("", "_blank");
  
    if (!printWindow) {
      alert("Pop-up blocked. Please allow pop-ups for this site.");
      return;
    }
  
    const safeReport = report
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  
    printWindow.document.open();
  
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activePlayer.name} - Next Phase Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #111;
              line-height: 1.5;
              background: white;
            }
  
            .header {
              background: #000;
              color: #fff;
              padding: 20px;
              text-align: center;
              border-bottom: 5px solid #d90429;
              margin-bottom: 25px;
            }
  
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
  
            .header p {
              margin: 8px 0 0 0;
              font-size: 13px;
            }
  
            .report {
              white-space: pre-wrap;
              font-family: Arial, sans-serif;
              font-size: 12px;
            }
  
            .button-row {
              margin-bottom: 20px;
              text-align: center;
            }
  
            button {
              background: #d90429;
              color: white;
              border: none;
              padding: 12px 20px;
              border-radius: 8px;
              font-weight: bold;
              cursor: pointer;
            }
  
            @media print {
              .button-row {
                display: none;
              }
  
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
  
        <body>
          <div class="button-row">
            <button onclick="window.print()">Save / Print PDF</button>
          </div>
  
          <div class="header">
            <h1>NEXT PHASE FOOTBALL</h1>
            <p>AI-Assisted Player Scout Report</p>
          </div>
  
          <div class="report">${safeReport}</div>
        </body>
      </html>
    `);
  
    printWindow.document.close();
  
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <img
          src="/next-phase-logo.png"
          alt="Next Phase Football Logo"
          style={styles.logo}
        />

        <p style={styles.subtitle}>
          Football player assessment and scout feedback tool.
        </p>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Add Player</h2>

          <input
            style={styles.input}
            placeholder="Player name"
            value={newPlayer.name}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, name: e.target.value })
            }
          />

          <input
            style={styles.input}
            placeholder="Age"
            value={newPlayer.age}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, age: e.target.value })
            }
          />

          <select
            style={styles.input}
            value={newPlayer.position}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, position: e.target.value })
            }
          >
            <option value="">Select Position</option>
            <option value="GK">Goalkeeper - GK</option>
            <option value="RB">Right Back - RB</option>
            <option value="LB">Left Back - LB</option>
            <option value="CB">Centre Back - CB</option>
            <option value="RWB">Right Wing Back - RWB</option>
            <option value="LWB">Left Wing Back - LWB</option>
            <option value="CDM">Defensive Midfielder - CDM</option>
            <option value="CM">Central Midfielder - CM</option>
            <option value="CAM">Attacking Midfielder - CAM</option>
            <option value="RM">Right Midfielder - RM</option>
            <option value="LM">Left Midfielder - LM</option>
            <option value="RW">Right Winger - RW</option>
            <option value="LW">Left Winger - LW</option>
            <option value="ST">Striker - ST</option>
            <option value="CF">Centre Forward - CF</option>
          </select>

          <input
            style={styles.input}
            placeholder="Current club"
            value={newPlayer.club}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, club: e.target.value })
            }
          />

          <button style={styles.button} onClick={addPlayer}>
            Add Player
          </button>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Players</h2>

          {players.map((player) => (
            <div
              key={player.id}
              style={{
                ...styles.playerBox,
                border:
                  activePlayer.id === player.id
                    ? "2px solid #d90429"
                    : "1px solid #333",
              }}
              onClick={() => {
                setSelectedPlayer(player);
                setReport("");
              }}
            >
              <strong>{player.name}</strong>
              <p>
                Age {player.age} | {player.position} | {player.club}
              </p>
              <p>Rating: {player.rating ? `${player.rating}/10` : "Pending"}</p>
            </div>
          ))}
        </section>

        <section style={styles.cardWide}>
          <h2 style={styles.cardTitle}>Scout Assessment</h2>

          <p>
            Selected Player: <strong>{activePlayer.name}</strong>
          </p>

          <div style={styles.ratingSection}>
            <h3 style={styles.sectionTitle}>Core Scout Ratings</h3>
            <p style={styles.sectionText}>
              These are the most important overall ratings used to judge the
              player's current level, attitude and academy potential.
            </p>

            <div style={styles.ratingGrid}>
              {coreRatings.map((item) => (
                <div key={item.key} style={styles.ratingBox}>
                  <label>
                    {item.label}: <strong>{assessment[item.key]}/10</strong>
                  </label>

                  <input
                    style={styles.slider}
                    type="range"
                    min="1"
                    max="10"
                    value={assessment[item.key]}
                    onChange={(e) =>
                      setAssessment({
                        ...assessment,
                        [item.key]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={styles.ratingSection}>
            <h3 style={styles.sectionTitle}>Detailed Ability Ratings</h3>
            <p style={styles.sectionText}>
              This section gives the scout a deeper breakdown of the player’s
              football ability across key technical, physical and tactical
              areas.
            </p>

            <div style={styles.ratingGrid}>
              {abilityRatings.map((item) => (
                <div key={item.key} style={styles.ratingBox}>
                  <label>
                    {item.label}: <strong>{assessment[item.key]}/10</strong>
                  </label>

                  <input
                    style={styles.slider}
                    type="range"
                    min="1"
                    max="10"
                    value={assessment[item.key]}
                    onChange={(e) =>
                      setAssessment({
                        ...assessment,
                        [item.key]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <textarea
            style={styles.textarea}
            placeholder="Write scout notes here. Example: Good dribbling, strong attitude, needs to pass quicker under pressure..."
            value={assessment.notes}
            onChange={(e) =>
              setAssessment({ ...assessment, notes: e.target.value })
            }
          />

          <button style={styles.button} onClick={generateReport}>
            Generate Professional Report
          </button>
        </section>

        <section style={styles.cardWide}>
          <h2 style={styles.cardTitle}>Generated Report</h2>

          {report ? (
            <>
              <pre style={styles.report}>{report}</pre>

              <button style={styles.downloadButton} onClick={printReport}>
                Export / Save as PDF
              </button>
            </>
          ) : (
            <p style={styles.emptyText}>No report generated yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  header: {
    background: "linear-gradient(135deg, #000000, #1a1a1a)",
    border: "1px solid #b00020",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow: "0 0 20px rgba(176, 0, 32, 0.25)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    width: "220px",
    maxWidth: "100%",
    height: "auto",
    display: "block",
    margin: "0 auto 12px auto",
  },
  subtitle: {
    marginTop: "10px",
    color: "#d1d1d1",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#111111",
    border: "1px solid #2b2b2b",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
  },
  cardWide: {
    background: "#111111",
    border: "1px solid #2b2b2b",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.35)",
    gridColumn: "1 / -1",
  },
  cardTitle: {
    color: "#ffffff",
    borderBottom: "2px solid #d90429",
    paddingBottom: "8px",
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#000000",
    color: "#ffffff",
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "120px",
    padding: "12px",
    marginTop: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#000000",
    color: "#ffffff",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#d90429",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  downloadButton: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d90429",
    background: "#ffffff",
    color: "#000000",
    fontWeight: "bold",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "15px",
  },
  playerBox: {
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer",
    background: "#000000",
    color: "#ffffff",
  },
  ratingSection: {
    background: "#000000",
    border: "1px solid #2b2b2b",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "18px",
  },
  sectionTitle: {
    color: "#ffffff",
    margin: "0 0 6px 0",
    fontSize: "18px",
  },
  sectionText: {
    color: "#aaaaaa",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "15px",
  },
  ratingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  ratingBox: {
    background: "#111111",
    border: "1px solid #333333",
    borderRadius: "10px",
    padding: "12px",
  },
  slider: {
    width: "100%",
    marginBottom: "15px",
    accentColor: "#d90429",
  },
  report: {
    background: "#000000",
    padding: "15px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    lineHeight: "1.5",
    color: "#f2f2f2",
    border: "1px solid #b00020",
    maxHeight: "600px",
    overflowY: "auto",
  },
  emptyText: {
    color: "#aaaaaa",
  },
};