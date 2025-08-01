import { jsonrepair } from "jsonrepair";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session)
    return res.status(401).json({
      success: false,
      status_code: 401,
      error: {
        name: "UnauthorizedError",
        message: "Unauthorized",
        errors: null,
      },
    });

  try {
    const response = await fetch(process.env.AI_ENDPOINT as string, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AI_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah asisten yang bisa mengubah soal ke format JSON dengan struktur tertentu.",
          },
          {
            role: "user",
            content: `
Kamu akan mengubah daftar soal pilihan ganda yang ditulis dalam format teks menjadi array JSON.

Struktur setiap soal sebagai berikut:
- Soal bisa diawali dengan nomor (contoh: 1. ...) atau langsung teks pertanyaan
- Ada 5 pilihan jawaban (A sampai E), masing-masing ditulis di baris terpisah

- Setelah pilihan, terdapat baris:
Jawaban Benar: <huruf yang benar>

- Setelah itu, terdapat penjelasan yang dimulai dengan:
Penjelasan Lengkap: <isi penjelasan>

- Jika ada bagian seperti "Tips Menjawab Soal:" atau "Penjelasan Lengkap Kenapa Opsi Lain Salah:", masukkan masing-masing ke dalam paragraf HTML yang berbeda di dalam field explanation. Setiap bagian dibungkus tag <p>...</p> dan ditaruh berurutan.

Tugasmu:

Konversi seluruh isi soal di bawah ini menjadi format JSON seperti ini:

[
  {
  "text": "<p>Isi pertanyaan dimasukkan ke tag HTML paragraf</p>",
  "options": [
      { "text": "Pilihan A", "is_correct": false },
      { "text": "Pilihan B", "is_correct": false },
      { "text": "Pilihan C", "is_correct": false },
      { "text": "Pilihan D", "is_correct": false },
      { "text": "Pilihan E", "is_correct": false }
  ],
  "explanation": "<p>Penjelasan lengkap dimasukin di paragraf ini.</p><p>Tips menjawab soal (jika ada) ditulis di paragraf berikutnya.</p><p>Penjelasan Lengkap Kenapa Opsi Lain Salah (jika ada) ditulis di paragraf berikutnya.</p>",
  "type": "text"
  }
]

Catatan penting:
- Hanya satu opsi "is_correct": true per soal
- Soal dan pembahasan wajib dibungkus tag <p>...</p>
- Jawaban harus dihubungkan ke opsi yang benar berdasarkan hurufnya
- Jika ada bagian seperti "Tips menjawab soal", pastikan isinya dimasukkan juga ke dalam explanation, bukan diabaikan
- Jika soal tidak memiliki nomor di awal, tetap anggap itu sebagai awal dari soal baru
- Jangan mengubah, menyunting, menambahkan, atau menghilangkan kata atau kalimat apapun dari teks asli. Tugasmu hanya mengambil, membungkus, dan mengkonversi, bukan memperbaiki atau mengimprovisasi.
- Jawaban kamu HARUS hanya berupa array JSON VALID, dan tanpa karakter di luar JSON.
- Jawaban kamu harus tidak ada baris yang terpotong.
- Jawaban kamu harus berurutan.

Berikut daftar soal yang ingin diubah ke format JSON:
${req.body.text}
`,
          },
          ...(req.body.prompt
            ? [
                {
                  role: "user",
                  content:
                    req.body.prompt +
                    " dan jawab dengan format JSON VALID DAN LENGKAP TANPA TERKECUALI.",
                },
              ]
            : []),
        ],
        temperature: 0,
        stream: true,
      }),
    });

    if (!response.body) {
      return res.status(500).json({
        success: false,
        status_code: 500,
        error: {
          name: "InternalServerError",
          message: "Failed to get response body",
        },
      });
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let result = "";

    if (!reader) throw new Error("No response body");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.replace("data: ", "");
          if (dataStr === "[DONE]") break;

          try {
            const json = JSON.parse(dataStr);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              result += content;
            }
          } catch (e) {
            console.error("Failed to parse JSON:", e, dataStr);
          }
        }
      }
    }

    const resultJSON = JSON.parse(jsonrepair(result));

    return res.status(200).json({
      success: true,
      status_code: 200,
      data: resultJSON,
    });
  } catch (e) {
    console.error("Error processing AI request:", e);
    return res.status(500).json({
      success: false,
      status_code: 500,
      error: {
        name: "InternalServerError",
        message: "Failed to process AI request",
        errors: e instanceof Error ? e.message : "Unknown error",
      },
    });
  }
}
