import { useState } from "react";
import {
  Send,
  Loader2,
  Dna,
  Clock,
  FlaskConical,
  Sparkles,
} from "lucide-react";

const API_URL = "http://178.104.227.250:3000/api/predict";

export default function App() {
  const [sequence, setSequence] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const exampleSequences = [
    {
      name: "Human Hemoglobin",
      seq: "MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFK",
    },
    {
      name: "Short Protein",
      seq: "ACDEFGHIKLMNPQRSTVWY",
    },
  ];

  const handleSend = async () => {
    if (sequence.trim().length < 10) {
      setError("The sequence must contain at least 10 amino acids.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequence,
          topN: 5,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setResponse(data.data);
    } catch (err) {
      setError(err.message || "Connection error");
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (seq) => {
    setSequence(seq);
    setError("");
    setResponse(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-4xl space-y-6 md:space-y-8">
        {/* HEADER */}
        <header className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3 animate-pulse">
            <div className="relative">
              <Dna
                className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400"
                strokeWidth={2}
              />
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 absolute -top-1 -right-1" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Protein Predictor
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-2">
            Discover similar proteins in UniProt using artificial intelligence
          </p>
        </header>

        {/* INPUT CARD */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6 md:p-8">
          <label className="block text-sm font-semibold text-gray-200 mb-3">
            Protein Sequence
          </label>

          <textarea
            value={sequence}
            onChange={(e) => setSequence(e.target.value.toUpperCase())}
            placeholder="Example: MVLSPADKTNVKAAWGKVGAHAGEY..."
            className="w-full h-40 font-mono text-sm p-4 bg-white/5 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all outline-none resize-none"
          />

          <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <p className="text-sm text-gray-400">
                {sequence.length} amino acids
              </p>

              <div className="flex flex-wrap gap-2">
                {exampleSequences.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadExample(ex.seq)}
                    className="px-3 py-2 text-xs sm:text-sm text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full sm:w-auto sm:self-end flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Analyze
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl backdrop-blur-sm break-words">
              <span className="font-semibold">⚠️ Error:</span> {error}
            </div>
          )}
        </div>

        {/* RESULTS */}
        {response && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* METADATA */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <Clock className="w-6 h-6 text-cyan-400 mx-auto" />
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {response.metadata.processingTime}
                    <span className="text-sm font-normal text-gray-300 ml-1">
                      ms
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">Processing Time</p>
                </div>

                <div className="space-y-2">
                  <Dna className="w-6 h-6 text-purple-400 mx-auto" />
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {response.inputSequence.length}
                    <span className="text-sm font-normal text-gray-300 ml-1">
                      aa
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">Length</p>
                </div>

                <div className="space-y-2">
                  <FlaskConical className="w-6 h-6 text-pink-400 mx-auto" />
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {response.predictions.length}
                  </p>
                  <p className="text-xs text-gray-400">Results</p>
                </div>
              </div>
            </div>

            {/* PREDICTIONS */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <FlaskConical className="text-cyan-400 shrink-0" />
                <span>Most Similar Proteins</span>
              </h2>

              <div className="space-y-4">
                {response.predictions.map((p, idx) => (
                  <div
                    key={p.rank}
                    className="bg-white/5 border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300"
                    style={{
                      animationDelay: `${idx * 100}ms`,
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                      <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2 break-all">
                        <span className="flex items-center justify-center min-w-8 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-sm">
                          {p.rank}
                        </span>

                        <span className="break-words">
                          {p.protein}
                        </span>
                      </h3>

                      <span className="self-start px-4 py-2 text-sm rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold shadow-lg whitespace-nowrap">
                        {p.similarity}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mb-4 leading-relaxed break-words">
                      {p.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1 break-words">
                        <span className="text-cyan-400">🧬</span>
                        {p.organism}
                      </span>

                      <span className="flex items-center gap-1">
                        <span className="text-purple-400">📏</span>
                        {p.sequence.length} aa
                      </span>

                      <span className="flex items-center gap-1">
                        <span className="text-pink-400">📊</span>
                        Distance: {p.distance}
                      </span>
                    </div>

                    {p.rank === 1 && (
                      <pre className="mt-4 bg-black/30 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap break-all font-mono text-cyan-300 border border-cyan-500/30">
                        {p.sequence.substring(0, 120)}
                        {p.sequence.length > 120 && "..."}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}