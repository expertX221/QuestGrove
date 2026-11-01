export function modelFor(id, grade) {
  if (id === "mathematics")
    return ["fractions", "numberline", "balance", "triangle", "logic"][
      grade - 6
    ];
  if (id === "science")
    return ["filtration", "heat", "pressure", "science", "circuit"][grade - 6];
  return id;
}
export function mathExperiment(grade, a, b, hi = false) {
  switch (Number(grade)) {
    case 6:
      return {
        title: hi ? "भिन्नों के साथ खेलें" : "PLAY WITH FRACTIONS",
        a: hi ? "भागों की संख्या" : "Equal parts",
        b: hi ? "चुने गए भाग" : "Chosen parts",
        minA: 2,
        maxA: 10,
        minB: 1,
        maxB: 10,
        text: `${b} / ${a} = ${(b / a).toFixed(2)}`,
        note: hi
          ? "हर पूर्ण के बराबर भाग बताता है। अंश चुने हुए भाग बताता है।"
          : "The denominator counts equal parts. The numerator counts the chosen parts.",
      };
    case 7:
      return {
        title: hi ? "संख्या रेखा पर चलें" : "WALK THE NUMBER LINE",
        a: hi ? "शुरुआत" : "Starting integer",
        b: hi ? "बदलाव" : "Change",
        minA: -10,
        maxA: 10,
        minB: -10,
        maxB: 10,
        text: `${a} + (${b}) = ${a + b}`,
        note: hi
          ? "धनात्मक बदलाव दाएँ, ऋणात्मक बाएँ ले जाता है।"
          : "A positive change moves right; a negative change moves left.",
      };
    case 8:
      return {
        title: hi ? "समीकरण का संतुलन" : "BALANCE AN EQUATION",
        a: hi ? "गुणांक a" : "Coefficient a",
        b: hi ? "स्थिरांक b" : "Constant b",
        minA: 1,
        maxA: 10,
        minB: 0,
        maxB: 12,
        text: `${a}x + ${b} = ${a * 3 + b} → x = 3`,
        note: hi
          ? "दोनों तरफ b घटाएँ और a से भाग दें।"
          : "Subtract b from both sides, then divide both sides by a.",
      };
    case 9:
      return {
        title: hi ? "क्षेत्रफल बदलें" : "CHANGE THE TRIANGLE",
        a: hi ? "आधार" : "Base (cm)",
        b: hi ? "ऊँचाई" : "Height (cm)",
        minA: 2,
        maxA: 10,
        minB: 2,
        maxB: 12,
        text: `½ × ${a} × ${b} = ${((a * b) / 2).toFixed(1)} cm²`,
        note: hi
          ? "ऊँचाई आधार पर लंब होनी चाहिए।"
          : "The height must be perpendicular to the base.",
      };
    default:
      return {
        title: hi ? "मूल से समीकरण बनाएँ" : "BUILD FROM THE ROOTS",
        a: hi ? "पहला मूल" : "First root",
        b: hi ? "दूसरा मूल" : "Second root",
        minA: 1,
        maxA: 10,
        minB: 1,
        maxB: 10,
        text: `(x − ${a})(x − ${b}) = x² − ${a + b}x + ${a * b}`,
        note: hi
          ? "गुणनखंड को शून्य रखने से दोनों मूल मिलते हैं।"
          : "Set each factor to zero to recover the two roots. The puzzle is a supporting visual.",
      };
  }
}
