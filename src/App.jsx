import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const playerNameOptions = [
    "Ayob Hussain",
    "Lincon Newall",
    "Ali Alhasnawi",
    "Jacob Rae",
    "Joe Danby",
    "Amir Melouli",
    "Fawaz Mahmoud",
    "Jayden Andrew Toussi",
    "Joseph Adelowo",
    "Anis Benoussaid",
    "Adnan Benfaddoul Zine",
    "Tiago Paz",
    "Ridwan Ali",
    "Prealey Iyobor Andrew",
    "Richie Kalongo",
    "Benjamin Ghanei",
    "Callum Sessman",
    "Younis Salar",
    "Marwane Redjdal",
    "Yusef Nader",
    "Brendan Nimako",
    "Youssef Mohamed",
    "Ibrahim Makdah",
    "Mohamed Gheris",
    "Tafara Machiridza",
    "Ikechukwu Reyes",
    "Abdoul Guebre",
    "Mohamed Toure",
    "Mohammed Mahamoud",
    "Anis Ben Hamed",
    "Fahed Almahmoud",
    "Igor Olechowski",
    "Joise Fernandes",
    "Jesse Jones",
    "Isaac Adelaja",
    "Ibra",
    "Will Still",
    "Musta",
    "Harrison Egwe",
  ];

  const ageGroupOptions = [
    "U13",
    "U14",
    "U15",
    "U16",
    "U17",
    "U18",
    "U19",
    "U20",
    "U21",
  ];

  const defaultAssessment = {
    technical: 7,
    physical: 7,
    attitude: 7,
    gameUnderstanding: 7,
    potential: 7,

    handling: 7,
    shotStopping: 7,
    diving: 7,
    reflexes: 7,
    distribution: 7,
    crosses: 7,
    communication: 7,
    positioning: 7,
    oneVsOne: 7,

    defending: 7,
    tackling: 7,
    interceptions: 7,
    heading: 7,
    strength: 7,
    pace: 7,
    passing: 7,
    composure: 7,

    firstTouch: 7,
    ballRetention: 7,
    vision: 7,
    decisionMaking: 7,
    movement: 7,
    pressResistance: 7,
    workRate: 7,
    creativity: 7,
    defensiveAwareness: 7,

    shooting: 7,
    finishing: 7,
    dribbling: 7,
    crossing: 7,
    pressing: 7,

    notes: "",
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loginDetails, setLoginDetails] = useState({
    scoutName: "",
    staffCode: "",
  });

  const [loggedInScout, setLoggedInScout] = useState("");

  const [activeSection, setActiveSection] = useState("assessment");
  const [players, setPlayers] = useState([]);
  const [savedReports, setSavedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemMessage, setSystemMessage] = useState("");

  const [newPlayer, setNewPlayer] = useState({
    name: "",
    age: "",
    position: "",
    club: "",
    kitColour: "",
    kitNumber: "",
  });

  const [assessment, setAssessment] = useState(defaultAssessment);

  const activePlayer = selectedPlayer || players[0] || null;

  const coreRatings = [
    { key: "technical", label: "Technical Ability" },
    { key: "physical", label: "Physical Ability" },
    { key: "attitude", label: "Attitude" },
    { key: "gameUnderstanding", label: "Game Understanding" },
    { key: "potential", label: "Academy Potential" },
  ];

  const positionRatingGroups = {
    goalkeeper: [
      { key: "handling", label: "Handling" },
      { key: "shotStopping", label: "Shot Stopping" },
      { key: "diving", label: "Diving" },
      { key: "reflexes", label: "Reflexes" },
      { key: "distribution", label: "Distribution" },
      { key: "crosses", label: "Dealing With Crosses" },
      { key: "communication", label: "Communication" },
      { key: "positioning", label: "Positioning" },
      { key: "oneVsOne", label: "1v1 Situations" },
      { key: "decisionMaking", label: "Decision Making" },
    ],

    defender: [
      { key: "defending", label: "Defending" },
      { key: "tackling", label: "Tackling" },
      { key: "interceptions", label: "Interceptions" },
      { key: "heading", label: "Heading" },
      { key: "positioning", label: "Positioning" },
      { key: "strength", label: "Strength" },
      { key: "pace", label: "Recovery Pace" },
      { key: "passing", label: "Passing Out From The Back" },
      { key: "composure", label: "Composure On The Ball" },
      { key: "communication", label: "Communication" },
    ],

    midfielder: [
      { key: "passing", label: "Passing" },
      { key: "firstTouch", label: "First Touch" },
      { key: "ballRetention", label: "Ball Retention" },
      { key: "vision", label: "Vision" },
      { key: "decisionMaking", label: "Decision Making" },
      { key: "movement", label: "Movement Off The Ball" },
      { key: "pressResistance", label: "Press Resistance" },
      { key: "workRate", label: "Work Rate" },
      { key: "creativity", label: "Creativity" },
      { key: "defensiveAwareness", label: "Defensive Awareness" },
    ],

    attacker: [
      { key: "shooting", label: "Shooting" },
      { key: "finishing", label: "Finishing" },
      { key: "dribbling", label: "Dribbling" },
      { key: "firstTouch", label: "First Touch" },
      { key: "movement", label: "Movement Off The Ball" },
      { key: "pace", label: "Pace" },
      { key: "oneVsOne", label: "1v1 Ability" },
      { key: "crossing", label: "Crossing / Final Ball" },
      { key: "decisionMaking", label: "Decision Making" },
      { key: "pressing", label: "Pressing From The Front" },
    ],
  };

  function getPositionGroup(position) {
    if (position === "GK") return "goalkeeper";

    if (["CB", "RB", "LB", "RWB", "LWB"].includes(position)) {
      return "defender";
    }

    if (["CDM", "CM", "CAM", "RM", "LM"].includes(position)) {
      return "midfielder";
    }

    if (["RW", "LW", "ST", "CF"].includes(position)) {
      return "attacker";
    }

    return "midfielder";
  }

  const selectedPositionGroup = activePlayer
    ? getPositionGroup(activePlayer.position)
    : "midfielder";

  const abilityRatings = positionRatingGroups[selectedPositionGroup];

  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setSystemMessage("Supabase environment variables are missing.");
      setIsLoading(false);
      return;
    }

    loadPlayers();
    loadReports();
  }, []);

  async function loadPlayers() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase players load error:", error);
      setSystemMessage("Could not load players from Supabase: " + error.message);
      setIsLoading(false);
      return;
    }

    const mappedPlayers = data.map((player) => ({
      id: player.id,
      name: player.name,
      age: player.age,
      position: player.position,
      club: player.club,
      kitColour: player.kit_colour,
      kitNumber: player.kit_number,
      rating: player.rating,
      notes: player.notes,
    }));

    setPlayers(mappedPlayers);
    setIsLoading(false);
  }

  async function loadReports() {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase reports load error:", error);
      setSystemMessage("Could not load reports from Supabase: " + error.message);
      return;
    }

    const mappedReports = data.map((report) => ({
      id: report.id,
      title: report.title,
      playerName: report.player_name,
      age: report.age,
      position: report.position,
      club: report.club,
      kitColour: report.kit_colour,
      kitNumber: report.kit_number,
      score: report.score,
      scoutName: report.scout_name,
      createdAt: new Date(report.created_at).toLocaleString(),
      reportText: report.report_text,
    }));

    setSavedReports(mappedReports);
  }

  function getKitBackground(colour) {
    if (colour === "Orange") return "#ff7a00";
    if (colour === "Yellow") return "#ffd60a";
    if (colour === "Green") return "#00a651";
    return "#555";
  }

  function getKitTextColour(colour) {
    if (colour === "Yellow") return "#000000";
    return "#ffffff";
  }

  function handleLogin() {
    if (!loginDetails.scoutName || !loginDetails.staffCode) {
      alert("Please enter your scout name and staff code.");
      return;
    }

    if (loginDetails.staffCode !== "ARELITE2026") {
      alert("Incorrect staff code.");
      return;
    }

    setLoggedInScout(loginDetails.scoutName);
    setIsLoggedIn(true);
  }

  async function addPlayer() {
    if (!newPlayer.name || !newPlayer.age || !newPlayer.position) {
      alert("Please add player name, age group and position.");
      return;
    }

    const playerToInsert = {
      name: newPlayer.name,
      age: newPlayer.age,
      position: newPlayer.position,
      club: newPlayer.club || "Not added",
      kit_colour: newPlayer.kitColour || "Not selected",
      kit_number: newPlayer.kitNumber || "Not selected",
      rating: "0",
      notes: "No assessment completed yet.",
    };

    const { data, error } = await supabase
      .from("players")
      .insert([playerToInsert])
      .select()
      .single();

    if (error) {
      console.error("Supabase player insert error:", error);
      alert("Could not save player to Supabase: " + error.message);
      return;
    }

    const savedPlayer = {
      id: data.id,
      name: data.name,
      age: data.age,
      position: data.position,
      club: data.club,
      kitColour: data.kit_colour,
      kitNumber: data.kit_number,
      rating: data.rating,
      notes: data.notes,
    };

    setPlayers([savedPlayer, ...players]);
    setSelectedPlayer(savedPlayer);

    setNewPlayer({
      name: "",
      age: "",
      position: "",
      club: "",
      kitColour: "",
      kitNumber: "",
    });

    setAssessment(defaultAssessment);
    setActiveSection("assessment");
    setSystemMessage("Player saved successfully.");
  }

  function calculateAverage() {
    const ratingKeys = [
      ...coreRatings.map((item) => item.key),
      ...abilityRatings.map((item) => item.key),
    ];

    return (
      ratingKeys.reduce((total, key) => total + Number(assessment[key]), 0) /
      ratingKeys.length
    );
  }

  function generateReportText() {
    if (!activePlayer) {
      alert("Please select or add a player first.");
      return "";
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

    const detailedRatingsText = abilityRatings
      .map((item) => `${item.label}: ${assessment[item.key]}/10`)
      .join("\n");

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

    return `
${activePlayer.name} REPORT

NEXT PHASE FOOTBALL PLAYER REPORT

PLAYER DETAILS

Scout Name: ${loggedInScout}
Player Name: ${activePlayer.name}
Age Group: ${activePlayer.age}
Position: ${activePlayer.position}
Current Club: ${activePlayer.club}
Kit Colour: ${activePlayer.kitColour || "Not selected"}
Kit Number: ${activePlayer.kitNumber || "Not selected"}

Overall Score: ${average.toFixed(1)}/10

CORE SCOUT RATINGS

Technical Ability: ${assessment.technical}/10
Physical Ability: ${assessment.physical}/10
Attitude: ${assessment.attitude}/10
Game Understanding: ${assessment.gameUnderstanding}/10
Academy Potential: ${assessment.potential}/10

DETAILED ABILITY RATINGS - ${selectedPositionGroup.toUpperCase()}

${detailedRatingsText}

SCOUT NOTES

${professionalScoutNotes}

AI SUMMARY

${activePlayer.name} is a ${activePlayer.age} player who plays as a ${activePlayer.position}. Based on the assessment, the player has achieved an overall score of ${average.toFixed(
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
  }

  async function submitAndDownloadPDF() {
    if (!activePlayer) {
      alert("Please select or add a player first.");
      return;
    }

    const generatedReport = generateReportText();

    if (!generatedReport) {
      return;
    }

    const average = calculateAverage();

    const reportToInsert = {
      title: `${activePlayer.name} Report`,
      player_name: activePlayer.name,
      age: activePlayer.age,
      position: activePlayer.position,
      club: activePlayer.club,
      kit_colour: activePlayer.kitColour || "Not selected",
      kit_number: activePlayer.kitNumber || "Not selected",
      score: average.toFixed(1),
      scout_name: loggedInScout,
      report_text: generatedReport,
    };

    const { data, error } = await supabase
      .from("reports")
      .insert([reportToInsert])
      .select()
      .single();

    if (error) {
      console.error("Supabase report insert error:", error);
      alert("Report generated, but could not save to Supabase: " + error.message);
      openPDFWindow(generatedReport, activePlayer.name);
      return;
    }

    const { error: updateError } = await supabase
      .from("players")
      .update({
        rating: average.toFixed(1),
        notes: assessment.notes || activePlayer.notes,
      })
      .eq("id", activePlayer.id);

    if (updateError) {
      console.error("Supabase player update error:", updateError);
      setSystemMessage("Report saved, but player rating update failed: " + updateError.message);
    }

    const savedReport = {
      id: data.id,
      title: data.title,
      playerName: data.player_name,
      age: data.age,
      position: data.position,
      club: data.club,
      kitColour: data.kit_colour,
      kitNumber: data.kit_number,
      score: data.score,
      scoutName: data.scout_name,
      createdAt: new Date(data.created_at).toLocaleString(),
      reportText: data.report_text,
    };

    setSavedReports([savedReport, ...savedReports]);
    setSelectedReport(savedReport);

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

    openPDFWindow(generatedReport, activePlayer.name);
    setActiveSection("reports");
    setSystemMessage("Report saved successfully.");
  }

  function openPDFWindow(reportText, playerName) {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Pop-up blocked. Please allow pop-ups for this site.");
      return;
    }

    const safeReport = reportText
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

    printWindow.document.open();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${playerName} Report</title>
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
            <button onclick="window.print()">Download / Save PDF</button>
          </div>

          <div class="header">
            <h1>${playerName} Report</h1>
            <p>Next Phase Football | AI-Assisted Player Scout Report</p>
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

  if (!isLoggedIn) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <img
            src="/next-phase-logo.png"
            alt="Next Phase Football Logo"
            style={styles.loginLogo}
          />

          <h1 style={styles.loginTitle}>AR Elite Staff Login</h1>

          <p style={styles.loginSubtitle}>
            Secure access for staff and scouts completing Next Phase Football
            player reports.
          </p>

          <input
            style={styles.loginInput}
            placeholder="Scout name"
            value={loginDetails.scoutName}
            onChange={(e) =>
              setLoginDetails({
                ...loginDetails,
                scoutName: e.target.value,
              })
            }
          />

          <input
            style={styles.loginInput}
            placeholder="Staff code"
            type="password"
            value={loginDetails.staffCode}
            onChange={(e) =>
              setLoginDetails({
                ...loginDetails,
                staffCode: e.target.value,
              })
            }
          />

          <button style={styles.loginButton} onClick={handleLogin}>
            Login
          </button>

          <p style={styles.loginFooter}>
            Next Phase Football | AR Elite Academy
          </p>
        </div>
      </div>
    );
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
          AI-assisted football player assessment and scout feedback tool.
        </p>

        <div style={styles.loggedInBox}>
          Logged in as: <strong>{loggedInScout}</strong> | AR Elite Staff
        </div>

        {systemMessage && <p style={styles.systemMessage}>{systemMessage}</p>}
      </header>

      <nav style={styles.menu}>
        <button
          style={{
            ...styles.menuButton,
            ...(activeSection === "add" ? styles.menuButtonActive : {}),
          }}
          onClick={() => setActiveSection("add")}
        >
          Add Player
        </button>

        <button
          style={{
            ...styles.menuButton,
            ...(activeSection === "assessment" ? styles.menuButtonActive : {}),
          }}
          onClick={() => setActiveSection("assessment")}
        >
          Scout Assessment
        </button>

        <button
          style={{
            ...styles.menuButton,
            ...(activeSection === "reports" ? styles.menuButtonActive : {}),
          }}
          onClick={() => setActiveSection("reports")}
        >
          Reports Library
        </button>
      </nav>

      <main style={styles.main}>
        {activeSection === "add" && (
          <section style={styles.cardWide}>
            <h2 style={styles.cardTitle}>Add Player</h2>

            <input
              style={styles.input}
              list="player-names"
              placeholder="Select or type player name"
              value={newPlayer.name}
              onChange={(e) =>
                setNewPlayer({ ...newPlayer, name: e.target.value })
              }
            />

            <datalist id="player-names">
              {playerNameOptions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>

            <select
              style={styles.input}
              value={newPlayer.age}
              onChange={(e) =>
                setNewPlayer({ ...newPlayer, age: e.target.value })
              }
            >
              <option value="">Select Age Group</option>
              {ageGroupOptions.map((ageGroup) => (
                <option key={ageGroup} value={ageGroup}>
                  {ageGroup}
                </option>
              ))}
            </select>

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

            <div style={styles.kitRow}>
              <div>
                <p style={styles.smallLabel}>Kit Colour</p>

                <div style={styles.kitColourRow}>
                  <button
                    type="button"
                    style={{
                      ...styles.kitColourBox,
                      background: "#ff7a00",
                      border:
                        newPlayer.kitColour === "Orange"
                          ? "3px solid #ffffff"
                          : "1px solid #333",
                    }}
                    onClick={() =>
                      setNewPlayer({ ...newPlayer, kitColour: "Orange" })
                    }
                  ></button>

                  <button
                    type="button"
                    style={{
                      ...styles.kitColourBox,
                      background: "#ffd60a",
                      border:
                        newPlayer.kitColour === "Yellow"
                          ? "3px solid #ffffff"
                          : "1px solid #333",
                    }}
                    onClick={() =>
                      setNewPlayer({ ...newPlayer, kitColour: "Yellow" })
                    }
                  ></button>

                  <button
                    type="button"
                    style={{
                      ...styles.kitColourBox,
                      background: "#00a651",
                      border:
                        newPlayer.kitColour === "Green"
                          ? "3px solid #ffffff"
                          : "1px solid #333",
                    }}
                    onClick={() =>
                      setNewPlayer({ ...newPlayer, kitColour: "Green" })
                    }
                  ></button>
                </div>
              </div>

              <div>
                <p style={styles.smallLabel}>Kit Number</p>

                <select
                  style={{
                    ...styles.kitNumberBox,
                    background: getKitBackground(newPlayer.kitColour),
                    color: getKitTextColour(newPlayer.kitColour),
                  }}
                  value={newPlayer.kitNumber}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, kitNumber: e.target.value })
                  }
                >
                  <option value="">#</option>
                  {Array.from({ length: 23 }, (_, i) => i + 1).map(
                    (number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <button style={styles.button} onClick={addPlayer}>
              Add Player
            </button>
          </section>
        )}

        {activeSection === "assessment" && (
          <>
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>Players</h2>

              {isLoading ? (
                <p style={styles.emptyText}>Loading players...</p>
              ) : players.length === 0 ? (
                <p style={styles.emptyText}>
                  No players saved yet. Add your first player.
                </p>
              ) : (
                players.map((player) => (
                  <div
                    key={player.id}
                    style={{
                      ...styles.playerBox,
                      border:
                        activePlayer && activePlayer.id === player.id
                          ? "2px solid #d90429"
                          : "1px solid #333",
                    }}
                    onClick={() => {
                      setSelectedPlayer(player);
                      setAssessment(defaultAssessment);
                    }}
                  >
                    <strong>{player.name}</strong>

                    <p>
                      Age {player.age} | {player.position} | {player.club}
                    </p>

                    <p>
                      Rating:{" "}
                      {player.rating && player.rating !== "0"
                        ? `${player.rating}/10`
                        : "Pending"}
                    </p>
                  </div>
                ))
              )}
            </section>

            <section style={styles.cardWide}>
              <h2 style={styles.cardTitle}>Scout Assessment</h2>

              {!activePlayer ? (
                <p style={styles.emptyText}>
                  Add or select a player to start an assessment.
                </p>
              ) : (
                <>
                  <p>
                    Selected Player: <strong>{activePlayer.name}</strong>
                  </p>

                  <div style={styles.ratingSection}>
                    <h3 style={styles.sectionTitle}>Core Scout Ratings</h3>
                    <p style={styles.sectionText}>
                      These are the most important overall ratings used to judge
                      the player&apos;s current level, attitude and academy
                      potential.
                    </p>

                    <div style={styles.ratingGrid}>
                      {coreRatings.map((item) => (
                        <div key={item.key} style={styles.ratingBox}>
                          <label>
                            {item.label}:{" "}
                            <strong>{assessment[item.key]}/10</strong>
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
                    <h3 style={styles.sectionTitle}>
                      Detailed Ability Ratings -{" "}
                      {selectedPositionGroup.toUpperCase()}
                    </h3>

                    <p style={styles.sectionText}>
                      These ratings are specific to the player&apos;s selected
                      position.
                    </p>

                    <div style={styles.ratingGrid}>
                      {abilityRatings.map((item) => (
                        <div key={item.key} style={styles.ratingBox}>
                          <label>
                            {item.label}:{" "}
                            <strong>{assessment[item.key]}/10</strong>
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
                    placeholder="Write scout notes here..."
                    value={assessment.notes}
                    onChange={(e) =>
                      setAssessment({ ...assessment, notes: e.target.value })
                    }
                  />

                  <button style={styles.button} onClick={submitAndDownloadPDF}>
                    Submit & Download PDF
                  </button>
                </>
              )}
            </section>
          </>
        )}

        {activeSection === "reports" && (
          <section style={styles.cardWide}>
            <h2 style={styles.cardTitle}>Reports Library</h2>

            {savedReports.length === 0 ? (
              <p style={styles.emptyText}>No reports saved yet.</p>
            ) : (
              <div style={styles.reportLibraryGrid}>
                {savedReports.map((savedReport) => (
                  <div key={savedReport.id} style={styles.reportCard}>
                    <h3 style={styles.reportCardTitle}>{savedReport.title}</h3>

                    <p style={styles.reportMeta}>
                      {savedReport.age} | {savedReport.position} |{" "}
                      {savedReport.kitColour} #{savedReport.kitNumber}
                    </p>

                    <p style={styles.reportMeta}>
                      Scout: {savedReport.scoutName}
                    </p>

                    <p style={styles.reportScore}>
                      Overall Score: {savedReport.score}/10
                    </p>

                    <p style={styles.reportDate}>
                      Created: {savedReport.createdAt}
                    </p>

                    <div style={styles.reportButtonRow}>
                      <button
                        style={styles.smallButton}
                        onClick={() => setSelectedReport(savedReport)}
                      >
                        View Report
                      </button>

                      <button
                        style={styles.smallButtonLight}
                        onClick={() =>
                          openPDFWindow(
                            savedReport.reportText,
                            savedReport.playerName
                          )
                        }
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedReport && (
              <div style={styles.reportViewer}>
                <h3 style={styles.reportCardTitle}>{selectedReport.title}</h3>
                <pre style={styles.reportPreview}>
                  {selectedReport.reportText}
                </pre>
              </div>
            )}
          </section>
        )}
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
  loginPage: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #2b0008 0%, #050505 45%, #000000 100%)",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  loginCard: {
    width: "100%",
    maxWidth: "420px",
    background: "linear-gradient(135deg, #111111, #000000)",
    border: "1px solid #b00020",
    borderRadius: "18px",
    padding: "32px",
    boxShadow: "0 0 30px rgba(217, 4, 41, 0.25)",
    textAlign: "center",
  },
  loginLogo: {
    width: "210px",
    maxWidth: "100%",
    height: "auto",
    margin: "0 auto 18px auto",
    display: "block",
  },
  loginTitle: {
    margin: "0 0 10px 0",
    fontSize: "28px",
    color: "#ffffff",
  },
  loginSubtitle: {
    color: "#cfcfcf",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "22px",
  },
  loginInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #444",
    background: "#050505",
    color: "#ffffff",
    outline: "none",
  },
  loginButton: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "none",
    background: "#d90429",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
    textTransform: "uppercase",
  },
  loginFooter: {
    marginTop: "18px",
    fontSize: "12px",
    color: "#888888",
  },
  header: {
    background: "linear-gradient(135deg, #000000, #1a1a1a)",
    border: "1px solid #b00020",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "20px",
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
  loggedInBox: {
    marginTop: "12px",
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid #d90429",
    background: "rgba(217, 4, 41, 0.12)",
    color: "#ffffff",
    fontSize: "13px",
  },
  systemMessage: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#aaaaaa",
  },
  menu: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  menuButton: {
    padding: "11px 16px",
    borderRadius: "999px",
    border: "1px solid #333333",
    background: "#111111",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
    textTransform: "uppercase",
    fontSize: "12px",
  },
  menuButtonActive: {
    background: "#d90429",
    border: "1px solid #d90429",
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
  },
  cardWide: {
    background: "#111111",
    border: "1px solid #2b2b2b",
    borderRadius: "12px",
    padding: "20px",
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
  },
  playerBox: {
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer",
    background: "#000000",
    color: "#ffffff",
  },
  kitRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
  },
  smallLabel: {
    fontSize: "12px",
    color: "#aaaaaa",
    margin: "0 0 6px 0",
  },
  kitColourRow: {
    display: "flex",
    gap: "8px",
  },
  kitColourBox: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    cursor: "pointer",
    outline: "none",
  },
  kitNumberBox: {
    width: "55px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid #333",
    textAlign: "center",
    fontWeight: "bold",
    cursor: "pointer",
    outline: "none",
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
  emptyText: {
    color: "#aaaaaa",
  },
  reportLibraryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "15px",
  },
  reportCard: {
    background: "#000000",
    border: "1px solid #333333",
    borderRadius: "12px",
    padding: "16px",
  },
  reportCardTitle: {
    margin: "0 0 8px 0",
    color: "#ffffff",
    fontSize: "18px",
  },
  reportMeta: {
    margin: "4px 0",
    color: "#cccccc",
    fontSize: "13px",
  },
  reportScore: {
    margin: "8px 0",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "14px",
  },
  reportDate: {
    margin: "4px 0",
    color: "#888888",
    fontSize: "12px",
  },
  reportButtonRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  smallButton: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#d90429",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "12px",
  },
  smallButtonLight: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d90429",
    background: "#ffffff",
    color: "#000000",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "12px",
  },
  reportViewer: {
    marginTop: "20px",
    background: "#000000",
    border: "1px solid #b00020",
    borderRadius: "12px",
    padding: "16px",
  },
  reportPreview: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.5",
    color: "#f2f2f2",
    fontSize: "13px",
    maxHeight: "500px",
    overflowY: "auto",
  },
};