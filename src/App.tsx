import { useState, useEffect, useRef } from "react";
import "./styles.css";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function App() {
  const [substantives, setSubstantives] = useState<string[]>();
  const [adjectives, setAdjectives] = useState<string[]>();
  const [choice, setChoice] = useState("");
  const [loading, setLoading] = useState(true);
  const loadTriggered = useRef(false);

  useEffect(() => {
    if (loadTriggered.current) {
      return;
    }
    const loadFile = async (
      fileUrl: string,
      onDone: (arr: string[]) => void
    ) => {
      const response = await fetch(fileUrl);
      const txt = await response.blob();
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event?.target?.result;
        if (text) {
          const arr = (text as string).split("\n");
          console.log("loaded:", fileUrl);
          onDone(arr);
        }
      };
      reader.readAsText(txt);
    };

    const load = async () => {
      await Promise.all([
        loadFile("/substantives.txt", (arr) => {
          setSubstantives(arr);
        }),
        loadFile("/adjectives.txt", (arr) => {
          setAdjectives(arr);
        }),
      ]);
      setLoading(false);
    };
    loadTriggered.current = true;
    load();
  }, []);

  const onGenerate = () => {
    const substCount = substantives?.length;
    const adjCount = adjectives?.length;
    if (!substCount || !adjCount) {
      return;
    }
    const randomSubstIndex = getRandomInt(substCount);
    const randomAdjIndex = getRandomInt(adjCount);
    const subst = substantives[randomSubstIndex];
    const showAdj = Math.random() > 0.3;
    const adj = showAdj ? `${adjectives[randomAdjIndex]} ` : "";
    setChoice(`${adj.toUpperCase()}${subst.toUpperCase()}`);
  };

  return (
    <div className="App">
      {loading && <div>Loading</div>}
      {!loading && (
        <div className="wrapper">
          <div className="bandName">{choice}</div>
          <button className="generateButton" onClick={onGenerate}>
            Nový
          </button>
        </div>
      )}
    </div>
  );
}
