// Each row contains two prerequisite questions, two extension questions and a novel checkpoint.
// Bilingual strings use English|Hindi; numeric expressions need no translation.
const q = (prompt, options, answer) => ({
  prompt,
  options: options.split("~"),
  answer,
});
export const extensions = {
  mathematics: [
    [
      q(
        "How many quarters make one whole?|एक पूर्ण में कितने चौथाई भाग हैं?",
        "4~2~8",
        0,
      ),
      q("Half of 8 mangoes is…|8 आमों का आधा है…", "2~4~6", 1),
      q("1/2 + 1/4 = ?|1/2 + 1/4 का मान?", "1/8~2/6~3/4", 2),
      q(
        "Riya spends 3/4 of ₹80. Money left?|रिया ₹80 के 3/4 खर्च करती है। कितने रुपये बचे?",
        "₹20~₹60~₹40",
        0,
      ),
      q(
        "Which is greater: 2/3 or 3/4?|2/3 और 3/4 में बड़ा कौन है?",
        "2/3~3/4~Equal|बराबर",
        1,
      ),
    ],
    [
      q(
        "Which number is below zero?|शून्य से छोटी संख्या कौन सी है?",
        "5~−2~2",
        1,
      ),
      q(
        "Move 3 steps right from 0. Position?|0 से 3 कदम दाएँ जाने पर स्थान?",
        "−3~0~3",
        2,
      ),
      q("−4 × (−3) + (−5) = ?|−4 × (−3) + (−5) का मान?", "7~−17~17", 0),
      q(
        "Temperature −2°C rises 7°C, then falls 9°C. Final?|तापमान −2°C से 7°C बढ़ा, फिर 9°C घटा। अंतिम तापमान?",
        "0°C~−4°C~4°C",
        1,
      ),
      q(
        "Balance ₹200; debit ₹350; credit ₹100. Balance?|शेष ₹200; ₹350 निकले; ₹100 जमा हुए। नया शेष?",
        "₹50~₹150~−₹50",
        2,
      ),
    ],
    [
      q("If x + 2 = 5, x = ?|यदि x + 2 = 5, तो x का मान?", "3~7~2", 0),
      q(
        "To undo multiplication by 4, use…|4 से गुणा हटाने के लिए करें…",
        "Add 4|4 जोड़ें~Divide by 4|4 से भाग~Subtract 4|4 घटाएँ",
        1,
      ),
      q("5(x − 2) = 3x + 8. x = ?|5(x − 2) = 3x + 8 में x का मान?", "4~6~9", 2),
      q(
        "Three equal notebooks and a ₹10 pen cost ₹85. Each notebook?|तीन समान कॉपियाँ और ₹10 का पेन कुल ₹85 हैं। एक कॉपी का मूल्य?",
        "₹25~₹30~₹35",
        0,
      ),
      q("2(x + 4) = 20. x = ?|2(x + 4) = 20 में x का मान?", "14~6~10", 1),
    ],
    [
      q(
        "Area of a rectangle 6 cm by 4 cm?|6 सेमी और 4 सेमी भुजाओं वाले आयत का क्षेत्रफल?",
        "10 cm²~12 cm²~24 cm²",
        2,
      ),
      q("Half of 30 is…|30 का आधा है…", "15~10~60", 0),
      q(
        "A triangle has area 42 cm² and base 12 cm. Height?|त्रिभुज का क्षेत्रफल 42 सेमी² और आधार 12 सेमी है। ऊँचाई?",
        "3.5 cm~7 cm~14 cm",
        1,
      ),
      q(
        "Doubling a triangle’s base while height stays fixed makes its area…|ऊँचाई समान रखकर आधार दोगुना करने पर क्षेत्रफल…",
        "Unchanged|समान~Four times|चार गुना~Twice|दोगुना",
        2,
      ),
      q(
        "A triangle covers half a 9 m × 6 m rectangle. Area?|9 मी × 6 मी आयत का आधा भाग त्रिभुज है। क्षेत्रफल?",
        "27 m²~54 m²~15 m²",
        0,
      ),
    ],
    [
      q(
        "Expand (x + 2)(x + 3).|(x + 2)(x + 3) का प्रसार करें।",
        "x² + 6~x² + 5x + 6~x² + x + 6",
        1,
      ),
      q(
        "If ab = 0, then…|यदि ab = 0, तो…",
        "Both must be 1|दोनों 1 हैं~Neither is zero|कोई शून्य नहीं~At least one is zero|कम से कम एक शून्य है",
        2,
      ),
      q(
        "Roots of 2x² − 7x + 3 = 0?|2x² − 7x + 3 = 0 के मूल?",
        "3, 1/2~−3, −1/2~1, 3",
        0,
      ),
      q(
        "Discriminant of x² + 4x + 4 is…|x² + 4x + 4 का विविक्तकर है…",
        "16~0~8",
        1,
      ),
      q(
        "A rectangle has sides x and x + 1; area 12. Positive x?|आयत की भुजाएँ x और x + 1 तथा क्षेत्रफल 12 है। धनात्मक x?",
        "4~2~3",
        2,
      ),
    ],
  ],
  science: [
    [
      q(
        "Sand in water is usually…|पानी में रेत सामान्यतः…",
        "Insoluble|अघुलनशील~Dissolved|घुली हुई~A gas|गैस",
        0,
      ),
      q(
        "Which can dissolve in water?|पानी में क्या घुल सकता है?",
        "Pebbles|कंकड़~Salt|नमक~Sand|रेत",
        1,
      ),
      q(
        "Sand and dissolved salt are mixed in water. First step to recover both?|पानी में रेत और घुला नमक है। दोनों पाने का पहला चरण?",
        "Evaporate all first|पहले पूरा वाष्पित करें~Magnet|चुंबक~Filter out sand|रेत छानें",
        2,
      ),
      q(
        "To collect pure water from salt solution, use…|नमक के घोल से शुद्ध पानी एकत्र करने के लिए…",
        "Distillation|आसवन~Sieving|छलनी~Magnet|चुंबक",
        0,
      ),
      q(
        "Why can ordinary filter paper not remove dissolved salt?|सामान्य फिल्टर घुले नमक को क्यों नहीं रोकता?",
        "Salt becomes sand|नमक रेत बनता है~Dissolved particles pass through|घुले कण निकल जाते हैं~Water stops completely|पानी पूरी तरह रुकता है",
        1,
      ),
    ],
    [
      q(
        "Heat naturally flows from…|ऊष्मा स्वाभाविक रूप से बहती है…",
        "Cold to hot|ठंडे से गर्म~Neither|कहीं नहीं~Hot to cold|गर्म से ठंडे",
        2,
      ),
      q(
        "A thermometer measures…|थर्मामीटर मापता है…",
        "Temperature|तापमान~Mass|द्रव्यमान~Speed|चाल",
        0,
      ),
      q(
        "Sunlight warms Earth mainly through…|सूर्य से पृथ्वी मुख्यतः किससे गर्म होती है?",
        "Conduction|चालन~Radiation|विकिरण~Convection through space|अंतरिक्ष में संवहन",
        1,
      ),
      q(
        "A wool blanket keeps you warm mainly because it…|ऊनी कंबल गर्म रखता है क्योंकि वह…",
        "Creates endless heat|अनंत ऊष्मा बनाता है~Is metal|धातु है~Traps air and reduces heat loss|हवा रोककर ऊष्मा हानि घटाता है",
        2,
      ),
      q(
        "A wooden spoon handle stays cooler than metal because wood is…|लकड़ी का चम्मच धातु से ठंडा रहता है क्योंकि लकड़ी…",
        "A poor heat conductor|ऊष्मा की कुचालक है~A perfect radiator|पूर्ण विकिरक है~Always frozen|सदा जमी रहती है",
        0,
      ),
    ],
    [
      q(
        "SI unit of force?|बल की SI इकाई?",
        "Pascal|पास्कल~Newton|न्यूटन~Metre|मीटर",
        1,
      ),
      q(
        "Pressure depends on force and…|दाब बल और किस पर निर्भर है?",
        "Colour|रंग~Smell|गंध~Area|क्षेत्रफल",
        2,
      ),
      q(
        "Force doubles and area halves. Pressure becomes…|बल दोगुना और क्षेत्रफल आधा हो तो दाब…",
        "Four times|चार गुना~Twice|दोगुना~Half|आधा",
        0,
      ),
      q(
        "Why do wide school-bag straps help?|स्कूल बैग की चौड़ी पट्टियाँ क्यों उपयोगी हैं?",
        "They increase force|बल बढ़ाती हैं~They spread force over more area|बल बड़े क्षेत्र में फैलाती हैं~They remove mass|द्रव्यमान हटाती हैं",
        1,
      ),
      q(
        "Pressure 50 Pa over 2 m² requires force…|2 मी² पर 50 पास्कल दाब के लिए बल…",
        "25 N~52 N~100 N",
        2,
      ),
    ],
    [
      q(
        "An element contains…|तत्व में होते हैं…",
        "One kind of atom|एक प्रकार के परमाणु~Only water|केवल पानी~Any random mixture|कोई भी मिश्रण",
        0,
      ),
      q(
        "The symbol O represents…|O का प्रतीक है…",
        "Gold|सोना~Oxygen|ऑक्सीजन~Hydrogen|हाइड्रोजन",
        1,
      ),
      q(
        "Total atoms in 2 H₂O molecules?|2 H₂O अणुओं में कुल परमाणु?",
        "3~4~6",
        2,
      ),
      q(
        "Total atoms in one CO₂ molecule?|एक CO₂ अणु में कुल परमाणु?",
        "3~2~1",
        0,
      ),
      q(
        "Hydrogen atoms in 4 H₂ molecules?|4 H₂ अणुओं में हाइड्रोजन परमाणु?",
        "4~8~2",
        1,
      ),
    ],
    [
      q(
        "SI unit of resistance?|प्रतिरोध की SI इकाई?",
        "Volt|वोल्ट~Ampere|एम्पियर~Ohm|ओम",
        2,
      ),
      q(
        "Current is measured in…|धारा किसमें मापते हैं?",
        "Ampere|एम्पियर~Ohm|ओम~Joule|जूल",
        0,
      ),
      q(
        "Two 3 Ω resistors in series on 12 V draw…|दो 3 ओम प्रतिरोध श्रेणी में 12 वोल्ट से जुड़े हैं। धारा?",
        "4 A~2 A~6 A",
        1,
      ),
      q(
        "At fixed voltage, doubling resistance makes current…|स्थिर विभवांतर पर प्रतिरोध दोगुना होने से धारा…",
        "Double|दोगुनी~Four times|चार गुनी~Half|आधी",
        2,
      ),
      q(
        "A 6 Ω resistor carries 0.5 A. Voltage?|6 ओम प्रतिरोध में 0.5 एम्पियर धारा है। विभवांतर?",
        "3 V~12 V~6.5 V",
        0,
      ),
    ],
  ],
  english: [
    [
      q(
        "Which word names a thing?|कौन सा शब्द वस्तु का नाम है?",
        "Quickly|जल्दी~Book|किताब~Very|बहुत",
        1,
      ),
      q(
        "Which word describes colour?|कौन सा शब्द रंग बताता है?",
        "Run|दौड़ना~Chair|कुर्सी~Blue|नीला",
        2,
      ),
      q(
        "Which sentence has two adjectives?|किस वाक्य में दो विशेषण हैं?",
        "The small green bird sings.~Birds sing.~The bird sings loudly.",
        0,
      ),
      q(
        "Choose the adjective, not the adverb.|क्रियाविशेषण नहीं, विशेषण चुनें।",
        "Quickly~Careful~Slowly",
        1,
      ),
      q(
        "In “a heavy school bag”, the adjective is…|“a heavy school bag” में विशेषण है…",
        "School~Bag~Heavy",
        2,
      ),
    ],
    [
      q(
        "Which word shows an action?|कौन सा शब्द क्रिया बताता है?",
        "Walk|चलना~Desk|मेज~Blue|नीला",
        0,
      ),
      q(
        "Yesterday refers to…|Yesterday किस समय को दर्शाता है?",
        "Future|भविष्य~Past|भूतकाल~Every future day|हर भावी दिन",
        1,
      ),
      q("Past tense of “bring”?|bring का भूतकाल?", "Bringed~Brang~Brought", 2),
      q(
        "Choose the completed past action.|पूर्ण भूतकाल की क्रिया चुनें।",
        "We finished the project yesterday.~We finish tomorrow.~We are finishing now.",
        0,
      ),
      q(
        "Complete: Last week they ___ to Delhi.|पूरा करें: Last week they ___ to Delhi.",
        "Go~Went~Going",
        1,
      ),
    ],
    [
      q(
        "Which subject is plural?|कौन सा कर्ता बहुवचन है?",
        "He~A child~The children",
        2,
      ),
      q("Complete: He ___ here.|पूरा करें: He ___ here.", "Is~Are~Am", 0),
      q(
        "Choose the correct sentence with each student.|each student के लिए सही वाक्य चुनें।",
        "Each student have a book.~Each student has a book.~Each student having a book.",
        1,
      ),
      q(
        "Complete: Neither answer ___ correct.|पूरा करें: Neither answer ___ correct.",
        "Are~Have~Is",
        2,
      ),
      q(
        "Complete: The list of names ___ on the desk.|पूरा करें: The list of names ___ on the desk.",
        "Is~Are~Were",
        0,
      ),
    ],
    [
      q(
        "“I” and “she” are…|I और she हैं…",
        "Adjectives|विशेषण~Pronouns|सर्वनाम~Articles|उपपद",
        1,
      ),
      q("Past form of “is”?|is का भूतकाल रूप?", "Are~Be~Was", 2),
      q(
        "Report: Ravi said, “I have finished.”|अप्रत्यक्ष कथन बनाएँ: Ravi said, “I have finished.”",
        "Ravi said that he had finished.~Ravi said I have finished.~Ravi says finished.",
        0,
      ),
      q(
        "Report: She said, “I will help.”|अप्रत्यक्ष कथन बनाएँ: She said, “I will help.”",
        "She said she will yesterday.~She said she would help.~She said I help now.",
        1,
      ),
      q(
        "Report: He said, “I can swim.”|अप्रत्यक्ष कथन बनाएँ: He said, “I can swim.”",
        "He said he cans swim.~He said I could swimming.~He said he could swim.",
        2,
      ),
    ],
    [
      q(
        "In “Riya reads a book”, the receiver is…|Riya reads a book में कर्म है…",
        "A book~Riya~Reads",
        0,
      ),
      q(
        "Past participle of “write”?|write का तीसरा रूप?",
        "Wrote~Written~Writing",
        1,
      ),
      q(
        "Passive: “They are repairing the road.”|कर्मवाच्य बनाएँ: They are repairing the road.",
        "The road repairs.~The road is repair.~The road is being repaired.",
        2,
      ),
      q(
        "Passive: “Someone has stolen my bag.”|कर्मवाच्य बनाएँ: Someone has stolen my bag.",
        "My bag has been stolen.~My bag has stole.~My bag is steal.",
        0,
      ),
      q(
        "Passive: “The teacher will explain the rule.”|कर्मवाच्य बनाएँ: The teacher will explain the rule.",
        "The rule will explaining.~The rule will be explained by the teacher.~The rule was explain.",
        1,
      ),
    ],
  ],
  social: [
    [
      q(
        "Which direction is opposite north?|उत्तर की विपरीत दिशा?",
        "East|पूर्व~West|पश्चिम~South|दक्षिण",
        2,
      ),
      q(
        "Earth’s shape is approximately…|पृथ्वी का आकार लगभग…",
        "Spherical|गोलाकार~Flat square|समतल वर्ग~A cube|घन",
        0,
      ),
      q(
        "The North Pole has latitude…|उत्तरी ध्रुव का अक्षांश है…",
        "0°~90° N~180° N",
        1,
      ),
      q(
        "A place at 20° S lies…|20° दक्षिण अक्षांश का स्थान है…",
        "North of equator|भूमध्य के उत्तर~On equator|भूमध्य पर~South of equator|भूमध्य के दक्षिण",
        2,
      ),
      q(
        "Which latitude lies in the Northern Hemisphere?|कौन सा अक्षांश उत्तरी गोलार्ध में है?",
        "23° N~10° S~45° S",
        0,
      ),
    ],
    [
      q(
        "A season is related to…|ऋतु किससे संबंधित है?",
        "Book size|किताब का आकार~Yearly weather cycle|वार्षिक मौसम चक्र~A person’s name|व्यक्ति का नाम",
        1,
      ),
      q(
        "Rainfall is a kind of…|वर्षा किसका भाग है?",
        "Rock|चट्टान~Currency|मुद्रा~Weather condition|मौसम की दशा",
        2,
      ),
      q(
        "One unusually cold day proves a region’s climate changed. True?|एक असामान्य ठंडा दिन जलवायु परिवर्तन सिद्ध करता है। सही?",
        "No; long-term evidence is needed|नहीं; दीर्घकालिक प्रमाण चाहिए~Yes always|हमेशा हाँ~Only at noon|केवल दोपहर में",
        0,
      ),
      q(
        "Best data for describing climate?|जलवायु समझने के लिए सर्वोत्तम आँकड़े?",
        "One hour|एक घंटा~Many years of observations|कई वर्षों के अवलोकन~One photograph|एक फोटो",
        1,
      ),
      q(
        "“Tomorrow may be cloudy” is a…|कल बादल हो सकते हैं, यह है…",
        "Climate average|जलवायु औसत~Constitutional right|संवैधानिक अधिकार~Weather forecast|मौसम पूर्वानुमान",
        2,
      ),
    ],
    [
      q(
        "Rules help a group by…|नियम समूह की सहायता कैसे करते हैं?",
        "Setting shared expectations|साझी अपेक्षाएँ तय करके~Ending all choices|सभी विकल्प खत्म करके~Changing Earth’s orbit|पृथ्वी की कक्षा बदलकर",
        0,
      ),
      q(
        "Treating everyone fairly relates to…|सबके साथ निष्पक्ष व्यवहार किससे संबंधित है?",
        "Evaporation|वाष्पीकरण~Equality|समानता~Longitude|देशांतर",
        1,
      ),
      q(
        "Government power should follow…|सरकारी शक्ति का प्रयोग किसके अनुसार होना चाहिए?",
        "Only a ruler’s mood|केवल शासक की इच्छा~No limits|बिना सीमा~Constitutional limits|संवैधानिक सीमाएँ",
        2,
      ),
      q(
        "Why protect fundamental rights?|मौलिक अधिकारों की रक्षा क्यों करें?",
        "To protect dignity and freedom|गरिमा और स्वतंत्रता बचाने के लिए~To cancel all laws|सभी कानून मिटाने के लिए~To avoid all duties|सभी कर्तव्य टालने के लिए",
        0,
      ),
      q(
        "If a rule unfairly discriminates, citizens can seek…|अनुचित भेदभाव वाले नियम के विरुद्ध नागरिक माँग सकते हैं…",
        "Only silence|केवल चुप्पी~Legal remedies|कानूनी उपचार~A weather report|मौसम रिपोर्ट",
        1,
      ),
    ],
    [
      q(
        "A citizen is a member of a…|नागरिक किसका सदस्य होता है?",
        "Triangle|त्रिभुज~Molecule|अणु~Political community|राजनीतिक समुदाय",
        2,
      ),
      q(
        "Voting lets people…|मतदान लोगों को देता है…",
        "Choose representatives|प्रतिनिधि चुनने का अवसर~Change gravity|गुरुत्व बदलने की शक्ति~Stop all debate|सभी बहस रोकने की शक्ति",
        0,
      ),
      q(
        "Why does a secret ballot matter?|गुप्त मतदान क्यों आवश्यक है?",
        "It removes voting|मतदान हटाता है~It reduces pressure on voter choice|मतदाता पर दबाव घटाता है~It guarantees one party|एक दल तय करता है",
        1,
      ),
      q(
        "A democracy needs elections and…|लोकतंत्र में चुनाव के साथ चाहिए…",
        "No criticism|कोई आलोचना नहीं~Inherited rule only|केवल वंश शासन~Rights and accountable institutions|अधिकार और जवाबदेह संस्थाएँ",
        2,
      ),
      q(
        "An elected representative should be…|निर्वाचित प्रतिनिधि को होना चाहिए…",
        "Accountable to people|लोगों के प्रति जवाबदेह~Above every law|हर कानून से ऊपर~Unable to hear citizens|नागरिकों को न सुनने वाला",
        0,
      ),
    ],
    [
      q(
        "Groundwater is a…|भूजल है…",
        "Planet|ग्रह~Natural resource|प्राकृतिक संसाधन~Political party|राजनीतिक दल",
        1,
      ),
      q(
        "Which action wastes water?|किससे पानी व्यर्थ होता है?",
        "Fixing leaks|रिसाव ठीक करना~Harvesting rain|वर्षाजल संग्रह~Leaving a tap running|नल खुला छोड़ना",
        2,
      ),
      q(
        "Why consider future generations?|भविष्य की पीढ़ियों का ध्यान क्यों रखें?",
        "Resources and ecosystems have limits|संसाधनों और पारितंत्र की सीमाएँ हैं~They need no water|उन्हें पानी नहीं चाहिए~All resources are endless|सभी संसाधन अनंत हैं",
        0,
      ),
      q(
        "Best combined development measure?|विकास का बेहतर संयुक्त माप?",
        "Income alone|केवल आय~Income, health, education and environment|आय, स्वास्थ्य, शिक्षा और पर्यावरण~Number of adverts|विज्ञापनों की संख्या",
        1,
      ),
      q(
        "A factory earns profit but pollutes drinking water. Assess…|कारखाना लाभ कमाता है पर पेयजल दूषित करता है। क्या देखें?",
        "Profit alone|केवल लाभ~Paint colour|रंग~Social and environmental costs too|सामाजिक और पर्यावरणीय लागत भी",
        2,
      ),
    ],
  ],
  logic: [
    [
      q("2 × 3 = ?|2 × 3 का मान?", "6~5~8", 0),
      q("Double 5 is…|5 का दोगुना है…", "7~10~15", 1),
      q("5, 10, 20, 40, …|5, 10, 20, 40 में अगली संख्या?", "45~60~80", 2),
      q(
        "A plant count doubles daily from 3. After 3 doublings?|3 पौधों की संख्या प्रतिदिन दोगुनी है। 3 बार दोगुना होने पर?",
        "24~12~18",
        0,
      ),
      q(
        "Which does not fit 2, 4, 8, 15, 32?|2, 4, 8, 15, 32 के दोगुने पैटर्न में गलत संख्या?",
        "8~15~32",
        1,
      ),
    ],
    [
      q("7 − 3 = ?|7 − 3 का मान?", "10~3~4", 2),
      q("Difference between 5 and 8?|5 और 8 का अंतर?", "3~2~4", 0),
      q("1, 4, 9, 16, …|1, 4, 9, 16 में अगली संख्या?", "20~25~24", 1),
      q("3, 7, 13, 21, …|3, 7, 13, 21 में अगली संख्या?", "25~29~31", 2),
      q("0, 2, 6, 12, 20, …|0, 2, 6, 12, 20 में अगली संख्या?", "30~28~24", 0),
    ],
    [
      q(
        "₹20 divided equally between 2 people gives each…|₹20 दो लोगों में बराबर बाँटें तो प्रत्येक को…",
        "₹40~₹10~₹2",
        1,
      ),
      q(
        "If one pen costs ₹5, two cost…|एक पेन ₹5 है तो दो का मूल्य…",
        "₹7~₹2.5~₹10",
        2,
      ),
      q(
        "4 kg rice costs ₹240. Cost of 7 kg at same rate?|4 किलो चावल ₹240 हैं। उसी दर पर 7 किलो का मूल्य?",
        "₹420~₹360~₹480",
        0,
      ),
      q(
        "Mixture ratio red:blue is 2:3. In 25 litres, blue is…|लाल:नीला अनुपात 2:3 है। 25 लीटर में नीला कितना?",
        "10 L~15 L~20 L",
        1,
      ),
      q(
        "6 workers finish in 10 days. At equal rates 3 workers need…|6 श्रमिक 10 दिन में काम करते हैं। समान दर पर 3 श्रमिकों को कितने दिन?",
        "5~10~20",
        2,
      ),
    ],
    [
      q("A square has how many sides?|वर्ग की कितनी भुजाएँ हैं?", "4~3~5", 0),
      q(
        "A rectangle has…|आयत में होते हैं…",
        "Three angles|तीन कोण~Four right angles|चार समकोण~No parallel sides|कोई समांतर भुजा नहीं",
        1,
      ),
      q(
        "All A are B; all B are C. Therefore…|सभी A, B हैं; सभी B, C हैं। निष्कर्ष?",
        "All C are A|सभी C, A हैं~No A is C|कोई A, C नहीं~All A are C|सभी A, C हैं",
        2,
      ),
      q(
        "All roses are flowers. A flower is necessarily a rose. Is this valid?|सभी गुलाब फूल हैं। इसलिए हर फूल गुलाब है। क्या यह वैध है?",
        "No|नहीं~Yes|हाँ~Only at night|केवल रात में",
        0,
      ),
      q(
        "If it rains, the ground gets wet. Wet ground alone proves rain?|बारिश से जमीन गीली होती है। केवल गीली जमीन बारिश सिद्ध करती है?",
        "Yes always|हमेशा हाँ~No; other causes are possible|नहीं; अन्य कारण संभव हैं~Only in winter|केवल सर्दियों में",
        1,
      ),
    ],
    [
      q(
        "A standard die has how many faces?|सामान्य पासे के कितने फलक हैं?",
        "4~8~6",
        2,
      ),
      q("One half as a decimal is…|एक आधा दशमलव में है…", "0.5~0.2~2", 0),
      q(
        "Fair die: probability of a number greater than 4?|निष्पक्ष पासे पर 4 से बड़ी संख्या की प्रायिकता?",
        "1/2~1/3~1/6",
        1,
      ),
      q(
        "Two fair coin tosses: probability of two heads?|निष्पक्ष सिक्के के दो उछालों में दोनों चित की प्रायिकता?",
        "1/2~1~1/4",
        2,
      ),
      q(
        "A bag has 3 red and 2 blue balls. Random red probability?|थैले में 3 लाल और 2 नीली गेंद हैं। लाल निकलने की प्रायिकता?",
        "3/5~2/5~1/2",
        0,
      ),
    ],
  ],
};
export const practiceHindi = {
  mathematics: [
    ["1/4 + 2/4 का मान?", "3/4 − 1/4 का मान?"],
    ["−3 + 5 का मान?", "5 + (−8) का मान?"],
    ["2x + 3 = 11 में x का मान?", "3x − 2 = 10 में x का मान?"],
    [
      "आधार 8 सेमी, ऊँचाई 5 सेमी। त्रिभुज का क्षेत्रफल?",
      "आधार 12 सेमी, ऊँचाई 4 सेमी। त्रिभुज का क्षेत्रफल?",
    ],
    ["x² − 5x + 6 = 0 के मूल?", "x² − 7x + 12 = 0 के मूल?"],
  ],
  science: [
    [
      "पानी से रेत अलग करने की विधि?",
      "पानी में घुले नमक को वापस पाने की विधि?",
    ],
    [
      "धातु के चम्मच में ऊष्मा किससे चलती है?",
      "गर्म पानी का ऊपर उठना किसका उदाहरण है?",
    ],
    [
      "समान बल छोटे क्षेत्र पर लगाने से क्या होगा?",
      "20 न्यूटन बल 4 मी² क्षेत्र पर लगे तो दाब?",
    ],
    [
      "एक पानी के अणु में कितने हाइड्रोजन परमाणु हैं?",
      "तीन पानी के अणुओं में कितने ऑक्सीजन परमाणु हैं?",
    ],
    ["12 वोल्ट और 4 ओम पर धारा?", "2 एम्पियर और 5 ओम पर विभवांतर?"],
  ],
  english: [
    [
      "the curious student में विशेषण कौन सा है?",
      "the green leaf में संज्ञा कौन सी है?",
    ],
    ["go का भूतकाल क्या है?", "पूरा करें: Yesterday she ___ a book."],
    [
      "कर्ता और क्रिया की दृष्टि से सही वाक्य चुनें।",
      "बहुवचन कर्ता के लिए सही वाक्य चुनें।",
    ],
    [
      "अप्रत्यक्ष कथन बनाएँ: He said, I am tired.",
      "अप्रत्यक्ष कथन बनाएँ: She said, I like tea.",
    ],
    [
      "कर्मवाच्य बनाएँ: They built the bridge.",
      "कर्मवाच्य बनाएँ: She writes a letter.",
    ],
  ],
  social: [
    [
      "भूमध्य रेखा किस अक्षांश पर है?",
      "भूमध्य रेखा के सापेक्ष भारत किस गोलार्ध में है?",
    ],
    [
      "आज बारिश हो रही है, यह किसका वर्णन है?",
      "कई वर्षों की औसत दशाएँ क्या बताती हैं?",
    ],
    ["संविधान क्या प्रदान करता है?", "कानून के समक्ष समानता का अर्थ क्या है?"],
    [
      "प्रतिनिधि किस प्रकार चुने जाते हैं?",
      "निष्पक्ष चुनाव में क्या होना चाहिए?",
    ],
    [
      "कौन सा कार्य सतत विकास में सहायक है?",
      "विकास में किसका ध्यान रखना चाहिए?",
    ],
  ],
  logic: [
    ["2, 4, 8, 16 के बाद क्या आता है?", "3, 6, 12, 24 के बाद क्या आता है?"],
    ["1, 3, 6, 10 के बाद क्या आता है?", "2, 5, 9, 14 के बाद क्या आता है?"],
    [
      "2 कॉपियाँ ₹40 की हैं। उसी दर पर 5 का मूल्य?",
      "3 पेन ₹30 के हैं। उसी दर पर 7 का मूल्य?",
    ],
    [
      "सभी वर्ग आयत हैं। एक वर्ग अवश्य क्या होगा?",
      "क्या हर आयत को वर्ग मान सकते हैं?",
    ],
    [
      "निष्पक्ष पासे पर 6 आने की प्रायिकता?",
      "निष्पक्ष पासे पर सम संख्या की प्रायिकता?",
    ],
  ],
};
const translations = {
  Filtration: "छानना",
  Melting: "पिघलना",
  Condensation: "संघनन",
  Evaporation: "वाष्पीकरण",
  Sieving: "छलनी",
  Convection: "संवहन",
  Radiation: "विकिरण",
  Conduction: "चालन",
  "Lower pressure": "कम दाब",
  "Higher pressure": "अधिक दाब",
  "No pressure": "कोई दाब नहीं",
  Curious: "जिज्ञासु (Curious)",
  Student: "छात्र (Student)",
  The: "The",
  Green: "हरा (Green)",
  Leaf: "पत्ती (Leaf)",
  Climate: "जलवायु",
  Latitude: "अक्षांश",
  Weather: "मौसम",
  "Today’s weather": "आज का मौसम",
  "A forecast only": "केवल पूर्वानुमान",
  Northern: "उत्तरी",
  Southern: "दक्षिणी",
  Neither: "कोई नहीं",
  "Only school rules": "केवल स्कूल के नियम",
  "A framework of government": "शासन की संरचना",
  "Only weather forecasts": "केवल मौसम पूर्वानुमान",
  "Rules only for some": "केवल कुछ लोगों पर नियम",
  "No laws exist": "कोई कानून नहीं",
  "Everyone is subject to law equally": "सभी पर कानून समान लागू होता है",
  Elections: "चुनाव",
  "Inheritance alone": "केवल वंशानुक्रम",
  "Random weather": "अनियमित मौसम",
  "Only one person to vote": "केवल एक मतदाता",
  "Eligible voters a free choice": "पात्र मतदाताओं को स्वतंत्र चुनाव",
  "No secret ballot ever": "गुप्त मतदान कभी नहीं",
  "Wasting groundwater": "भूजल व्यर्थ करना",
  "Burning all forests": "सभी वन जलाना",
  "Rainwater harvesting": "वर्षाजल संग्रह",
  "People and environment": "लोग और पर्यावरण",
  "Income alone": "केवल आय",
  "Today alone": "केवल आज",
  "A rectangle": "आयत",
  "A circle": "वृत्त",
  "A triangle": "त्रिभुज",
  "Yes always": "हमेशा हाँ",
  No: "नहीं",
  "Only if blue": "केवल नीला होने पर",
};
export function localise(value, hi) {
  const pair = String(value).split("|");
  return hi ? pair[1] || translations[pair[0]] || pair[0] : pair[0];
}
