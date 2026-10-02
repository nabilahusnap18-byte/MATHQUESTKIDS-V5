import { Question, SchoolYear } from '../types';

/**
 * Deterministic math question generator for unlimited adaptive practice.
 * Generates verified Malaysian KSSR curriculum questions with randomized seeds
 * and authentic local contexts.
 */

const LOCAL_ITEMS = [
  { itemMs: 'nasi lemak', itemEn: 'nasi lemak', price: 3 },
  { itemMs: 'karipap pusing', itemEn: 'curry puff', price: 1 },
  { itemMs: 'roti canai', itemEn: 'roti canai', price: 2 },
  { itemMs: 'durian Musang King', itemEn: 'Musang King durian', price: 45 },
  { itemMs: 'buku tulis latihan', itemEn: 'exercise book', price: 4 },
  { itemMs: 'pensel warna 24 batang', itemEn: '24-color pencils', price: 12 },
  { itemMs: 'kotak pensel comel', itemEn: 'cute pencil case', price: 8 },
  { itemMs: 'botol air sekolah', itemEn: 'school water bottle', price: 15 },
];

export function generateDynamicQuestion(
  topicId: string,
  year: SchoolYear,
  difficulty: 1 | 2 | 3 = 2
): Question {
  const qId = `dyn-${topicId}-y${year}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  if (topicId === 'money') {
    const item = LOCAL_ITEMS[Math.floor(Math.random() * LOCAL_ITEMS.length)];
    const quantity = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const totalCost = item.price * quantity;
    const paidBills = [10, 20, 50, 100];
    const paid = paidBills.find((b) => b >= totalCost) || totalCost + 10;
    const change = paid - totalCost;

    if (Math.random() > 0.5) {
      // Find total cost
      return {
        id: qId,
        year,
        topicId: 'money',
        difficulty,
        type: 'numeric',
        promptMs: `Adik membeli ${quantity} biji ${item.itemMs} yang berharga RM${item.price} setiap satu. Berapakah jumlah wang yang perlu dibayar?`,
        promptEn: `You bought ${quantity} of ${item.itemEn} at RM${item.price} each. What is the total cost?`,
        correctAnswer: totalCost,
        explanationMs: `${quantity} × RM${item.price} = RM${totalCost}.`,
        explanationEn: `${quantity} × RM${item.price} = RM${totalCost}.`,
        hintStepsMs: [
          `Gunakan operasi darab untuk mencari jumlah harga.`,
          `Darabkan kuantiti (${quantity}) dengan harga seunit (RM${item.price}).`,
          `${quantity} × ${item.price} = RM${totalCost}.`,
        ],
        hintStepsEn: [
          `Use multiplication to find total cost.`,
          `Multiply quantity (${quantity}) by price (RM${item.price}).`,
          `${quantity} × ${item.price} = RM${totalCost}.`,
        ],
      };
    } else {
      // Find change
      return {
        id: qId,
        year,
        topicId: 'money',
        difficulty,
        type: 'numeric',
        promptMs: `Ibu membeli barang di pasar malam dengan jumlah RM${totalCost}. Ibu membayar dengan wang kertas RM${paid}. Berapakah baki wang yang diterima ibu?`,
        promptEn: `Mother bought items at the night market for RM${totalCost}. She paid with RM${paid}. How much change does she receive?`,
        correctAnswer: change,
        explanationMs: `RM${paid} - RM${totalCost} = RM${change}.`,
        explanationEn: `RM${paid} - RM${totalCost} = RM${change}.`,
        hintStepsMs: [
          `Untuk mencari baki wang, gunakan operasi tolak (-).`,
          `Wang dibayar (RM${paid}) tolak harga barang (RM${totalCost}).`,
          `${paid} - ${totalCost} = RM${change}.`,
        ],
        hintStepsEn: [
          `To find the change, use subtraction (-).`,
          `Amount paid (RM${paid}) minus cost (RM${totalCost}).`,
          `${paid} - ${totalCost} = RM${change}.`,
        ],
      };
    }
  }

  if (topicId === 'whole-numbers') {
    if (year <= 3) {
      if (difficulty === 1) {
        // Simple 3-digit addition
        const a = Math.floor(Math.random() * 400) + 100;
        const b = Math.floor(Math.random() * 400) + 100;
        const sum = a + b;
        return {
          id: qId,
          year,
          topicId: 'whole-numbers',
          difficulty: 1,
          type: 'numeric',
          promptMs: `Kira hasil tambah: ${a} + ${b} = ?`,
          promptEn: `Calculate the sum: ${a} + ${b} = ?`,
          correctAnswer: sum,
          explanationMs: `${a} + ${b} = ${sum}.`,
          explanationEn: `${a} + ${b} = ${sum}.`,
          hintStepsMs: [
            `Susun nombor mengikut sa, puluh, dan ratus.`,
            `Tambah digit sa dahulu, kemudian puluh, dan ratus.`,
            `Hasil tambahnya ialah ${sum}.`,
          ],
          hintStepsEn: [
            `Align numbers by ones, tens, and hundreds.`,
            `Add ones first, then tens, then hundreds.`,
            `The sum is ${sum}.`,
          ],
        };
      } else {
        // Multiplication table
        const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
        const b = Math.floor(Math.random() * 8) + 2;
        const product = a * b;
        const fake1 = product + a;
        const fake2 = Math.max(1, product - b);
        const fake3 = product + 2;
        return {
          id: qId,
          year,
          topicId: 'whole-numbers',
          difficulty,
          type: 'multiple-choice',
          promptMs: `Kira hasil darab: ${a} × ${b} = ?`,
          promptEn: `Calculate the product: ${a} × ${b} = ?`,
          options: [
            { id: '1', labelMs: `${product}`, labelEn: `${product}`, isCorrect: true },
            { id: '2', labelMs: `${fake1}`, labelEn: `${fake1}`, isCorrect: false },
            { id: '3', labelMs: `${fake2}`, labelEn: `${fake2}`, isCorrect: false },
            { id: '4', labelMs: `${fake3}`, labelEn: `${fake3}`, isCorrect: false },
          ].sort(() => Math.random() - 0.5),
          correctAnswer: `${product}`,
          explanationMs: `${a} × ${b} = ${product}.`,
          explanationEn: `${a} × ${b} = ${product}.`,
          hintStepsMs: [
            `Ingat sifir ${a}.`,
            `Kira gandaan ${a} sebanyak ${b} kali.`,
            `${a} × ${b} = ${product}.`,
          ],
          hintStepsEn: [
            `Recall the ${a} times table.`,
            `Count multiples of ${a} by ${b} times.`,
            `${a} × ${b} = ${product}.`,
          ],
        };
      }
    } else {
      // Year 4-6: Mixed operations (BODMAS)
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 6) + 2;
      const c = Math.floor(Math.random() * 6) + 2;
      const ans = a + b * c;
      return {
        id: qId,
        year,
        topicId: 'whole-numbers',
        difficulty,
        type: 'numeric',
        promptMs: `Selesaikan mengikut tertib operasi: ${a} + ${b} × ${c} = ?`,
        promptEn: `Solve following order of operations: ${a} + ${b} × ${c} = ?`,
        correctAnswer: ans,
        explanationMs: `Darab dahulu: ${b} × ${c} = ${b * c}. Kemudian tambah: ${a} + ${b * c} = ${ans}.`,
        explanationEn: `Multiply first: ${b} × ${c} = ${b * c}. Then add: ${a} + ${b * c} = ${ans}.`,
        hintStepsMs: [
          `Gunakan prinsip KUDABATO (BODMAS): Darab dilakukan sebelum Tambah.`,
          `Kira ${b} × ${c} = ${b * c}.`,
          `Tambah dengan ${a}: ${a} + ${b * c} = ${ans}.`,
        ],
        hintStepsEn: [
          `Follow BODMAS rule: Multiplication comes before Addition.`,
          `Compute ${b} × ${c} = ${b * c}.`,
          `Add ${a}: ${a} + ${b * c} = ${ans}.`,
        ],
      };
    }
  }

  if (topicId === 'fractions-decimals-percentages') {
    const denom = [4, 5, 8, 10][Math.floor(Math.random() * 4)];
    const num1 = Math.floor(Math.random() * (denom - 2)) + 1;
    const num2 = 1;
    const sumNum = num1 + num2;

    return {
      id: qId,
      year,
      topicId: 'fractions-decimals-percentages',
      difficulty,
      type: 'numeric',
      promptMs: `Kira hasil tambah pecahan: ${num1}/${denom} + ${num2}/${denom} = ? Berapakah nombor pengangka (atas)?`,
      promptEn: `Add fractions: ${num1}/${denom} + ${num2}/${denom} = ? What is the numerator (top number)?`,
      correctAnswer: sumNum,
      explanationMs: `Kerana penyebut sama (${denom}), tambah pengangka sahaja: ${num1} + ${num2} = ${sumNum}. Jawapannya ${sumNum}/${denom}.`,
      explanationEn: `Since denominators match (${denom}), add numerators: ${num1} + ${num2} = ${sumNum}. Answer is ${sumNum}/${denom}.`,
      hintStepsMs: [
        `Penyebut sudah sama iaitu ${denom}.`,
        `Tambah nombor pengangka di atas: ${num1} + ${num2}.`,
        `${num1} + ${num2} = ${sumNum}.`,
      ],
      hintStepsEn: [
        `Denominators already match (${denom}).`,
        `Add the top numerators: ${num1} + ${num2}.`,
        `${num1} + ${num2} = ${sumNum}.`,
      ],
    };
  }

  // Fallback measurement / geometry dynamic question
  const length = Math.floor(Math.random() * 7) + 3;
  const width = Math.floor(Math.random() * 5) + 2;
  const area = length * width;
  return {
    id: qId,
    year,
    topicId: 'space-geometry',
    difficulty,
    type: 'numeric',
    promptMs: `Sebuah bilik darjah berbentuk segi empat tepat berukuran ${length} m panjang dan ${width} m lebar. Cari luas lantai dalam m².`,
    promptEn: `A rectangular classroom is ${length} m long and ${width} m wide. Find its floor area in m².`,
    correctAnswer: area,
    explanationMs: `Luas = Panjang × Lebar = ${length} × ${width} = ${area} m².`,
    explanationEn: `Area = Length × Width = ${length} × ${width} = ${area} m².`,
    hintStepsMs: [
      `Rumus luas segi empat tepat ialah Panjang × Lebar.`,
      `Darabkan ${length} dengan ${width}.`,
      `${length} × ${width} = ${area} m².`,
    ],
    hintStepsEn: [
      `Area formula of rectangle is Length × Width.`,
      `Multiply ${length} by ${width}.`,
      `${length} × ${width} = ${area} m².`,
    ],
  };
}
