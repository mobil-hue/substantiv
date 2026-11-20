(function(){
'use strict';
/* Engelsk til gangesystem-videoene: fortellerstemme per scene (SCENES) og tekstene som står på tavla (LABELS, nøkkel = norsk tekst). */
const A = window.App;
const EN = A.GS_EN = {SCENES:{}, LABELS:{}};

EN.SCENES = {
gs_system: [
  "Hi! The times table has a hundred squares. That sounds like a lot. But you don't have to memorize all hundred!",
  "Here is the whole times table. A hundred squares. Let's see how many we really have to memorize.",
  "First we remove the mirror images. 5 × 6 is the same as 6 × 5. Now only 55 are left.",
  "Then we remove the one times table, the two times table and the ten times table. They are very easy. Now 28 are left.",
  "The five times table is easy too. Now 21 are left.",
  "Next come like times like. These are the square numbers, and there are only six. Now 15 are left.",
  "The nine times table has a rule. Five more facts disappear. Now only 10 are left!",
  "These are the ten facts we have to memorize. Everything else has a rule.",
  "From 100 to 10, step by step. We learn one step at a time. Are you ready?"
],
gs_mirror: [
  "Now we learn the first trick: mirror facts.",
  "3 rows of 7 dots. If we turn the grid, we get 7 rows of 3 dots. It is the same number of dots.",
  "3 × 7 is 21. 7 × 3 is also 21. The answer is the same.",
  "In the table they sit on opposite sides of the diagonal. Look: three and seven here, and seven and three here.",
  "We only need one half. Now 55 facts are left.",
  "Tip: turn the fact around, so the smallest number comes first. 8 × 3 becomes 3 × 8. That is often easier.",
  "Great! Now you know that you only have to learn half of the table."
],
gs_easy: [
  "Now come three very easy times tables: the one times table, the two times table and the ten times table.",
  "The one times table: multiplying by 1 gives the same number. 7 × 1 is 7.",
  "The ten times table: put a zero after the number. 7 × 10 is 70. 10 × 10 is 100.",
  "The two times table: double it! 8 × 2 is 8 + 8. That is 16.",
  "These three make 27 squares in the table easy.",
  "Try it yourself: 9 × 1, 9 × 2 and 9 × 10. The answers are 9, 18 and 90.",
  "Well done! You already know 27 facts."
],
gs_five: [
  "Now we learn the five times table. It is easy too.",
  "Count by fives: 5, 10, 15, 20, 25, 30. Every jump is five.",
  "Five is half of ten. So the five times table is half of the ten times table. 7 × 10 is 70, and half of that is 35.",
  "If the number is even, you can halve the number and put a zero after it. 8 × 5: half of 8 is 4, zero after it, 40.",
  "The answers in the five times table always end in 0 or 5.",
  "The five times table removes 7 more facts. Now 21 are left.",
  "The five times table: half of the ten times table!"
],
gs_square: [
  "Now we learn like times like. They are called square numbers.",
  "3 rows of 3. 4 rows of 4. The dots form a square. That is why they are called square numbers.",
  "We memorize these as a small group of their own. 3 × 3 is 9. 4 × 4 is 16. 6 × 6 is 36.",
  "7 × 7 is 49. 8 × 8 is 64. 9 × 9 is 81.",
  "You already know 2 × 2, 5 × 5 and 10 × 10 from the easy tables. We don't need them here.",
  "The square numbers sit on the diagonal. Six facts. Now 15 are left.",
  "A little trick: add the next odd number. 9 + 7 is 16. 16 + 9 is 25. 25 + 11 is 36.",
  "Six square numbers: 9, 16, 36, 49, 64 and 81. Practise them as a group of their own!"
],
gs_nine: [
  "The nine times table has a rule. Multiply by ten, and subtract the number once.",
  "Why? Nine is one less than ten. 7 rows of ten dots is 70. We remove one dot from each row, seven dots. 70 − 7 is 63.",
  "Here are all five: 3 × 9 is 27. 4 × 9 is 36. 6 × 9 is 54. 7 × 9 is 63. 8 × 9 is 72.",
  "Look at the answers: 27, 36, 54, 63 and 72. The digits add up to nine! 2 + 7 is 9. Use that as a check.",
  "The rule works for 9 × 9 too: 90 − 9 is 81. But it belongs with the square numbers.",
  "The nine times table removes 5 facts. Now only 10 are left!",
  "The nine rule: multiply by ten, and subtract the number. Easy!"
],
gs_learn: [
  "Now only 10 facts are left. We have to memorize those. But we have good tricks!",
  "Here are the ten. They sit in a small area in the middle of the table.",
  "The three times table: 3 × 4, 3 × 6, 3 × 7 and 3 × 8. The four times table: 4 × 6, 4 × 7 and 4 × 8. The six times table: 6 × 7 and 6 × 8. And finally 7 × 8.",
  "The trick for the four times table: double twice. 4 × 7: 7, 14, 28.",
  "The trick for the eight times table: double three times. 6 × 8: 6, 12, 24, 48.",
  "The seven times table: use what you know. 3 × 7 is two sevens and one more seven: 14 + 7 is 21. 6 × 7 is five sevens and one more: 35 + 7 is 42.",
  "Last one: 7 × 8. Remember the row 5, 6, 7, 8. 56 is 7 × 8.",
  "Ten facts. Practise a little every day, and soon they will stick!"
],
gs_which: [
  "How do you know which rule to use? Ask four questions, in the right order.",
  "Question 1: Is one of the factors 1, 2 or 10? Then you use the easy tricks.",
  "Question 2: Is one of the factors 5? Then you use the five times table: half of the ten times table.",
  "Question 3: Are the factors the same? Then it is a square number, and you memorize it.",
  "Question 4: Is one of the factors 9? Then you use the nine rule: multiply by ten and subtract.",
  "If the answer is no to all four, you have to memorize it. But there are only 10 facts.",
  "Example: 6 × 9. 1, 2 or 10? No. 5? No. Same? No. 9? Yes! Then it is the nine rule: 60 − 6 is 54.",
  "Example: 5 × 5. 1, 2 or 10? No. 5? Yes! It is the five times table: half of 50 is 25. Note: 5 × 5 belongs to the five times table, not to the square numbers.",
  "Example: 7 × 8. No, no, no and no. Then you have to memorize it: 56.",
  "When you practise, you can always press the question mark. Then you find out which rule applies."
]};

EN.LABELS = {
  'Gangetabellen som system':'The times table as a system', '100 ruter':'100 squares', 'speilvendte ut → 55':'mirror facts out → 55',
  '1-, 2- og 10-gangen ut → 28':'1s, 2s and 10s out → 28', '5-gangen ut → 21':'5s out → 21', 'like × like ut → 15':'like × like out → 15',
  '9-regelen → 10 igjen':'9 rule → 10 left', 'Det som må læres: 10':'To memorize: 10', 'ett steg om gangen':'one step at a time',
  'Speilvendte regnestykker':'Mirror facts', 'diagonalen':'the diagonal', 'bare halve tabellen → 55':'only half the table → 55',
  'det minste tallet først':'smallest number first', 'Speilvendt!':'Mirrored!', 'Lær bare halve tabellen':'Learn only half the table',
  '1-, 2- og 10-gangen':'The 1, 2 and 10 times tables', '1-gangen':'The 1 times table', 'samme tall':'same number', '10-gangen':'The 10 times table',
  'en null bak':'a zero after it', '2-gangen':'The 2 times table', '27 ruter er lette':'27 squares are easy', 'Du kan allerede 27!':'You already know 27!',
  '5-gangen':'The 5 times table', '5 er halvparten av 10':'5 is half of 10', 'partall: halver, null bak':'even number: halve it, zero after it',
  'slutter på 0 eller 5':'ends in 0 or 5', 'halvparten av 10-gangen':'half of the 10 times table', 'Like × like':'Like × like',
  'kvadrat = firkant':'square', 'kan du fra før':'you already know these', '6 kvadrattall → 15 igjen':'6 square numbers → 15 left',
  'Seks kvadrattall':'Six square numbers', 'hører til kvadrattallene':'belongs with the square numbers', '9-regelen':'The 9 rule',
  'gang med 10, trekk fra tallet':'multiply by 10, subtract the number', 'De ti som må pugges':'The ten to memorize', '10 regnestykker':'10 facts',
  '4-gangen: doble to ganger':'4s: double twice', '8-gangen: doble tre ganger':'8s: double three times', 'øv litt hver dag':'practise a little every day',
  'Hvilken regel gjelder?':'Which rule applies?', 'Er en av faktorene 1, 2 eller 10?':'Is one of the factors 1, 2 or 10?',
  'Er en av faktorene 5?':'Is one of the factors 5?', 'Er faktorene like (like × like)?':'Are the factors the same (like × like)?',
  'Er en av faktorene 9?':'Is one of the factors 9?', 'Ingen av dem → må læres':'None of them → memorize', 'Trykk på ❓':'Press ❓',
  'så får du vite hvilken regel som gjelder':'to find out which rule applies'
};

/* gjør om regnestykker til engelsk tale: «3 × 7 = 21» → «3 times 7 equals 21» */
A.spokenMathEn = t => String(t).replace(/\s*×\s*/g, ' times ').replace(/\s*\+\s*/g, ' plus ').replace(/\s*[−]\s*/g, ' minus ').replace(/\s*÷\s*/g, ' divided by ').replace(/\s*=\s*/g, ' equals ').replace(/\s{2,}/g, ' ').trim();
})();
